import { faAlignJustify, faCogs, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import './offCanvas.css';
import ReactTooltip from 'react-tooltip';
import { DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppRoute } from "../../AppRoute";
import { faBuffer } from "@fortawesome/free-brands-svg-icons";
import { AuthenticationManager } from "../../../AuthenticationManager";
import { Function } from "../Constants";

export class OffcanvasNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggle: false
        }
    }

    componentDidMount = () => {

    }

    toggleMenu = () => {
        this.setState({ isToggle: !this.state.isToggle });
    }

    onLinkClick = (e) => {
        this.toggleMenu();
    }

    renderCollapseMenu = () => {
        return (
            <>
                {AuthenticationManager.AllowView(Function.ADM000) &&
                    <DropdownButton id="dropdown-basic-button" className="btn-item-collapse mt-3" drop="right" title={<FontAwesomeIcon icon={faBuffer} className="icon-toggle" size="2x" />}>
                        {AuthenticationManager.AllowView(Function.ADM001) && <Link to={AppRoute.ADMIN_ACOUNT.path} className="dropdown-item">Quản Lý Tài Khoản</Link>}
                        {AuthenticationManager.AllowView(Function.ADM002) && <Link to={AppRoute.ADMIN_SYSTEM_ROLE.path} className="dropdown-item">Phân Quyền Chức Năng</Link>}
                        {AuthenticationManager.AllowView(Function.ADM003) && <Link to={AppRoute.ADMIN_DATA_ROLE.path} className="dropdown-item">Phân Quyền Vùng Dữ Liệu</Link>}
                    </DropdownButton>
                }
                {AuthenticationManager.AllowView(Function.SYS000) &&
                    <DropdownButton id="dropdown-basic-button" className="btn-item-collapse mt-3" drop="right" title={<FontAwesomeIcon className="icon-toggle" icon={faCogs} size="2x" />}>
                        {AuthenticationManager.AllowView(Function.LS000) && <Link to={AppRoute.CATEGORY_LIST.path} className="dropdown-item">Quản Lý Danh Mục</Link>}
                    </DropdownButton>
                }

                {AuthenticationManager.AllowView(Function.EMP000) &&
                    <DropdownButton id="dropdown-basic-button" className="btn-item-collapse" drop="right" title={<FontAwesomeIcon className="icon-toggle" icon={faUsers} size="2x" />}>
                        {AuthenticationManager.AllowView(Function.EMP001) && <Link to={AppRoute.EMPLOYEE_MANAGEMENT.path} className="dropdown-item">Quản Lý Nhân Viên</Link>}
                    </DropdownButton>
                }
                <ReactTooltip />
            </>
        )
    }

    renderExpandMenu = () => {
        return (
            <>
                {AuthenticationManager.AllowView(Function.ADM000) &&
                    <div className="w-100 d-flex flex-column mt-3 animate__animated animate__backInLeft">
                        <span className="ml-2 white d-flex"><FontAwesomeIcon className="sys-icon" icon={faBuffer} color="white" /> <h5 className="ml-2"><b>HỆ THỐNG</b></h5></span>
                        {AuthenticationManager.AllowView(Function.ADM001) && <Link to={AppRoute.ADMIN_ACOUNT.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Quản Lý Tài Khoản</Link>}
                        {AuthenticationManager.AllowView(Function.ADM002) && <Link to={AppRoute.ADMIN_SYSTEM_ROLE.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Phân Quyền Chức Năng</Link>}
                        {AuthenticationManager.AllowView(Function.ADM003) && <Link to={AppRoute.ADMIN_DATA_ROLE.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Phân Quyền Vùng Dữ Liệu</Link>}
                    </div>
                }

                {AuthenticationManager.AllowView(Function.SYS000) &&
                    <div className="w-100 d-flex flex-column mt-3 animate__animated animate__backInLeft">
                        <span className="ml-2 white d-flex"><FontAwesomeIcon icon={faCogs} color="white" /> <h5 className="ml-2"><b>THIẾT LẬP</b></h5></span>
                        {AuthenticationManager.AllowView(Function.LS000) && <Link to={AppRoute.CATEGORY_LIST.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Quản Lý Danh Mục</Link>}
                    </div>
                }
                {AuthenticationManager.AllowView(Function.EMP000) &&
                    <div className="w-100 d-flex flex-column mt-3 animate__animated animate__backInLeft">
                        <span className="ml-2 white d-flex"><FontAwesomeIcon icon={faUsers} color="white" /> <h5 className="ml-2"><b>NHÂN VIÊN</b></h5></span>
                        {AuthenticationManager.AllowView(Function.EMP001) && <Link to={AppRoute.EMPLOYEE_MANAGEMENT.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Danh Sách Nhân Viên</Link>}

                    </div>
                }
            </>
        )
    }

    render = () => {
        const { isToggle } = this.state;
        return (
            <div className="offCanvas">
                {!isToggle &&
                    <>
                        <ReactCSSTransitionGroup transitionName="offCanvasBackdropOff" transitionAppear={true} transitionLeave={true} transitionEnter={true}>
                            <div className="offCanvas-backdrop-none" />
                        </ReactCSSTransitionGroup>
                        <ReactCSSTransitionGroup transitionName="offCanvasTranOff" transitionAppear={true} transitionLeave={true}>
                            <div className="offCanvas-content d-flex flex-column">
                                <FontAwesomeIcon data-tip="Mở rộng menu." className="cursor-pointer ml-auto mt-1 toggle-btn" icon={faAlignJustify} size="2x" color="white" onClick={this.toggleMenu} />
                                {this.renderCollapseMenu()}
                            </div>
                        </ReactCSSTransitionGroup>

                    </>
                }
                {
                    isToggle &&
                    <>
                        <ReactCSSTransitionGroup transitionName="offCanvasBackdrop" transitionAppear={true} transitionLeave={true} transitionEnter={true}>
                            <div onClick={this.toggleMenu} className="offCanvas-backdrop" />
                        </ReactCSSTransitionGroup>
                        <ReactCSSTransitionGroup transitionName="offCanvasTran" transitionAppear={true} transitionLeave={true}>
                            <div className="offCanvas-toggle d-flex flex-column">
                                <FontAwesomeIcon data-tip="Thu nhỏ menu." className="cursor-pointer ml-auto mt-1 toggle-btn" icon={faAlignJustify} size="2x" color="white" onClick={this.toggleMenu} />
                                {this.renderExpandMenu()}
                            </div>
                        </ReactCSSTransitionGroup>
                        <ReactTooltip place="right" effect="float" type="info" />
                    </>
                }

            </div>
        )
    }

}