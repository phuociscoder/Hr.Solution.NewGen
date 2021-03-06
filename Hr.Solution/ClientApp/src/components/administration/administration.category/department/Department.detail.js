import { faCheck, faPlus, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Modal } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { DepartmentServices } from "../../admin.department/Department.services";
import { Mode } from "./Constants";
import { ImageUploader } from '../../../Common/ImageUploader';
import { CategoryServices } from "../Category.services";
import { AuthenticationManager } from "../../../../AuthenticationManager";
import { CustomSelect } from "../../../Common/CustomSelect";
import { result } from "lodash";



export class DepartmentDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentInfo: {},
            mode: Mode.VIEW,
            departments: [],
            reload: false,
            showLogo: false

        }
    }

    initModel = {
        id: null,
        departmentCode: '',
        departmentName: '',
        departmentName2: '',
        parentId: null,
        active: true,
        isCompany: false,
        departmentTel: '',
        departmentEmail: '',
        departmentAddress: '',
        taxCode: '',
        note: '',
        ordinal: 0,
        departmentFax: '',
        logoImage: null

    }

    componentDidMount = () => {
        const { prefix, departmentId } = this.props;
        if (!prefix || !departmentId) return;
        this.getDepartmentInfo(departmentId);
    }

    getDepartmentInfo = (id) => {
        DepartmentServices.GetById(id)
            .then(response => {
                const resultModel = response.data;
                const model = Object.assign({}, {
                    id: resultModel.id,
                    departmentCode: resultModel.departmentCode ?? '',
                    departmentName: resultModel.departmentName ?? '',
                    departmentName2: resultModel.departmentName2 ?? '',
                    parentID: resultModel.parentID,
                    active: resultModel.active,
                    managerId: resultModel.managerId,
                    isCompany: resultModel.isCompany,
                    departmentTel: resultModel.departmentTel ?? '',
                    departmentEmail: resultModel.departmentEmail ?? '',
                    departmentAddress: resultModel.departmentAddress ?? '',
                    taxCode: resultModel.taxCode ?? '',
                    note: resultModel.note ?? '',
                    ordinal: resultModel.ordinal ?? 0,
                    departmentFax: resultModel.departmentFax ?? '',
                    logoImage: resultModel.logoImage
                });
                this.setState({ departmentInfo: model, originDepartmentInfo: model, mode: Mode.EDIT, showLogo: model.isCompany });
            },
                error => {
                    ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? truy c???p th??ng tin b??? ph???n");
                })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.departmentId !== nextProps.departmentId) {
            this.setState({ departmentId: nextProps.departmentId }, this.getDepartmentInfo(nextProps.departmentId));
        }
        if (this.props.model !== nextProps.model && Object.keys(nextProps.model).length > 0) {
            this.setState({ model: nextProps.model, editModel: nextProps.model, mode: Mode.EDIT });
        }
        return true;
    }

    componentDidUpdate = () => {
        const { reload } = this.state;
        if (reload) {
            this.setState({ reload: false });
        }
    }

    onAddItemClick = () => {
        const newModel = this.initModel;
        this.setState({ departmentInfo: newModel, mode: Mode.CREATE, showLogo: false });
    }

    onInputChange = (e) => {
        const { departmentInfo } = this.state;
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
        if (fieldName === 'isCompany') {
            this.setState({ showLogo: value });
        }

        let newModel = Object.assign({}, { ...departmentInfo, [fieldName]: value });
        this.setState({ departmentInfo: newModel });
    }

    onDepartmentLogoChange = (value) => {
        const { departmentInfo } = this.state;
        const newModel = Object.assign({}, { ...departmentInfo, logoImage: value });
        this.setState({ departmentInfo: newModel });
    }

    onManagerChange = (id) => {
        const { departmentInfo } = this.state;
        const newModel = Object.assign({}, { ...departmentInfo, managerId: id });
        this.setState({ departmentInfo: newModel });
    }

    onDepartmentChange = (id) => {
        const { departmentInfo } = this.state;
        const newModel = Object.assign({}, { ...departmentInfo, parentId: id });
        this.setState({ departmentInfo: newModel });
    }

    render = () => {
        const { mode, reload, showLogo } = this.state;
        const { id, departmentCode, departmentName, departmentName2, departmentAddress, departmentEmail, departmentFax,
            departmentTel, isCompany, note, ordinal, taxCode, logoImage, managerId, active, parentID } = this.state.departmentInfo;
        return (
            <>
                <Card className="h-100">
                    <Card.Header>
                        <button className="btn btn-primary" disabled={mode === Mode.CREATE} onClick={this.onAddItemClick}><FontAwesomeIcon icon={faPlus} /><span> Th??m m???i</span></button>
                    </Card.Header>
                    <Card.Body className="flex-column">
                        <div className="d-flex w-75 p-3">
                            <div className="w-50 d-flex flex-column">
                                <label>
                                    M?? b??? ph???n:
                                    <input disabled={mode !== Mode.CREATE} fieldname="departmentCode" value={departmentCode} onChange={this.onInputChange} className="w-50 form-control" placeholder="M?? b??? ph???n" />
                                </label>
                                <label className="mt-2">
                                    T??n b??? ph???n:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentName" value={departmentName} onChange={this.onInputChange} className="form-control" placeholder="T??n b??? ph???n" />
                                </label>
                                <label className="mt-2">
                                    T??n Thay th???:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentName2" value={departmentName2} onChange={this.onInputChange} className=" form-control" placeholder="T??n thay th???" />
                                </label>
                                <label className="mt-2">
                                    Tr?????ng b??? ph???n:
                                    <CustomSelect dataUrl="/api/Employee/Managers" className="w-100"
                                        orderFieldName={["level"]}
                                        orderBy="desc"
                                        disabled={mode === Mode.VIEW}
                                        selectedValue={managerId}
                                        isHierachy={false}
                                        valueField="id"
                                        labelField="fullName"
                                        isClearable={true}
                                        onValueChange={this.onManagerChange} />
                                </label>
                                <div className="w-50 d-flex mt-2">
                                    <label>
                                        <input disabled={mode === Mode.VIEW} fieldname="isCompany" checked={isCompany} onChange={this.onInputChange} className="mr-1" type="checkbox" /> C??ng ty
                                    </label>
                                    <label className="ml-auto">
                                        <input disabled={mode === Mode.VIEW} fieldname="active" checked={active} onChange={this.onInputChange} type="checkbox" /> ??ang ho???t ?????ng
                                    </label>
                                </div>
                                <label className="mt-2">
                                    Thu???c b??? ph???n:
                                    <CustomSelect dataUrl="/api/Department" className="w-100"
                                        orderFieldName={["level"]}
                                        orderBy="desc"
                                        disabled={mode === Mode.VIEW}
                                        isHierachy={true}
                                        selectedValue={parentID}
                                        disabledValue={id}
                                        valueField="id"
                                        labelField="departmentName"
                                        isClearable={true}
                                        reload={reload}
                                        onValueChange={this.onDepartmentChange} />
                                </label>
                                <label className="mt-2">
                                    ??i???n tho???i:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentTel" value={departmentTel} onChange={this.onInputChange} className="form-control " placeholder="??i???n tho???i" />
                                </label>
                                <label className="mt-2">
                                    ?????a ch???:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentAddress" value={departmentAddress} onChange={this.onInputChange} className="form-control " placeholder="??i???n tho???i" />
                                </label>
                            </div>
                            { showLogo && <div className="w-25 ml-5">
                                <label className="mb-0">Logo:</label>
                                <ImageUploader disabled={mode === Mode.VIEW} imageSrc={logoImage} onChangeImage={this.onDepartmentLogoChange} width={115} height={115} />
                            </div>}

                        </div>
                        <div className="w-75 p-3 d-flex flex-column">
                            <div className="w-100 d-flex">
                                <label className="mt-2 w-50">
                                    Email:
                                    <input disabled={mode === Mode.VIEW} fieldname="departmentEmail" value={departmentEmail} onChange={this.onInputChange} className="form-control" placeholder="Email" />
                                </label>
                                <label className="mt-2 pl-5 ml-0 w-50">
                                    Th??? t???:
                                    <input disabled={mode === Mode.VIEW} fieldname="ordinal" type="number" value={ordinal} onChange={this.onInputChange} className="form-control w-50" placeholder="Th??? t???" />
                                </label>
                            </div>

                            <div className="w-100 d-flex">
                                <div className="w-50">
                                    <label className="w-100 mt-2">
                                        Fax:
                                        <input disabled={mode === Mode.VIEW} fieldname="departmentFax" value={departmentFax} onChange={this.onInputChange} className="form-control " placeholder="Fax" />
                                    </label>
                                    <label className="w-100 mt-2">
                                        M?? s??? thu???:
                                        <input disabled={mode === Mode.VIEW} fieldname="taxCode" value={taxCode} onChange={this.onInputChange} className="form-control" placeholder="M?? s??? thu???" />
                                    </label>
                                </div>
                                <div className="w-50 pl-5 mt-2">
                                    <label className="w-100">
                                        Ghi ch??:
                                        <textarea disabled={mode === Mode.VIEW} rows={4} style={{ height: '115px' }} placeholder="Ghi ch??" fieldName="note" value={note} onChange={this.onInputChange} className="form-control" />
                                    </label>
                                </div>
                            </div>

                        </div>
                        <div className="w-75 border-bottom mt-2"></div>
                        <div className="w-75 mt-2 ml-3 d-flex">
                            {mode === Mode.EDIT &&
                                <button className="btn btn-danger mr-auto" onClick={this.onShowRemoveModalConfirm}>
                                    <FontAwesomeIcon icon={faTrash} /> <span className="ml-1"> X??a b??? ph???n</span>
                                </button>
                            }

                            {mode !== Mode.VIEW &&
                                <>

                                    <button className="btn btn-primary mr-2 " onClick={this.onShowProcessConfirmModal}>
                                        <FontAwesomeIcon icon={faCheck} /> <span className="ml-1"> L??u thay ?????i</span>
                                    </button>
                                    <button className="btn btn-danger " onClick={this.onShowCancelConfirmModal}>
                                        <FontAwesomeIcon icon={faTimes} /> <span className="ml-1"> H???y b???</span>
                                    </button>
                                </>
                            }
                        </div>

                    </Card.Body>
                </Card>
                {this.generateCancelModalConfirm()}
                {this.generateProcessModalConfirm()}
                {this.generateRemoveModalConfirm()}
            </>
        )
    }

    onShowRemoveModalConfirm = () => {
        this.setState({ showModalRemoveComfirm: true });
    }

    generateRemoveModalConfirm = () => {
        const { showModalRemoveComfirm } = this.state;
        return (
            <Modal show={showModalRemoveComfirm} backdrop="static" centered>
                <Modal.Header>
                    X??C NH???N X??A
                </Modal.Header>
                <Modal.Body>
                    Ch???c ch???n x??a ph??ng ban/ b??? ph???n ?
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
        const { departmentInfo } = this.state;
        DepartmentServices.Delete(departmentInfo.id)
            .then(response => {
                if (response.data === "SUCCESS") {
                    ShowNotification(NotificationType.SUCCESS, "X??a ph??ng ban/b??? ph???n th??nh c??ng");
                    this.setState({ showModalRemoveComfirm: false, departmentInfo: this.initModel, originDepartmentInfo: this.initModel, mode: Mode.VIEW }, this.onRefresh(true));
                }
                else {
                    this.setState({ showModalRemoveComfirm: false });
                    ShowNotification(NotificationType.ERROR, "Kh??ng th??? x??a ph??ng ban/b??? ph???n v?? c?? c??c ????n v??? tr???c thu???c");
                }

            }, error => {
                ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? x??a ch??? m???c kh???i danh m???c");
                this.setState({ showModalRemoveComfirm: false });
            })

    }

    onProcessConfirm = () => {
        const { departmentInfo, mode } = this.state;
        if (mode === Mode.CREATE) {
            const newModel = Object.assign({}, { ...departmentInfo, createdBy: AuthenticationManager.UserName() });
            DepartmentServices.Add(newModel)
                .then(response => {
                    ShowNotification(NotificationType.SUCCESS, "Th??m b??? ph???n/ph??ng ban th??nh c??ng");
                    this.setState({ model: this.initModel, showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? th??m b??? ph???n/ph??ng ban v??o h??? th???ng");
                })

        } else if (mode === Mode.EDIT) {
            const editModel = Object.assign({}, { ...departmentInfo, modifiedBy: AuthenticationManager.UserName() });
            DepartmentServices.Update(editModel.id, editModel)
                .then(response => {
                    ShowNotification(NotificationType.SUCCESS, "C???p nh???t ph??ng ban/b??? ph???n th??nh c??ng");
                    this.setState({ departmentInfo: editModel, originDepartmentInfo: editModel, showModalProcessConfirm: false }, this.onRefresh(true));
                }, error => {
                    this.setState({ showModalProcessConfirm: false });
                    ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra ! Kh??ng th??? c???p nh???t ch??? m???c ");
                });
        }
    }

    onRefresh = (value) => {
        const { onRefresh } = this.props;
        this.setState({ reload: true }, onRefresh(true));

    }

    onShowCancelConfirmModal = () => {
        this.setState({ showCancelConfirmModal: true });
    }

    onShowProcessConfirmModal = () => {
        this.setState({ showModalProcessConfirm: true });
    }

    onCancelProcessConfirm = () => {
        const { mode, originDepartmentInfo } = this.state;
        if (mode === Mode.CREATE) {
            const model = originDepartmentInfo ?? this.initModel;
            const newMode = originDepartmentInfo ? Mode.EDIT : Mode.VIEW;
            this.setState({ departmentInfo: model, mode: newMode, showCancelConfirmModal: false });
            return;
        }
        if (mode === Mode.EDIT) {
            const model = originDepartmentInfo;
            this.setState({ departmentInfo: model, showCancelConfirmModal: false });
            return;
        }
    }
}