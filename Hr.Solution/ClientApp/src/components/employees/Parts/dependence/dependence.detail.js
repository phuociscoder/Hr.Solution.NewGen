
import { faAngleLeft, faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { Function } from "../../../Common/Constants";
import { CustomSelect } from "../../../Common/CustomSelect";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { Mode } from "../../Constanst";
import { NumberUltis } from "../../../Utilities/NumberUltis";
import { StringUltis } from "../../../Utilities/StringUltis";
// import { dependenceServices } from "../dependence.services";

export class EmployeeDependantDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dependence: {},
            mode: Mode.View,
            model: {
                id: 0
            }

        }
    }

    componentDidMount = () => {
        this.loadSelectOptions(Function.LSEM104, 'relations');
    }

    loadSelectOptions = (functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if (options) this.setState({ [stateName]: options });
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách quan hệ");
        });
    }


    shouldComponentUpdate = (nextProps) => {
        if (this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0) {
            this.setState({ model: nextProps.model, editModel: nextProps.model, mode: Mode.Edit });
        }
        return true;
    }

    resetModel = () => {
        const model = {
            id: 0,
            employeeId: 0,
            dependantsCode: '',
            fullName: '',
            phone: '',
            relationTypeId: null,
            dayOfBirth: null,
            address: '',
            isTax: true,
            note: null
        }
        return model;
    }

    onAddItemClick = () => {
        const newModel = { id: 0, isActive: true };
        this.setState({ model: newModel, mode: Mode.Create });
    }

    onEmployeeDependantModelChange = (e) => {
        const { model } = this.state;
        const fieldName = e.target.getAttribute("fieldname");
        const type = e.target.type;
        let value;
        if (type === 'text' || type === 'textarea') {
            value = e.target.value;
        }
        if (type === 'checkbox') {
            value = e.target.checked;
        }

        let newModel = Object.assign({}, { ...model, [fieldName]: value });
        this.setState({ model: newModel });
    }

    onCustomModelChange = (value, stateName) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, [stateName]: value });
        this.setState({ model: newModel });
    }

    validModel = () => {
        const { model } = this.state;
        return !StringUltis.IsNullOrEmpty(model.dependantsCode) && NumberUltis.IsNumber(model.relationTypeId) && !StringUltis.IsNullOrEmpty(model.fullName);
    }

    render = () => {
        const { dependantsCode, fullName, dayOfBirth, address, relationTypeId, phone, isTax, note } = this.state.model;
        const { mode, relations } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.Create} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        {mode === Mode.View && <div className="w-100 p-5"><h5><b>Chọn từ danh sách hoặc nhấn nút "Thêm mới" để tiếp tục .</b></h5></div>}
                        {mode !== Mode.View && <div className="w-80 d-flex p-3 animate__animated animate__fadeIn">
                            <div className="w-100 d-flex flex-column">
                                <label className="w-25">
                                    Mã người phụ thuộc:<span className="require">*</span>
                                    <input fieldname="dependantsCode" value={dependantsCode} onChange={this.onEmployeeDependantModelChange} className="form-control" placeholder="Mã người phụ thuộc"></input>
                                </label>
                                <label className="w-25 text-camelcase">
                                    Quan hệ: <span className="require">*</span>
                                    <CustomSelect data={relations} selectedValue={relationTypeId} labelField="name" placeHolder="-Chọn quan hệ-" isClearable={true} onValueChange={value => this.onCustomModelChange(value, 'relationTypeId')} />
                                </label>
                                <div className="d-flex">
                                    <label className="w-50">
                                        Tên người phụ thuộc: <span className="require">*</span>
                                        <input fieldname="fullName" value={fullName} onChange={this.onEmployeeDependantModelChange} className="form-control" placeholder="Tên người phụ thuộc"></input>
                                    </label>
                                    <label className="w-50 pl-4 text-camelcase">
                                        Ngày sinh:
                                        <CustomDatePicker value={dayOfBirth} onDateChange={value => this.onCustomModelChange(value, 'dayOfBirth')} />
                                    </label>
                                </div>
                                <label className="w-100 text-camelcase">
                                    Địa chỉ:
                                    <input fieldname="address" value={address} onChange={this.onEmployeeDependantModelChange} className="form-control" placeholder="Địa chỉ"></input>
                                </label>

                                <label className="w-50 text-camelcase">
                                    Số điện thoại:
                                    <input fieldname="phone" value={phone} onChange={this.onEmployeeDependantModelChange} className="form-control" placeholder="Số điện thoại"></input>
                                </label>
                                <label className="w-25 ">
                                    <input fieldname="isTax" onChange={this.onEmployeeDependantModelChange} type="checkbox" checked={isTax} /> <span className="ml-1"> Tính thuế</span>
                                </label>
                                <label className="w-100 ">
                                    Ghi chú:
                                    <textarea fieldname="note" onChange={this.onEmployeeDependantModelChange} value={note} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                                </label>
                            </div>
                        </div>
                        }
                        <div className="w-80 border-bottom" />
                        <div className="d-flex w-80 justify-content-end mt-2">
                            {mode !== Mode.View && <button disabled={!this.validModel()} data-tip="Lưu" className="btn btn-primary" onClick={() => this.setState({ showModalProcessConfirm: true })}><FontAwesomeIcon icon={faAngleLeft} /><span className="ml-1">{mode === Mode.Create ? "Thêm vào danh sách" : "Cập nhật vào danh sách"}</span></button>}
                            {mode === Mode.Edit && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showModalRemoveComfirm: true })}><FontAwesomeIcon icon={faTrash} /><span className="ml-1">Xóa khỏi danh sách</span></button>}
                            {mode !== Mode.View && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span className="ml-1">Hủy thao tác</span></button>}

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
                    Chắc chắn xóa người phụ thuộc?
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
                    {mode === Mode.Create && <span>Chắc chắn thêm người phụ thuộc ?</span>}
                    {mode === Mode.Edit && <span>Chắn chắn thay đổi thông tin người phụ thuộc ?</span>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessConfirm}><FontAwesomeIcon icon={faCheck} /><span> Xác nhận</span></button>
                    <button className="btn btn-danger" onClick={() => { this.setState({ showModalProcessConfirm: false }) }}><FontAwesomeIcon icon={faTimes} /><span> Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateCancelModalConfirm = () => {
        const { showCancelConfirmModal } = this.state;
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
        const { onUpdateModels } = this.props;
        onUpdateModels({ type: "D", model: model });
        this.setState({ showModalRemoveComfirm: false, mode: Mode.View });

    }

    onProcessConfirm = () => {
        const { model, mode, relations } = this.state;
        const { onUpdateModels } = this.props;

        if (model.relationTypeId) {
            model.relationTypeName = relations.find(x => x.id === model.relationTypeId)?.name;
        }

        if (mode === Mode.Create) {
            onUpdateModels({ type: "A", model: model });
            this.setState({ showModalProcessConfirm: false, model: this.resetModel() });
        } else if (mode === Mode.Edit) {

            onUpdateModels({ type: "E", model: model });
            this.setState({ showModalProcessConfirm: false });
        }
    }

    onRefresh = () => {
        const { onRefresh } = this.props;
        if (onRefresh) onRefresh(true);

    }

    onCancelProcessConfirm = () => {
        const { mode, editModel } = this.state;
        if (mode === Mode.Create) {
            const model = editModel ?? this.resetModel();
            const newMode = editModel ? Mode.Edit : Mode.View;
            this.setState({ model: model, mode: newMode, showCancelConfirmModal: false });
            return;
        }
        if (mode === Mode.Edit) {
            const model = editModel;
            this.setState({ model: model, showCancelConfirmModal: false });
            return;
        }
    }
}