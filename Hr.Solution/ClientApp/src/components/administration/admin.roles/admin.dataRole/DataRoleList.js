import { faCheck, faEdit, faLock, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import './admin.roles.css';
import { AdminDataRoleServices } from "./admin.dataRoles.services";
import { debounce } from "lodash";
import { Action } from "./Constants";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";

export class DataRoleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            selectedRole: null,
            mode: Action.CREATE,
            groupModel: this.defaultGroupModel


        }
    }

    componentDidMount = () => {
        this.onLoadRoles(null);
    }

    shouldComponentUpdate =(nextProps) => {
        const {reload, searchText} = this.state;
        if(nextProps.reload)
        {
            this.onLoadRoles(searchText);
        }
        return true;
    }

    defaultGroupModel = {
        id: null,
        code: null,
        name: null,
        name2: null,
        roleCount: null,
        description: null,
        lock: false
    }

    onLoadRoles = (name) => {
        AdminDataRoleServices.GetAllRolesByName({ freeText: name ?? '' })
            .then(result => {
                if (result.data && result.data.length > 0) {
                    this.setState({ roles: result.data }, this.props.onRefreshed());
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
        this.setState({searchText: value});

    }

    onSelectRole = (id) => {
        const { onChange } = this.props;
        if (id === null || !onChange) return;
        this.setState({ selectedRole: id }, onChange(id));
    }

    onShowAddEditGroupModal = (item) => {
        if (item) {
            this.setState({ groupModel: item, showAddEditGroupModal: true, mode: Action.EDIT });
            return;
        }
        this.setState({ showAddEditGroupModal: true, groupModel: this.defaultGroupModel, mode: Action.CREATE });
    }

    onHideModal = () => {
        this.setState({ showAddEditGroupModal: false, mode: Action.EDIT }, this.resetGroupModel);
    }

    onGroupModelTextChange = (e) => {
        const { groupModel } = this.state;
        const type = e.target.type;
        const fieldName = e.target.getAttribute("fieldname");
        if (type === "text" || type === "textarea") {
            const value = e.target.value;
            const newModel = Object.assign({}, { ...groupModel, [fieldName]: value });
            this.setState({ groupModel: newModel });
        } else if (type === "checkbox") {
            const value = e.target.checked;
            const newModel = Object.assign({}, { ...groupModel, [fieldName]: value });
            this.setState({ groupModel: newModel });
        }

    }

    resetGroupModel = () => {

        this.setState({ groupModel: this.defaultGroupModel });
    }

    processAddRole = () => {
        const { groupModel } = this.state;
        AdminDataRoleServices.Create(Object.assign({}, { ...groupModel, createdBy: AuthenticationManager.UserName() }))
            .then(result => {
                this.onLoadRoles();
                this.onHideModal();
                ShowNotification(NotificationType.SUCCESS, "Tạo mới vùng dữ liệu thành công!");
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra , không thể thêm mới vùng dữ liệu");
            });
    }



    processEditRole = () => {
        const { groupModel } = this.state;
        AdminDataRoleServices.Update(groupModel.id, Object.assign({}, { ...groupModel, active: true, modifiedBy: AuthenticationManager.UserName() }))
            .then(response => {
                this.onLoadRoles();
                this.onHideModal();
                ShowNotification(NotificationType.SUCCESS, "Chỉnh sửa phân quyền thành công!");
            }, error => {
                debugger;
            });
    }

    render = () => {
        const { roles, selectedRole } = this.state;
        return (
            <Card className="h-100 shadow">
                <Card.Header>
                    <div className="d-flex">
                        <input onChange={this.onRoleSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                        <button data-tip="Thêm nhóm quyền mới" className="btn btn-primary ml-1" onClick={() => this.onShowAddEditGroupModal()}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>

                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            roles && roles.length > 0 && roles.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedRole === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"} onClick={() => this.onSelectRole(item.id)}>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.name}</b>-{item.code}</span>
                                            <div className="ml-auto">
                                                <FontAwesomeIcon className="mr-2" onClick={() => this.onShowAddEditGroupModal(item)} icon={faEdit} color="blue" />
                                                {
                                                    item.lock && <FontAwesomeIcon icon={faLock} color="red" />
                                                }
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.name2} (SL:{item.roleCount})</i></span>
                                            {/* <span className="ml-auto mt-1"><i>{item.isAdmin ? 'Toàn quyền' : ''}</i></span> */}
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

                    </div>
                </Card.Body>
                {this.generateAddGroupModal()}
            </Card>
        )
    }

    generateAddGroupModal = () => {
        const { showAddEditGroupModal, mode } = this.state;
        const { id, code, name, name2, lock, description } = this.state.groupModel;
        return (
            <Modal show={showAddEditGroupModal} centered backdrop="static">
                <Modal.Header>
                    {mode === Action.CREATE ? 'TẠO MỚI VÙNG DỮ LIỆU' : 'CHỈNH SỬA VÙNG DỮ LIỆU'}
                </Modal.Header>
                <Modal.Body className="group-role-container">
                    <div className="w-100 d-flex flex-column pl-2 pr-2">
                        <label>
                            Mã vùng dữ liệu:
                            <input className="form-control w-50"
                                placeholder="Mã vùng dữ liệu"
                                value={code}
                                onChange={this.onGroupModelTextChange}
                                fieldName="code"
                                disabled={mode === Action.EDIT}
                            ></input>
                        </label>
                        <label>
                            Tên vùng dữ liệu:
                            <input className="form-control" placeholder="Tên vùng dữ liệu" value={name} onChange={this.onGroupModelTextChange} fieldName="name"></input>
                        </label>
                        <label>
                            Tên khác:
                            <input className="form-control" placeholder="Tên thay thế" value={name2} onChange={this.onGroupModelTextChange} fieldName="name2"></input>
                        </label>
                        <div className="ml-auto mt-2">
                            <label>
                                <input type="checkbox" checked={lock} fieldName="lock" onChange={this.onGroupModelTextChange} /> Bị khóa
                            </label>
                            {/* <label className="ml-3">
                                <input type="checkbox" checked={isAdmin} fieldName="isAdmin" onChange={this.onGroupModelTextChange} /> Toàn quyền
                            </label> */}
                        </div>

                        <label>
                            Mô tả:
                            <textarea rows={3} className="form-control" placeholder="Mô tả" value={description} onChange={this.onGroupModelTextChange} fieldName="description" />

                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => { mode === Action.CREATE ? this.processAddRole() : this.processEditRole() }}>
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