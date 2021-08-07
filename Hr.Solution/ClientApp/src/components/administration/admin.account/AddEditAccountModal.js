import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal, NavDropdown } from "react-bootstrap";
import { Mode, PasswordType } from "./Constant";
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
            passwordType : PasswordType.Default,
            password: null,
            passwordConfirm: null,
            model: {
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
               password: 'Hr@123456',
               lockAfter: 3,
               avatar: null
            }
        }
    }

    componentDidMount = () => {
        this.testAPI();
        const { showModal } = this.props;
        if (showModal) {
            this.setState({ showModal });
        }
    }

    testAPI =() => {
        axios.get("/api/testconnect").then(result =>{
            console.log(result);
        }, error => {});
    }

    onHideModal = () => {
        const { onCancelProcess } = this.props;
        this.setState({ showModal: false, model: {} }, onCancelProcess());
    }

    onPasswordTypeChange =(type) => {
        if(!isNaN(type))
        {
            this.setState({passwordType: type});
        }
    }

    onAvatarChange =(image) => {
        const {model} = this.state;
        const newModel = Object.assign({},{...model, avatar: image});
        this.setState({model: newModel});
    }

    onInputChange =(e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        const newModel = Object.assign({}, {...this.state.model, [fieldName]: value});
        this.setState({model: newModel});
    }

    onCheckboxChange =(e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.checked;
        const newModel = Object.assign({}, {...this.state.model, [fieldName]: value});
        this.setState({model: newModel});
    }

    onValidDateChange =(value) => {
        const {model} = this.state;
        const newModel = Object.assign({}, {...model, validDate: value});
        this.setState({model: newModel});
    }

    onProcessAccount =() => {
        const {onProcessConfirm} = this.props;
        onProcessConfirm(this.state.mode, this.state.model);
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal});
        }

        if (this.props.mode != nextProps.mode) {
            if(nextProps.mode === Mode.EDIT)
            {
                this.setState({mode: nextProps.mode , model: nextProps.model});
            }  
        }
        return true;
    }
   
    render = () => {
        const { showModal, mode, passwordType, customPassword, passwordConfirm } = this.state;
        const {code, userName, fullName, email, validDate, isActive, isAdmin, isDomain, isLock, isNeverLock, password, lockCount, avatar} = this.state.model;
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
                                    <input value={code} fieldName="code" className="form-control" placeholder="Mã tài khoản" onChange={this.onInputChange}></input>
                                </label>

                                <label>Tài khoản đăng nhập:
                                    <input value={userName} fieldName="userName" className="form-control" placeholder="Tài khoản" onChange={this.onInputChange}></input>
                                </label>
                                <label>Tên hiển thị:
                                    <input value={fullName} fieldName="fullName" className="form-control" placeholder="Tên hiển thị" onChange={this.onInputChange}></input>
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
                                    <CustomDatePicker value={validDate} onDateChange={this.onValidDateChange}/>
                                </label>
                                <NavDropdown.Divider/>
                                <div className="d-flex">
                                <label>
                                    <input type="radio" name="passType" checked={passwordType === PasswordType.Default} onChange={() =>this.onPasswordTypeChange(PasswordType.Default)} /> Mật khẩu mặc định
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
                                            <input value={customPassword} fieldName="customPassword" className="form-control" placeholder="mật khẩu"/>
                                        </label>
                                        <label>
                                            Xác nhận mật khẩu:
                                            <input value={passwordConfirm} fieldName="passwordConfirm" className="form-control" placeholder="Xác nhận mật khẩu"/>
                                        </label>
                                    </>
                                }
                                 <label className="mt-4">
                                  <span className="d-flex align-items-center">Khóa sau <input value={lockCount} onChange={this.onInputChange} fieldName="lockCount" className="form-control ml-1 mr-1" style={{width: '70px'}} type="number"/> lần đăng nhập thất bại.</span>
                                </label>
                            </div>
                            <div className="d-flex flex-column ml-5">
                                <label>
                                    <input type="checkbox" checked={isAdmin} fieldName="isAdmin" onChange={this.onCheckboxChange}/> Quản trị hệ thống
                                </label>
                                <label>
                                    <input type="checkbox" checked={isNeverLock} fieldName="isNeverLock" onChange={this.onCheckboxChange}/> Không bao giờ bị khóa
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
                    <button className="btn btn-primary" onClick={this.onProcessAccount}><FontAwesomeIcon icon={faCheck} /> <span>Xác nhận</span></button>
                    <button className="btn btn-danger ml-2" onClick={this.onHideModal} ><FontAwesomeIcon icon={faTimes} /> <span>Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }
}