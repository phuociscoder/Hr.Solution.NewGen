
import { faAngleLeft, faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { Function } from "../../../Common/Constants";
import { CustomSelect } from "../../../Common/CustomSelect";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { Amount } from "../../../Common/InputAmount";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { Mode } from "../../Constanst";

export class EmployeeContractDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: Mode.View,
            model: {
                id: 0
            }

        }
    }

    componentDidMount = () => {
        this.loadSelectOptions(Function.LSEM140, 'contractTypes');
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
            contractNo: '',
            signDate: null,
            employeeId: null,
            contractTypeId: null,
            durationId: null,
            validDate: null,
            expiredDate: null,
            paymentMethodId: null,
            signatorId: null,
            basicSalary: null,
            probationFromDate: null,
            probationToDate: null,
            workingTime: null,
            workingPlaceId: null,
            vehicleInfo: null,
            jobTitle: null,
            note: null
        }
        return model;
    }

    onAddItemClick = () => {
        const newModel = { id: 0, isActive: true };
        this.setState({ model: newModel, mode: Mode.Create });
    }

    onEmployeeContractModelChange = (e) => {
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

    render = () => {
        const { contractNo, signDate, signatorId, validDate, expiredDate, durationId, contractTypeId, paymentMethodId, basicSalary, probationFromDate, probationToDate, workingPlaceId,
                workingTime, vehicleInfo, jobTitle, note  } = this.state.model;
        const { mode, contractTypes } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.Create} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        {mode === Mode.View && <div className="w-100 p-5"><h5><b>Chọn từ danh sách hoặc nhấn nút "Thêm mới" để tiếp tục .</b></h5></div>}
                        {mode !== Mode.View && <div className="w-80 d-flex p-3 animate__animated animate__fadeIn">
                            <div className="w-50 d-flex flex-column">
                            <label className="w-100">
                                Số hợp đồng:
                                <input className="form-control" placeholder="Số hợp đồng" fieldName="contractNo" value={contractNo} onChange={this.onEmployeeContractModelChange} />
                            </label>
                            <label className="w-100">
                                Ngày ký:
                                <CustomDatePicker value={signDate} onDateChange={value => this.onCustomModelChange(value, 'signDate')} />
                            </label>

                            <label className="w-100">
                               Loại hợp đồng:
                               <CustomSelect labelField="name" selectedValue={contractTypeId} data={contractTypes} placeHolder="-Chọn loại hợp đồng-" onValueChange={value => this.onCustomModelChange(value, 'contractTypeId')} />
                            </label>
                            
                            <label className="w-100">
                               Thời hạn hợp đồng:
                               <CustomSelect selectedValue={durationId} data={contractTypes} placeHolder="-Chọn thời hạn-" onValueChange={value => this.onCustomModelChange(value, 'durationId')} />
                            </label>

                            <label className="w-100">
                                Ngày hiệu lực:
                                <CustomDatePicker value={validDate} onDateChange={value => this.onCustomModelChange(value, 'validDate')} />
                            </label>

                            <label className="w-100">
                                Ngày hết hạn:
                                <CustomDatePicker value={expiredDate} onDateChange={value => this.onCustomModelChange(value, 'expiredDate')} />
                            </label>

                            <label className="w-100">
                               Hình thức trả lương:
                               <CustomSelect selectedValue={paymentMethodId} data={contractTypes} placeHolder="-Chọn hình thức trả lương-" onValueChange={value => this.onCustomModelChange(value, 'paymentMethod')} />
                            </label>

                            <label className="w-100">
                               Người ký HĐLD:
                               <CustomSelect selectedValue={signatorId} data={contractTypes} placeHolder="-Chọn Người Ký-" onValueChange={value => this.onCustomModelChange(value, 'signatorId')} />
                            </label>

                            <label className="w-100">
                               Mức lương chính
                              <Amount className="form-control" amount={basicSalary} onAmountChange={value => this.onCustomModelChange(value, 'basicSalary')} placeHolder="Mức lương chính" />
                            </label>

                            </div>

                            <div className="w-50 pl-4 ml-4 d-flex flex-column">
                            <label className="w-100">
                                Thử việc từ ngày:
                                <CustomDatePicker value={probationFromDate} onDateChange={value => this.onCustomModelChange(value, 'probationFromDate')} />
                            </label>

                            <label className="w-100">
                                Thử việc đến ngày:
                                <CustomDatePicker value={probationToDate} onDateChange={value => this.onCustomModelChange(value, 'probationToDate')} />
                            </label>

                            <label className="w-100">
                               Nơi làm việc:
                               <CustomSelect selectedValue={workingPlaceId} data={contractTypes} placeHolder="-Chọn nơi làm việc-" onValueChange={value => this.onCustomModelChange(value, 'workingPlaceId')} />
                            </label>

                            <label className="w-100">
                               Thời gian làm việc:
                               <input className="form-control" fieldName="workingTime" value={workingTime} onChange={this.onEmployeeContractModelChange} placeholder="Thời gian làm việc" />
                            </label>

                            <label className="w-100">
                               Công việc chính:
                               <input className="form-control" fieldName="jobTitle" value={jobTitle} onChange={this.onEmployeeContractModelChange} placeholder="Công việc chính" />
                            </label>

                            <label className="w-100">
                               Phương tiện đi lại:
                               <input className="form-control" fieldName="vehicleInfo" value={vehicleInfo} onChange={this.onEmployeeContractModelChange} placeholder="Phương tiện đi lại" />
                            </label>
                            <label className="w-100">
                               Thời gian làm việc:
                               <textarea className="form-control" rows={4} fieldName="note" value={note} onChange={this.onEmployeeContractModelChange} placeholder="Ghi chú" />
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
                    Chắc chắn xóa hợp đồng?
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
                    {mode === Mode.Create && <span>Chắc chắn thêm hợp đồng ?</span>}
                    {mode === Mode.Edit && <span>Chắn chắn thay đổi thông tin hợp đồng ?</span>}
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
        const { model, mode, contractTypes } = this.state;
        const { onUpdateModels } = this.props;

        if (model.contractTypeId) {
            model.contractTypeName = contractTypes.find(x => x.id === model.contractTypeId)?.name;
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