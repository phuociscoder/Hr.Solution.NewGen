import React, { Component } from "react";
import noAvatar from "../assets/no-avatar.jpg";
import { AuthenticationManager } from "../AuthenticationManager";
import "./HomePage.css";


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
    const displaySysRole = this.getDisplaySysRole();
    this.setState({ fullName: userFullName, avatar: avatar, displayRoleName: displaySysRole });
  }

  getDisplaySysRole = () => {
    const sysRoles = AuthenticationManager.SysRoles();
    if (!sysRoles || sysRoles.length === 0) return null;

    if (sysRoles.length === 1) return sysRoles[0].name;

    return `${sysRoles[0].name} +${sysRoles.length - 1}`;
  }

  render() {
    const { avatar, fullName, displayRoleName } = this.state;
    return (
      <div className="wrapper">
        <div className="user-info-card card">
          <div className="upper-container">
            <div className="image-container">
              <img src={avatar || noAvatar} alt="avatar" height="100px" width="100px" />
            </div>
          </div>
          <div className="lower-container">
            <h2>Welcome To Hr Solution</h2>
            <h3>{fullName}</h3>
            <h4>{displayRoleName}</h4>
          </div>
        </div>
      </div>
    );
  }
}
