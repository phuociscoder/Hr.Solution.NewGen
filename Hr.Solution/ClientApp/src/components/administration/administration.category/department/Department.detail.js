import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { DepartmentServices } from "../../admin.department/Department.services";
import { Mode } from "./Constants";
import { ImageUploader } from '../../../Common/ImageUploader';
import { CategoryServices } from "../Category.services";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { DepartmentSelect } from "../../../Common/DepartmentSelect/DepartmentSelect";
import { CustomSelect } from "../../../Common/CustomSelect";



export class DepartmentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentInfo: {},
            mode: Mode.VIEW,
            departments: []

        }
    }

    initModel = {
        id: null,
        departmentCode: null,
        departmentName: null,
        departmentName2: null,
        parentId: null
    }

    componentDidMount = () => {
        const { prefix, departmentId } = this.props;
        if (!prefix || !departmentId) return;
        this.getDepartmentInfo(departmentId);
    }

    getDepartmentInfo = (id) => {
        DepartmentServices.GetById(id)
            .then(response => {
                this.setState({ departmentInfo: response.data });
            },
                error => {
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể truy cập thông tin bộ phận");
                })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.departmentId !== nextProps.departmentId) {
            this.setState({ departmentId: nextProps.departmentId }, this.getDepartmentInfo(nextProps.departmentId));
        }
        if (this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0) {
            this.setState({ model: nextProps.model, editModel: nextProps.model, mode: Mode.EDIT });
        }
        return true;
    }

    onAddItemClick = () => {
        const newModel = this.resetModel();
        this.setState({ model: newModel, mode: Mode.CREATE });
    }

    // getDepartments =() => {
    //         const { dataUrl } = this.props;
    //         RestClient.SendGetRequest(dataUrl)
    //             .then(response => {
    //                 const options = this.generateOptions(response.data);
    //                 this.setState({ departments: options });
    //             }, error => {
    //                 debugger;
    //             });
        
    // }

    onInputChange = (e) => {
        const { departmentInfo } = this.state;
        const fieldName = e.target.getAttribute("fieldname");
        const type = e.target.type;
        let value;
        if (type === 'text' || type === 'textarea') {
            value = e.target.value;
        }
        if (type === 'checkbox') {
            value = e.target.checked;
        }
        if (type === 'number') {
            value = parseInt(e.target.value);
        }

        let newModel = Object.assign({}, { ...departmentInfo, [fieldName]: value });
        this.setState({ departmentInfo: newModel });
    }
    onAmountChange = (value) => {
        console.log(value);
    }

    onDepartmentLogoChange =(e) => {

    }

    onParentChange =(parentId) => {

    }

    onDepartmentChange =(id) => {
        console.log(id);
    }

    render = () => {
        console.log(this.state.departmentInfo);
        const { mode, model, departments } = this.state;
        const { id, departmentCode, departmentName, departmentName2, departmentAddress, departmentEmail, departmentFax,
            departmentTel, isCompany, note, lock, ordinal, taxCode, logoImage, managerId, active, parentID } = this.state.departmentInfo;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex flex-column w-75 p-3">
                            <div className="w-100 d-flex">
                                <div className="w-50 d-flex flex-column">
                                    <label>
                                        Mã bộ phận:
                                        <input disabled={mode === Mode.EDIT} fieldname="departmentCode" value={departmentCode} onChange={this.onInputChange} className="w-50 form-control" placeholder="Mã bộ phận" />
                                    </label>
                                    <label className="mt-2">
                                        Tên bộ phận:
                                        <input fieldname="departmentName" value={departmentName} onChange={this.onInputChange} className="w-100 form-control" placeholder="Tên bộ phận" />
                                    </label>
                                </div>
                                <div className="w-25 ml-3">
                                    <label>Logo:
                                        <ImageUploader imageSrc={logoImage} onChangeImage={this.onDepartmentLogoChange} width={80} height={80} />
                                    </label>
                                </div>
                            </div>

                            <label className="mt-2">
                                Tên Thay thế:
                                <input fieldname="departmentName2" value={departmentName2 ?? ''} onChange={this.onInputChange} className="w-50 form-control" placeholder="Tên thay thế" />
                            </label>
                            <label className="mt-2">
                                Trưởng bộ phận:
                              <CustomSelect dataUrl="/api/Department" className="w-50" 
                              orderFieldName={["level"]} 
                              orderBy="desc" 
                              isHierachy={true}
                              selectedValue={parentID}
                              disabledValue={id} 
                              valueField="id"
                              labelField="departmentName"
                              onValueChange={this.onDepartmentChange} />
                            </label>
                            <div className="w-50 d-flex mt-2">
                                <label>
                                    <input fieldname="isCompany" checked={isCompany} onChange={this.onInputChange} className="mr-1" type="checkbox" /> Công ty
                                </label>
                                <label className="ml-auto">
                                    <input fieldname="active" checked={active} onChange={this.onInputChange} type="checkbox" /> Đang hoạt động
                                </label>
                            </div>
                            <label className="mt-2">
                                Thuộc bộ phận:
                                {/* <DepartmentSelect onValueChange={this.onParentChange} isMulti={false} selectedValue={parentID} hideOptions={[id]} className="w-50" /> */}
                            </label>
                            <div className="w-100 d-flex mt-2">
                                <label className="w-50">
                                    Điện thoại:
                                    <input fieldname="departmentTel" value={departmentTel} onChange={this.onInputChange} className="form-control " placeholder="Điện thoại" />
                                </label>
                                <label className="w-50 ml-3">
                                    Email:
                                    <input fieldname="departmentEmail" value={departmentEmail} onChange={this.onInputChange} className="form-control" placeholder="Email" />
                                </label>
                            </div>
                            <div className="w-100 d-flex mt-2">
                                <label className="w-50">
                                    Fax:
                                    <input fieldname="departmentFax" value={departmentFax} onChange={this.onInputChange} className="form-control " placeholder="Fax" />
                                </label>
                                <label className="w-50 ml-3">
                                    Mã số thuế:
                                    <input fieldname="taxCode" value={taxCode} onChange={this.onInputChange} className="form-control" placeholder="Mã số thuế" />
                                </label>
                            </div>
                            <div className="w-100 border-bottom mt-2"></div>
                            <div className="w-100 mt-2 d-flex">
                                <button className="btn btn-danger mr-auto">
                                    <FontAwesomeIcon icon={faTrash} /> <span className="ml-1"> Xóa bộ phận</span>
                                </button>
                                <button className="btn btn-primary mr-2 ">
                                    <FontAwesomeIcon icon={faTrash} /> <span className="ml-1"> Lưu thay đổi</span>
                                </button>
                                <button className="btn btn-danger ">
                                    <FontAwesomeIcon icon={faTrash} /> <span className="ml-1"> Hủy bỏ</span>
                                </button>
                            </div>
                        </div>

                    </Card.Body>
                </Card>
                {this.generateCancelModalConfirm()}
                {this.generateProcessModalConfirm()}
                {this.generateRemoveModalConfirm()}
            </>
        )
    }

    generateRemoveModalConfirm = () => {
        const { showModalRemoveComfirm } = this.state;
        return (
            <Modal show={showModalRemoveComfirm} backdrop="static" centered>
                <Modal.Header>
                    XÁC NHẬN XÓA
                </Modal.Header>
                <Modal.Body>
                    Chắc chắn xóa chỉ mục khỏi danh mục ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessRemoveConfirm}><FontAwesomeIcon icon={faCheck} /> <span>Đồng ý</span></button>
                    <button className="btn btn-danger" onClick={() => this.setState({ showModalRemoveComfirm: false })}><FontAwesomeIcon icon={faTimes} /> <span>Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateProcessModalConfirm = () => {
        const { showModalProcessConfirm, mode } = this.state;
        return (
            <Modal show={showModalProcessConfirm} backdrop="static" centered>
                <Modal.Header>
                    XÁC NHẬN
                </Modal.Header>
                <Modal.Body>
                    {mode === Mode.CREATE && <span>Chắc chắn thêm chỉ mục vào danh sách ?</span>}
                    {mode === Mode.EDIT && <span>Chắn chắn thay đổi thông tin chỉ mục ?</span>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessConfirm}><FontAwesomeIcon icon={faCheck} /><span> Xác nhận</span></button>
                    <button className="btn btn-danger" onClick={() => { this.setState({ showModalProcessConfirm: false }) }}><FontAwesomeIcon icon={faTimes} /><span> Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateCancelModalConfirm = () => {
        const { showCancelConfirmModal, mode } = this.state;
        return (
            <Modal show={showCancelConfirmModal} centered backdrop="static">
                <Modal.Header>
                    XÁC NHẬN HỦY BỎ
                </Modal.Header>
                <Modal.Body>
                    Chắc chắn muốn hủy bỏ thao tác ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onCancelProcessConfirm}><FontAwesomeIcon icon={faCheck} /><span> Đồng ý</span></button>
                    <button className="btn btn-danger" onClick={() => this.setState({ showCancelConfirmModal: false })}><FontAwesomeIcon icon={faTimes} /><span> Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    onProcessRemoveConfirm = () => {
        const { model } = this.state;
        CategoryServices.DeleteCategoryItem(model.id)
            .then(response => {
                ShowNotification(NotificationType.SUCCESS, "Xóa chỉ mục khỏi danh mục thành công");
                this.setState({ showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.VIEW }, this.onRefresh(true));
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa chỉ mục khỏi danh mục");
                this.setState({ showModalRemoveComfirm: false });
            })

    }

    onProcessConfirm = () => {
        const { model, mode, category } = this.state;
        if (mode === Mode.CREATE) {
            const newModel = Object.assign({}, { ...model, functionId: category.id, createdBy: AuthenticationManager.UserName() });
            CategoryServices.AddCategoryItem(newModel)
                .then(response => {
                    const newModel = response.data;
                    ShowNotification(NotificationType.SUCCESS, "Thêm chỉ mục vào danh sách thành công");
                    this.setState({ model: this.resetModel(), showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể thêm chỉ mục vào danh sách");
                })
        } else if (mode === Mode.EDIT) {
            const editModel = Object.assign({}, { ...model, modifiedBy: AuthenticationManager.UserName() });
            CategoryServices.UpdateCategoryItem(editModel.id, editModel)
                .then(response => {
                    const editModel = response.data;
                    ShowNotification(NotificationType.SUCCESS, "Cập nhật chỉ mục thành công");
                    this.setState({ model: editModel, editModel: editModel, showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể cập nhật chỉ mục ");
                });
        }
    }

    onRefresh = (value) => {
        const { onRefresh } = this.props;
        if (onRefresh) onRefresh(true);

    }

    onCancelProcessConfirm = () => {
        const { mode, editModel } = this.state;
        if (mode === Mode.CREATE) {
            const model = editModel ?? this.resetModel();
            const newMode = editModel ? Mode.EDIT : Mode.VIEW;
            this.setState({ model: model, mode: newMode, showCancelConfirmModal: false });
            return;
        }
        if (mode === Mode.EDIT) {
            const model = editModel;
            this.setState({ model: model, showCancelConfirmModal: false });
            return;
        }
    }
}