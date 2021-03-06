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

export class EmployeeTypeDetailItem extends React.Component {
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
            ordinal: '',
            note: '',
            percentSalary: 0,
            percentSoftSalary: 0
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
                        { AuthenticationManager.AllowAdd(category.id) && <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Th??m m???i</span></button>}
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex">
                            <div className="w-30 pl-4 pt-3 mr-5">
                                <label className="w-100">
                                    M?? lo???i nh??n vi??n:
                                    <input fieldname="code" value={model.code} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder='M?? lo???i nh??n vi??n:'></input>
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    Ph??n lo???i:
                                    {/* CALL_API get ph??n lo???i nh??n vi??n */}
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
                                    % ch??? ????? l????ng:
                                    <input fieldname="percentSalary" type="number" value={model.percentSalary} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="% ch??? ????? l????ng"></input>
                                </label>
                                
                                <div className="w-100 d-flex align-content-center">
                                    <label className="w-50">
                                        Th??? t???:
                                        <input fieldname="ordinal" value={model.ordinal} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Th??? t???"></input>
                                    </label>
                                    <label className="ml-auto mt-4">
                                        <input className="align-middle" fieldname="isActive" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isActive} /> ??ang ho???t ?????ng
                                    </label>
                                </div>
                            </div>
                            <div className="w-30 pl-4 pt-3 mr-5">
                            <label className="w-100">
                                    T??n lo???i nh??n vi??n:
                                    <input fieldname="name" value={model.name} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder='T??n lo???i nh??n vi??n'></input>
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    T??n kh??c:
                                    <input fieldname="name2" value={model.name2} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="T??n kh??c"></input>
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    % l????ng m???m:
                                    <input fieldname="percentSoftSalary" value={model.percentSoftSalary} type="number" onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="% l????ng m???m"></input>
                                </label>
                                <label className="w-100 mt-2">
                                    Ghi ch??:
                                    <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.VIEW} value={model.note} className="form-control" rows={5} placeholder="Ghi ch??"></textarea>
                                </label>
                            </div>
                        </div>
                        <div className="w-40 d-flex justify-content-end mt-5">
                        { ((AuthenticationManager.AllowEdit(category.id) && (mode === Mode.EDIT)) || (AuthenticationManager.AllowAdd(category.id) && (mode === Mode.CREATE)))
                            && <button className="btn btn-primary" onClick={() => this.setState({showModalProcessConfirm: true})}><FontAwesomeIcon icon={faCheck} /> <span> L??u thay ?????i</span></button>}
                        { AuthenticationManager.AllowDelete(category.id) && (mode === Mode.EDIT)
                            && <button className="btn btn-danger ml-2" onClick={()=> this.setState({showModalRemoveComfirm: true})}><FontAwesomeIcon icon={faTrash} /><span> X??a</span></button>}
                        { ((AuthenticationManager.AllowEdit(category.id) && (mode === Mode.EDIT)) || (AuthenticationManager.AllowAdd(category.id) && (mode === Mode.CREATE)))
                            && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span> H???y b???</span></button>}
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
                    X??C NH???N X??A
                </Modal.Header>
                <Modal.Body>
                    Ch???c ch???n x??a ch??? m???c kh???i danh m???c ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessRemoveConfirm}><FontAwesomeIcon icon={faCheck}/> <span>?????ng ??</span></button>
                    <button className="btn btn-danger" onClick={() => this.setState({showModalRemoveComfirm: false})}><FontAwesomeIcon icon={faTimes}/> <span>H???y b???</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateProcessModalConfirm =() => {
        const {showModalProcessConfirm, mode} = this.state;
        return (
            <Modal show={showModalProcessConfirm} backdrop="static" centered>
                <Modal.Header>
                    X??C NH???N
                </Modal.Header>
                <Modal.Body>
                    {mode === Mode.CREATE && <span>Ch???c ch???n th??m ch??? m???c v??o danh s??ch ?</span>}
                    {mode === Mode.EDIT && <span>Ch???n ch???n thay ?????i th??ng tin ch??? m???c ?</span>}
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessConfirm}><FontAwesomeIcon icon={faCheck}/><span> X??c nh???n</span></button>
                    <button className="btn btn-danger" onClick={() => {this.setState({showModalProcessConfirm: false})}}><FontAwesomeIcon icon={faTimes}/><span> H???y b???</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateCancelModalConfirm = () => {
        const { showCancelConfirmModal, mode } = this.state;
        return (
            <Modal show={showCancelConfirmModal} centered backdrop="static">
                <Modal.Header>
                    X??C NH???N H???Y B???
                </Modal.Header>
                <Modal.Body>
                    Ch???c ch???n mu???n h???y b??? thao t??c ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onCancelProcessConfirm}><FontAwesomeIcon icon={faCheck} /><span> ?????ng ??</span></button>
                    <button className="btn btn-danger" onClick={() => this.setState({ showCancelConfirmModal: false })}><FontAwesomeIcon icon={faTimes} /><span> H???y b???</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    onProcessRemoveConfirm =() => {
        const {model} = this.state;
        // CALL_API delete lo???i nh??n vi??n
        // CategoryServices.DeleteCategoryItem(model.id)
        // .then(response => {
        //     ShowNotification(NotificationType.SUCCESS, "X??a ch??? m???c kh???i danh m???c th??nh c??ng");
        //     this.setState({showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.VIEW}, this.onRefresh(true));
        // }, error => {
        //     ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? x??a ch??? m???c kh???i danh m???c");
        //     this.setState({showModalRemoveComfirm: false});
        // })

    }

    onProcessConfirm =() => {
        const {model, mode, category} = this.state;
        if(mode === Mode.CREATE)
        {
            const newModel = Object.assign({},{...model, functionId: category.id , createdBy: AuthenticationManager.UserName()});
            // CALL_API add lo???i nh??n vi??n
            // CategoryServices.AddCategoryItem(newModel)
            // .then(response => {
            //     const newModel = response.data;
            //     ShowNotification(NotificationType.SUCCESS, "Th??m ch??? m???c v??o danh s??ch th??nh c??ng");
            //     this.setState({ model: this.resetModel(), showModalProcessConfirm: false}, this.onRefresh(true));
            // }, error => {
            //     this.setState({showModalProcessConfirm: false});
            //     ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? th??m ch??? m???c v??o danh s??ch");
            // })
        }else if(mode === Mode.EDIT)
        {
            const editModel = Object.assign({},{...model, modifiedBy: AuthenticationManager.UserName()});
            // CALL_API update lo???i nh??n vi??n
            // CategoryServices.UpdateCategoryItem(editModel.id, editModel)
            // .then(response =>{
            //     const editModel = response.data;
            //     ShowNotification(NotificationType.SUCCESS, "C???p nh???t ch??? m???c th??nh c??ng");
            //     this.setState({model: editModel, editModel: editModel, showModalProcessConfirm: false}, this.onRefresh(true));
            // }, error=> {
            //     this.setState({showModalProcessConfirm: false});
            //     ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? c???p nh???t ch??? m???c ");
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