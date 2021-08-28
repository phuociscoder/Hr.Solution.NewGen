import React, { Component } from "react";
import { AuthenticationManager } from "../AuthenticationManager";
import "./HomePage.css";
import _ from "lodash";


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
    const shortName = this.getDisplayShortName();
    const avatar = AuthenticationManager.Avatar();

    const displayAllSysRoleName = this.getDisplayRoleNames();
    this.setState({ fullName: userFullName, avatar: avatar, displayAllSysRoleName: displayAllSysRoleName, shortName: shortName });
  }

  getDisplayShortName = () => {
    const userFullName = AuthenticationManager.FullName();

    if (userFullName) {
      const fullNames = userFullName.split(" ");
      let newNames = fullNames.map(name => {
        return name[0].toUpperCase();
      });
      newNames = _.takeRight(newNames, 2);
      return newNames;
    }
    return null;
  }


  getDisplayRoleNames = () => {
    const sysRoles = AuthenticationManager.SysRoles();
    if (!sysRoles) return null;

    return sysRoles.map(x => <div className="roleName">{x.name}</div>);
  }

  render() {
    const { avatar, fullName, displayAllSysRoleName, shortName } = this.state;
    console.log(avatar);
    return (
      <div className="wrapper d-flex w-100 h-100 justify-content-center align-items-center">
        <div className=".user-info-card d-flex flex-row align-items-center bg-white">
          {avatar !== 'null' ? <img className="image-avatar" src={avatar} /> : <div className="profileImage">{shortName}</div>}
          <div className="lower-container d-flex flex-column justify-content-center align-items-end">
            <h1 className="Message">Welcome To Hr Solution</h1>
            <h2 className="fullName">{fullName}</h2>
            <p className="roleNames">{displayAllSysRoleName}</p>
          </div>
        </div>
      </div >
    );
  }
}
