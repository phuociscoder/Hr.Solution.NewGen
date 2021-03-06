import { faBuromobelexperte } from "@fortawesome/free-brands-svg-icons";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { TabType } from "./Constants";
import './admin.roles.css';
import { RoleList } from "./RoleList";
import { RoleGroupMembers } from "./GroupMembers";
import { RoleGroupPermissions } from "./GroupPermissions";
import { AdminRoleServices } from "./admin.roles.services";
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";

export class SystemRoleManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelect: TabType.USER,
            selectedRoleId: null,
            sysFunctions: [],
            reloadSysRoles: false,
        }

    }

    componentDidMount = () => {
        const { prefix } = this.props;
        if (prefix) {
            this.setState({ prefix: prefix }, this.loadSystemFunctions());
        }
    }

    loadSystemFunctions = () => {
        AdminRoleServices.GetFunctions()
            .then(response => {
                this.setState({ sysFunctions: response.data });
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách phân quyền");
            });
    }

    onChangeTab = (e) => {
        const type = e.target.getAttribute("type");
        if (parseInt(type) === TabType.USER) {
            this.setState({ tabSelect: TabType.USER });
            return;
        }
        this.setState({ tabSelect: TabType.ROLE });
    }

    onRoleChange = (roleId) => {
        this.setState({ selectedRoleId: roleId });
    }

    onListRoleReloaded = () => {
        this.setState({reloadSysRoles: false });
    }

    onReloadSysRole =() => {
        this.setState({reloadSysRoles: true});
    }

    render = () => {
        const { prefix, tabSelect, selectedRoleId, sysFunctions, reloadSysRoles } = this.state;
        return (
            <div className="d-flex w-100 h-100">
                <div className="w-20 h-100">
                    <RoleList prefix={prefix} onChange={this.onRoleChange} reload={reloadSysRoles} onReloaded={this.onListRoleReloaded} />
                </div>
                <div className="flex-fill ml-2 h-100">
                    <Card className="h-100">
                        <Card.Header>
                            <div className="d-flex">
                                <button type={TabType.USER} className={tabSelect === TabType.USER ? "btn btn-primary active" : "btn btn-primary"} onClick={this.onChangeTab}>
                                    <FontAwesomeIcon icon={faUserShield} /> Tài khoản
                                </button>
                                <button type={TabType.ROLE} className={tabSelect === TabType.ROLE ? "ml-2 btn btn-primary active" : "ml-2 btn btn-primary"} onClick={this.onChangeTab}>
                                    <FontAwesomeIcon icon={faBuromobelexperte} /> Phân quyền
                                </button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="pt-2 pl-2 pr-2 h-100">
                                {tabSelect === TabType.USER && <RoleGroupMembers prefix={prefix} selectedRoleId={selectedRoleId} onReloadSysRole={this.onReloadSysRole} />}
                                {tabSelect === TabType.ROLE && <RoleGroupPermissions prefix={prefix} selectedRoleId={selectedRoleId} functions={sysFunctions} />}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <ReactTooltip />
            </div>
        )
    }
}