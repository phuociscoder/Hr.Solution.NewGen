import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { OffcanvasNav } from './Common/offCanvas.Menu/OffCanvasNav';
import { NavMenu } from './NavMenu';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import 'animate.css/animate.compat.css'

export class Layout extends Component {
  static displayName = Layout.name;

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
