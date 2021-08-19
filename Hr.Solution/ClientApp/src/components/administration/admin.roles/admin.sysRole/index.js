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

export class SystemRoleManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelect: TabType.USER,
            selectedRoleId: null,
            sysFunctions: []
        }

    }

    componentDidMount =() => {
        this.loadSystemFunctions();
    }

    loadSystemFunctions =() => {
        AdminRoleServices.GetFunctions()
        .then(response => {
            this.setState({sysFunctions: response.data});
        }, error => {

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

    onRoleChange =(roleId) => {
        this.setState({selectedRoleId: roleId});
    }

    render = () => {
        const { tabSelect, selectedRoleId, sysFunctions} = this.state;
        return (
            <div className="d-flex w-100 h-100">
                <div className="w-20 h-100">
                    <RoleList onChange={this.onRoleChange} />
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
                            <div className="pt-2 pl-2 pr-2">
                            {tabSelect === TabType.USER && <RoleGroupMembers selectedRoleId={selectedRoleId}/>}
                            {tabSelect === TabType.ROLE && <RoleGroupPermissions selectedRoleId={selectedRoleId} functions={sysFunctions}/>}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <ReactTooltip />
            </div>
        )
    }
}