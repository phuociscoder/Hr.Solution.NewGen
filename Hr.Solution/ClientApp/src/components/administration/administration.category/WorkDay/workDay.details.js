import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { Mode } from "../common/Constants";
import { Modal } from "react-bootstrap";
import { CategoryServices } from "../Category.services";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { DateTimeUltils } from "../../../Utilities/DateTimeUltis";

export class WorkDayDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: {},
            mode: Mode.VIEW,
            model: {},
            selectedYearMonth: '',
            monthYears: []
        };
    }

    componentDidMount = () => {
        const { category, model } = this.props;
        if (!category) return;
        this.getMonthYears();
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
            month: 0,
            year: 0,
            startDate: new Date(),
            endDate: null,
            expireApproveDate: null,
            numWorkDay: 0,
            numDateApproval: 0,
            ordinal: 0,
            note: '',
            isActive: true
        }
        return model;
    }

    getMonthYears = () => {
        const monthYears = DateTimeUltils.getMonthYears();
        if (!monthYears) return;
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1;
        const selectedYearMonth = `${currentMonth}/${currentYear}`;
        this.setState({ monthYears: monthYears, selectedYearMonth: selectedYearMonth });
    }

    onYearMonthChange = (e) => {
        const value = e.target.value;
        const { monthYears, model } = this.state;
        if (!value) return;
        const selectedObject = monthYears.find((item) => item.name === value);
        const newModel = Object.assign({}, { ...model, month: selectedObject.month, year: selectedObject.year });
        this.setState({ model: newModel, selectedYearMonth: value });
    }

    onAddItemClick = () => {
        const newModel = this.resetModel();
        this.setState({ model: newModel, mode: Mode.CREATE });
    }

    onInputChange = (e) => {
        // Vantt12_TODO Validate date & num date working 
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

    render = () => {
        const { category, mode, model, selectedYearMonth, monthYears } = this.state;
        return (
            <>
                <Card>
                    <Card.Header className="h-3">
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Th??m m???i</span></button>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex">
                            <div className="w-30 pl-4 pt-3">
                                <label className="w-100">
                                    N??m, th??ng ch???m c??ng:
                                    <select value={selectedYearMonth} className="form-control" onChange={this.onYearMonthChange}>
                                        {
                                            monthYears && monthYears.length > 0 && monthYears.map((item) => {
                                                return (
                                                    <option key={item.name} value={item.name}>{item.name}</option>
                                                )
                                            }
                                            )
                                        }
                                    </select>
                                </label>
                                <label className="w-100 mt-2">
                                    Ng??y b???t ?????u:
                                    {/* Vantt12_TODO Mode ? */}
                                    <CustomDatePicker fieldname="startDate" value={model.startDate} onDateChange={this.onValidDateChange} />
                                </label>
                                <label className="w-100 mt-2">
                                    Ng??y k???t th??c:
                                    {/* Vantt12_TODO Mode ? */}
                                    <CustomDatePicker fieldname="endDate" value={model.endDate} onDateChange={this.onValidDateChange} />
                                </label>
                                <label className="w-100 mt-2">
                                    {/* Vantt12_TODO valid NumWorkDay in month < 24 ? */}
                                    S??? c??ng trong th??ng:
                                    <input fieldname="numWorkDay" value={model.numWorkDay} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" max={30} className="form-control" placeholder="24"></input>
                                </label>
                                <label className="w-100 mt-2">
                                    Ng??y ch???t c??ng t??nh l????ng:
                                    {/* Vantt12_TODO Mode ? */}
                                    <CustomDatePicker fieldname="expireApproveDate" value={model.expireApproveDate} onDateChange={this.onValidDateChange} />
                                </label>
                            </div>
                            <div className="w-30 pl-4 pt-3">
                                <label className="w-100">
                                    Ch???t phi???u duy???t sau s??? ng??y:
                                    <input fieldname="numDateApproval" value={model.numDateApproval} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Ch???t phi???u duy???t sau s??? ng??y"></input>
                                </label>
                                <div className="w-100 d-flex align-items-center mt-2">
                                    <label className="w-50">
                                        Th??? t???:
                                        <input fieldname="ordinal" value={model.ordinal} onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="number" className="form-control" placeholder="Th??? t???"></input>
                                    </label>
                                    <label className="ml-auto mt-4 d-flex align-items-center">
                                        <input className="mr-2" fieldname="isActive" onChange={this.onInputChange} disabled={mode === Mode.VIEW} type="checkbox" checked={model.isActive} />??ang ho???t ?????ng
                                    </label>
                                </div>
                                <label className="w-100 mt-2">
                                    Ghi ch??:
                                    <textarea fieldname="note" onChange={this.onInputChange} disabled={mode === Mode.VIEW} value={model.note} className="form-control" rows={5} placeholder="Ghi ch??"></textarea>
                                </label>
                                <div className="w-100 d-flex justify-content-end mt-3">
                                    {mode !== Mode.VIEW && <button className="btn btn-primary" onClick={() => this.setState({ showModalProcessConfirm: true })}><FontAwesomeIcon icon={faCheck} /> <span> L??u thay ?????i</span></button>}
                                    {mode === Mode.EDIT && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showModalRemoveComfirm: true })}><FontAwesomeIcon icon={faTrash} /><span> X??a</span></button>}
                                    {mode !== Mode.VIEW && <button className="btn btn-danger ml-2" onClick={() => this.setState({ showCancelConfirmModal: true })}><FontAwesomeIcon icon={faTimes} /><span> H???y b???</span></button>}
                                </div>
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