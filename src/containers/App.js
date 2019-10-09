import React, {Component} from 'react';
import { UserAgentApplication } from "msal";
import {
  HashRouter
} from "react-router-dom"

import update from 'immutability-helper';

import Login from '../components/Login';
import Sentiment from '../components/Sentiment';

class App extends Component {
  state = {
    msalApp: new UserAgentApplication({
      auth: {
          clientId: "245e9392-c666-4d51-8f8a-bfd9e55b2456",
          authority: "https://login.microsoftonline.com/common",
          validateAuthority: true,
          postLogoutRedirectUri: "http://localhost:3000",
          navigateToLoginRequestUrl: false
      },
      cache: {
          cacheLocation: "sessionStorage"
      }
    }),

    GRAPH_REQUESTS: {
      LOGIN: {
          scopes: ["openid", "profile", "User.Read.All", "Group.Read.All"]
      },
      EMAIL: {
          scopes: ["Mail.Read"]
      }
    },

    GRAPH_ENDPOINTS: {
      ME: "https://graph.microsoft.com/v1.0/me",
      MAIL: "https://graph.microsoft.com/v1.0/me/messages",
      JOINED_TEAMS: "https://graph.microsoft.com/v1.0/me/joinedTeams",
      TEAM_CHANNELS: "https://graph.microsoft.com/v1.0/teams/{team-id}/channels",
      MESSAGES: "https://graph.microsoft.com/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages"
    },

    account: null,
    error: null,
    joinedTeams: null,
    teamChannels: null,
    teamChannelsFetchCount: 0,
    teamChannelsMessages: []
  }

  requiresInteraction = errorMessage => {
    if (!errorMessage || !errorMessage.length) {
        return false;
    }
    return (
        errorMessage.indexOf("consent_required") > -1 ||
        errorMessage.indexOf("interaction_required") > -1 ||
        errorMessage.indexOf("login_required") > -1
    );
  };

  async acquireToken(request, redirect) {
    return this.state.msalApp.acquireTokenSilent(request).catch(error => {
        // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure
        // due to consent or interaction required ONLY
        if (this.requiresInteraction(error.errorCode)) {
            return redirect
                ? this.state.msalApp.acquireTokenRedirect(request)
                : this.state.msalApp.acquireTokenPopup(request);
        }
    });
  }

  async onSignIn(redirect) {
    if (redirect) {
        return this.state.msalApp.loginRedirect(this.state.GRAPH_REQUESTS.LOGIN);
    }

    const loginResponse = await this.state.msalApp
        .loginPopup(this.state.GRAPH_REQUESTS.LOGIN)
        .catch(error => {
            this.setState({
                error: error.message
            });
        });

    if (loginResponse) {
        this.setState({
            account: loginResponse.account,
            error: null
        });

        const tokenResponse = await this.acquireToken(
            this.state.GRAPH_REQUESTS.LOGIN
        );

        this.setState({
          graphToken: tokenResponse.accessToken
        })
        
    }
  }

  async componentDidMount() {
    this.state.msalApp.handleRedirectCallback(error => {
        if (error) {
            const errorMessage = error.errorMessage ? error.errorMessage : "Unable to acquire access token.";
            // setState works as long as navigateToLoginRequestUrl: false
            this.setState({
                error: errorMessage
            });
        }
    });

    const account = this.state.msalApp.getAccount();

    this.setState({
        account
    });

    if (account) {
        const tokenResponse = await this.acquireToken(
            this.state.GRAPH_REQUESTS.LOGIN
        );

          if (tokenResponse) {
            const joinedTeams = await this.fetchMsGraph(
                this.state.GRAPH_ENDPOINTS.JOINED_TEAMS,
                tokenResponse.accessToken
            ).catch(() => {
                this.setState({
                    error: "Unable to fetch joined teams profile."
                });
            });

            if (joinedTeams) {
                this.setState({
                  joinedTeams
                });
            }
        }
    }
  }

