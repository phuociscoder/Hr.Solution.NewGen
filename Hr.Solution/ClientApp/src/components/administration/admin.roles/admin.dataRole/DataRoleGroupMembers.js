import { faCheck, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Image, Modal } from "react-bootstrap";
import { AdminDataRoleServices } from "./admin.dataRoles.services";
import { debounce } from "lodash";
import { AccountServices } from "../../admin.account/Account.services";
import noAvatar from '../../../../assets/no-avatar.jpg';
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";
import { DataRoleMemberTable, MemberTable } from "./DataRoleMemberTable";
import _ from "lodash";
import { Loading } from "../../../Common/loading/Loading";
import { AdminRoleServices } from "../admin.sysRole/admin.roles.services";
import { AuthenticationManager } from "../../../../AuthenticationManager";

export class DataRoleGroupMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddRoleModal: false,
            searchAddRoles: [],
            selectedDataRoleId: null,
            domainRoles: [],
            onLoading: false
        }
    }
    componentDidMount = () => {
        const { selectedRoleId } = this.props;
        this.setState({ selectedDataRoleId: selectedRoleId });
        if(selectedRoleId)
        {
        this.loadDataRoleMembers(selectedRoleId);
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.selectedRoleId !== nextProps.selectedRoleId) {
            this.loadDataRoleMembers(nextProps.selectedRoleId);
            this.setState({ selectedDataRoleId: nextProps.selectedRoleId });
        }
        return true;
    }

    loadDataRoleMembers = (domainId, freeText) => {
        this.setState({ onLoading: true });
        AdminDataRoleServices.GetSysRoles(domainId, { freeText: freeText ?? '' })
            .then(response => {
                if (response.data) {
                    this.setState({ domainRoles: response.data, onLoading: false });
                } else {
                    this.setState({ onLoading: false });
                }
            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! Kh??ng th??? truy c???p ???????c danh s??ch ph??n quy???n.");
            })
    }

    onShowAddRoleModal = () => {
        this.setState({ showAddRoleModal: true });
    }

    onHideModal = () => {
        this.setState({ showAddRoleModal: false, searchAddRoles: [] });
    }

    onSearchAddRole = (freeText) => {
        AdminRoleServices.GetAllRolesByName({ name: freeText })
            .then(response => {
                this.setState({ showLoading: false });
                if (!response.data) return;
                let searchAddRoles = response.data;
                const { domainRoles } = this.state;
                if (domainRoles) {
                    searchAddRoles = searchAddRoles.filter(x => !domainRoles.some(y => y.roleId === x.recID));
                }
                this.setState({ searchAddRoles: searchAddRoles });
            }, error => {
                this.setState({ showLoading: false });
            });
    }

    onProcessAddRole = (roleId) => {
        const { selectedDataRoleId } = this.state;
        AdminDataRoleServices.AddSysRole(selectedDataRoleId, { roleId: roleId, createdBy: AuthenticationManager.UserName() })
            .then(response => {
                if (!response.data) return;
                const { domainRoles } = this.state;
                domainRoles.unshift(response.data);
                let { searchAddRoles } = this.state;
                if (searchAddRoles) {
                    searchAddRoles = searchAddRoles.filter(x => !domainRoles.some(y => y.roleId === x.recID));
                    this.setState({ searchAddRoles: searchAddRoles });
                }
                this.setState({ domainRoles: domainRoles }, this.props.onRefesh(true));
                ShowNotification(NotificationType.SUCCESS, "Th??m ph??n quy???n v??o v??ng d??? li???u th??nh c??ng !");

            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! Kh??ng th??? th??m ph??n quy???n");
            });
    }

    onProcessRemoveRole = (id) => {
        AdminDataRoleServices.RemoveSysRole(id)
            .then(response => {
                if (response.data === 0) return;

                ShowNotification(NotificationType.SUCCESS, "X??a ph??n quy???n kh???i v??ng d??? li???u th??nh c??ng !");
                const { domainRoles } = this.state;
                const selectedIndex = domainRoles.findIndex(x => x.id === id);
                if (selectedIndex > -1) {
                    domainRoles.splice(selectedIndex, 1);
                }
                this.setState({ domainRoles: domainRoles }, this.props.onRefesh(true));

            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! kh??ng th??? x??a t??i kho???n");
            })
    }

    onSearchAddTextChange = (e) => {
        const freeText = e.target.value;
        if (!freeText || freeText.trim() === '') {
            this.setState({ searchAddRoles: [] });
            return;
        }
        this.setState({ showLoading: true });
        this.onDeboundSearchAddRole(freeText)
    }
    onDeboundSearchAddRole = debounce((freeText) => this.onSearchAddRole(freeText), 1000);

    onSearchDomainRoleChange = (e) => {
        const value = e.target.value;
        this.onDeboundSearchDomainRole(value);
    }

    onDeboundSearchDomainRole = debounce((value) => this.loadDataRoleMembers(this.state.selectedDataRoleId, value), 1000);

    render = () => {
        const { domainRoles, selectedDataRoleId, onLoading } = this.state;
        return (
            <div className="d-flex flex-column w-100 animate__animated animate__fadeIn">
                <div className="w-100 d-flex justify-content-end">
                    <input disabled={selectedDataRoleId === null} className="w-40 form-control" onChange={this.onSearchDomainRoleChange} placeholder="T??m ki???m"></input>
                    <button disabled={selectedDataRoleId === null} className="btn btn-primary ml-3" onClick={this.onShowAddRoleModal}><FontAwesomeIcon icon={faUserPlus} /><span> Th??m ph??n quy???n</span></button>
                </div>

                <div className="w-100 h-100 mt-2">
                    <DataRoleMemberTable data={domainRoles} onProcessRemoveRole={this.onProcessRemoveRole} onLoading={onLoading} />
                </div>
                {this.generateAddUserModal()}
            </div>
        )
    }

    generateAddUserModal = () => {
        const { showAddRoleModal, searchAddRoles, showLoading } = this.state;
        return (
            <Modal show={showAddRoleModal} backdrop="static">
                <Modal.Header>
                    TH??M PH??N QUY???N
                </Modal.Header>
                <Modal.Body>
                    <input className="form-control" onChange={this.onSearchAddTextChange} placeholder="T??m ki???m ph??n quy???n ..."></input>
                    <div className="w-100 d-flex justify-content-center"><Loading show={showLoading} /></div>
                    <div className="w-100 search-item-container mt-1">
                        {
                            searchAddRoles && searchAddRoles.length > 0 && searchAddRoles.map((item, index) => {
                                return (
                                    <div className="d-flex flex-column mt-1">
                                        <div className="w-100 d-flex group-role-item border animate__animated animate__fadeIn">
                                            <div className="d-flex flex-column ml-2">
                                                <span className="w-100 text-uppercase mt-1"><b>{item.roleName}</b> - {item.roleId}</span>
                                                <span className="w-100"><i>{item.roleSubName}</i></span>
                                            </div>
                                            <div className="ml-auto">
                                                <button className="btn btn-primary h-100" onClick={() => this.onProcessAddRole(item.recID)}><FontAwesomeIcon icon={faPlus} /></button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onHideModal}><FontAwesomeIcon icon={faCheck} /><span> X??c Nh???n</span></button>
                </Modal.Footer>
            </Modal>
        )
    }
}