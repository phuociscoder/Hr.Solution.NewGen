import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { Amount } from "../../../Common/InputAmount";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { DepartmentServices } from "../../admin.department/Department.services";
import { CategoryServices } from "../Category.services";
import { Mode } from "./Constants";

export class DepartmentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            mode: Mode.VIEW,
            model: {}

        }
    }

    componentDidMount = () => {
        const { prefix, departmentId } = this.props;
        if (!prefix || !departmentId) return;
        DepartmentServices.GetById(departmentId)
        .then(response => {
            debugger;
        }, error => {
            debugger;
        });
        // this.setState({ category: category });
        // if (Object.keys(model).length > 0) {
        //     this.setState({ model: model, editModel: model, mode: Mode.EDIT });
        // }
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
            id: 0,
            code: '',
            name: '',
            name2: '',
            ordinal: 0,
            note: '',
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
    onAmountChange =(value) => {
        console.log(value);
    }

    render = () => {
        const { category, mode, model } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Thêm mới</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="w-50 pl-4 pt-3">
                           <label className="w-100">
                               Mã bộ phận:<span className="require"> *</span>
                               <input className="form-control w-50" placeholder="Mã bộ phận" required></input>
                           </label>
                           <label className="w-100 mt-2">
                               Tên bộ phận: <span className="require">*</span>
                               <input className="form-control" placeholder="Tên bộ phận"/>
                           </label>
                           <label className="w-100 mt-2">
                               Tên khác: 
                               <input className="form-control" placeholder="Tên khác"/>
                           </label>
                           <label className="w-100 mt-2">
                               Số điện thoại: 
                               <input className="form-control" placeholder="Số điện thoại"/>
                           </label>
                           <label className="w-100 mt-2">
                               Tên bộ phận: <span className="require">*</span>
                               <input className="form-control" placeholder="Tên bộ phận"/>
                           </label>
                           <label className="w-100 mt-2">
                               Tên bộ phận: <span className="require">*</span>
                               <Amount amount={'445vsadsa'} className="form-control" placeholder="Nhập số tiền" onAmountChange={this.onAmountChange} />
                           </label>
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
        CategoryServices.DeleteCategoryItem(model.id)
        .then(response => {
            ShowNotification(NotificationType.SUCCESS, "Xóa chỉ mục khỏi danh mục thành công");
            this.setState({showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.VIEW}, this.onRefresh(true));
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa chỉ mục khỏi danh mục");
            this.setState({showModalRemoveComfirm: false});
        })

    }

    onProcessConfirm =() => {
        const {model, mode, category} = this.state;
        if(mode === Mode.CREATE)
        {
            const newModel = Object.assign({},{...model, functionId: category.id , createdBy: AuthenticationManager.UserName()});
            CategoryServices.AddCategoryItem(newModel)
            .then(response => {
                const newModel = response.data;
                ShowNotification(NotificationType.SUCCESS, "Thêm chỉ mục vào danh sách thành công");
                this.setState({ model: this.resetModel(), showModalProcessConfirm: false}, this.onRefresh(true));
            }, error => {
                this.setState({showModalProcessConfirm: false});
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể thêm chỉ mục vào danh sách");
            })
        }else if(mode === Mode.EDIT)
        {
            const editModel = Object.assign({},{...model, modifiedBy: AuthenticationManager.UserName()});
            CategoryServices.UpdateCategoryItem(editModel.id, editModel)
            .then(response =>{
                const editModel = response.data;
                ShowNotification(NotificationType.SUCCESS, "Cập nhật chỉ mục thành công");
                this.setState({model: editModel, editModel: editModel, showModalProcessConfirm: false}, this.onRefresh(true));
            }, error=> {
                this.setState({showModalProcessConfirm: false});
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể cập nhật chỉ mục ");
            });
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