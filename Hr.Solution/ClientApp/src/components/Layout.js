import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { OffcanvasNav } from './Common/offCanvas.Menu/OffCanvasNav';
import { NavMenu } from './NavMenu';
import { AuthenticationManager } from '../AuthenticationManager';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import 'animate.css/animate.compat.css'

export class Layout extends Component {
  static displayName = Layout.name;
    constructor(props) {
        super(props);
        this.events = [
            "load",
            "mousemove",
            "mousedown",
            "click",
            "scroll",
            "keypress"
        ];

        this.warn = this.warn.bind(this);
        this.logout = this.logout.bind(this);
        this.resetTimeout = this.resetTimeout.bind(this);

        for (var i in this.events) {
            window.addEventListener(this.events[i], this.resetTimeout);
        }

        this.setTimeout();
    }
    clearTimeout() {
        if (this.warnTimeout) clearTimeout(this.warnTimeout);

        if (this.logoutTimeout) clearTimeout(this.logoutTimeout);
    }
    setTimeout() {
        this.warnTimeout = setTimeout(this.warn, 30000 * 1000);// 30 l� 30 gi�y
        this.logoutTimeout = setTimeout(this.logout, 60000 * 1000); // 60 l� 60 gi�y
    }
    resetTimeout() {
        this.clearTimeout();
        this.setTimeout();
    }
    warn() {
        alert("You will be logged out automatically in 1 minute.");
    }
    logout() {
        AuthenticationManager.ClearAuthenInfo();
        window.location.href = "/login";
        this.destroy(); // Cleanup
    }
    destroy() {
        this.clearTimeout();

        for (var i in this.events) {
            window.removeEventListener(this.events[i], this.resetTimeout);
        }
    }
  render() {
    return (
      <div className="main-container">
        <ReactNotification />
        <ReactCSSTransitionGroup transitionName="example"
          transitionAppear={true} transitionAppearTimeout="5000">
          <NavMenu />

          <div className="d-flex content-container">
            <OffcanvasNav />
            {this.props.children}
          </div>
        </ReactCSSTransitionGroup>
      </div>

    );
  }
}
