import React, { Component } from "react";

class Login extends Component {
  render() {
    return (
      <button onClick={this.props.onSignIn}>Sign In</button>
    )
  }
}

export default Login;