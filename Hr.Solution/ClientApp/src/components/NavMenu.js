import React, { Component } from 'react';
import { Badge, Button, Dropdown, Form, FormControl, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './NavMenu.css';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faEnvelopeOpenText, faIdCardAlt, faPowerOff, faUnlockAlt } from '@fortawesome/free-solid-svg-icons'

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}Hr Solution</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/counter"><i className="" /> QUẢN LÝ NHÂN VIÊN</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
            <Form inline>
            <Image width={45} height={40} src={avatar} rounded />
            <span className="ml-2 mr-2" style={{ color: "whitesmoke" }}><b>NGUYỄN HỮU PHƯỚC</b><br/><i>QUẢN TRỊ VIÊN</i></span>
            
              <NavDropdown alignRight menu title={
                
                <React.Fragment>
                  <FontAwesomeIcon color="whitesmoke" size="lg" icon={faCog}/>
                  
                </React.Fragment>

              } id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1"><FontAwesomeIcon icon={faUnlockAlt}></FontAwesomeIcon>  Đổi Mật Khẩu</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2"><FontAwesomeIcon icon={faEnvelopeOpenText}/> Thông Báo <Badge variant="danger">10</Badge></NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3"><FontAwesomeIcon icon={faIdCardAlt}/> Thông Tin Cá Nhân</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4"><FontAwesomeIcon color="red" icon={faPowerOff}/> Đăng Xuất</NavDropdown.Item>
              </NavDropdown>


            </Form>
          </Navbar.Collapse>
        </Navbar>
      </header>
    );
  }
}
