import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { AuthenticationManager } from "../../../../../AuthenticationManager";
import { CustomSelect } from "../../../../Common/CustomSelect";
import { CustomDatePicker } from "../../../../Common/DatePicker";
import { AddCreatedModifiedField } from "../../common/Common.addfield";
import { Mode } from "../../common/Constants";
import TimePicker from "react-times";
import 'react-times/css/material/default.css';

export class WorkShiftDetailItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workShift: {},
            mode: Mode.VIEW,
            model: {}

        }
    }

    componentDidMount = () => {
        const { workShift, model } = this.props;
        if (!workShift) return;
        this.setState({ workShift: workShift });
        if (Object.keys(model).length > 0) {
            this.setState({ model: model, editModel: model, mode: Mode.EDIT });
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.workShift !== nextProps.workShift) {
            this.setState({ workShift: nextProps.workShift });
        }
        if(this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0)
        {
            this.setState({model: nextProps.model, editModel: nextProps.model, mode: Mode.EDIT});
        }
        return true;
    }

    resetModel = () => {
        const model = {
            id: 0,
            code: '',
            name: null,
            hourByWork: null,
            dayByShift: 0,
            ordinal: 0,
            note: '',
            isActive: true,
            firstTimeIn: '00:00',
            lastTimeOut: '00:00',
            scanFirstIn: '00:00',
            scanLastIn: '00:00',
            scanFirstOuts: '00:00',
            scanLastOut: '00:00',
        }
        return model;
    }

    onAddItemClick = () => {
        const newModel = this.resetModel();
        this.setState({ model: newModel, mode: Mode.CREATE });
    }

    onInputChange = (e) => {
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
        if (type === 'number') {
            value = parseInt(e.target.value);
        }

        let newModel = Object.assign({}, { ...model, [fieldName]: value });
        this.setState({ model: newModel });
    }

    onValidDateChange = (value) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, validDate: value });
        this.setState({ model: newModel });
    }

    // onFocusChange = (focusStatue) => {

    //     console.log(focusStatue);
    // }

    onTimeChange = (options, fieldName) => {
        console.log(options);
        console.log(fieldName);
        let time = `${options.hour}:${options.minute}`;
        console.log(time);
        const { model } = this.state;
        let newModel = Object.assign({}, { ...model, [fieldName]: time });
        this.setState({ model : newModel });
    }

    render = () => {
        const { workShift, mode, model } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="w-100 pl-4 pt-3">
                            <div className="d-flex w-60">
                                <div className="w-50">
                                    <label className="w-100">
                                        Mã ca làm việc:
                                        <input fieldname="code" value={model.code} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder="Mã ca làm việc"></input>
                                    </label>
                                    <label className="w-100 mt-2">
                                        Tên ca làm việc:
                                        <input fieldname="name" value={model.name} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder="Tên ca làm việc"></input>
                                    </label>
                                    <div className="d-flex mt-2">
                                        <label className="w-45">
                                            Số giờ một công:
                                            <input fieldname="hourByWork" type="number" value={model.hourByWork} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder="Số giờ một công"></input>
                                        </label>
                                        <label className="w-50 ml-5">
                                            Số ngày trong một ca:
                                            <input fieldname="dayByShift" type="number" value={model.dayByShift} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder="Số ngày trong một ca"></input>
                                        </label>
                                    </div>
                                </div>
                                <div className="w-50 ml-5">
                                    <div className="w-100 d-flex align-items-center">
                                        <label className="w-50">
                                            Thứ tự:
                                            <input fieldname="ordinal" value={model.ordinal} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Thứ tự"></input>
                                        </label>
                                        <label className="ml-auto mt-4">
                                            <input fieldname="isActive" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isActive} /> Ngưng sử dụng
                                        </label>
                                    </div>
                                    <label className="w-100 mt-2">
                                        Ghi chú:
                                        <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.VIEW} value={model.note} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                                    </label>
                                </div>
                            </div>
                            <label className="mt-5" style={{ borderBottom: "3px solid grey" }}>
                                <h4>THỜI ĐIỂM VÀO/ RA CA</h4>
                            </label>
                            <div className="mt-5 w-100 d-flex">
                                <div className="w-30 ml-3">
                                    <div className="d-flex align-items-end">
                                        <label className="w-40 text-right">
                                            VÀO ca sớm nhất: 
                                        </label>
                                        <div className="w-55 ml-4">
                                            <TimePicker
                                                disabled={mode === Mode.VIEW}
                                                colorPalette="light"
                                                time={model.firstTimeIn ? model.firstTimeIn : '00:00'}
                                                theme="material"
                                                onTimeChange={(options) => this.onTimeChange(options, "firstTimeIn")}
                                                minuteStep={1}
                                                // timezone="America/New_York"
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex mt-3 align-items-end">
                                        <label className="w-40 text-right">
                                            RA ca trễ nhất: 
                                        </label>
                                        <div className="w-55 ml-4">
                                            <TimePicker
                                                disabled={mode === Mode.VIEW}
                                                colorPalette="light"
                                                time={model.lastTimeOut ? model.lastTimeOut : '00:00'}
                                                theme="material"
                                                onTimeChange={(options) => this.onTimeChange(options, "lastTimeOut")}
                                                minuteStep={1}
                                                // timezone="America/New_York"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-30 ml-3">
                                    <div className="d-flex align-items-end">
                                        <label className="w-40 text-right">
                                            Quét thẻ VÀO sớm nhất: 
                                        </label>
                                        <div className="w-55 ml-4">
                                            <TimePicker
                                                disabled={mode === Mode.VIEW}
                                                colorPalette="light"
                                                time={model.scanFirstIn ? model.scanFirstIn : '00:00'}
                                                theme="material"
                                                onTimeChange={(options) => this.onTimeChange(options, "scanFirstIn")}
                                                minuteStep={1}
                                                // timezone="America/New_York"
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex mt-3 align-items-end">
                                        <label className="w-40 text-right">
                                            Quét thẻ VÀO trễ nhất: 
                                        </label>
                                        <div className="w-55 ml-4">
                                            <TimePicker
                                                disabled={mode === Mode.VIEW}
                                                colorPalette="light"
                                                time={model.scanLastIn ? model.scanLastIn : '00:00'}
                                                theme="material"
                                                onTimeChange={(options) => this.onTimeChange(options, "scanLastIn")}
                                                minuteStep={1}
                                                // timezone="America/New_York"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-30 ml-3">
                                    <div className="d-flex align-items-end">
                                        <label className="w-40 text-right">
                                            Quét thẻ RA sớm nhất: 
                                        </label>
                                        <div className="w-55 ml-4">
                                            <TimePicker
                                                disabled={mode === Mode.VIEW}
                                                colorPalette="light"
                                                time={model.scanFirstOut ? model.scanFirstOut : '00:00'}
                                                theme="material"
                                                onTimeChange={(options) => this.onTimeChange(options, "scanFirstOut")}
                                                minuteStep={1}
                                                // timezone="America/New_York"
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex mt-3 align-items-end">
                                        <label className="w-40 text-right">
                                            Quét thẻ RA trễ nhất: 
                                        </label>
                                        <div className="w-55 ml-4">
                                            <TimePicker
                                                disabled={mode === Mode.VIEW}
                                                colorPalette="light"
                                                time={model.scanLastOut ? model.scanLastOut : '00:00'}
                                                theme="material"
                                                onTimeChange={(options) => this.onTimeChange(options, "scanLastOut")}
                                                minuteStep={1}
                                                // timezone="America/New_York"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label className="w-100 mt-2">
                                <AddCreatedModifiedField createdBy={model.createdBy} createdOn={model.createdOn} modifiedBy={model.modifiedBy} modifiedOn={model.modifiedOn}/>
                            </label>
                            <div className="w-50 d-flex justify-content-end mt-4">
                                {mode !== Mode.VIEW && <button className="btn btn-primary" onClick={() => this.setState({showModalProcessConfirm: true})}><FontAwesomeIcon icon={faCheck} /> <span> Lưu thay đổi</span></button>}
                                {mode === Mode.EDIT && <button className="btn btn-danger ml-2" onClick={()=> this.setState({showModalRemoveComfirm: true})}><FontAwesomeIcon icon={faTrash} /><span> Xóa</span></button>}
                                {mode !== Mode.VIEW && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span> Hủy bỏ</span></button>}

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

    generateRemoveModalConfirm =() => {
        const {showModalRemoveComfirm} = this.state;
        return (
            <Modal show={showModalRemoveComfirm} backdrop="static" centered>
                <Modal.Header>
                    XÁC NHẬN XÓA
                </Modal.Header>
                <Modal.Body>
                    Chắc chắn xóa chỉ mục khỏi danh mục ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessRemoveConfirm}><FontAwesomeIcon icon={faCheck}/> <span>Đồng ý</span></button>
                    <button className="btn btn-danger" onClick={() => this.setState({showModalRemoveComfirm: false})}><FontAwesomeIcon icon={faTimes}/> <span>Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateProcessModalConfirm =() => {
        const {showModalProcessConfirm, mode} = this.state;
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
                    <button className="btn btn-primary" onClick={this.onProcessConfirm}><FontAwesomeIcon icon={faCheck}/><span> Xác nhận</span></button>
                    <button className="btn btn-danger" onClick={() => {this.setState({showModalProcessConfirm: false})}}><FontAwesomeIcon icon={faTimes}/><span> Hủy bỏ</span></button>
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

    onProcessRemoveConfirm =() => {
        const {model} = this.state;
        // CALL_API
        // WorkShiftServices.DeleteWorkShiftItem(model.id)
        // .then(response => {
        //     ShowNotification(NotificationType.SUCCESS, "Xóa chỉ mục khỏi danh mục thành công");
        //     this.setState({showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.VIEW}, this.onRefresh(true));
        // }, error => {
        //     ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa chỉ mục khỏi danh mục");
        //     this.setState({showModalRemoveComfirm: false});
        // })

    }

    onProcessConfirm =() => {
        const {model, mode, workShift} = this.state;
        if(mode === Mode.CREATE)
        {
            const newModel = Object.assign({},{...model, functionId: workShift.id , createdBy: AuthenticationManager.UserName()});
            // CALL_API
            // WorkShiftServices.AddWorkShiftItem(newModel)
            // .then(response => {
            //     const newModel = response.data;
            //     ShowNotification(NotificationType.SUCCESS, "Thêm chỉ mục vào danh sách thành công");
            //     this.setState({ model: this.resetModel(), showModalProcessConfirm: false}, this.onRefresh(true));
            // }, error => {
            //     this.setState({showModalProcessConfirm: false});
            //     ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể thêm chỉ mục vào danh sách");
            // })
        }else if(mode === Mode.EDIT)
        {
            const editModel = Object.assign({},{...model, modifiedBy: AuthenticationManager.UserName()});
            // CALL_API
            // WorkShiftServices.UpdateWorkShiftItem(editModel.id, editModel)
            // .then(response =>{
            //     const editModel = response.data;
            //     ShowNotification(NotificationType.SUCCESS, "Cập nhật chỉ mục thành công");
            //     this.setState({model: editModel, editModel: editModel, showModalProcessConfirm: false}, this.onRefresh(true));
            // }, error=> {
            //     this.setState({showModalProcessConfirm: false});
            //     ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể cập nhật chỉ mục ");
            // });
        }
    }

    onRefresh =(value) => {
        const {onRefresh} = this.props;
        if(onRefresh) onRefresh(true);
        
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