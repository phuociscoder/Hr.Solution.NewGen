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

export class OffcanvasNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggle: false
        }
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
             <DropdownButton id="dropdown-basic-button" className="btn-item-collapse mt-3" drop="right" title={<FontAwesomeIcon icon={faBuffer} size="2x" />}>
                    <Link to={AppRoute.CATEGORY_LIST.path} className="dropdown-item">Quản Lý Tài Khoản</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Quản Lý Phân Quyền</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Nhóm Phân Quyền</Link>
                </DropdownButton>

                <DropdownButton id="dropdown-basic-button" className="btn-item-collapse mt-3" drop="right" title={<FontAwesomeIcon icon={faCogs} size="2x" />}>
                    <Link to={AppRoute.CATEGORY_LIST.path} className="dropdown-item">Quản Lý Danh Mục</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Danh Sách Người Dùng</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Danh Sách Phân Quyền</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Phân Quyền Hệ Thống</Link>
                </DropdownButton>

                <DropdownButton id="dropdown-basic-button" className="btn-item-collapse" drop="right" title={<FontAwesomeIcon icon={faUsers} size="2x" />}>
                    <Link to={AppRoute.EMPLOYEE_MANAGEMENT.path} className="dropdown-item">Danh Sách Nhân Viên</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Phân Ca Làm Việc</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Thời Gian Làm Việc</Link>
                    <Link to={AppRoute.MAINTAIN.path} className="dropdown-item">Ngày Nghỉ /Ngày Lễ</Link>
                </DropdownButton>
                <ReactTooltip />
            </>
        )
    }

    renderExpandMenu = () => {
        return (
            <>
                 <div className="w-100 d-flex flex-column mt-3">
                    <span className="ml-2 white d-flex"><FontAwesomeIcon icon={faBuffer} color="white" /> <h5 className="ml-2"><b>THIẾT LẬP</b></h5></span>
                    <Link to={AppRoute.CATEGORY_LIST.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Quản Lý Tài Khoản</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Quản Lý Phân Quyền</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Nhóm Phân Quyền</Link>
                </div>

                <div className="w-100 d-flex flex-column mt-3">
                    <span className="ml-2 white d-flex"><FontAwesomeIcon icon={faCogs} color="white" /> <h5 className="ml-2"><b>THIẾT LẬP</b></h5></span>
                    <Link to={AppRoute.CATEGORY_LIST.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Quản Lý Danh Mục</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Danh Sách Người Dùng</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Danh Sách Phân Quyền</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Phân Quyền Hệ Thống</Link>
                </div>

                <div className="w-100 d-flex flex-column mt-3">
                    <span className="ml-2 white d-flex"><FontAwesomeIcon icon={faUsers} color="white" /> <h5 className="ml-2"><b>NHÂN VIÊN</b></h5></span>
                    <Link to={AppRoute.EMPLOYEE_MANAGEMENT.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Danh Sách Nhân Viên</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Phân Ca Làm Việc</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Thời Gian Làm Việc</Link>
                    <Link to={AppRoute.MAINTAIN.path} onClick={this.onLinkClick} className="ml-5 white cursor-pointer menu-expand-item">Ngày Nghỉ /Ngày Lễ</Link>
                </div>
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