import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { Function } from "../../../Common/Constants";
import { CustomSelect } from "../../../Common/CustomSelect";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { Mode } from "../../Constanst";
// import { dependenceServices } from "../dependence.services";

export class DependenceDetailItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dependence: {},
            mode: Mode.View,
            model: {}

        }
    }

    componentDidMount = () => {
        const { dependence, model } = this.props;
        this.loadSelectOptions(Function.LSEM104, 'dependenceDropdown');
        if (!dependence) return;
        this.setState({ dependence: dependence });
        if (Object.keys(model).length > 0) {
            this.setState({ model: model, editModel: model, mode: Mode.Edit });
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.dependence !== nextProps.dependence) {
            this.setState({ dependence: nextProps.dependence });
        }
        if(this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0)
        {
            this.setState({model: nextProps.model, editModel: nextProps.model, mode: Mode.Edit});
        }
        return true;
    }

    loadSelectOptions =(functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if(options) this.setState({[stateName]: options});
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách quan hệ");
        });
    }

    resetModel = () => {
        const model = {
            id: 0,
            code: '',
            name: '',
            address: '',
            phone: '',
            birthday: null,
            dependent: '',
            isTax: true,
            note: '',
        }
        return model;
    }

    onAddItemClick = () => {
        const newModel = this.resetModel();
        this.setState({ model: newModel, mode: Mode.Create });
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

        let newModel = Object.assign({}, { ...model, [fieldName]: value });
        this.setState({ model: newModel });
    }

    onValidDateChange = (value) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, birthday: value });
        this.setState({ model: newModel });
    }

    onCustomModelChange =(value, stateName) => {
       const {model} = this.state;
       const newModel = Object.assign({},{...model, [stateName]: value});
       this.setState({model: newModel});
    }

    render = () => {
        const { mode, model, dependenceDropdown } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.Create} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="pl-4 pt-3 w-80">
                            <label className="w-40">
                                Mã người phụ thuộc:
                                <input fieldname="code" value={model.code} onChange={this.onInputChange} disabled={mode === Mode.Edit || mode === Mode.View} className="form-control" placeholder="Mã người phụ thuộc"></input>
                            </label>
                            <div className="d-flex">
                                <label className="w-50 mt-2">
                                    Tên người phụ thuộc:
                                    <input fieldname="name" value={model.name} onChange={this.onInputChange} disabled={mode === Mode.View} className="form-control" placeholder="Tên người phụ thuộc"></input>
                                </label>
                                <label className="w-50 mt-2 ml-4 text-camelcase">
                                    Ngày sinh:
                                    <CustomDatePicker value={model.birthday} disabled={mode === Mode.View} onDateChange={this.onValidDateChange} />
                                </label>
                            </div>
                            <label className="w-100 mt-2 text-camelcase">
                                Địa chỉ:
                                <input fieldname="address" value={model.address} onChange={this.onInputChange} disabled={mode === Mode.View} className="form-control" placeholder="Địa chỉ"></input>
                            </label>
                            <div className="d-flex align-items-center">
                                <label className="w-40 mt-2 text-camelcase">
                                    Quan hệ:
                                    <CustomSelect data={dependenceDropdown} selectedValue={model.dependent} disabled={mode === Mode.View} labelField="name" placeHolder="-Chọn quan hệ-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'dependenceId')} />
                                </label>
                                <label className="w-40 mt-2 ml-4 text-camelcase">
                                    Số điện thoại:
                                    <input fieldname="phone" value={model.phone} onChange={this.onInputChange} disabled={mode === Mode.View} className="form-control" placeholder="Số điện thoại"></input>
                                </label>
                                <label className="align-items-center ml-auto align-self-end">
                                    <input fieldname="isTax" onChange={this.onInputChange} disabled={mode === Mode.View} type="checkbox" checked={model.isTax} /> Tính thuế
                                </label>
                            </div>
                            <label className="w-100 mt-2">
                                Ghi chú:
                                <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.View} value={model.note} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                            </label>
                            <div className="d-flex justify-content-end mt-3">
                                {mode !== Mode.View && <button className="btn btn-primary" onClick={() => this.setState({showModalProcessConfirm: true})}><FontAwesomeIcon icon={faCheck} /> <span> Lưu thay đổi</span></button>}
                                {mode === Mode.Edit && <button className="btn btn-danger ml-2" onClick={()=> this.setState({showModalRemoveComfirm: true})}><FontAwesomeIcon icon={faTrash} /><span> Xóa</span></button>}
                                {mode !== Mode.View && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span> Hủy bỏ</span></button>}

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
                    {mode === Mode.Create && <span>Chắc chắn thêm chỉ mục vào danh sách ?</span>}
                    {mode === Mode.Edit && <span>Chắn chắn thay đổi thông tin chỉ mục ?</span>}
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
        // dependenceServices.DeletedependenceItem(model.id)
        // .then(response => {
        //     ShowNotification(NotificationType.SUCCESS, "Xóa chỉ mục khỏi danh mục thành công");
        //     this.setState({showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.View}, this.onRefresh(true));
        // }, error => {
        //     ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa chỉ mục khỏi danh mục");
        //     this.setState({showModalRemoveComfirm: false});
        // })

    }

    onProcessConfirm =() => {
        const {model, mode, dependence} = this.state;
        if(mode === Mode.Create)
        {
            const newModel = Object.assign({},{...model, functionId: dependence.id , createdBy: AuthenticationManager.UserName()});
            // CALL_API
            // dependenceServices.AdddependenceItem(newModel)
            // .then(response => {
            //     const newModel = response.data;
            //     ShowNotification(NotificationType.SUCCESS, "Thêm chỉ mục vào danh sách thành công");
            //     this.setState({ model: this.resetModel(), showModalProcessConfirm: false}, this.onRefresh(true));
            // }, error => {
            //     this.setState({showModalProcessConfirm: false});
            //     ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể thêm chỉ mục vào danh sách");
            // })
        }else if(mode === Mode.Edit)
        {
            const editModel = Object.assign({},{...model, modifiedBy: AuthenticationManager.UserName()});
            // CALL_API
            // dependenceServices.UpdatedependenceItem(editModel.id, editModel)
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