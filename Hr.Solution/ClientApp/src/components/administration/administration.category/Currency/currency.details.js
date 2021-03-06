import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { Mode } from "../common/Constants";
import { Modal } from "react-bootstrap";
import { CategoryServices } from "../Category.services";
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";
import { AuthenticationManager } from "../../../../AuthenticationManager";

export class CurrencyDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            model: Mode.VIEW,
            model: {}
        };
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
        if (this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0) {
            this.setState({ model: nextProps.model, editModel: nextProps.model, mode: Mode.EDIT });
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
            isActive: true,
            isMultiple: false,
            tempRate: 0,
            decPlace: 0,
        }
        return model;
    }


    onAddItemClick = () => {
        const newModel = this.resetModel();
        this.setState({ model: newModel, mode: Mode.CREATE });
    }

    onInputChange = (e) => {
        const { model } = this.state;
        const fieldname = e.target.getAttribute("fieldname");
        const type = e.target.type;
        let value;
        if (type === "checkbox") {
            value = e.target.checked;
        }
        if (type === "number") {
            value = parseInt(e.target.value);
        }
        if (type === "text" || type === "textarea") {
            value = e.target.value;
        }

        let newModel = Object.assign({}, { ...model, [fieldname]: value });
        this.setState({ model: newModel });
    }

    render = () => {
        const { category, mode, model } = this.state;
        return (
            <>
                <Card className="h-100">
                    <Card.Header className="h-3">
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span>Th??m m???i</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex">
                            <div className="w-30 pl-4 pt-3">
                                <label className="w-100">
                                    M?? nguy??n t???:
                                    <input fieldname="code" value={model.code} onChange={this.onInputChange} disabled={mode === Mode.EDIT || mode === Mode.VIEW} className="form-control" placeholder="M?? nguy??n t???"></input>
                                </label>
                                <label className="w-100 mt-2">
                                    T??n nguy??n t???:
                                    <input fieldname="name" value={model.name} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="T??n nguy??n t???"></input>
                                </label>
                                <label className="w-100 mt-2 text-camelcase">
                                    T??n kh??c:
                                    <input fieldname="name2" value={model.name2} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" placeholder="T??n kh??c"></input>
                                </label>
                                <label className="w-100">
                                    T??? l??? m???u:
                                    <input fieldname="tempRate" value={model.tempRate} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="T??? l??? m???u"></input>
                                </label>
                                <div className="w-100 mt-2">
                                    <label className="d-flex align-items-center">
                                        <div className="mr-2">Nh??n h??? s???</div> <input fieldname="isMultiple" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isMultiple} />
                                    </label>
                                </div>
                            </div>
                            <div className="w-30 pl-4 pt-3">
                                <label className="w-100">
                                    S??? l??? l??m tr??n:
                                    <input fieldname="decPlace" value={model.decPlace} onChange={this.onInputChange} disabled={mode === Mode.VIEW} className="form-control" type="number" placeholder="S??? l??? l??m tr??n"></input>
                                </label>
                                <label className="w-100 mt-2">
                                    Th??? t???:
                                    <input fieldname="ordinal" value={model.ordinal} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Th??? t???"></input>
                                </label>
                                <div className="w-100 mt-2">
                                    <label className="d-flex align-items-center">
                                        <div className="mr-2">??ang Ho???t ?????ng</div> <input fieldname="isActive" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isActive} />
                                    </label>
                                </div>
                                <label className="w-100 mt-3">
                                    Ghi ch??:
                                    <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.VIEW} value={model.note} className="form-control" rows={4} placeholder="Ghi ch??"></textarea>
                                </label>
                                <div className="w-100 d-flex justify-content-end mt-3">
                                    {mode !== Mode.VIEW && <button className="btn btn-primary" onClick={() => this.setState({ showModalProcessConfirm: true })}><FontAwesomeIcon icon={faCheck} /> <span> L??u thay ?????i</span></button>}
                                    {mode === Mode.EDIT && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showModalRemoveComfirm: true })}><FontAwesomeIcon icon={faTrash} /><span> X??a</span></button>}
                                    {mode !== Mode.VIEW && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span> H???y b???</span></button>}
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card >
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
                    X??C NH???N X??A
                </Modal.Header>
                <Modal.Body>
                    Ch???c ch???n x??a ch??? m???c kh???i danh m???c ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessRemoveConfirm}><FontAwesomeIcon icon={faCheck} /> <span>?????ng ??</span></button>
                    <button className="btn btn-danger" onClick={() => this.setState({ showModalRemoveComfirm: false })}><FontAwesomeIcon icon={faTimes} /> <span>H???y b???</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateProcessModalConfirm = () => {
        const { showModalProcessConfirm, mode } = this.state;
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
                    <button className="btn btn-primary" onClick={this.onProcessConfirm}><FontAwesomeIcon icon={faCheck} /><span> X??c nh???n</span></button>
                    <button className="btn btn-danger" onClick={() => { this.setState({ showModalProcessConfirm: false }) }}><FontAwesomeIcon icon={faTimes} /><span> H???y b???</span></button>
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

    onProcessRemoveConfirm = () => {
        //CALL_API
        const { model } = this.state;
        CategoryServices.DeleteCategoryItem(model.id)
            .then(response => {
                ShowNotification(NotificationType.SUCCESS, "X??a ch??? m???c kh???i danh m???c th??nh c??ng");
                this.setState({ showModalRemoveComfirm: false, model: this.resetModel(), editModel: null, mode: Mode.VIEW }, this.onRefresh(true));
            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? x??a ch??? m???c kh???i danh m???c");
                this.setState({ showModalRemoveComfirm: false });
            })

    }

    onProcessConfirm = () => {
        //CALL_API
        const { model, mode, category } = this.state;
        if (mode === Mode.CREATE) {
            const newModel = Object.assign({}, { ...model, functionId: category.id, createdBy: AuthenticationManager.UserName() });
            CategoryServices.AddCategoryItem(newModel)
                .then(response => {
                    const newModel = response.data;
                    ShowNotification(NotificationType.SUCCESS, "Th??m ch??? m???c v??o danh s??ch th??nh c??ng");
                    this.setState({ model: this.resetModel(), showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? th??m ch??? m???c v??o danh s??ch");
                })
        } else if (mode === Mode.EDIT) {
            const editModel = Object.assign({}, { ...model, modifiedBy: AuthenticationManager.UserName() });
            CategoryServices.UpdateCategoryItem(editModel.id, editModel)
                .then(response => {
                    const editModel = response.data;
                    ShowNotification(NotificationType.SUCCESS, "C???p nh???t ch??? m???c th??nh c??ng");
                    this.setState({ model: editModel, editModel: editModel, showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? c???p nh???t ch??? m???c ");
                });
        }
    }

    onRefresh = (value) => {
        const { onRefresh } = this.props;
        if (onRefresh) onRefresh(true);

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