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
import { CustomSelect } from "../../../Common/CustomSelect";
import { result } from "lodash";



export class DepartmentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentInfo: {},
            mode: Mode.VIEW,
            departments: [],
            reload: false,
            showLogo: false

        }
    }

    initModel = {
        id: null,
        departmentCode: '',
        departmentName: '',
        departmentName2: '',
        parentId: null,
        active: true,
        isCompany: false,
        departmentTel: '',
        departmentEmail: '',
        departmentAddress: '',
        taxCode: '',
        note: '',
        ordinal: 0,
        departmentFax: '',
        logoImage: null

    }

    componentDidMount = () => {
        const { prefix, departmentId } = this.props;
        if (!prefix || !departmentId) return;
        this.getDepartmentInfo(departmentId);
    }

    getDepartmentInfo = (id) => {
        DepartmentServices.GetById(id)
            .then(response => {
                const resultModel = response.data;
                const model = Object.assign({}, {
                    id: resultModel.id,
                    departmentCode: resultModel.departmentCode ?? '',
                    departmentName: resultModel.departmentName ?? '',
                    departmentName2: resultModel.departmentName2 ?? '',
                    parentID: resultModel.parentID,
                    active: resultModel.active,
                    managerId: resultModel.managerId,
                    isCompany: resultModel.isCompany,
                    departmentTel: resultModel.departmentTel ?? '',
                    departmentEmail: resultModel.departmentEmail ?? '',
                    departmentAddress: resultModel.departmentAddress ?? '',
                    taxCode: resultModel.taxCode ?? '',
                    note: resultModel.note ?? '',
                    ordinal: resultModel.ordinal ?? 0,
                    departmentFax: resultModel.departmentFax ?? '',
                    logoImage: resultModel.logoImage
                });
                this.setState({ departmentInfo: model, originDepartmentInfo: model, mode: Mode.EDIT, showLogo: model.isCompany });
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

    componentDidUpdate = () => {
        const { reload } = this.state;
        if (reload) {
            this.setState({ reload: false });
        }
    }

    onAddItemClick = () => {
        const newModel = this.initModel;
        this.setState({ departmentInfo: newModel, mode: Mode.CREATE, showLogo: false });
    }

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
        if (fieldName === 'isCompany') {
            this.setState({ showLogo: value });
        }

        let newModel = Object.assign({}, { ...departmentInfo, [fieldName]: value });
        this.setState({ departmentInfo: newModel });
    }

    onDepartmentLogoChange = (value) => {
        const { departmentInfo } = this.state;
        const newModel = Object.assign({}, { ...departmentInfo, logoImage: value });
        this.setState({ departmentInfo: newModel });
    }

    onManagerChange = (id) => {
        const { departmentInfo } = this.state;
        const newModel = Object.assign({}, { ...departmentInfo, managerId: id });
        this.setState({ departmentInfo: newModel });
    }

    onDepartmentChange = (id) => {
        const { departmentInfo } = this.state;
        const newModel = Object.assign({}, { ...departmentInfo, parentId: id });
        this.setState({ departmentInfo: newModel });
    }

    render = () => {
        const { mode, reload, showLogo } = this.state;
        const { id, departmentCode, departmentName, departmentName2, departmentAddress, departmentEmail, departmentFax,
            departmentTel, isCompany, note, ordinal, taxCode, logoImage, managerId, active, parentID } = this.state.departmentInfo;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body className="flex-column">
                        <div className="d-flex w-75 p-3">
                            <div className="w-50 d-flex flex-column">
                                <label>
                                    Mã bộ phận:
                                    <input disabled={mode !== Mode.CREATE} fieldname="departmentCode" value={departmentCode} onChange={this.onInputChange} className="w-50 form-control" placeholder="Mã bộ phận" />
                                </label>
                                <label className="mt-2">
                                    Tên bộ phận:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentName" value={departmentName} onChange={this.onInputChange} className="form-control" placeholder="Tên bộ phận" />
                                </label>
                                <label className="mt-2">
                                    Tên Thay thế:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentName2" value={departmentName2} onChange={this.onInputChange} className=" form-control" placeholder="Tên thay thế" />
                                </label>
                                <label className="mt-2">
                                    Trưởng bộ phận:
                                    <CustomSelect dataUrl="/api/Employee/Managers" className="w-100"
                                        orderFieldName={["level"]}
                                        orderBy="desc"
                                        disabled={mode === Mode.VIEW}
                                        selectedValue={managerId}
                                        isHierachy={false}
                                        valueField="id"
                                        labelField="fullName"
                                        isClearable={true}
                                        onValueChange={this.onManagerChange} />
                                </label>
                                <div className="w-50 d-flex mt-2">
                                    <label>
                                        <input disabled={mode === Mode.VIEW} fieldname="isCompany" checked={isCompany} onChange={this.onInputChange} className="mr-1" type="checkbox" /> Công ty
                                    </label>
                                    <label className="ml-auto">
                                        <input disabled={mode === Mode.VIEW} fieldname="active" checked={active} onChange={this.onInputChange} type="checkbox" /> Đang hoạt động
                                    </label>
                                </div>
                                <label className="mt-2">
                                    Thuộc bộ phận:
                                    <CustomSelect dataUrl="/api/Department" className="w-100"
                                        orderFieldName={["level"]}
                                        orderBy="desc"
                                        disabled={mode === Mode.VIEW}
                                        isHierachy={true}
                                        selectedValue={parentID}
                                        disabledValue={id}
                                        valueField="id"
                                        labelField="departmentName"
                                        isClearable={true}
                                        reload={reload}
                                        onValueChange={this.onDepartmentChange} />
                                </label>
                                <label className="mt-2">
                                    Điện thoại:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentTel" value={departmentTel} onChange={this.onInputChange} className="form-control " placeholder="Điện thoại" />
                                </label>
                                <label className="mt-2">
                                    Địa chỉ:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentAddress" value={departmentAddress} onChange={this.onInputChange} className="form-control " placeholder="Điện thoại" />
                                </label>
                            </div>
                            { showLogo && <div className="w-25 ml-5">
                                <label className="mb-0">Logo:</label>
                                <ImageUploader disabled={mode === Mode.VIEW} imageSrc={logoImage} onChangeImage={this.onDepartmentLogoChange} width={115} height={115} />
                            </div>}

                        </div>
                        <div className="w-75 p-3 d-flex flex-column">
                            <div className="w-100 d-flex">
                                <label className="mt-2 w-50">
                                    Email:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentEmail" value={departmentEmail} onChange={this.onInputChange} className="form-control" placeholder="Email" />
                                </label>
                                <label className="mt-2 pl-5 ml-0 w-50">
                                    Thứ tự:
                                    <input disabled={mode === Mode.VIEW} fieldname="ordinal" type="number" value={ordinal} onChange={this.onInputChange} className="form-control w-50" placeholder="Thứ tự" />
                                </label>
                            </div>

                            <div className="w-100 d-flex">
                                <div className="w-50">
                                    <label className="w-100 mt-2">
                                        Fax:
                                        <input disabled={mode === Mode.VIEW} fieldname="departmentFax" value={departmentFax} onChange={this.onInputChange} className="form-control " placeholder="Fax" />
                                    </label>
                                    <label className="w-100 mt-2">
                                        Mã số thuế:
                                        <input disabled={mode === Mode.VIEW} fieldname="taxCode" value={taxCode} onChange={this.onInputChange} className="form-control" placeholder="Mã số thuế" />
                                    </label>
                                </div>
                                <div className="w-50 pl-5 mt-2">
                                    <label className="w-100">
                                        Ghi chú:
                                        <textarea disabled={mode === Mode.VIEW} rows={4} style={{ height: '115px' }} placeholder="Ghi chú" fieldName="note" value={note} onChange={this.onInputChange} className="form-control" />
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div className="w-75 border-bottom mt-2"></div>
                        <div className="w-75 mt-2 ml-3 d-flex">
                            {mode === Mode.EDIT &&
                                <button className="btn btn-danger mr-auto" onClick={this.onShowRemoveModalConfirm}>
                                    <FontAwesomeIcon icon={faTrash} /> <span className="ml-1"> Xóa bộ phận</span>
                                </button>
                            }

                            {mode !== Mode.VIEW &&
                                <>

                                    <button className="btn btn-primary mr-2 " onClick={this.onShowProcessConfirmModal}>
                                        <FontAwesomeIcon icon={faCheck} /> <span className="ml-1"> Lưu thay đổi</span>
                                    </button>
                                    <button className="btn btn-danger " onClick={this.onShowCancelConfirmModal}>
                                        <FontAwesomeIcon icon={faTimes} /> <span className="ml-1"> Hủy bỏ</span>
                                    </button>
                                </>
                            }
                        </div>

                    </Card.Body>
                </Card>
                {this.generateCancelModalConfirm()}
                {this.generateProcessModalConfirm()}
                {this.generateRemoveModalConfirm()}
            </>
        )
    }

    onShowRemoveModalConfirm = () => {
        this.setState({ showModalRemoveComfirm: true });
    }

    generateRemoveModalConfirm = () => {
        const { showModalRemoveComfirm } = this.state;
        return (
            <Modal show={showModalRemoveComfirm} backdrop="static" centered>
                <Modal.Header>
                    XÁC NHẬN XÓA
                </Modal.Header>
                <Modal.Body>
                    Chắc chắn xóa phòng ban/ bộ phận ?
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
        const { departmentInfo } = this.state;
        DepartmentServices.Delete(departmentInfo.id)
            .then(response => {
                if (response.data === "SUCCESS") {
                    ShowNotification(NotificationType.SUCCESS, "Xóa phòng ban/bộ phận thành công");
                    this.setState({ showModalRemoveComfirm: false, departmentInfo: this.initModel, originDepartmentInfo: this.initModel, mode: Mode.VIEW }, this.onRefresh(true));
                }
                else {
                    this.setState({ showModalRemoveComfirm: false });
                    ShowNotification(NotificationType.ERROR, "Không thể xóa phòng ban/bộ phận vì có các đơn vị trực thuộc");
                }

            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa chỉ mục khỏi danh mục");
                this.setState({ showModalRemoveComfirm: false });
            })

    }

    onProcessConfirm = () => {
        const { departmentInfo, mode } = this.state;
        console.log(departmentInfo);
        if (mode === Mode.CREATE) {
            const newModel = Object.assign({}, { ...departmentInfo, createdBy: AuthenticationManager.UserName() });
            DepartmentServices.Add(newModel)
                .then(response => {
                    ShowNotification(NotificationType.SUCCESS, "Thêm bộ phận/phòng ban thành công");
                    this.setState({ model: this.initModel, showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể thêm bộ phận/phòng ban vào hệ thống");
                })

        } else if (mode === Mode.EDIT) {
            const editModel = Object.assign({}, { ...departmentInfo, modifiedBy: AuthenticationManager.UserName() });
            DepartmentServices.Update(editModel.id, editModel)
                .then(response => {
                    ShowNotification(NotificationType.SUCCESS, "Cập nhật phòng ban/bộ phận thành công");
                    this.setState({ departmentInfo: editModel, originDepartmentInfo: editModel, showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể cập nhật chỉ mục ");
                });
        }
    }

    onRefresh = (value) => {
        const { onRefresh } = this.props;
        this.setState({ reload: true }, onRefresh(true));

    }

    onShowCancelConfirmModal = () => {
        this.setState({ showCancelConfirmModal: true });
    }

    onShowProcessConfirmModal = () => {
        this.setState({ showModalProcessConfirm: true });
    }

    onCancelProcessConfirm = () => {
        const { mode, originDepartmentInfo } = this.state;
        if (mode === Mode.CREATE) {
            const model = originDepartmentInfo ?? this.initModel;
            const newMode = originDepartmentInfo ? Mode.EDIT : Mode.VIEW;
            this.setState({ departmentInfo: model, mode: newMode, showCancelConfirmModal: false });
            return;
        }
        if (mode === Mode.EDIT) {
            const model = originDepartmentInfo;
            this.setState({ departmentInfo: model, showCancelConfirmModal: false });
            return;
        }
    }
}