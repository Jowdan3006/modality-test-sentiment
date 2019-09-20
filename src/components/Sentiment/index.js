import React, { Component } from "react";
import {
  NavLink,
  Route
} from "react-router-dom"

import Channels from './Channels';

class Sentiment extends Component {
  displayJoinedTeamsLinks() {
    let links = [];
    this.props.joinedTeams.value.forEach((team, index) => {
      links.push(
        <NavLink to={`/${team.displayName}`} key={`Link${index}`}>{team.displayName}</NavLink>
      );
    });
    return links;
  }

  displayJoinedTeamsRoutes() {
    let routes = [];
    this.props.joinedTeams.value.forEach((team, index) => {
      routes.push(
        <Route path={`/${team.displayName}`} key={`Route${index}`} render={() => 
          <Channels 
            team={team}
            teamChannels={this.props.teamChannels}
            getTeamChannels={this.props.getTeamChannels}
            teamChannelsMessages={this.props.teamChannelsMessages}
          />
        }/>
      );
    });
    return routes;
  }

  render() {
    console.log(this.props.teamChannelsMessages);
    if (this.props.joinedTeams === undefined || this.props.joinedTeams.length === 0) {
      return (
        <div>No Teams to display</div>
      );
    } else {
      return (
        <div>
          <Route exact path="/" render={() => this.displayJoinedTeamsLinks()} />
          {this.displayJoinedTeamsRoutes()}
        </div>
      );
    }
  }

}

export default Sentiment;