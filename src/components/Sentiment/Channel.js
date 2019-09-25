import React, { Component } from "react";

class Channel extends Component {
  render() {
    console.log(this.props.ChannelMessages)
    return (
      <div>{JSON.stringify(this.props.ChannelMessages)}</div>
    )
  }
}

export default Channel;
