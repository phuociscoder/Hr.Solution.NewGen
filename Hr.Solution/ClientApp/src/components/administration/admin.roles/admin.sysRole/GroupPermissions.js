import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { AdminRoleServices } from "./admin.roles.services";
import { FunctionType } from "./Constants";
import { debounce } from "lodash";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faRecycle, faSave, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

export class RoleGroupPermissions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            permissions: [],
            selectedRoleId: null,
            notFoundPermission: false,
            showResetConfirmModal: false,
            modalType: ''
        }
    }

    componentDidMount = () => {
        const { selectedRoleId, functions, prefix } = this.props;
        if (prefix) {
            this.setState({ prefix: prefix });
        }
        if (functions) {
            this.setState({ functions: functions });
        }
        if (selectedRoleId) {
            this.setState({ selectedRoleId: selectedRoleId });
            this.loadPermissions(selectedRoleId);
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.prefix !== nextProps.prefix) {
            this.setState({ prefix: nextProps.prefix });
        }
        if (this.props.functions !== nextProps.functions) {
            this.setState({ functions: nextProps.functions });
        }
        if (this.props.selectedRoleId !== nextProps.selectedRoleId) {
            if (nextProps.selectedRoleId) {
                this.setState({ selectedRoleId: nextProps.selectedRoleId }, this.loadPermissions(nextProps.selectedRoleId));
            }
        }
        return true;
    }

    defaultPermissions = () => {
        return {
            view: false,
            add: false,
            edit: false,
            delete: false,
            import: false,
            export: false,
            roleId: null
        }
    }

    mapData = (rolePermissions) => {
        let roleFunctionPermissions = [];
        const { functions } = this.state;
        if (!functions) return;
        functions.forEach(_function => {
            const functionPermissions = rolePermissions && rolePermissions.length > 0 ? rolePermissions.find(x => x.functionId === _function.functionId) : this.defaultPermissions();
            let roleFunctionPermission = {};
            roleFunctionPermission = { ..._function, ...functionPermissions };
            roleFunctionPermissions.push(roleFunctionPermission);
        });
        this.setState({ permissions: roleFunctionPermissions, originRolePermissions: rolePermissions });
    }

    loadPermissions = (roleId) => {
        AdminRoleServices.GetRolePermissions(roleId)
            .then(response => {
                if (response.data) {
                    this.mapData(response.data);
                }
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể thao tác");
            });
    }

    onCheckboxChange = (e) => {
        const { selectedRoleId, permissions, prefix } = this.state;
        if (!AuthenticationManager.AllowEdit(prefix)) {
            ShowNotification(NotificationType.ERROR, "Bạn không có quyền thay đổi thiết lập");
            e.target.checked = false;
            return;
        }
        const fieldName = e.target.getAttribute("fieldname");
        const functionId = e.target.getAttribute("functionid");
        const value = e.target.checked;

        let func = permissions.find(x => x.functionId === functionId);
        if (!func) {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể thao tác");
            return;
        }
        func[fieldName] = value;
        func['roleId'] = selectedRoleId;
        this.setState({ permissions: permissions });
        // AdminRoleServices.UpdateRolePermission(selectedRoleId, func)
        //     .then(response => {
        //         if (response.data === 0) {
        //             ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể thao tác");
        //             return;
        //         }
        //         ShowNotification(NotificationType.SUCCESS, "Cập nhật phân quyền thành công!");
        //         this.setState({ permissions: permissions });
        //     }, error => {
        //         debugger;
        //     })
    }

    onSearchPermissionChange = (e) => {
        const value = e.target.value;
        this.onDebounceSearch(value);
    }



    onDebounceSearch = debounce((value) => {
        const { functions } = this.props;
        if (value === '' || !value || value.length === 0) {
            this.setState({ functions: functions, notFoundPermission: false }, this.loadPermissions(this.state.selectedRoleId));
            return;
        }
        const { notFoundPermission } = this.state;
        let searchFunctions = Object.assign([], functions).filter(x => x.functionId
            .toLowerCase()
            .trim()
            .includes(value.toLowerCase().trim())
            || x.functionName.toLowerCase().trim().includes(value.toLowerCase().trim()));
        if (searchFunctions.length === 0) {
            this.setState({ notFoundPermission: true });
            return;
        }
        if (notFoundPermission) this.setState({ notFoundPermission: false });
        this.loadTreeFunctions(searchFunctions);
    }, 1000);

    loadTreeFunctions = (searchFunctions) => {
        const functions = Object.freeze(this.props.functions);
        let results = [];
        searchFunctions.forEach(func => {
            if (func.level === 0) {
                const childs = functions.filter(x => x.parentId === func.functionId);
                results = [...new Set([...results, func, ...childs])];
            }

            if (func.level === 1) {
                const parent = functions.find(x => x.functionId === func.parentId);
                const childs = functions.filter(x => x.parentId === func.functionId);
                results = [...new Set([...results, parent, func, ...childs])];
            }

            if (func.level === 2) {
                const parent = functions.find(x => x.functionId === func.parentId);
                if (parent.level === 1) {
                    const root = functions.find(x => x.functionId === parent.parentId);
                    results = [...new Set([...results, ...[root]])];
                }
                results = [...new Set([...results, ...[parent], func])];
            }
        });
        this.setState({ functions: results }, this.loadPermissions(this.state.selectedRoleId));
    }

    renderPermissionItem = (item) => {
        return (
            <Row className={`${item.level === 0 ? 'permission-module-title'
                : item.level === 1 ? 'permission-submodule-title'
                    : 'permission'} border-bottom permission pt-2 pb-2`}>
                {item.level === 2 &&
                    <>
                        <Col xs={1}>{item.functionId}</Col>
                        <Col xs={5}>{item.functionName}</Col>
                    </>
                }
                {
                    item.level !== 2 &&
                    <Col xs={6} className="text-uppercase"><b>{item.functionName}</b></Col>
                }
                <Col className="text-center border-right border-left" xs={1}>
                    <input className="permission-checkbox shadow" checked={item.view} fieldName="view" functionId={item.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                </Col>
                <Col className="text-center border-right border-left" xs={1}>
                    <input className="permission-checkbox shadow" checked={item.add} fieldName="add" functionId={item.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                </Col>
                <Col className="text-center border-right border-left" xs={1}>
                    <input className="permission-checkbox shadow" checked={item.edit} fieldName="edit" functionId={item.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                </Col>
                <Col className="text-center border-right border-left" xs={1}>
                    <input className="permission-checkbox shadow" checked={item.delete} fieldName="delete" functionId={item.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                </Col>
                <Col className="text-center border-right border-left" xs={1}>
                    <input className="permission-checkbox shadow" checked={item.import} fieldName="import" functionId={item.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                </Col>
                <Col className="text-center border-right border-left" xs={1}>
                    <input className="permission-checkbox shadow" checked={item.export} fieldName="export" functionId={item.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                </Col>
            </Row>
        )
    }

    render = () => {
        const { permissions, notFoundPermission, prefix } = this.state;
        return (
            <div className="d-flex flex-column w-100 h-100 animate__animated animate__fadeIn">
                <div className="w-100 h-6 d-flex justify-content-end align-items-center mt-1" style={{ paddingRight: '20px' }}>
                    <input className="form-control w-40" onChange={this.onSearchPermissionChange} placeholder="Tìm kiếm"></input>
                    <button className="btn btn-primary ml-2" onClick={() => this.setState({ showConfirmModal: true, modalType: 'saveChanges' })}><FontAwesomeIcon icon={faSave} /><span className="ml-1">Lưu thay đổi</span></button>
                    <button className="btn btn-danger ml-2" onClick={() => this.setState({ showConfirmModal: true, modalType: 'reset' })}><FontAwesomeIcon icon={faRecycle} /><span className="ml-1">Hoàn tác</span></button>
                </div>
                <div className="w-100 h-94 mt-2 d-flex flex-column">
                    <div className="h-6" style={{ width: '99%' }}>
                        <Row className="border h-100 pt-2 pb-2 permission-group-header">
                            <Col xs={1}>MÃ CN</Col>
                            <Col xs={5}>TÊN CHỨC NĂNG</Col>
                            <Col className="text-center border-right border-left" xs={1}>XEM</Col>
                            <Col className="text-center border-right border-left" xs={1}>THÊM</Col>
                            <Col className="text-center border-right border-left" xs={1}>SỬA</Col>
                            <Col className="text-center border-right border-left" xs={1}>XÓA</Col>
                            <Col className="text-center border-right border-left" xs={1}>NHẬP</Col>
                            <Col className="text-center border-right border-left" xs={1}>XUẤT</Col>
                        </Row>
                    </div>
                    <div className="permission-container d-flex flex-column align-self-stretch mt-1">
                        {
                            !notFoundPermission && permissions && permissions.length > 0 && permissions.filter(x => x.functionType === FunctionType.Module && x.level === 0).map((item, index) => {
                                return (
                                    <>
                                        {this.renderPermissionItem(item)}
                                        {permissions.filter(x => x.parentId === item.functionId).map((func, index) => {
                                            if (func.functionType === FunctionType.Module && func.level === 1) {
                                                return (
                                                    <>
                                                        {this.renderPermissionItem(func)}
                                                        {
                                                            permissions.filter(x => x.parentId === func.functionId).map((child, item) => {
                                                                return (
                                                                    <>
                                                                        {this.renderPermissionItem(child)}
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                )
                                            } else {
                                                return (
                                                    <>
                                                        {this.renderPermissionItem(func)}
                                                    </>
                                                )
                                            }
                                        })}
                                    </>
                                )
                            })
                        }
                        {
                            notFoundPermission &&
                            <Row className="border permission-module-title mt-1">
                                <Col xs={12} className="text-center"><span className="text-uppercase"><b>Không tìm thấy chức năng này !</b></span></Col>
                            </Row>
                        }
                        {this.generateConfirmModal()}

                    </div>
                </div>
            </div>
        )
    }

    generateConfirmModal = () => {
        const { showConfirmModal, modalType } = this.state;
        return (
            <Modal show={showConfirmModal} centered backdrop="static">
                <Modal.Header>{modalType === "reset" ? "XÁC NHẬN HOÀN TÁC" : "XÁC NHẬN LƯU THAY ĐỔI"}</Modal.Header>
                <Modal.Body>
                    {modalType === "reset" ? "Chắc chắn muốn hoàn tác ?" : "Chắc chắn muốn lưu các thay đổi ?"}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => { modalType === 'reset' ? this.onProcessResetConfirm() : this.onProcessSaveChangesConfirm() }}><FontAwesomeIcon icon={faCheck} /> <span className="ml-1">Đồng ý</span></button>
                    <button className="btn btn-danger ml-2" onClick={() => this.setState({ showConfirmModal: false })}><FontAwesomeIcon icon={faTimes} /> <span className="ml-1">Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    onProcessResetConfirm = () => {
        const { originRolePermissions } = this.state;
        this.setState({ showConfirmModal: false }, this.mapData(originRolePermissions));
        ShowNotification(NotificationType.SUCCESS, "Hoàn tác dữ liệu thành công!");
    }

    onProcessSaveChangesConfirm = () => {
        const { permissions, selectedRoleId } = this.state;
        const newRolePermissions = permissions.filter(x => x.view || x.edit || x.add || x.delete || x.import || x.export);
        const params = newRolePermissions.map(x => {
            const permissionParam = {
                roleId: x.roleId,
                functionId: x.functionId,
                view: x.view,
                add: x.add,
                edit: x.edit,
                delete: x.delete,
                import: x.import,
                export: x.export,
                createdBy: AuthenticationManager.UserName()
            }
            return permissionParam;
        });
        AdminRoleServices.UpdateRolePermissions(selectedRoleId, params)
        .then(response => {
            debugger;
        }, error => {
            debugger;
        });

    }
}