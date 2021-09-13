import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import { Amount } from "../../../Common/InputAmount";
import { NumberUltis } from "../../../Utilities/NumberUltis";
// import { dependenceServices } from "../dependence.services";

export class EmployeeAllowanceDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dependence: {},
            mode: Mode.Create,
            model: {
                id: 0
            }

        }
    }

    componentDidMount = () => {
        this.loadSelectOptions(Function.LSEM156, 'allowances');
        this.loadSelectOptions(Function.LSEM101, 'currencies');
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
            decideNo: '',
            validFromDate: null,
            validToDate: null,
            allowanceTypeId: null,
            amount: null,
            currency: null,
            currencyRate: null,
            freeTaxAmount: null,
            isActive: true,
            note: null
        }
        return model;
    }

    onAddItemClick = () => {
        const newModel = this.resetModel();
        this.setState({ model: newModel, mode: Mode.Create });
    }

    onEmployeeAllowanceModelChange = (e) => {
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
        const {decideNo, validFromDate, validToDate, allowanceTypeId, amount, currencyId, currencyRate, freeTaxAmount, isActive, note} = this.state.model;
        const { mode, allowances, currencies } = this.state;

        console.log(this.state.model);
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.Create} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="w-80 d-flex p-3">
                            <div className="w-50 d-flex flex-column">
                                <label className="w-100">
                                    Số quyết định:
                                    <input value={decideNo} fieldName="decideNo" onChange={this.onEmployeeAllowanceModelChange} placeholder="Số quyết định" className="form-control" />
                                </label>

                                <label className="w-100">
                                    Ngày hiệu lực:
                                    <CustomDatePicker onDateChange={(value) => this.onCustomModelChange(value, 'validFromDate')} />
                                </label>

                                <label className="w-100">
                                    Ngày kết thúc:
                                    <CustomDatePicker onDateChange={value => this.onCustomModelChange(value, 'validToDate')} />
                                </label>

                                <label className="w-100">
                                    Loại phụ cấp:
                                    <CustomSelect data={allowances} labelField="name" onValueChange={value => this.onCustomModelChange(value, 'allowanceTypeId')} />
                                </label>

                                <label className="w-100">
                                    Số tiền:
                                    <Amount placeholder="Số tiền" className="form-control" onAmountChange={value => this.onCustomModelChange(value, 'amount')} />
                                </label>

                                <label className="w-100">
                                    Nguyên tệ:
                                    <CustomSelect data={currencies} labelField="name" onValueChange={value => this.onCustomModelChange(value, 'currencyId')} />
                                </label>
                                <label className="w-100">
                                    Tỉ giá:
                                    <input value={currencyRate} fieldName="currencyRate" onChange={this.onEmployeeAllowanceModelChange} className="form-control" placeholder="Tỉ giá" />
                                </label>
                            </div>
                            <div className="w-50 ml-4">
                                <label className="w-100">
                                    Số tiền miễn thuế:
                                    <Amount placeholder="Số tiền miễn thuế" className="form-control" onAmountChange={(value) => this.onCustomModelChange(value, 'freeTaxAmount')} />
                                </label>

                                <label className="w-100">
                                    <input checked={isActive} fieldName="isActive" onChange={this.onEmployeeAllowanceModelChange} type="checkbox" /> <span className="mt-1 ml-1">Đang hiệu lực</span>
                                </label>

                                <label className="w-100">
                                    Ghi chú:
                                    <textarea value={note} fieldName="note" onChange={this.onEmployeeAllowanceModelChange} rows={4} className="form-control" placeholder="Ghi chú" />
                                </label>
                            </div>
                        </div>
                        <div className="w-80 border-bottom" />
                        <div className="d-flex w-80 justify-content-end mt-2">
                            {mode !== Mode.View && <button className="btn btn-primary" onClick={() => this.setState({ showModalProcessConfirm: true })}><FontAwesomeIcon icon={faPlus} /></button>}
                            {mode === Mode.Edit && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showModalRemoveComfirm: true })}><FontAwesomeIcon icon={faTrash} /></button>}
                            {mode !== Mode.View && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /></button>}

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
                    Chắc chắn xóa khoản phụ cấp?
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
                    {mode === Mode.Create && <span>Chắc chắn thêm khoản phụ cấp ?</span>}
                    {mode === Mode.Edit && <span>Chắn chắn thay đổi thông tin khoản phụ cấp ?</span>}
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
        const {onUpdateModels} = this.props;
        onUpdateModels({type: "D", model: model});

    }

    onProcessConfirm = () => {
        const { model, mode, allowances} = this.state;
        const {onUpdateModels} = this.props;

        if(model.allowanceTypeId)
        {
            model.allowanceTypeName = allowances.find(x => x.id === model.allowanceTypeId).name;
        }

        if(model.amount)
        {
            model.amountDisplay = NumberUltis.convertToAmountText(model.amount);
        }

        if (mode === Mode.Create) {
            onUpdateModels({type:"A" , model: model});
        } else if (mode === Mode.Edit) {
            onUpdateModels({type: "E", model: model});
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