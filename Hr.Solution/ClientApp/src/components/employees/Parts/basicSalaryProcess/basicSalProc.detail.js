
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
// import { BasicSalProcServices } from "../basicSalProc.services";

export class EmployeeSalaryProcessDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            salaryProcess: {},
            mode: Mode.View,
            model: {
                id: 0
            },
            // CALL_DRAFT
            adjustmentSalaryTypes : [],
            signers: []

        }
    }

    componentDidMount = () => {
        // Loại điều chỉnh lương
        // this.loadSelectOptions(Function.LSEM104, 'adjustmentSalaryTypes');
        // Người ký
        // this.loadSelectOptions(Function.LSEM104, 'signers');
    }

    loadSelectOptions = (functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if (options) this.setState({ [stateName]: options });
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách chỉ mục.");
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
            decisionNumber: '',
            effectiveDate: null,
            expirationDate: null,
            basicSalary: 0.0,
            salarySI: 0.0,
            adjustmentSalaryTypeId: 0,
            OTSalary: 0.0,
            contractSalary: 0.0,
            signDate: null,
            signerId: 0,
            isActive: true,
            note: ''
        }
        return model;
    }

    onAddItemClick = () => {
        const newModel = { id: 0, isActive: true };
        this.setState({ model: newModel, mode: Mode.Create });
    }

    onEmployeeBasicSalProcModelChange = (e) => {
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
        if (type === "number") {
            value = parseFloat(e.target.value);
        }

        let newModel = Object.assign({}, { ...model, [fieldName]: value });
        this.setState({ model: newModel });
    }

    onCustomModelChange = (value, stateName) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, [stateName]: value });
        this.setState({ model: newModel });
    }

    render = () => {
        const { decisionNumber, effectiveDate, expirationDate, basicSalary, salarySI, adjustmentSalaryTypeId, OTSalary, contractSalary, signDate, signerId, isActive, note } = this.state.model;
        const { mode, signers, adjustmentSalaryTypes } = this.state;
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
                                <div className="d-flex">
                                    <label className="w-50">
                                        Số quyết định:
                                        <input fieldname="decisionNumber" value={decisionNumber} onChange={this.onEmployeeBasicSalProcModelChange} className="form-control" placeholder="Số quyết định"></input>
                                    </label>
                                    <label className="w-50 pl-4 text-camelcase">
                                        Loại điều chỉnh lương:
                                        <CustomSelect data={adjustmentSalaryTypes} selectedValue={adjustmentSalaryTypeId} labelField="name" placeHolder="-Chọn quan hệ-" isClearable={true} onValueChange={value => this.onCustomModelChange(value, 'adjustmentSalaryTypeId')} />
                                    </label>
                                </div>
                                <div className="d-flex">
                                    <label className="w-50">
                                        Ngày hiệu lực:
                                        <CustomDatePicker value={effectiveDate} onDateChange={value => this.onCustomModelChange(value, 'effectiveDate')} />
                                    </label>
                                    <label className="w-50 pl-4 text-camelcase">
                                        Đơn giá ngoài giờ:
                                        <input fieldname="OTSalary" type="number" value={OTSalary} onChange={this.onEmployeeBasicSalProcModelChange} className="form-control" placeholder="Đơn giá ngoài giờ"></input>
                                    </label>
                                </div>
                                <div className="d-flex">
                                    <label className="w-50">
                                        Ngày hết hạn:
                                        <CustomDatePicker value={expirationDate} onDateChange={value => this.onCustomModelChange(value, 'expirationDate')} />
                                    </label>
                                    <label className="w-50 pl-4 text-camelcase">
                                        Lương khoán:
                                        <input fieldname="contractSalary" type="number" value={contractSalary} onChange={this.onEmployeeBasicSalProcModelChange} className="form-control" placeholder="Lương khoán"></input>
                                    </label>
                                </div>
                                <div className="d-flex">
                                    <label className="w-50">
                                        Lương cơ bản:
                                        <input fieldname="basicSalary" type="number" value={basicSalary} onChange={this.onEmployeeBasicSalProcModelChange} className="form-control" placeholder="Lương cơ bản"></input>
                                    </label>
                                    <label className="w-50 pl-4 text-camelcase">
                                        Ngày ký:
                                        <CustomDatePicker value={signDate} onDateChange={value => this.onCustomModelChange(value, 'signDate')} />
                                    </label>
                                </div>
                                <div className="d-flex">
                                    <label className="w-50">
                                        Lương đóng BHXH:
                                        <input fieldname="salarySI" type="number" value={salarySI} onChange={this.onEmployeeBasicSalProcModelChange} className="form-control" placeholder="Lương đóng BHXH"></input>
                                    </label>
                                    <div className="d-flex w-50 pl-4">
                                        <label className="mr-auto text-camelcase">
                                            Người ký:
                                            <CustomSelect data={signers} selectedValue={signerId} labelField="name" placeHolder="-Chọn quan hệ-" isClearable={true} onValueChange={value => this.onCustomModelChange(value, 'signerId')} />
                                            {/* <CustomDatePicker value={doB} onDateChange={value => this.onCustomModelChange(value, 'doB')} /> */}
                                        </label>
                                        <label className="w-25 ">
                                            <input fieldname="isActive" onChange={this.onEmployeeBasicSalProcModelChange} type="checkbox" checked={isActive} /> <span className="ml-1"> Đang hiệu lực</span>
                                        </label>
                                    </div>
                                </div>
                                <label className="w-100 ">
                                    Ghi chú:
                                    <textarea fieldname="note" onChange={this.onEmployeeBasicSalProcModelChange} value={note} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                                </label>
                            </div>
                        </div>
                        }
                        <div className="w-80 border-bottom" />
                        <div className="d-flex w-80 justify-content-end mt-2">
                            {mode !== Mode.View && <button data-tip="Lưu" className="btn btn-primary" onClick={() => this.setState({ showModalProcessConfirm: true })}><FontAwesomeIcon icon={faAngleLeft} /><span className="ml-1">{mode === Mode.Create ? "Thêm vào danh sách" : "Cập nhật vào danh sách"}</span></button>}
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
                    Chắc chắn xóa quyết định?
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
                    {mode === Mode.Create && <span>Chắc chắn thêm quyết định ?</span>}
                    {mode === Mode.Edit && <span>Chắn chắn thay đổi thông tin quyết định ?</span>}
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
        const { model, mode, adjustmentSalaryTypes, signers } = this.state;
        const { onUpdateModels } = this.props;

        if (model.adjustmentSalaryTypeId) {
            model.adjustmentSalaryName = adjustmentSalaryTypes.find(x => x.id === model.adjustmentSalaryTypeId)?.name;
        }
        if (model.signerId) {
            model.signerName = signers.find(x => x.id === model.signerId)?.name;
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