import { faCheck, faEdit, faLock, faPlus, faTimes, faTrash, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import './admin.roles.css';
import { AdminRoleServices } from "./admin.roles.services";
import { debounce } from "lodash";
import { Action } from "./Constants";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";

export class RoleList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            selectedRole: null,
            mode: Action.CREATE,
            groupModel: this.defaultGroupModel,
            showRemoveModal: false
                
            
        }
    }

    componentDidMount = () => {
        const {prefix, reload, reloaded} = this.props;
        if(prefix)
        {
        this.setState({prefix: prefix}, this.onLoadRoles(null));
        }
        if(reload)
        {
            this.onLoadRoles(this.state.searchText ?? '');
        }
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.prefix !== nextProps.prefix)
        {
            this.setState({prefix: nextProps.prefix},this.onLoadRoles());
        }
        if(nextProps.reload)
        {
            this.onLoadRoles(this.state.searchText ?? '');
        }
        return true;
    }

    defaultGroupModel = {
        recID: null,
        roleId: null,
        roleName: null,
        roleSubName: null,
        isAdmin: false,
        description: null,
        lock: false
    }

    onLoadRoles = (name) => {
        const {onReloaded} = this.props;
        AdminRoleServices.GetAllRolesByName({ name: name ?? '' })
            .then(result => {
                if (result.data && result.data.length > 0) {
                    this.setState({ roles: result.data }, onReloaded());
                    return;
                }
                this.setState({ roles: [] });
            }, error => {
            });
    }

    searchRoles = debounce((name) => { this.onLoadRoles(name) }, 1000);

    onRoleSearchTextChange = (e) => {
        const value = e.target.value;
        this.setState({searchText: value}, this.searchRoles(value));
    }

    onSelectRole = (id) => {
        const { onChange } = this.props;
        if (id === null || !onChange) return;
        this.setState({ selectedRole: id }, onChange(id));
    }

    onShowAddEditGroupModal = (item) => {
        if(item)
        {
            this.setState({ groupModel: item, showAddEditGroupModal: true, mode: Action.EDIT });
            return;
        }
        this.setState({ showAddEditGroupModal: true, groupModel: this.defaultGroupModel, mode: Action.CREATE});
    }

    onShowRemoveModal =(item) => {
        this.setState({showRemoveModal: true, removeItemId: item.recID});
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
        AdminRoleServices.Create(Object.assign({}, { ...groupModel, currentUser: AuthenticationManager.UserId }))
            .then(result => {
                this.onLoadRoles();
                this.onHideModal();
                ShowNotification(NotificationType.SUCCESS, "T???o m???i ph??n quy???n th??nh c??ng!");
            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra , kh??ng th??? th??m m???i ph??n quy???n");
            });
    }



    processEditRole = () => {
        const { groupModel } = this.state;
        AdminRoleServices.Update(groupModel.recID, Object.assign({}, { ...groupModel, modifiedBy: null }))
            .then(response => {
                this.onLoadRoles();
                this.onHideModal();
                ShowNotification(NotificationType.SUCCESS, "Ch???nh s???a ph??n quy???n th??nh c??ng!");
            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? ch???nh s???a ph??n quy???n");
            });
    }

    processRemoveRole =() => {
        const {removeItemId} = this.state;
        AdminRoleServices.Delete(removeItemId).then(response => {
            if(response.data === "USER_EXIST")
            {
                ShowNotification(NotificationType.ERROR, "??ang c?? ng?????i d??ng thu???c ph??n quy???n n??y");
                this.setState({showRemoveModal: false, removeItemId: null});
                return;
            }

            if(response.data === "DATAROLE_EXIST")
            {
                ShowNotification(NotificationType.ERROR, "Ph??n quy???n n??y ??ang thu???c c??c v??ng d??? li???u");
                this.setState({showRemoveModal: false, removeItemId: null});
                return;
            }

            ShowNotification(NotificationType.SUCCESS, "X??a Ph??n quy???n th??nh c??ng");
                this.setState({showRemoveModal: false, removeItemId: null}, this.onLoadRoles());
        }, error => {
            ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! kh??ng th??? x??a ph??n quy???n");
            this.setState({showRemoveModal: false, removeItemId: null});
        });
    }

    render = () => {
        const { roles, selectedRole, prefix } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <div className="d-flex">
                        <input onChange={this.onRoleSearchTextChange} className="form-control flex-fill" placeholder="T??m ki???m"></input>
                        {AuthenticationManager.AllowAdd(prefix) &&<button data-tip="Th??m nh??m quy???n m???i" className="btn btn-primary ml-1" onClick={() =>this.onShowAddEditGroupModal()}><FontAwesomeIcon icon={faPlus} /></button>}
                    </div>

                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            roles && roles.length > 0 && roles.map((item, index) => {
                                return (
                                    <div key={item.recID} fieldName={item.recID} className={selectedRole === item.recID ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"} onClick={() => this.onSelectRole(item.recID)}>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.roleName}</b>-{item.roleId}</span>
                                            <div className="ml-auto">
                                            {AuthenticationManager.AllowEdit(prefix) && <FontAwesomeIcon className="mr-2" onClick={() => this.onShowAddEditGroupModal(item)} icon={faEdit} color="blue" />}
                                            {AuthenticationManager.AllowDelete(prefix) && <FontAwesomeIcon className="mr-2" onClick={() => this.onShowRemoveModal(item)} icon={faTrash} color="red" />}
                                                {
                                                    item.lock && <FontAwesomeIcon icon={faLock} color="red" />
                                                }
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.roleSubName} <FontAwesomeIcon className="ml-3 mr-1" icon={faUsers}/>:{item.userCount}</i></span>
                                            <span className="ml-auto mt-1"><i>{item.isAdmin ? 'To??n quy???n' : ''}</i></span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !roles || roles.length === 0 &&
                            <div className="w-100 h-100 group-role-item-blank">
                                Kh??ng c?? d??? li???u.
                            </div>
                        }

                    </div>
                </Card.Body>
                {this.generateAddGroupModal()}
                {this.generateRemoveModal()}
            </Card>
        )
    }

    generateRemoveModal =() => {
        const {showRemoveModal} = this.state;
        return (
            <Modal show={showRemoveModal} centered backdrop="static">
                <Modal.Header>X??C NH???N</Modal.Header>
                <Modal.Body>
                    B???n ch???c ch???n mu???n x??a ph??n quy???n ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.processRemoveRole}><FontAwesomeIcon icon={faCheck}/><span className="ml-1"> ?????ng ??</span> </button>
                    <button className="btn btn-danger" onClick={() => this.setState({showRemoveModal: false, removeItemId: null})}><FontAwesomeIcon icon={faTimes}/><span className="ml-1"> H???y b???</span> </button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateAddGroupModal = () => {
        const { showAddEditGroupModal, mode } = this.state;
        const { roleId, roleName, roleSubName, isAdmin, lock, description } = this.state.groupModel;
        return (
            <Modal show={showAddEditGroupModal} centered backdrop="static">
                <Modal.Header>
                    {mode === Action.CREATE ? 'T???O M???I PH??N QUY???N' : 'CH???NH S???A PH??N QUY???N'}
                </Modal.Header>
                <Modal.Body className="group-role-container">
                    <div className="w-100 d-flex flex-column pl-2 pr-2">
                        <label>
                            M?? Nh??m:
                            <input className="form-control w-50"
                                placeholder="M?? nh??m"
                                value={roleId}
                                onChange={this.onGroupModelTextChange}
                                fieldName="roleId"
                                disabled={mode === Action.EDIT}
                            ></input>
                        </label>
                        <label>
                            T??n nh??m:
                            <input className="form-control" placeholder="T??n nh??m" value={roleName} onChange={this.onGroupModelTextChange} fieldName="roleName"></input>
                        </label>
                        <label>
                            T??n kh??c:
                            <input className="form-control" placeholder="T??n thay th???" value={roleSubName} onChange={this.onGroupModelTextChange} fieldName="roleSubName"></input>
                        </label>
                        <div className="ml-auto mt-2">
                            <label>
                                <input type="checkbox" checked={lock} fieldName="lock" onChange={this.onGroupModelTextChange} /> B??? kh??a
                            </label>
                            <label className="ml-3">
                                <input type="checkbox" checked={isAdmin} fieldName="isAdmin" onChange={this.onGroupModelTextChange} /> To??n quy???n
                            </label>
                        </div>

                        <label>
                            M?? t???:
                            <textarea rows={3} className="form-control" placeholder="M?? t???" value={description} onChange={this.onGroupModelTextChange} fieldName="description" />

                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => { mode === Action.CREATE ? this.processAddRole() : this.processEditRole() }}>
                        <FontAwesomeIcon icon={faCheck} />
                        <span className="ml-1">L??u</span>
                    </button>
                    <button className="btn btn-danger" onClick={this.onHideModal}>
                        <FontAwesomeIcon icon={faTimes} />
                        <span className="ml-1">H???y b???</span>
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}