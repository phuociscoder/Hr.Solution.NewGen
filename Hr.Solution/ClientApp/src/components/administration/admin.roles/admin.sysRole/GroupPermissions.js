import React from "react";
import { Col, Row } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { AdminRoleServices } from "./admin.roles.services";
import { FunctionType } from "./Constants";
import { debounce } from "lodash";
import { AuthenticationManager } from "../../../../AuthenticationManager";

export class RoleGroupPermissions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            permissions: [],
            selectedRoleId: null,
            notFoundPermission: false
        }
    }

    componentDidMount = () => {
        const { selectedRoleId, functions, prefix } = this.props;
        if(prefix)
        {
            this.setState({prefix: prefix});
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
        if(this.props.prefix !== nextProps.prefix)
        {
            this.setState({prefix: nextProps.prefix});
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
        this.setState({ permissions: roleFunctionPermissions });
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
        if(!AuthenticationManager.AllowEdit(prefix))
        {
            ShowNotification(NotificationType.ERROR, "Bạn không có quyền thay đổi thiết lập");
            e.target.checked=false;
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
        AdminRoleServices.UpdateRolePermission(selectedRoleId, func)
            .then(response => {
                if (response.data === 0) {
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể thao tác");
                    return;
                }
                ShowNotification(NotificationType.SUCCESS, "Cập nhật phân quyền thành công!");
                this.setState({ permissions: permissions });
            }, error => {
                debugger;
            })
    }

    onSearchPermissionChange = (e) => {
        const value = e.target.value;
        this.onDebounceSearch(value);
    }



    onDebounceSearch = debounce((value) => {
        const { functions } = this.props;
        if(value === '' || !value || value.length ===0)
        {
            this.setState({functions: functions, notFoundPermission: false}, this.loadPermissions(this.state.selectedRoleId));
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

    render = () => {
        const { permissions, notFoundPermission, prefix } = this.state;
        return (
            <div className="d-flex flex-column w-100 h-100 animate__animated animate__fadeIn">
                <div className="w-100 h-6 d-flex justify-content-end mt-1">
                    <input className="form-control w-40" onChange={this.onSearchPermissionChange} placeholder="Tìm kiếm"></input>
                </div>
                <div className="w-100 h-94 mt-2 d-flex flex-column">
                    <div className="h-6">
                        <Row className="border h-100 pt-2 pb-2 permission-group-header">
                            <Col xs={1}>MÃ CN</Col>
                            <Col xs={5}>TÊN CHỨC NĂNG</Col>
                            <Col className="text-center" xs={1}>XEM</Col>
                            <Col className="text-center" xs={1}>THÊM</Col>
                            <Col className="text-center" xs={1}>SỬA</Col>
                            <Col className="text-center" xs={1}>XÓA</Col>
                            <Col className="text-center" xs={1}>NHẬP</Col>
                            <Col className="text-center" xs={1}>XUẤT</Col>
                        </Row>
                    </div>
                    <div className="permission-container d-flex flex-column align-self-stretch mt-1">
                        {
                            !notFoundPermission && permissions && permissions.length > 0 && permissions.filter(x => x.functionType === FunctionType.Module && x.level === 0).map((item, index) => {
                                return (
                                    <>
                                        <Row className="border permission-module-title mt-1">
                                            <Col xs={12}><span className="text-uppercase"><b>{item.functionName}</b></span></Col>
                                        </Row>
                                        {permissions.filter(x => x.parentId === item.functionId).map((func, index) => {
                                            if (func.functionType === FunctionType.Module && func.level === 1) {
                                                return (
                                                    <>
                                                        <Row className="border permission-submodule-title pl-4 pt-2 pb-2">
                                                            <Col xs={12}><span><b>{func.functionName}</b></span></Col>
                                                        </Row>
                                                        {
                                                            permissions.filter(x => x.parentId === func.functionId).map((child, item) => {
                                                                return (
                                                                    <Row key={child.functionId} className=" permission pt-2 pb-2">
                                                                        <Col xs={1}>{child.functionId}</Col>
                                                                        <Col xs={5}>{child.functionName}</Col>
                                                                        <Col className="text-center border-right border-left" xs={1}>
                                                                            <input className="permission-checkbox shadow" checked={child.view} fieldName="view" functionId={child.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                                        </Col>
                                                                        <Col className="text-center border-right border-left" xs={1}>
                                                                            <input className="permission-checkbox shadow" checked={child.add} fieldName="add" functionId={child.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                                        </Col>
                                                                        <Col className="text-center border-right border-left" xs={1}>
                                                                            <input className="permission-checkbox shadow" checked={child.edit} fieldName="edit" functionId={child.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                                        </Col>
                                                                        <Col className="text-center border-right border-left" xs={1}>
                                                                            <input className="permission-checkbox shadow" checked={child.delete} fieldName="delete" functionId={child.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                                        </Col>
                                                                        <Col className="text-center border-right border-left" xs={1}>
                                                                            <input className="permission-checkbox shadow" checked={child.import} fieldName="import" functionId={child.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                                        </Col>
                                                                        <Col className="text-center border-right border-left" xs={1}>
                                                                            <input className="permission-checkbox shadow" checked={child.export} fieldName="export" functionId={child.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                )
                                            } else {
                                                return (
                                                    <Row className=" permission pt-2 pb-2">
                                                        <Col xs={1}>{func.functionId}</Col>
                                                        <Col xs={5}>{func.functionName}</Col>
                                                        <Col className="text-center border-right border-left" xs={1}>
                                                            <input className="permission-checkbox shadow" checked={func.view} fieldName="view" functionId={func.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                        </Col>
                                                        <Col className="text-center border-right border-left" xs={1}>
                                                            <input className="permission-checkbox shadow" checked={func.add} fieldName="add" functionId={func.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                        </Col>
                                                        <Col className="text-center border-right border-left" xs={1}>
                                                            <input className="permission-checkbox shadow" checked={func.edit} fieldName="edit" functionId={func.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                        </Col>
                                                        <Col className="text-center border-right border-left" xs={1}>
                                                            <input className="permission-checkbox shadow" checked={func.delete} fieldName="delete" functionId={func.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                        </Col>
                                                        <Col className="text-center border-right border-left" xs={1}>
                                                            <input className="permission-checkbox shadow" checked={func.import} fieldName="import" functionId={func.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                        </Col>
                                                        <Col className="text-center border-right border-left" xs={1}>
                                                            <input className="permission-checkbox shadow" checked={func.export} fieldName="export" functionId={func.functionId} onClick={this.onCheckboxChange} type="checkbox" />
                                                        </Col>
                                                    </Row>
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

                    </div>
                </div>
            </div>
        )
    }
}