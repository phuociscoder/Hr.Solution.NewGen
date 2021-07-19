import { faCheck, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal } from "react-bootstrap";
import { Currency } from "../../Common/Constants";
import { AllowanceLevel, AllowanceType, Mode } from "../Constanst";

export class AllowanceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: this.initModel(),
            manages: [],
            showRemoveModal: false,
            mode: Mode.Edit
        }
    }

    initModel = () => {
        return {
            decidedNo: null,
            freeTaxAmount: 0,
            startDate: null,
            endDate: null,
            signatureDate: null,
            signatorId: 0,
            allowanceType: 0,
            isActive: false,
            allowanceLevel: 0,
            amount: 0,
            currency: 0,
            currencyRate: 0,
            note: null,
            name: "Cowm true"
        }
    }

    componentDidMount = () => {
        const { mode } = this.props;
        if (mode) {
            this.setState({ mode: mode });
        }

        this.loadManagers();
    }

    onModelChange = () => {
        const { onModelChange } = this.props;
        const { model } = this.state;
        if (onModelChange) onModelChange(model);
    }

    

    loadManagers = () => {
        //TODO
        const managers = [
            { id: 1, name: "Trần Tuấn Anh" },
            { id: 2, name: "Nguyễn Hữu Phước" }
        ];
        this.setState({ managers: managers });
    }

    onChangeValue = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        const model = Object.assign({}, { ...this.state.model, [fieldName]: value, name:"test add" });
        this.setState({model}, this.onModelChange);
    }

    onRemoveAllowance = (item) => {
        this.setState({ showRemoveModal: false });
    }

    render = () => {
        const { model, managers, mode } = this.state;
        return (
            <div className="d-flex">
                <div className="w-50">
                    <label className="w-100 pr-5">
                        Số quyết định:
                        <input className="form-control" value={model.decidedNo} fieldName="decidedNo" onChange={this.onChangeValue} placeholder="Nhập số quyết định"></input>
                    </label>
                    <label className="w-100 pr-5">
                        Ngày hiệu lực:
                        <input className="form-control" type="date" value={model.startDate} ></input>
                    </label>
                    <label className="w-100 pr-5">
                        Ngày kết thúc:
                        <input className="form-control" type="date" value={model.endDate} ></input>
                    </label>
                    <label className="w-100 pr-5">
                        Loại phụ cấp:
                        <select className="form-control" value={model.allowanceType}>
                            <option key={0} value={0} disabled>-Chọn loại phụ cấp-</option>
                            {AllowanceType.All.map((item, index) => {
                                return (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                            })}
                        </select>
                    </label>
                    <label className="w-100 pr-5">
                        Mức phụ cấp:
                        <select className="form-control" value={model.allowanceLevel}>
                            <option key={0} value={0} disabled>-Chọn mức phụ cấp-</option>
                            {AllowanceLevel.All.map((item, index) => {
                                return (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                            })}
                        </select>
                    </label>
                    <label className="w-100 pr-5">
                        Số tiền:
                        <input type="number" className="form-control" value={model.amount} ></input>
                    </label>
                    <label className="w-100 pr-5"> Nguyên tệ:
                        <select className="form-control" value={model.currency}>
                            <option key={0} value={0} disabled>-Chọn nguyên tệ-</option>
                            {Currency.All.map((item, index) => {
                                return (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                            })}
                        </select>
                    </label>
                    <label className="w-100 pr-5">
                        Tỷ giá:
                        <input type="number" className="form-control" value={model.currencyRate} ></input>
                    </label>

                </div>
                <div className="w-50 pr-5">
                    <label className="w-100">
                        Số tiền miễn thuế:
                        <input type="number" className="form-control" value={model.freeTaxAmount}></input>
                    </label>
                    <label className="w-100">
                        Ngày ký:
                        <input type="date" className="form-control" value={model.signatureDate}></input>
                    </label>
                    <label className="w-100">
                        Người ký:
                        <select className="form-control" value={model.signatorId}>
                            <option key={0} value={0}>-Chọn người ký-</option>
                            {
                                managers && managers.map((item, index) => {
                                    return (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </label>

                    <label className="pt-3">
                        <input type="checkbox" value={model.isActive} /> Đang hiệu lực
                    </label>
                    <label className="w-100">
                        Ghi Chú:
                        <textarea className="form-control" value={model.note} rows={4}></textarea>
                    </label>
                    {mode === Mode.Edit &&
                        <div className="w-100 d-flex">
                            <button style={{ marginTop: "3em" }} onClick={() => { this.setState({ showRemoveModal: true }) }} className="btn btn-danger mt-10 ml-auto"><FontAwesomeIcon icon={faTrash} /> Xóa khoản phụ cấp</button>
                        </div>
                    }

                </div>
                {this.generateRemoveModal(model)}
            </div>
        )
    }

    generateRemoveModal = (item) => {
        const { showRemoveModal } = this.state;
        return (
            <Modal show={showRemoveModal} backdrop="static" centered >
                <Modal.Header>
                    Hủy bỏ phụ cấp
                </Modal.Header>
                <Modal.Body>
                    <span>Chắc chắn hủy bỏ phụ cấp <b>{item.name}</b> ?</span>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={() => this.onRemoveAllowance(item)}><FontAwesomeIcon icon={faCheck} /> Xác nhận</button>
                    <button className="btn btn-danger" onClick={() => { this.setState({ showRemoveModal: false }) }}><FontAwesomeIcon icon={faTimes} /> Hủy</button>
                </Modal.Footer>
            </Modal>
        )
    }




}