import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { Mode } from "../common/Constants";
import { Modal } from "react-bootstrap";
import { CategoryServices } from "../Category.services";
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";
import { AuthenticationManager } from "../../../../AuthenticationManager";

export class CurrencyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            model: Mode.VIEW,
            model: {}
        };
    }

    componentDidMount = () => {
        const { category, model } = this.props;
        const test = this.resetModel();
        if (!category) return;
        this.setState({ category: category });
        if (Object.keys(model).length > 0) {
            this.setState({ model: model, editModel: model, mode: Mode.EDIT });
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.category !== nextProps.category) {
            this.setState({ category: nextProps.category });
        }
        if (this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0) {
            this.setState({ model: nextProps.model, editModel: nextProps.model, mode: Mode.EDIT });
        }
        return true;
    }

    resetModel = () => {
        const model = {
            id: 0,
            code: '',
            name: '',
            name2: '',
            ordinal: 0,
            note: '',
            isActive: true,
            isMultiple: false,
            standardRatio: '',
            roundedNumber: 0,
            complexCode: ''
        }
        console.log(Object.keys(model));
        return model;
    }


    onAddItemClick = () => {
        const newModel = this.resetModel();
        this.setState({ model: newModel, mode: Mode.CREATE });
    }

    onInputChange = (e) => {
        const { model } = this.state;
        const fieldname = e.target.getAttribute("fieldname");
        const type = e.target.type;
        let value;
        if (type === "checkbox") {
            value = e.target.checked;
        }
        if (type === "number") {
            value = parseInt(e.target.value);
        }
        if (type === "text" || type === "textarea") {
            value = e.target.value;
        }

        let newModel = Object.assign({}, { ...model, [fieldname]: value });
        this.setState({ model: newModel });
    }

    render = () => {
        const { category, mode, model } = this.state;
        console.log(category);
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span>Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex">
                            <div className="w-30 pl-4 pt-3">
                                <label className="w-100">
                                    Mã nguyên tệ:
                                    <input fieldname="code" value={model.code} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder="Mã nguyên tệ"></input>
                                </label>
                                <label className="w-100 mt-2">
                                    Tên nguyên tệ:
                                    <input fieldname="name" value={model.name} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Tên nguyên tệ"></input>
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    Tên khác:
                                    <input fieldname="name2" value={model.name2} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Tên khác"></input>
                                </label>
                                <label className="w-100">
                                    Tỷ lệ mẫu:
                                    <input fieldname="standardRatio" value={model.standardRatio} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Tỷ lệ mẫu"></input>
                                </label>
                                <div className="w-100 mt-2">
                                    <label className="d-flex align-items-center">
                                        <div className="mr-2">Nhân hệ số</div> <input fieldname="isMultiple" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isMultiple} />
                                    </label>
                                </div>
                                <label className="w-100">
                                    Áp dụng cho:
                                    <input fieldname="applyFor" value={model.applyFor} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Áp dụng cho"></input>
                                </label>
                            </div>
                            <div className="w-30 pl-4 pt-3">
                                <label className="w-100">
                                    Số lẻ làm tròn:
                                    <input fieldname="roundedNumber" value={model.roundedNumber} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" type="number" placeholder="Số lẻ làm tròn"></input>
                                </label>
                                <label className="w-100 mt-2">
                                    Mã tổng hợp:
                                    <input fieldname="complexCode" value={model.complexCode} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Mã tổng hợp"></input>
                                </label>
                                <label className="w-100 mt-2">
                                    Thứ tự:
                                    <input fieldname="ordinal" value={model.ordinal} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Thứ tự"></input>
                                </label>
                                <div className="w-100 mt-2">
                                    <label className="d-flex align-items-center">
                                        <div className="mr-2">Đang Hoạt Động</div> <input fieldname="isActive" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isActive} />
                                    </label>
                                </div>
                                <label className="w-100 mt-3">
                                    Ghi chú:
                                    <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.VIEW} value={model.note} className="form-control" rows={4} placeholder="Ghi chú"></textarea>
                                </label>
                                <div className="w-100 d-flex justify-content-end mt-3">
                                    {mode !== Mode.VIEW && <button className="btn btn-primary" onClick={() => this.setState({ showModalProcessConfirm: true })}><FontAwesomeIcon icon={faCheck} /> <span> Lưu thay đổi</span></button>}
                                    {mode === Mode.EDIT && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showModalRemoveComfirm: true })}><FontAwesomeIcon icon={faTrash} /><span> Xóa</span></button>}
                                    {mode !== Mode.VIEW && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span> Hủy bỏ</span></button>}
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card >
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