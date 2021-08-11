import { faBan, faCheck, faEdit, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import './admin.roles.css';
import { AdminRoleServices } from "./admin.roles.services";
import { debounce } from "lodash";
import { Action } from "./Constants";
import { AuthenticationManager } from "../../../AuthenticationManager";
import { ShowNotification } from "../../Common/notification/Notification";
import { NotificationType } from "../../Common/notification/Constants";

export class RoleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            selectedRole: null,
            mode: Action.CREATE,
            groupModel: {
                recID: null,
                roleId: null,
                roleName: null,
                roleSubName: null,
                isAdmin: false,
                description: null,
                lock: false
            }
        }

    }

    componentDidMount = () => {
        this.onLoadRoles(null);
    }

    onLoadRoles = (name) => {
        AdminRoleServices.GetAllRolesByName({ name: name ?? '' })
            .then(result => {
                if (result.data && result.data.length > 0) {
                    this.setState({ roles: result.data });
                    return;
                }
                this.setState({ roles: [] });
            }, error => {
            });
    }

    searchRoles = debounce((name) => { this.onLoadRoles(name) }, 1000);

    onRoleSearchTextChange = (e) => {
        const value = e.target.value;
        this.searchRoles(value);

    }

    onLockGroup = (roleId) => {
        this.setState()
    }

    onSelectRole = (id) => {
        const { onChange } = this.props;
        if (id === null || !onChange) return;
        this.setState({ selectedRole: id }, onChange(id));
    }

    onShowAddEditGroupModal = () => {
        this.setState({ showAddEditGroupModal: true });
    }

    onHideModal = () => {
        this.setState({ showAddEditGroupModal: false }, this.resetGroupModel);
    }

    onGroupModelTextChange =(e) => {
        const {groupModel} = this.state;
        const type = e.target.type;
        const fieldName = e.target.getAttribute("fieldname");
        if(type === "text" || type ==="textarea")
        {
            const value = e.target.value;
            const newModel = Object.assign({},{...groupModel, [fieldName]: value });
            this.setState({groupModel : newModel});
        }else if(type === "checkbox")
        {
            const value = e.target.checked;
            const newModel = Object.assign({},{...groupModel, [fieldName]: value });
            this.setState({groupModel : newModel});
        }

    }

    resetGroupModel =() => {
      const groupModel= {
            recID: null,
            roleId: null,
            roleName: null,
            roleSubName: null,
            isAdmin: false,
            description: null,
            lock: false
        };
        this.setState({groupModel: groupModel});
    }

    processAddRole =() => {
        const {groupModel} = this.state;
        AdminRoleServices.Create(Object.assign({}, {...groupModel, currentUser: AuthenticationManager.UserId}))
        .then(result => {
            this.onLoadRoles();
            this.onHideModal();
            ShowNotification(NotificationType.SUCCESS, "Tạo mới phân quyền thành công!");
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra , không thể thêm mới phân quyền");
        });
        
    }



    processEditRole= () => {

    }

    onShowMessage =(type, message) => {
        const {onShowMessage} = this.props;
        if(!onShowMessage) return;
        onShowMessage(type, message);
    }


    render = () => {
        const { roles, selectedRole } = this.state;
        console.log(roles);
        return (
            <Card className="h-100 shadow">
                <Card.Header>
                    <div className="d-flex">
                        <input onChange={this.onRoleSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                        <button data-tip="Thêm nhóm quyền mới" className="btn btn-primary ml-1" onClick={this.onShowAddEditGroupModal}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>

                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            roles && roles.length > 0 && roles.map((item, index) => {
                                return (
                                    <div key={item.recID} fieldName={item.recID} className={selectedRole === item.recID ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"} onClick={() => this.onSelectRole(item.recID)}>
                                        <div className="d-flex">
                                            <span><b>{item.roleName}-{item.roleId}</b></span>
                                            <div className="ml-auto">
                                                <FontAwesomeIcon className="mr-2" onClick={() => alert(item.recID)} data-tip="remove" icon={faEdit} color="blue" />
                                                <FontAwesomeIcon onClick={() => alert(item.recID)} data-tip="remove" icon={faBan} color="red" />
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.roleSubName} (SL:{0})</i></span>
                                            <span className="ml-auto mt-1"><i>{item.isAdmin ? 'Toàn quyền' : ''}</i></span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            !roles || roles.length === 0 &&
                            <div className="w-100 h-100 group-role-item-blank">
                                Không có dữ liệu.
                            </div>
                        }
                        <ReactTooltip />
                    </div>
                </Card.Body>
                {this.generateAddGroupModal()}
                {/* {this.generateLockGroupModal()} */}
            </Card>
        )
    }

    generateAddGroupModal = () => {
        const { showAddEditGroupModal, mode } = this.state;
        const { roleId, roleName, roleSubName, isAdmin, lock, description } = this.state.groupModel;
        return (
            <Modal show={showAddEditGroupModal} centered backdrop="static">
                <Modal.Header>
                    {mode === Action.CREATE ? 'TẠO MỚI PHÂN QUYỀN' : 'CHỈNH SỬA PHÂN QUYỀN'}
                </Modal.Header>
                <Modal.Body className="group-role-container">
                    <div className="w-100 d-flex flex-column pl-2 pr-2">
                        <label>
                            Mã Nhóm:
                            <input className="form-control w-50" placeholder="Mã nhóm" value={roleId} onChange={this.onGroupModelTextChange} fieldName="roleId"></input>
                        </label>
                        <label>
                            Tên nhóm:
                            <input className="form-control" placeholder="Tên nhóm" value={roleName} onChange={this.onGroupModelTextChange} fieldName="roleName"></input>
                        </label>
                        <label>
                            Tên khác:
                            <input className="form-control" placeholder="Tên thay thế" value={roleSubName} onChange={this.onGroupModelTextChange} fieldName="roleSubName"></input>
                        </label>
                        <div className="ml-auto mt-2">
                        <label>
                            <input type="checkbox" checked={lock} fieldName="lock" onChange={this.onGroupModelTextChange} /> Bị khóa
                        </label>
                        <label className="ml-3">
                        <input type="checkbox" checked={isAdmin} fieldName="isAdmin" onChange={this.onGroupModelTextChange} /> Toàn quyền
                        </label>
                        </div>
                        
                        <label>
                            Mô tả:
                            <textarea rows={3} className="form-control" placeholder="Mô tả" value={description} onChange={this.onGroupModelTextChange} fieldName="description" />

                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => {mode === Action.CREATE ? this.processAddRole() : this.processEditRole()}}>
                        <FontAwesomeIcon icon={faCheck} />
                        <span className="ml-1">Lưu</span>
                    </button>
                    <button className="btn btn-danger" onClick={this.onHideModal}>
                        <FontAwesomeIcon icon={faTimes} />
                        <span className="ml-1">Hủy bỏ</span>
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}