import { faCheck, faEdit, faLock, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal, ModalBody } from "react-bootstrap";
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
                ShowNotification(NotificationType.SUCCESS, "T???o m???i v??ng d??? li???u th??nh c??ng!");
            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra , kh??ng th??? th??m m???i v??ng d??? li???u");
            });
    }



    processEditRole = () => {
        const { groupModel } = this.state;
        AdminDataRoleServices.Update(groupModel.id, Object.assign({}, { ...groupModel, active: true, modifiedBy: AuthenticationManager.UserName() }))
            .then(response => {
                this.onLoadRoles();
                this.onHideModal();
                ShowNotification(NotificationType.SUCCESS, "Ch???nh s???a ph??n quy???n th??nh c??ng!");
            }, error => {
            });
    }

    onRefesh =() => {
        const {onRefesh} = this.props;
        if(onRefesh) onRefesh();
    }

    onRemoveConfirm =() => {
        const {removeItemId} = this.state;
        AdminDataRoleServices.Delete(removeItemId).then(response => {
            if(response.data ==="SYSROLE_EXIST")
            {
                ShowNotification(NotificationType.ERROR, "??ang t???n t???i ph??n quy???n thu???c v??ng d??? li???u");
                this.setState({showRemoveModal: false, removeItemId: null});
                return;
            }

            ShowNotification(NotificationType.SUCCESS, "X??a v??ng d??? li???u th??nh c??ng");
            this.setState({showRemoveModal: false, removeItemId: null}, this.onLoadRoles())
        }, error => {
            ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! Kh??ng th??? x??a v??ng d??? li???u");
        });
    }

    onshowRemoveModal =(item) => {
        this.setState({showRemoveModal: true, removeItemId: item.id});
    }

    render = () => {
        const { roles, selectedRole } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <div className="d-flex">
                        <input onChange={this.onRoleSearchTextChange} className="form-control flex-fill" placeholder="T??m ki???m"></input>
                        <button data-tip="Th??m nh??m quy???n m???i" className="btn btn-primary ml-1" onClick={() => this.onShowAddEditGroupModal()}><FontAwesomeIcon icon={faPlus} /></button>
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
                                                <FontAwesomeIcon className=" mr-2" onClick={() => this.onshowRemoveModal(item)} icon={faTrash} color="red"/>
                                                {
                                                    item.lock && <FontAwesomeIcon icon={faLock} color="red" />
                                                }
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.name2} (SL:{item.roleCount})</i></span>
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
                <Modal.Header>
                    X??C NH???N
                </Modal.Header>
                <Modal.Body>
                    Ch???c ch???n mu???n x??a v??ng d??? li???u ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onRemoveConfirm} ><span className="ml-1">?????ng ??</span></button>
                    <button className="btn btn-danger ml-2" onClick={() => {this.setState({showRemoveModal: false, removeItemId: null})}} ><span className="ml-1">H???y b???</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateAddGroupModal = () => {
        const { showAddEditGroupModal, mode } = this.state;
        const { id, code, name, name2, lock, description } = this.state.groupModel;
        return (
            <Modal show={showAddEditGroupModal} centered backdrop="static">
                <Modal.Header>
                    {mode === Action.CREATE ? 'T???O M???I V??NG D??? LI???U' : 'CH???NH S???A V??NG D??? LI???U'}
                </Modal.Header>
                <Modal.Body className="group-role-container">
                    <div className="w-100 d-flex flex-column pl-2 pr-2">
                        <label>
                            M?? v??ng d??? li???u:
                            <input className="form-control w-50"
                                placeholder="M?? v??ng d??? li???u"
                                value={code}
                                onChange={this.onGroupModelTextChange}
                                fieldName="code"
                                disabled={mode === Action.EDIT}
                            ></input>
                        </label>
                        <label>
                            T??n v??ng d??? li???u:
                            <input className="form-control" placeholder="T??n v??ng d??? li???u" value={name} onChange={this.onGroupModelTextChange} fieldName="name"></input>
                        </label>
                        <label>
                            T??n kh??c:
                            <input className="form-control" placeholder="T??n thay th???" value={name2} onChange={this.onGroupModelTextChange} fieldName="name2"></input>
                        </label>
                        <div className="ml-auto mt-2">
                            <label>
                                <input type="checkbox" checked={lock} fieldName="lock" onChange={this.onGroupModelTextChange} /> B??? kh??a
                            </label>
                            {/* <label className="ml-3">
                                <input type="checkbox" checked={isAdmin} fieldName="isAdmin" onChange={this.onGroupModelTextChange} /> To??n quy???n
                            </label> */}
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