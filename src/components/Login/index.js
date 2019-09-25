import React, { Component } from "react";

class Login extends Component {
  render() {
    return (
      <div className="welcomePage">
        <div className="buttonWrapper">
          <button onClick={this.props.onSignIn}>Sign In</button>
        </div>
      </div>
    )
  }
}

export default Login;
