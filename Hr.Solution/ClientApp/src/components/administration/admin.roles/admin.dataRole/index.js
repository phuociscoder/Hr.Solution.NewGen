import { faBuromobelexperte } from "@fortawesome/free-brands-svg-icons";
import { faProjectDiagram } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { TabType } from "./Constants";
import './admin.roles.css';
import { DataRoleList } from "./DataRoleList";
import { DataRoleGroupMembers } from "./DataRoleGroupMembers";
import { AdminDataRoleServices } from "./admin.dataRoles.services";
import { DepartmentList } from "../../admin.department";
import { DataRoleDepartments } from "./DataRoleDepartments";

export class DataRoleManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabSelect: TabType.ROLE,
            selectedRoleId: null,
            sysFunctions: []
        }

    }

    componentDidMount =() => {
    }

    onChangeTab = (e) => {
        const type = e.target.getAttribute("type");
        if (parseInt(type) === TabType.ROLE) {
            this.setState({ tabSelect: TabType.ROLE });
            return;
        }
        this.setState({ tabSelect: TabType.DEPARTMENT });
    }

    onRoleChange =(roleId) => {
        this.setState({selectedRoleId: roleId});
    }

    onDepartmentCheckedChange =(ids) => {
        console.log(ids);
    }

    onRefesh =(value) => {
        if(value)
        {
            this.setState({reload: true});
        }
    }
    onRefreshed =() => {
        this.setState({reload: false});
    }

    render = () => {
        const { tabSelect, selectedRoleId, reload} = this.state;
        return (
            <div className="d-flex w-100 h-100">
                <div className="w-20 h-100">
                    <DataRoleList reload={reload} onRefreshed={this.onRefreshed} onChange={this.onRoleChange} />
                </div>
                <div className="flex-fill ml-2 h-100">
                    <Card className="h-100">
                        <Card.Header>
                            <div className="d-flex">
                                <button type={TabType.ROLE} className={tabSelect === TabType.ROLE ? "btn btn-primary active" : "btn btn-primary"} onClick={this.onChangeTab}>
                                    <FontAwesomeIcon icon={faBuromobelexperte} /> Phân quyền
                                </button>
                                <button type={TabType.DEPARTMENT} className={tabSelect === TabType.DEPARTMENT ? "ml-2 btn btn-primary active" : "ml-2 btn btn-primary"} onClick={this.onChangeTab}>
                                    <FontAwesomeIcon icon={faProjectDiagram} /> Bộ phận/Phòng ban
                                </button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="pt-2 pl-2 pr-2">
                            {tabSelect === TabType.ROLE && <DataRoleGroupMembers selectedRoleId={selectedRoleId} onRefesh={this.onRefesh}/>}
                            {tabSelect === TabType.DEPARTMENT && <DataRoleDepartments selectedRoleId={selectedRoleId} />}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <ReactTooltip />
            </div>
        )
    }
}