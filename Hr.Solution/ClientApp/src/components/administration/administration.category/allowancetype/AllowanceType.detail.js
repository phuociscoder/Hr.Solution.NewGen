import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { CustomSelect } from "../../../Common/CustomSelect";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { CategoryServices } from "../Category.services";
import { Mode } from "../department/Constants";

export class AllowanceTypeDetailItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            mode: Mode.VIEW,
            model: {}

        }
    }

    componentDidMount = () => {
        const { category, model } = this.props;
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
        if(this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0)
        {
            this.setState({model: nextProps.model, editModel: nextProps.model, mode: Mode.EDIT});
        }
        return true;
    }

    resetModel = () => {
        const model = {
            id: '',
            code: '',
            name: '',
            name2: '',
            isActive: true,
            type: [],
            parentId: [],
            ordinal: '',
            note: '',
            isAllowanceMonth: false,
            isAddSalary: false,
            isSocialInsurance: false,
            isHealthInsurance: false,
            isUnemploymentInsurance: false
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

    onManagerChange = () => {

    }

    render = () => {
        const { category, mode, model } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header className="h-8">
                    { AuthenticationManager.AllowAdd(category.id) && <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>}
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex">
                            <div className="w-30 pl-4 pt-3 mr-5">
                                <label className="w-100">
                                    Mã phụ cấp:
                                    <input fieldname="code" value={model.code} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder='Mã loại nhân viên:'></input>
                                </label>
                                <label className="w-100">
                                    Tên loại nhân viên:
                                    <input fieldname="name" value={model.name} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder='Tên loại nhân viên'></input>
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    Tên khác:
                                    <input fieldname="name2" value={model.name2} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="Tên khác"></input>
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    Phân loại phụ cấp:
                                    {/* CALL_API phân loại phụ cấp */}
                                    <CustomSelect dataUrl="/api/Employee/Managers" className="w-100"
                                        orderFieldName={["level"]}
                                        orderBy="desc"
                                        disabled={mode === Mode.VIEW}
                                        // selectedValue={managerId}
                                        isHierachy={false}
                                        valueField="id"
                                        labelField="fullName"
                                        isClearable={true}
                                        onValueChange={this.onManagerChange} />
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    Thuộc nhóm phụ cấp:
                                    {/* CALL_API get thuộc nhóm phụ cấp */}
                                    <CustomSelect dataUrl="/api/Employee/Managers" className="w-100"
                                        orderFieldName={["level"]}
                                        orderBy="desc"
                                        disabled={mode === Mode.VIEW}
                                        // selectedValue={managerId}
                                        isHierachy={false}
                                        valueField="id"
                                        labelField="fullName"
                                        isClearable={true}
                                        onValueChange={this.onManagerChange} />
                                </label>
                                <div className="w-100 d-flex align-content-center">
                                    <label className="w-50">
                                        Thứ tự:
                                        <input fieldname="ordinal" value={model.ordinal} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Thứ tự"></input>
                                    </label>
                                    <label className="ml-auto mt-4">
                                        <input className="align-middle" fieldname="isActive" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isActive} /> Đang hoạt động
                                    </label>
                                </div>
                            </div>
                            <div className="w-30 pl-4 pt-3 mr-5">
                                <label className="w-100 ml-auto mt-4">
                                    <input className="align-middle" fieldname="isAllowanceMonth" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isAllowanceMonth} /> Phụ cấp tính cho tháng
                                </label>
                                <label className="w-100 ml-auto mt-4">
                                    <input className="align-middle" fieldname="isAddSalary" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isAddSalary} /> Cộng vào lương tính công
                                </label>
                                <label className="w-100 ml-auto mt-4">
                                    <input className="align-middle" fieldname="isSocialInsurance" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isSocialInsurance} /> Đóng BHXH
                                </label>
                                <label className="w-100 ml-auto mt-4">
                                    <input className="align-middle" fieldname="isHealthInsurance" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isHealthInsurance} /> Đóng BHYT
                                </label>
                                <label className="w-100 ml-auto mt-4">
                                    <input className="align-middle" fieldname="isUnemploymentInsurance" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isUnemploymentInsurance} /> Đóng BHTN
                                </label>
                                <label className="w-100 mt-2">
                                    Ghi chú:
                                    <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.VIEW} value={model.note} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                                </label>
                            </div>
                        </div>
                        <div className="w-40 d-flex justify-content-end mt-5">
                        { ((AuthenticationManager.AllowEdit(category.id) && (mode === Mode.EDIT)) || (AuthenticationManager.AllowAdd(category.id) && (mode === Mode.CREATE)))
                            && <button className="btn btn-primary" onClick={() => this.setState({showModalProcessConfirm: true})}><FontAwesomeIcon icon={faCheck} /> <span> Lưu thay đổi</span></button>}
                        { AuthenticationManager.AllowDelete(category.id) && (mode === Mode.EDIT)
                            && <button className="btn btn-danger ml-2" onClick={()=> this.setState({showModalRemoveComfirm: true})}><FontAwesomeIcon icon={faTrash} /><span> Xóa</span></button>}
                        { ((AuthenticationManager.AllowEdit(category.id) && (mode === Mode.EDIT)) || (AuthenticationManager.AllowAdd(category.id) && (mode === Mode.CREATE)))
                            && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span> Hủy bỏ</span></button>}
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
        // CALL_API delete loại phụ cấp
        // CategoryServices.DeleteCategoryItem(model.id)
        // .then(response => {
        //     ShowNotification(NotificationType.SUCCESS, "Xóa chỉ mục khỏi danh mục thành công");
        //     this.setState({showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.VIEW}, this.onRefresh(true));
        // }, error => {
        //     ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa chỉ mục khỏi danh mục");
        //     this.setState({showModalRemoveComfirm: false});
        // })

    }

    onProcessConfirm =() => {
        const {model, mode, category} = this.state;
        if(mode === Mode.CREATE)
        {
            const newModel = Object.assign({},{...model, functionId: category.id , createdBy: AuthenticationManager.UserName()});
            // CALL_API add loại phụ cấp
            // CategoryServices.AddCategoryItem(newModel)
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
            // CALL_API update loại phụ cấp
            // CategoryServices.UpdateCategoryItem(editModel.id, editModel)
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