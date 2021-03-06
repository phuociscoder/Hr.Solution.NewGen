import { faCheck, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Image, Modal } from "react-bootstrap";
import { AdminRoleServices } from "./admin.roles.services";
import { debounce } from "lodash";
import { AccountServices } from "../../admin.account/Account.services";
import noAvatar from '../../../../assets/no-avatar.jpg';
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";
import { MemberTable } from "./MemberTable";
import _ from "lodash";
import { Loading } from "../../../Common/loading/Loading";
import { AuthenticationManager } from "../../../../AuthenticationManager";

export class RoleGroupMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddUserModal: false,
            searchAddUsers: [],
            selectedRoleId: null,
            users: [],
            onLoading: false
        }
    }
    componentDidMount = () => {
        const { selectedRoleId, prefix } = this.props;
        if(prefix)
        {
            this.setState({prefix: prefix});
        }
        this.setState({ selectedRoleId: selectedRoleId });
        if (selectedRoleId) {
            this.loadRoleUsers(selectedRoleId);
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if(this.props.prefix !== nextProps.prefix)
        {
            this.setState({prefix: nextProps.prefix});
        }
        if (this.props.selectedRoleId !== nextProps.selectedRoleId) {
            this.loadRoleUsers(nextProps.selectedRoleId);
            this.setState({ selectedRoleId: nextProps.selectedRoleId });
        }
        return true;
    }

    loadRoleUsers = (roleId, freeText) => {
        this.setState({ onLoading: true });
        AdminRoleServices.GetUsers(roleId, { freeText: freeText ?? '' })
            .then(response => {
                if (response.data.data) {
                    this.setState({ users: response.data.data, onLoading: false });
                }
            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! Kh??ng th??? truy c???p ???????c danh s??ch t??i kho???n.");
            })
    }

    onShowAddUserModal = () => {
        this.setState({ showAddUserModal: true });
    }

    onHideModal = () => {
        this.setState({ showAddUserModal: false, searchAddUsers: [] });
    }

    onSearchAddUser = (freeText) => {
        AccountServices.GetAll({ freeText: freeText })
            .then(response => {
                this.setState({ showLoading: false });
                if (!response.data) return;
                let searchAddUsers = response.data;
                const { users } = this.state;
                if (users) {
                    searchAddUsers = searchAddUsers.filter(x => !users.some(y => y.userId === x.id));
                }
                this.setState({ searchAddUsers: searchAddUsers });
            }, error => {
                this.setState({ showLoading: false });
            });
    }

    onProcessAddUser = (userId) => {
        const { selectedRoleId } = this.state;
        AdminRoleServices.AddUser({ roleId: selectedRoleId, userId: userId, createdBy: AuthenticationManager.UserName() })
            .then(response => {
                if (!response.data) return;
                const { users } = this.state;
                users.unshift(response.data);
                let { searchAddUsers } = this.state;
                if (searchAddUsers) {
                    searchAddUsers = searchAddUsers.filter(x => !users.some(y => y.userId === x.id));
                    this.setState({ searchAddUsers: searchAddUsers });
                }
                this.setState({ users: users }, this.props.onReloadSysRole());
                ShowNotification(NotificationType.SUCCESS, "Th??m t??i kho???n v??o ph??n quy???n th??nh c??ng !");

            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! Kh??ng th??? th??m t??i kho???n");
            });
    }

    onProcessRemoveUser = (userRoleId) => {
        AdminRoleServices.RemoveUser(userRoleId)
            .then(response => {
                if (response.data === 0) return;

                ShowNotification(NotificationType.SUCCESS, "X??a t??i kho???n kh???i ph??n quy???n th??nh c??ng !");
                const { users } = this.state;
                const selectedIndex = users.findIndex(x => x.id === userRoleId);
                if (selectedIndex > -1) {
                    users.splice(selectedIndex, 1);
                }
                this.setState({ users: users }, this.props.onReloadSysRole());

            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! kh??ng th??? x??a t??i kho???n");
            })
    }

    onSearchAddTextChange = (e) => {
        const freeText = e.target.value;
        if (!freeText) {
            this.setState({ searchAddUsers: [] });
        }
        this.setState({ showLoading: true });
        this.onDeboundSearchAddUser(freeText)
    }
    onDeboundSearchAddUser = debounce((freeText) => this.onSearchAddUser(freeText), 1000);

    onSearchRoleUserChange = (e) => {
        const value = e.target.value;
        this.onDeboundSearchRoleUser(value);
    }

    onDeboundSearchRoleUser = debounce((value) => this.loadRoleUsers(this.state.selectedRoleId, value), 1000);

    render = () => {
        const { users, selectedRoleId, onLoading, prefix } = this.state;
        return (
            <div className="d-flex flex-column w-100 animate__animated animate__fadeIn">
                <div className="w-100 d-flex justify-content-end">
                    <input disabled={selectedRoleId === null} className="w-40 form-control" onChange={this.onSearchRoleUserChange} placeholder="T??m ki???m"></input>
                    {AuthenticationManager.AllowEdit(prefix) && 
                    <button disabled={selectedRoleId === null} className="btn btn-primary ml-3" onClick={this.onShowAddUserModal}><FontAwesomeIcon icon={faUserPlus} /><span> Th??m t??i kho???n</span></button>
                    }
                    </div>

                <div className="w-100 h-100 mt-2">
                    <MemberTable data={users} prefix={prefix} onProcessRemoveUser={this.onProcessRemoveUser} onLoading={onLoading} />
                </div>
                {this.generateAddUserModal()}
            </div>
        )
    }

    generateAddUserModal = () => {
        const { showAddUserModal, searchAddUsers, showLoading } = this.state;
        return (
            <Modal show={showAddUserModal} backdrop="static">
                <Modal.Header>
                    TH??M T??I KHO???N
                </Modal.Header>
                <Modal.Body>
                    <input className="form-control" onChange={this.onSearchAddTextChange} placeholder="Nh???p h??? t??n/Email/T??n ????ng nh???p..."></input>
                    <div className="w-100 d-flex justify-content-center"><Loading show={showLoading} /></div>
                    {
                        searchAddUsers && searchAddUsers.length > 0 && searchAddUsers.map((item, index) => {
                            return (
                                <div className="d-flex flex-column mt-1">
                                    <div className="w-100 d-flex group-role-item border animate__animated animate__fadeIn">
                                        <div>
                                            <Image className="shadow" src={item.avatar ?? noAvatar} width={70} height={70} />
                                        </div>
                                        <div className="d-flex flex-column ml-2">
                                            <span className="w-100">{item.code}-{item.userName}</span>
                                            <span className="w-100 text-uppercase mt-1"><b>{item.fullName}</b></span>
                                            <span className="w-100"><i>{item.email}</i></span>
                                        </div>
                                        <div className="ml-auto">
                                            <button className="btn btn-primary h-100" onClick={() => this.onProcessAddUser(item.id)}><FontAwesomeIcon icon={faPlus} /></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onHideModal}><FontAwesomeIcon icon={faCheck} /><span> X??c Nh???n</span></button>
                </Modal.Footer>
            </Modal>
        )
    }
}