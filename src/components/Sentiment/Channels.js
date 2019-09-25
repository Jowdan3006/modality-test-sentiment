import React, { Component } from "react";
import {
  NavLink,
  Route
} from "react-router-dom";

import Channel from './Channel';

class Channels extends Component {
  componentDidMount() {
    this.props.getTeamChannels(this.props.team.id);
  }

  displayChannelLinks() {
    let links = [];
    this.props.teamChannels.value.forEach((channel, index) => {
      links.push(
        <div key={`Link${index}`}>
          <NavLink to={`/${this.props.team.displayName}/${channel.displayName}`} >{channel.displayName}</NavLink>
        </div>
      );
    });
    return links;
  }

  displayChannelRoutes() {
    let routes = [];
    
    this.props.teamChannels.value.forEach((channel, index) => {
      routes.push(
        <Route path={`/${this.props.team.displayName}/${channel.displayName}`} key={`Route${index}`} render={() => 
          <Channel
            channel={channel}
            ChannelMessages={this.props.teamChannelsMessages ? 
              this.props.teamChannelsMessages.filter(channelMessages => channelMessages.id === channel.id)[0] : 
              this.props.teamChannelsMessages}
          />
        }/>
      );
    });
    return routes;
  }

  render() {
    if (this.props.teamChannels && this.props.teamChannels.length !== 0) {
      return (
        <div>
          <Route exact path={`/${this.props.team.displayName}`} render={() => this.displayChannelLinks()} />
          {this.displayChannelRoutes()}
        </div>
      );
    } else {
      return (
        <div>Getting Channels</div>
      )
    }
  }
}

export default Channels;
