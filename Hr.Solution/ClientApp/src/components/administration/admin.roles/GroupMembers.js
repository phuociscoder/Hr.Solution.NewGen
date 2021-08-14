import { faCheck, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Image, Modal } from "react-bootstrap";
import { AdminRoleServices } from "./admin.roles.services";
import { debounce } from "lodash";
import { AccountServices } from "../admin.account/Account.services";
import noAvatar from '../../../assets/no-avatar.jpg';
import { ShowNotification } from "../../Common/notification/Notification";
import { NotificationType } from "../../Common/notification/Constants";
import { MemberTable } from "./MemberTable";
import _ from "lodash";
import { Loading } from "../../Common/loading/Loading";

export class RoleGroupMembers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddUserModal: false,
            searchAddUsers: [],
            selectedRoleId: null,
            users: []
        }
    }
    componentDidMount =() => {
        const {selectedRoleId} = this.props;
        this.setState({selectedRoleId: selectedRoleId});
        this.loadRoleUsers(selectedRoleId);
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.selectedRoleId !== nextProps.selectedRoleId) {
            this.loadRoleUsers(nextProps.selectedRoleId);
            this.setState({ selectedRoleId: nextProps.selectedRoleId });
        }
        return true;
    }

    loadRoleUsers = (roleId) => {
        AdminRoleServices.GetUsers(roleId)
            .then(response => {
                if (response.data.data) {
                    this.setState({ users: response.data.data });
                }
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập được danh sách tài khoản.");
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
                this.setState({showLoading: false});
                if (!response.data) return;
                let searchAddUsers = response.data;
                const {users} =this.state;
                if(users)
                {
                    searchAddUsers = searchAddUsers.filter(x => !users.some(y=> y.userId === x.id));
                }
                this.setState({ searchAddUsers: searchAddUsers });
            }, error => {
                this.setState({showLoading: false});
            });
    }

    onProcessAddUser = (userId) => {
        const { selectedRoleId } = this.state;
        AdminRoleServices.AddUser({ roleId: selectedRoleId, userId: userId, createdBy: 'PhuocNguyen' })
            .then(response => {
                if (!response.data) return;
                const { users } = this.state;
                users.unshift(response.data);
                let {searchAddUsers} =this.state;
                if(searchAddUsers)
                {
                    searchAddUsers = searchAddUsers.filter(x => !users.some(y=> y.userId === x.id));
                    this.setState({searchAddUsers: searchAddUsers});
                }
                this.setState({ users: users });
                ShowNotification(NotificationType.SUCCESS, "Thêm tài khoản vào phân quyền thành công !");

            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể thêm tài khoản");
            });
    }

    onProcessRemoveUser = (userRoleId) => {
        AdminRoleServices.RemoveUser(userRoleId)
            .then(response => {
                if (response.data === 0) return;

                ShowNotification(NotificationType.SUCCESS, "Xóa tài khoản khỏi phân quyền thành công !");
                const { users } = this.state;
                const selectedIndex = users.findIndex(x => x.id === userRoleId);
                if (selectedIndex > -1) {
                    users.splice(selectedIndex, 1);
                }
                this.setState({ users: users });

            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! không thể xóa tài khoản");
            })
    }

    onSearchAddTextChange = (e) => {
        const freeText = e.target.value;
        if (!freeText) {
            this.setState({ searchAddUsers: [] });
        }
        this.setState({showLoading: true});
        this.onDeboundSearchAddUser(freeText)
    }
    onDeboundSearchAddUser = debounce((freeText) => this.onSearchAddUser(freeText), 1000);

    render = () => {
        const { users, selectedRoleId } = this.state;
        return (
            <div className="d-flex flex-column w-100 animate__animated animate__fadeIn">
                <div className="w-100 d-flex justify-content-end">
                    <input disabled={selectedRoleId === null} className="w-40 form-control" placeholder="Tìm kiếm"></input>
                    <button disabled={selectedRoleId === null} className="btn btn-primary ml-3" onClick={this.onShowAddUserModal}><FontAwesomeIcon icon={faUserPlus} /><span> Thêm tài khoản</span></button>
                </div>

                <div className="w-100 h-100 mt-2">
                    <MemberTable data={users} onProcessRemoveUser={this.onProcessRemoveUser} />
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
                    THÊM TÀI KHOẢN
                </Modal.Header>
                <Modal.Body>
                    <input className="form-control" onChange={this.onSearchAddTextChange} placeholder="Nhập họ tên/Email/Tên đăng nhập..."></input>
                    <div className="w-100 d-flex justify-content-center"><Loading show={showLoading}/></div>
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
                    <button className="btn btn-primary" onClick={this.onHideModal}><FontAwesomeIcon icon={faCheck} /><span> Xác Nhận</span></button>
                </Modal.Footer>
            </Modal>
        )
    }
}