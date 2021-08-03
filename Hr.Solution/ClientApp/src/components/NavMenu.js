import React, { Component } from 'react';
import { Badge, Button, Dropdown, Form, FormControl, Image, Modal, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './NavMenu.css';
import logo from '../assets/logo.png';
import avatar from '../assets/avatar.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBezierCurve, faCheck, faCog, faEnvelopeOpenText, faIdCardAlt, faPowerOff, faTimes, faUnlockAlt, faUser, faUsers, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
import { AppRoute } from './AppRoute';
import { AuthorizeService } from '../services/auth.service';


export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      showLogOutModal: false
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  onLogOutClick =() => {
    this.setState({showLogOutModal: true});
  }

  processLogOut =() => {
     AuthorizeService.logout();
     window.location.href ="/login";
  }

  generateConfirmModalLogout =() => {
    const {showLogOutModal} = this.state;
    return (
      <Modal show={showLogOutModal} backdrop="static" centered>
        <Modal.Header>
          Xác nhận đăng xuất
        </Modal.Header>
        <Modal.Body>
          <span><b>Bạn chắc chắn muốn đăng xuất ?</b></span>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={this.processLogOut}><FontAwesomeIcon icon={faCheck} /> Xác nhận</button>
          <button className="btn btn-danger" onClick={() => this.setState({showLogOutModal: false})}><FontAwesomeIcon icon={faTimes}/> Hủy bỏ</button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg" className="nav-top-bar">
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
            
            <Form className="ml-auto" inline>
              <Image width={45} height={40} src={avatar} rounded />
              <span className="ml-2 mr-2" style={{ color: "whitesmoke" }}><b>NGUYỄN HỮU PHƯỚC</b><br /><i>QUẢN TRỊ VIÊN</i></span>

              <NavDropdown alignRight menu title={
                <React.Fragment>
                  <FontAwesomeIcon color="whitesmoke" size="lg" icon={faCog} />
                </React.Fragment>

              } id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1"><FontAwesomeIcon icon={faUnlockAlt}></FontAwesomeIcon>  Đổi Mật Khẩu</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2"><FontAwesomeIcon icon={faEnvelopeOpenText} /> Thông Báo <Badge variant="danger">10</Badge></NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3"><FontAwesomeIcon icon={faIdCardAlt} /> Thông Tin Cá Nhân</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item  onClick={this.onLogOutClick}><span><FontAwesomeIcon color="red" icon={faPowerOff} /> Đăng Xuất </span></NavDropdown.Item>
              </NavDropdown>


            </Form>
          </Navbar.Collapse>
        </Navbar>
        {this.generateConfirmModalLogout()}
      </>
      
    );
  }
}