  async fetchMsGraph(url, accessToken) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return response.json();
  };

  getTeamChannels = async (id) => {
    if (this.state.account) {
      const tokenResponse = await this.acquireToken(
          this.state.GRAPH_REQUESTS.LOGIN
      );
      if (tokenResponse) {
        let teamUrl = this.state.GRAPH_ENDPOINTS.TEAM_CHANNELS;
        const teamChannels = await this.fetchMsGraph(
          teamUrl.replace("{team-id}", id),
          tokenResponse.accessToken
        ).catch(() => {
          this.setState({
              error: "Unable to fetch team channels."
          });
        });
        if (teamChannels) {
          this.setState({
            teamChannels,
            teamChannelsFetchCount: 0,
            teamChannelsFetched: false
          });
          this.getTeamChannelsMessages(tokenResponse, id);
        }
      }
    }
  }

  getTeamChannelsMessages(tokenResponse, id) {
    this.state.teamChannels.value.forEach(async channel => {
      let messageUrl = this.state.GRAPH_ENDPOINTS.MESSAGES;
      messageUrl = messageUrl.replace("{group-id-for-teams}", id);
      messageUrl = messageUrl.replace("{channel-id}", channel.id);
      let channelMessages = await this.fetchMsGraph(
        messageUrl,
        tokenResponse.accessToken
      ).catch(() => {
        this.setState({
            error: "Unable to fetch channel messages"
        });
      });
      this.setState({ 
        teamChannelsMessages: [...this.state.teamChannelsMessages, {id: channel.id, channelMessages: channelMessages}],
        teamChannelsFetchCount: ++this.state.teamChannelsFetchCount
      });
      if (this.state.teamChannelsFetchCount === this.state.teamChannels.value.length) {
        this.getScoreForChannels()
      }
    })
  }

  getTextAnalyticsDocument = (channelMessages) => {
    let regex = /(<([^>]+)>)/ig;
    let chatMessages = channelMessages.value.map((textDataDetail) => {
      return {
        "id": textDataDetail.id,
        "language": "en",
        "text": textDataDetail.body.content.replace(regex, '')
      }
    })
    let documents = { "documents": chatMessages }
    return documents;
  }

  getScoreForChannels = () => {
    let teamChannelsMessages = this.state.teamChannelsMessages;
    teamChannelsMessages.forEach(async (teamChannelMessages, index) => {
      let channelDocuments = this.getTextAnalyticsDocument(teamChannelMessages.channelMessages);
      await fetch('https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment', {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": "064e6defe25c445bb9acbcb577ed9f36",
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(channelDocuments)
      })
      .then(response => response.json())
      .then(responseJson => {
        // loop through response
        teamChannelMessages.channelMessages.value.forEach(channelMessage => {
          responseJson.documents.forEach(responseMessage => {
            // compare the current document array id to the state chat id in a loop
            if (channelMessage.id === responseMessage.id) {
              // add key value pair for score to the empty array
              channelMessage.score = responseMessage.score;
            }
          })
        })
        let updatedteamChannelsMessages = update(this.state.teamChannelsMessages, {[index]: {$set: teamChannelMessages}})
        this.setState({teamChannelsMessages: updatedteamChannelsMessages});
      })
    })
  }

  signOut = () => {
    this.state.msalApp.logout();
  }

  render() {
    if (this.state.account) {
      if (this.state.joinedTeams) {
        return (
          <div class="content">
            <header>
              <button onClick={this.signOut} >Sign Out</button>
            </header>
            <HashRouter>
              <Sentiment 
                joinedTeams={this.state.joinedTeams}
                getTeamChannels={this.getTeamChannels}
                teamChannels={this.state.teamChannels}
                teamChannelsMessages={this.state.teamChannelsMessages}
              /> 
            </HashRouter>
          </div>
        );
      } else {
        return (
          <div>Getting Joined Teams</div>
        );
      }
    } else {
      return (
        <Login onSignIn={this.onSignIn.bind(this)} />   
      );
    }
  }

}

export default App;
