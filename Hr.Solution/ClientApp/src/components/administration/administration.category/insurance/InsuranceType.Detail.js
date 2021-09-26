import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { CustomSelect } from "../../../Common/CustomSelect";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { CategoryServices } from "../Category.services";
import { InsuranceType } from "../Constants";
import { Mode } from "../department/Constants";
import {Amount} from "../../../Common/InputAmount";
import { InsuranceCategoryService } from "./insuranceCategory.services";
import { InsuranceConfig } from ".";

export class InsuranceTypeDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            mode: Mode.VIEW,
            model: this.resetModel()

        }
    }

    componentDidMount = () => {
        const { category, model } = this.props;
        if (!category) return;
        this.setState({ category: category });
        if (Object.keys(model).length > 0) {
            this.getInsuranceById(model.id);
        }
    }

    getInsuranceById =(id) => {
        InsuranceCategoryService.getById(id)
        .then(response => {
            if(response.data)
            {
                this.setState({ model: response.data, editModel: response.data, mode: Mode.EDIT });
                return;
            }
            ShowNotification(NotificationType.ERROR, "Dữ liệu có thể đã bị xóa trước đó , vui lòng kiểm tra lại");
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập vào cơ sở dữ liệu");
        });
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
          siCode: '',
          siName: '',
          siName2: '',
          insType: 0,
          lock: false,
          note: '',
          departmentId: null,
          rateEmp: 0,
          rateCo: 0,
          isDefault: false,
          minSalary: 0,
          maxsalary: 0,
          effectDate: null,
          basicSalary: 0,
          basicSalary2: 0,
          basicSalary3: 0,
          basicSalary4: 0,
          ordinal: 0,
          createdOn: null,
          createdBy: '',
          modifiedOn: null,
          modifiedBy: ''

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

    onCustomModelChange =(value, stateName) => {
        const {model} = this.state;
        this.setState({model: Object.assign({}, {...model, [stateName]: value})});
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
                            <label className="w-50">
                                Mã loại BH: 
                                <input disabled={mode === Mode.VIEW} className="form-control" placeholder="Mã loại BH" value={model.siCode} fieldName="siCode" onChange={this.onInputChange} />
                            </label>
                            <label className="w-100">
                                Tên loại BH: 
                                <input disabled={mode === Mode.VIEW} className="form-control" placeholder="Tên loại BH" value={model.siName} fieldName="siName" onChange={this.onInputChange} />
                            </label>
                            <label className="w-100">
                                Tên khác: 
                                <input disabled={mode === Mode.VIEW} className="form-control" placeholder="Tên loại BH" value={model.siName2} fieldName="siName2" onChange={this.onInputChange} />
                            </label>
                            <label className="w-100">
                                Phân loại: 
                                <CustomSelect data={InsuranceType.ALL} 
                                selectedValue={model.insType} 
                                disabled={mode === Mode.VIEW} 
                                onValueChange={value => this.onCustomModelChange(value, 'insType')} 
                                placeHolder="-Chọn loại bảo hiểm-" 
                                labelField="name" />
                            </label>
                            <label className="w-40">
                                <input disabled={mode === Mode.VIEW} type="checkbox" checked={model.isDefault} fieldName="isDefault" onChange={this.onInputChange} /> <span className="ml-2">Loại mặc định</span>
                            </label>
                            </div>

                            <div className="w-30 pl-4 pt-3 mr-5">
                            <label className="w-50">
                                Thứ tự:
                               <input disabled={mode === Mode.VIEW} type="number" className="form-control" fieldName="ordinal" value={model.ordinal} placeholder="Thứ tự" onChange={this.onInputChange} />
                            </label>
                            <label className="w-100">
                                Ghi chú:
                             <textarea disabled={mode === Mode.VIEW} placeholder="Ghi chú" className="form-control" fieldName="note" value={model.note} onChange={this.onInputChange} rows={3} />
                            </label>
                            <label className="w-50">
                                <input disabled={mode === Mode.VIEW} type="checkbox" fieldName="lock" checked={model.lock} onChange={this.onInputChange} /><span className="ml-2">Ngưng sử dụng</span>
                            </label>
                            <label className="w-100">
                                Áp dụng cho:
                            <CustomSelect dataUrl="/api/Department" className="w-100"
                                        orderFieldName={["level"]}
                                        orderBy="desc"
                                        disabled={mode === Mode.VIEW}
                                        isHierachy={true}
                                        selectedValue={model.departmentId}
                                        labelField="departmentName"
                                        isClearable={true}
                                        onValueChange={value => this.onCustomModelChange(value, 'departmentId')} />
                            </label>
                            </div>
                        </div>
                        <div className="w-100  pl-4 pt-3 mr-5">
                            <span className="border-bottom"><h5><b>MỨC ĐÓNG</b></h5></span>
                        </div>
                        <div className="w-100 d-flex">
                            <div className="d-flex flex-column w-30 pl-4 pt-3 mr-5">
                                <label className="w-100">
                                    % Cá nhân: 
                                    <input type="number" disabled={mode === Mode.VIEW} fieldName="rateEmp" value={model.rateEmp} className="form-control" onChange={this.onInputChange} placeHolder="% cá nhân" />
                                </label>
                                <label className="w-100">
                                    % Công ty: 
                                    <input  type="number" disabled={mode === Mode.VIEW} value={model.rateCo} fieldName="rateCo" className="form-control" onChange={this.onInputChange} placeHolder="% công ty" />
                                </label>
                            </div>
                            <div className="d-flex flex-column pl-4 pt-3 mr-5 w-30">
                            <label className="w-100">
                                    Mức lương tối thiểu: 
                                    <Amount disabled={mode === Mode.VIEW} amount={model.minSalary} className="form-control" onAmountChange={value => this.onCustomModelChange(value, 'minSalary')} placeHolder="Mức lương tối thiểu" />
                                </label>
                                <label className="w-100">
                                    Mức trần đóng BH:
                                    <Amount disabled={mode === Mode.VIEW} amount={model.maxSalary} className="form-control" onAmountChange={value => this.onCustomModelChange(value, 'maxSalary')} placeHolder="Mức trần đóng BH" />
                                </label>
                            </div>
                        </div>
                        <div className="w-60 d-flex justify-content-end mt-5">
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
        InsuranceCategoryService.delete(model.id)
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
            InsuranceCategoryService.insert(model)
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
            InsuranceCategoryService.update(model.id, model)
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