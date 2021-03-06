import { faCheck, faKey, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal, NavDropdown } from "react-bootstrap";
import { DefaultPassword, Mode, PasswordType } from "./Constant";
import { ImageUploader } from "../../Common/ImageUploader";
import { CustomDatePicker } from "../../Common/DatePicker";
import axios from "axios";
// import DatePicker from 'react-date-picker';

export class AddEditAccountModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            mode: Mode.CREATE,
            passwordType: PasswordType.Default,
            password: null,
            passwordConfirm: null,
            model: this.initModel
        }
    }

    initModel = {
        code: null,
        userName: null,
        fullName: null,
        email: null,
        validDate: null,
        isAdmin: false,
        isNeverLock: false,
        isDomain: false,
        isLock: false,
        isActive: true,
        password: DefaultPassword.value,
        lockAfter: 3,
        avatar: null
    }

    componentDidMount = () => {
        const { showModal } = this.props;
        if (showModal) {
            this.setState({ showModal });
        }
    }

    onHideModal = () => {
        const { onCancelProcess } = this.props;
        this.setState({ showModal: false, model: this.initModel }, onCancelProcess());
    }

    onPasswordTypeChange = (type) => {
        if (!isNaN(type)) {
            this.setState({ passwordType: type });
        }
    }

    onAvatarChange = (image) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, avatar: image });
        this.setState({ model: newModel });
    }

    onInputChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        const newModel = Object.assign({}, { ...this.state.model, [fieldName]: value });
        this.setState({ model: newModel });
    }

    onCheckboxChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.checked;
        const newModel = Object.assign({}, { ...this.state.model, [fieldName]: value });
        this.setState({ model: newModel });
    }

    onValidDateChange = (value) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, validDate: value });
        this.setState({ model: newModel });
    }

    onProcessAccount = () => {
        const password = this.getPassword();
        if (!password) {
            let errors = "M???t kh???u kh??ng tr??ng kh???p";
            this.setState({ errorMessages: errors });
            return;
        }
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, password: password });
        const { onProcessConfirm } = this.props;
        this.setState({ model: newModel, errorMessages: null }, onProcessConfirm(this.state.mode, newModel));
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }

        if (this.props.mode != nextProps.mode) {
            this.setState({ mode: nextProps.mode });
        }

        if (this.props.model != nextProps.model) {
            this.setState({ model: Object.keys(nextProps.model).length > 0 ? nextProps.model : this.initModel });
        }
        return true;
    }

    onPasswordCustomChange = (e) => {
        const value = e.target.value;
        this.setState({ cPassword: value });
    }

    onPassWordConfirmChange = (e) => {
        const value = e.target.value;
        this.setState({ confirmCPassword: value });
    }

    getPassword = () => {
        const { cPassword, confirmCPassword, passwordType } = this.state;
        if (passwordType === PasswordType.Default) {
            return DefaultPassword.value;
        }

        if (cPassword === confirmCPassword) {
            return cPassword;
        }
        return null;
    }

    render = () => {
        const { showModal, mode, passwordType, customPassword, passwordConfirm, errorMessages } = this.state;
        const { code, userName, fullName, email, validDate, isActive, isAdmin, isDomain, isLock, isNeverLock, password, lockAfter, avatar } = this.state.model;
        return (
            <Modal size="lg" centered backdrop="static" show={showModal} onHide={this.onHideModal}>
                <Modal.Header>
                    {mode === Mode.CREATE ? "T???O M???I T??I KHO???N" : "CH???NH S???A T??I KHO???N"}
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100 d-flex flex-column mt-1 ml-2 mr-2 mb-1">
                        <div className="w-100 d-flex">
                            <div className="w-50 d-flex flex-column">
                                <label>M?? t??i kho???n:
                                    <input disabled={mode === Mode.EDIT} value={code} fieldName="code" className="form-control" placeholder="M?? t??i kho???n" onChange={this.onInputChange}></input>
                                </label>
                                <label>T??i kho???n ????ng nh???p:
                                    <input value={userName} disabled={mode === Mode.EDIT} fieldName="userName" className="form-control" placeholder="T??i kho???n" onChange={this.onInputChange}></input>
                                </label>
                                <label>T??n hi???n th???:
                                    <input value={fullName} fieldName="fullName" className="form-control" placeholder="T??n hi???n th???" onChange={this.onInputChange}></input>
                                </label>
                            </div>
                            <div className="d-flex flex-column ml-5" style={{ marginTop: '0px' }}>
                                <ImageUploader imageSrc={avatar} width={100} height={100} onChangeImage={this.onAvatarChange} />
                            </div>
                        </div>

                        <div className="w-100 d-flex">
                            <div className="w-50 d-flex flex-column">
                                <label>Email:
                                    <input value={email} fieldName="email" className="form-control" placeholder="Email" onChange={this.onInputChange}></input>
                                </label>
                                <label> Ng??y hi???u l???c:
                                    <CustomDatePicker value={validDate} onDateChange={this.onValidDateChange} />
                                </label>
                                <NavDropdown.Divider />
                                {mode === Mode.CREATE &&
                                    <>
                                        <div className="d-flex">
                                            <label>
                                                <input type="radio" name="passType" checked={passwordType === PasswordType.Default} onChange={() => this.onPasswordTypeChange(PasswordType.Default)} /> M???t kh???u m???c ?????nh
                                            </label>
                                            <label className="ml-auto">
                                                <input type="radio" name="passType" checked={passwordType === PasswordType.Custom} onChange={() => this.onPasswordTypeChange(PasswordType.Custom)} /> M???t kh???u t??y ch???n
                                            </label>
                                        </div>
                                        {
                                            passwordType === PasswordType.Custom &&
                                            <>
                                                <label>
                                                    M???t kh???u:
                                                    <input value={customPassword} type="password" fieldName="customPassword" className="form-control" placeholder="m???t kh???u" onChange={this.onPasswordCustomChange} />
                                                </label>
                                                <label>
                                                    X??c nh???n m???t kh???u:
                                                    <input value={passwordConfirm} type="password" fieldName="passwordConfirm" className="form-control" placeholder="X??c nh???n m???t kh???u" onChange={this.onPassWordConfirmChange} />
                                                </label>
                                                {
                                                    errorMessages && <span style={{ color: "red" }}><i>*{errorMessages}</i></span>
                                                }
                                            </>
                                        }
                                    </>
                                }
                                <label className="mt-4">
                                    <span className="d-flex align-items-center">Kh??a sau <input value={lockAfter} onChange={this.onInputChange} fieldName="lockCount" className="form-control ml-1 mr-1" style={{ width: '70px' }} type="number" /> l???n ????ng nh???p th???t b???i.</span>
                                </label>
                            </div>
                            <div className="d-flex flex-column ml-5">
                                <label>
                                    <input type="checkbox" checked={isAdmin} fieldName="isAdmin" onChange={this.onCheckboxChange} /> Qu???n tr??? h??? th???ng
                                </label>
                                <label>
                                    <input type="checkbox" checked={isNeverLock} fieldName="isNeverLock" onChange={this.onCheckboxChange} /> Kh??ng bao gi??? b??? kh??a
                                </label>
                                <label>
                                    <input type="checkbox" checked={isDomain} fieldName="isDomain" onChange={this.onCheckboxChange} /> L?? t??i kho???n Domain
                                </label>
                                <label className="mt-4">
                                    <input type="checkbox" checked={isLock} fieldName="isLock" onChange={this.onCheckboxChange} /> Kh??a t??i kho???n
                                </label>
                                <label>
                                    <input type="checkbox" checked={isActive} fieldName="isActive" onChange={this.onCheckboxChange} /> ??ang ho???t ?????ng
                                </label>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {mode === Mode.EDIT && <button className="btn btn-primary mr-auto"><FontAwesomeIcon icon={faKey} /><span> ?????i m???t kh???u</span></button>}
                    <button className="btn btn-primary" onClick={this.onProcessAccount}><FontAwesomeIcon icon={faCheck} /> <span>X??c nh???n</span></button>
                    <button className="btn btn-danger ml-2" onClick={this.onHideModal} ><FontAwesomeIcon icon={faTimes} /> <span>H???y b???</span></button>
                </Modal.Footer>
            </Modal>
        )
    }
}