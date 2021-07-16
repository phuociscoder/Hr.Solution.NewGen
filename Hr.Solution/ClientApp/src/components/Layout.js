import React, { Component } from 'react';
import { BreadcrumbCustom } from './BreadcrumbCustom';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div>
        <NavMenu />
        <BreadcrumbCustom></BreadcrumbCustom>
        <div className="container-main">
          {this.props.children}
          </div>
      </div>
    );
  }
}
