import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import noAvatar from "../assets/no-avatar.jpg";
import { AuthenticationManager } from "../AuthenticationManager";

export class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
      fullName: "Anonymous"
    };
  }

  componentDidMount = () => {
    const userFullName = AuthenticationManager.FullName();
    const avatar = AuthenticationManager.Avatar();
    this.setState({ fullName: userFullName, avatar: avatar });
  }

  render() {
    const { avatar, fullName } = this.state;
    return (
      <>
        <div className="d-flex justify-content-center align-items-center container-content">
          <Image src={avatar || noAvatar} rounded />
          <div className="welcomeMsg ml-4"> <h1>Welcome To Hr Solution</h1><br /><h2>{fullName}</h2></div>
        </div>
      </>
    );
  }
}
