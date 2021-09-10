import { faCheck, faKey, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal, NavDropdown } from "react-bootstrap";
import { DefaultPassword, Mode, PasswordType } from "./Constant";
import { ImageUploader } from "../../Common/ImageUploader";
import { CustomDatePicker } from "../../Common/DatePicker";
import axios from "axios";
import { ValidateField, ValidateFieldMessage } from "../../Common/ValidateionField";
import { TypeValidation } from "../../Common/Constants";
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
            model: this.initModel,
            fieldsInValid: [],
            validations: []
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
        this.setState({ showModal: false, model: this.initModel, fieldsInValid: [] }, onCancelProcess());
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
        this.setState({ model: newModel, fieldsInValid: [] });
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
            let errors = "Mật khẩu không trùng khớp";
            this.setState({ errorMessages: errors });
            return;
        }
        const { model, validations } = this.state;
        const isInValid = validations.some(x => x.inValid);
        if(isInValid) return;
        const newModel = Object.assign({}, { ...model, password: password });
        // const fieldsValidation = [
        //     {field: 'code', value: newModel.code, type:TypeValidation.required},
        //     {field: 'userName', value: newModel.userName, type:TypeValidation.required},
        //     {field: 'fullName', value: newModel.fullName, type:TypeValidation.required},
        // ]
        // const fieldsInValid = ValidateField(fieldsValidation);
        // if (fieldsInValid.length > 0) {
        //     this.setState({ fieldsInValid: fieldsInValid});
        //     return;
        // }
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

        if (this.props.fieldsInValid != nextProps.fieldsInValid) {
            this.setState({ fieldsInValid: nextProps.fieldsInValid});
        }
        return true;
    }

    // componentDidUpdate = () => {
    //     console.log("componet");
    //     // const { isSubmit } = this.state;
    //     if (isSubmit) this.setState({ isSubmit: false });
    // }

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

    onValidation = (model) => {
        // debugger
        const { validations } = this.state;
        console.log(validations);
        let newValidations = [...validations];
        const modelIndex = validations.findIndex(x => x.fieldName === model.fieldName);
        if(modelIndex > -1) {
            newValidations.splice(modelIndex, 1, model); 
        } else {
            newValidations.push(model);
        }
        console.log(newValidations);
        this.setState({ validations: newValidations });
    }

    render = () => {
        const { showModal, mode, passwordType, customPassword, passwordConfirm, errorMessages, fieldsInValid } = this.state;
        const { code, userName, fullName, email, validDate, isActive, isAdmin, isDomain, isLock, isNeverLock, password, lockAfter, avatar } = this.state.model;
        return (
            <Modal size="lg" centered backdrop="static" show={showModal} onHide={this.onHideModal}>
                <Modal.Header>
                    {mode === Mode.CREATE ? "TẠO MỚI TÀI KHOẢN" : "CHỈNH SỬA TÀI KHOẢN"}
                </Modal.Header>
                <Modal.Body>
                    <div className="w-100 d-flex flex-column mt-1 ml-2 mr-2 mb-1">
                        <div className="w-100 d-flex">
                            <div className="w-50 d-flex flex-column">
                                <label>Mã tài khoản:
                                    <input disabled={mode === Mode.EDIT} value={code} fieldName="code" className="form-control" placeholder="Mã tài khoản" onChange={this.onInputChange} ></input>
                                    {/* { fieldsInValid.find(x=> x.field == "code") && <ValidateFieldMessage value={code} type={TypeValidation.REQUIRED} fieldName="Mã Tài Khoản" isSubmit={isSubmit}/>} */}
                                    <ValidateFieldMessage value={code} type={TypeValidation.REQUIRED} fieldName="code" property="Mã nhân viên" onValidate={this.onValidation}/>
                                </label>
                                <label>Tài khoản đăng nhập:
                                    <input value={userName} disabled={mode === Mode.EDIT} fieldName="userName" className="form-control" placeholder="Tài khoản" onChange={this.onInputChange}></input>
                                    {/* { fieldsInValid.find(x=> x.field == "userName") && <ValidateFieldMessage message="Không được bỏ trống Tài khoản đăng nhập"/>} */}
                                    <ValidateFieldMessage value={userName} type={TypeValidation.REQUIRED} fieldName="userName" property="Mã Tài Khoản" onValidate={this.onValidation}/>
                                </label>
                                <label>Tên hiển thị:
                                    <input value={fullName} fieldName="fullName" className="form-control" placeholder="Tên hiển thị" onChange={this.onInputChange}></input>
                                    {/* { fieldsInValid.find(x=> x.field == "fullName") && <ValidateFieldMessage message="Không được bỏ trống Tên hiển thị"/>} */}
                                    <ValidateFieldMessage value={fullName} type={TypeValidation.REQUIRED} fieldName="fullName" property="Tên hiển thị" onValidate={this.onValidation}/>
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
                                <label> Ngày hiệu lực:
                                    <CustomDatePicker value={validDate} onDateChange={this.onValidDateChange} />
                                </label>
                                <NavDropdown.Divider />
                                {mode === Mode.CREATE &&
                                    <>
                                        <div className="d-flex">
                                            <label>
                                                <input type="radio" name="passType" checked={passwordType === PasswordType.Default} onChange={() => this.onPasswordTypeChange(PasswordType.Default)} /> Mật khẩu mặc định
                                            </label>
                                            <label className="ml-auto">
                                                <input type="radio" name="passType" checked={passwordType === PasswordType.Custom} onChange={() => this.onPasswordTypeChange(PasswordType.Custom)} /> Mật khẩu tùy chọn
                                            </label>
                                        </div>
                                        {
                                            passwordType === PasswordType.Custom &&
                                            <>
                                                <label>
                                                    Mật khẩu:
                                                    <input value={customPassword} type="password" fieldName="customPassword" className="form-control" placeholder="mật khẩu" onChange={this.onPasswordCustomChange} />
                                                </label>
                                                <label>
                                                    Xác nhận mật khẩu:
                                                    <input value={passwordConfirm} type="password" fieldName="passwordConfirm" className="form-control" placeholder="Xác nhận mật khẩu" onChange={this.onPassWordConfirmChange} />
                                                </label>
                                                {
                                                    errorMessages && <span style={{ color: "red" }}><i>*{errorMessages}</i></span>
                                                }
                                            </>
                                        }
                                    </>
                                }
                                <label className="mt-4">
                                    <span className="d-flex align-items-center">Khóa sau <input value={lockAfter} onChange={this.onInputChange} fieldName="lockCount" className="form-control ml-1 mr-1" style={{ width: '70px' }} type="number" /> lần đăng nhập thất bại.</span>
                                </label>
                            </div>
                            <div className="d-flex flex-column ml-5">
                                <label>
                                    <input type="checkbox" checked={isAdmin} fieldName="isAdmin" onChange={this.onCheckboxChange} /> Quản trị hệ thống
                                </label>
                                <label>
                                    <input type="checkbox" checked={isNeverLock} fieldName="isNeverLock" onChange={this.onCheckboxChange} /> Không bao giờ bị khóa
                                </label>
                                <label>
                                    <input type="checkbox" checked={isDomain} fieldName="isDomain" onChange={this.onCheckboxChange} /> Là tài khoản Domain
                                </label>
                                <label className="mt-4">
                                    <input type="checkbox" checked={isLock} fieldName="isLock" onChange={this.onCheckboxChange} /> Khóa tài khoản
                                </label>
                                <label>
                                    <input type="checkbox" checked={isActive} fieldName="isActive" onChange={this.onCheckboxChange} /> Đang hoạt động
                                </label>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {mode === Mode.EDIT && <button className="btn btn-primary mr-auto"><FontAwesomeIcon icon={faKey} /><span> Đổi mật khẩu</span></button>}
                    <button className="btn btn-primary" onClick={this.onProcessAccount}><FontAwesomeIcon icon={faCheck} /> <span>Xác nhận</span></button>
                    <button className="btn btn-danger ml-2" onClick={this.onHideModal} ><FontAwesomeIcon icon={faTimes} /> <span>Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }
}