import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Offcanvas } from 'bootstrap';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { OffcanvasNav } from './Common/offCanvas.Menu/OffCanvasNav';
import { NavMenu } from './NavMenu';
export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <ReactCSSTransitionGroup transitionName="example"
        transitionAppear ={true} transitionAppearTimeout="5000">
        <NavMenu />

        <div className="d-flex">
        <OffcanvasNav/>
          {this.props.children}
      </div>
      </ReactCSSTransitionGroup>
      </div>
     
    );
  }
}
