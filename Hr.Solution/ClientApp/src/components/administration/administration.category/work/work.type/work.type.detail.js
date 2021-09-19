import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { AuthenticationManager } from "../../../../../AuthenticationManager";
import { CustomSelect } from "../../../../Common/CustomSelect";
import { AddCreatedModifiedField } from "../../common/Common.addfield";
import { Mode } from "../../common/Constants";
// import { WorkTypeServices } from "../workType.services";

export class WorkTypeDetailItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workType: {},
            mode: Mode.VIEW,
            model: {}

        }
    }

    componentDidMount = () => {
        const { workType, model } = this.props;
        if (!workType) return;
        this.setState({ workType: workType });
        if (Object.keys(model).length > 0) {
            this.setState({ model: model, editModel: model, mode: Mode.EDIT });
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.workType !== nextProps.workType) {
            this.setState({ workType: nextProps.workType });
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
            name: '',
            name2: '',
            workCount: 0,
            salaryOverTime: 0,
            compensationRate: 0,
            type: '',
            ordinal: 0,
            note: '',
            isPayingPersonal: true,
            isActive: true
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

    onCustomModelChange = (value, stateName) => {
        // const { model } = this.state;
        // const newModel = Object.assign({}, { ...model, [stateName]: value });
        // this.setState({ model: newModel });
    }

    render = () => {
        const { workType, mode, model } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="w-60 pl-4 pt-3">
                            <label className="w-40">
                                Mã loại công:
                                <input fieldname="code" value={model.code} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder="Mã loại công"></input>
                            </label>
                            <div className="d-flex w-100 mt-2">
                                <label className="w-45">
                                    Tên loại công:
                                    <input fieldname="name" value={model.name} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Tên loại công"></input>
                                </label>
                                <label className="w-50 ml-5 text-camelcase">
                                    Tên khác:
                                    <input fieldname="name2" value={model.name2} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Tên khác"></input>
                                </label>
                            </div>
                            <div className="d-flex mt-2">
                                <label className="w-30 text-camelcase">
                                    Số công được tính:
                                    <input fieldname="workCount" type="number" value={model.workCount} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Số công được tính"></input>
                                </label>
                                <label className="w-30 ml-5 text-camelcase">
                                    Đơn giá lương ngoài giờ:
                                    <input fieldname="salaryOverTime" type="number" value={model.salaryOverTime} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Đơn giá lương ngoài giờ"></input>
                                </label>
                                <label className="w-30 ml-auto text-camelcase">
                                    Tỉ lệ chuyển sang quỹ nghỉ bù:
                                    <input fieldname="compensationRate" type="number" value={model.compensationRate} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Tỉ lệ chuyển sang quỹ nghỉ bù"></input>
                                </label>
                            </div>
                            <div className="d-flex mt-2">
                                <div className="w-45 d-flex align-items-center">
                                    <label className="text-camelcase w-50">
                                        Phân loại:
                                        <CustomSelect data={[]} selectedValue={model.type} labelField="name" placeholder="-chọn loại công-" disabled={mode === Mode.VIEW} onValueChange={value => this.onCustomModelChange(value, 'allowanceTypeId')} />
                                    </label>
                                    <label className="ml-5">
                                        Thứ tự:
                                        <input fieldname="ordinal" value={model.ordinal} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Thứ tự"></input>
                                    </label>
                                </div>
                                <div className="w-50 ml-5 d-flex align-items-center">
                                    <label className="mt-4">
                                        <input fieldname="isPayingPersonal" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isPayingPersonal} /> Tham gia đóng thuế TNCN
                                    </label>
                                    <label className="ml-5 mt-4">
                                        <input fieldname="isActive" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isActive} /> Ngưng sử dụng
                                    </label>
                                </div>
                            </div>
                            <label className="w-100 mt-2">
                                Ghi chú:
                                <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.VIEW} value={model.note} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                            </label>
                            <label className="w-100 mt-2">
                                <AddCreatedModifiedField createdBy={model.createdBy} createdOn={model.createdOn} modifiedBy={model.modifiedBy} modifiedOn={model.modifiedOn}/>
                            </label>
                            <div className="d-flex justify-content-end mt-3">
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
        // WorkTypeServices.DeleteWorkTypeItem(model.id)
        // .then(response => {
        //     ShowNotification(NotificationType.SUCCESS, "Xóa chỉ mục khỏi danh mục thành công");
        //     this.setState({showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.VIEW}, this.onRefresh(true));
        // }, error => {
        //     ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa chỉ mục khỏi danh mục");
        //     this.setState({showModalRemoveComfirm: false});
        // })

    }

    onProcessConfirm =() => {
        const {model, mode, workType} = this.state;
        if(mode === Mode.CREATE)
        {
            const newModel = Object.assign({},{...model, functionId: workType.id , createdBy: AuthenticationManager.UserName()});
            // CALL_API
            // WorkTypeServices.AddWorkTypeItem(newModel)
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
            // WorkTypeServices.UpdateWorkTypeItem(editModel.id, editModel)
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