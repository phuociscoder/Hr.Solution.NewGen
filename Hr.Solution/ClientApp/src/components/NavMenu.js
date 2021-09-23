import React, { Component } from 'react';
import { Badge, Form, Image, Modal, Navbar, NavDropdown } from 'react-bootstrap';
import './NavMenu.css';
import logo from '../assets/logo.png';
import noAvatar from '../assets/no-avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faEnvelopeOpenText, faIdCardAlt, faPowerOff, faTimes, faUnlockAlt } from '@fortawesome/free-solid-svg-icons'
import { LanguageSelect } from './Common/language/LanguageSelect';
import { AuthenticationManager } from '../AuthenticationManager';
import { ChangePasswordModal } from "./Common/changpassword/ChangePasswordModal";
import { ChangeUserInfoModal } from "./Common/ChangeUserInfo/ChangeUserInfoModal";
import { AccountServices } from './administration/admin.account/Account.services';
import { ShowNotification } from './Common/notification/Notification';
import { NotificationType } from './Common/notification/Constants';


export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      showLogOutModal: false,
      fullName: "Anonymous",
      avatar: null,
      showChangeUserInfoModal: false
    };
  }

  componentDidMount = () => {
    const userFullName = AuthenticationManager.FullName();
    const avatar = AuthenticationManager.Avatar();
    const displaySysRole = this.getDisplaySysRole();
    const displayAllSysRoleName = this.getDisplayRoleNames();
    this.setState({ fullName: userFullName, avatar: avatar, displayRoleName: displaySysRole, roleTooltips: displayAllSysRoleName });
  }

  getDisplaySysRole = () => {
    const sysRoles = AuthenticationManager.SysRoles();
    const isAdmin = AuthenticationManager.IsAdmin();
    if (isAdmin) return 'Quản Trị Hệ Thống';

    if (!sysRoles || sysRoles.length === 0) return null;

    if (sysRoles.length === 1) return sysRoles[0].name;

    return `${sysRoles[0].name} +${sysRoles.length - 1}`;
  }

  getDisplayRoleNames = () => {
    const sysRoles = AuthenticationManager.SysRoles();
    if (!sysRoles) return null;

    return sysRoles.map(x => x.name).toString();
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  onLogOutClick = () => {
    this.setState({ showLogOutModal: true });
  }

  processLogOut = () => {
    AuthenticationManager.ClearAuthenInfo();
    window.location.href = "/login";
  }

  onChangePasswordClick = () => {
    this.setState({ showChangePasswordModal: true });
  }

  onCancelProcessModal = () => {
    this.setState({ showChangePasswordModal: false, errorMessages: '', oldPassword: '', newPassword: '', confirmPassword: '' })
  }

  onChangeUserInfo = () => {
    this.setState({ showChangeUserInfoModal: true });
  }

  onCancelChangeUserInfoModal = () => {
    this.setState({ showChangeUserInfoModal: false, fullName: '', avatar: null, email: '' })
  }

  generateConfirmModalLogout = () => {
    const { showLogOutModal } = this.state;
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
          <button className="btn btn-danger" onClick={() => this.setState({ showLogOutModal: false })}><FontAwesomeIcon icon={faTimes} /> Hủy bỏ</button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    const { fullName, avatar, displayRoleName, roleTooltips, showChangePasswordModal, showChangeUserInfoModal } = this.state;
    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg" className="nav-top-bar" style={{ zIndex: 300 }}>
          <Navbar.Brand className="animate__animated animate__fadeInLeft" href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}Hr Solution</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">

            <Form className="ml-auto animate__animated animate__fadeInRight" inline>
              <LanguageSelect />
              <Image className="ml-3" width={45} height={40} src={avatar || noAvatar} rounded />
              <span data-tip={roleTooltips} className="ml-2 mr-2 text-uppercase" style={{ color: "whitesmoke" }}><b>{fullName}</b><br /><i>{displayRoleName}</i></span>

              <NavDropdown alignRight menu title={
                <React.Fragment>
                  <FontAwesomeIcon color="whitesmoke" size="lg" icon={faCog} />
                </React.Fragment>

              } id="basic-nav-dropdown">
                <NavDropdown.Item onClick={this.onChangePasswordClick}><FontAwesomeIcon icon={faUnlockAlt}></FontAwesomeIcon>  Đổi Mật Khẩu</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2"><FontAwesomeIcon icon={faEnvelopeOpenText} /> Thông Báo <Badge variant="danger">10</Badge></NavDropdown.Item>
                <NavDropdown.Item onClick={this.onChangeUserInfo}><FontAwesomeIcon icon={faIdCardAlt} /> Thông Tin Cá Nhân</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.onLogOutClick}><span><FontAwesomeIcon color="red" icon={faPowerOff} /> Đăng Xuất </span></NavDropdown.Item>
              </NavDropdown>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        {this.generateConfirmModalLogout()}
        {<ChangePasswordModal showModal={showChangePasswordModal} onCancelProcess={this.onCancelProcessModal} userName={AuthenticationManager.UserName()} />}
        {<ChangeUserInfoModal showModal={showChangeUserInfoModal} onCancelProcess={this.onCancelChangeUserInfoModal} userName={AuthenticationManager.UserName()} />}
      </>
    );
  }
}
