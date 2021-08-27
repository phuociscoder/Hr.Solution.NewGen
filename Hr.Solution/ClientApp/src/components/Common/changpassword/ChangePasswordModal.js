import { faCheck, faKey, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal } from "react-bootstrap";
import { AccountServices } from '../../administration/admin.account/Account.services';
import { ShowNotification } from '../notification/Notification';
import { NotificationType } from '../notification/Constants';
import { ErrorCase } from "./Constants";


export class ChangePasswordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            oldPassword: null,
            newPassword: null,
            confirmPassword: null,
        }
    }

    componentDidMount = () => {
        const { showModal } = this.props;
        if (showModal) {
            this.setState({ showModal });
        }
    }

    onHideModal = () => {
        const { onCancelProcess } = this.props;
        this.setState({ showModal: false, errorMessages: '', oldPassword: null, newPassword: null, confirmPassword: null }, onCancelProcess());
    }

    onInputChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        this.setState({ [fieldName]: value, errorMessages: '' });
    }

    onProcessAccount = () => {
        const password = this.getPassword();
        const { oldPassword, newPassword, confirmPassword } = this.state;
        if (password === ErrorCase.fieldNull){
            let errors = "Vui lòng điền đầy đủ các trường!";
            this.setState({ errorMessages: errors });
            return;
        }
        if (password === ErrorCase.oldPassMatchNewPass) {
            let errors = "Mật khẩu mới không được trùng mật khẩu cũ";
            this.setState({ errorMessages: errors });
            return;
        }
        if (password === ErrorCase.confirmNotMatchNewPass) {
            let errors = "Mật khẩu xác nhận không trùng khớp";
            this.setState({ errorMessages: errors });
            return;
        }
        const { userName } = this.props;
        this.setState({newPassword: password, errorMessages: null}, this.processConfirmChange(userName, newPassword));
    }

    processConfirmChange = (id, newPassword) => {
        AccountServices.Update(id, newPassword)
              .then(response => {
                if(response.data) {
                  ShowNotification(NotificationType.SUCCESS, "Đổi mật khẩu thành công!");
                  this.setState({ showChangePasswordModal: false });
                }
              }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể thay đổi mật khẩu!");
              })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }

        return true;
    }

    getPassword = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state;
        if (oldPassword && newPassword && confirmPassword){            
            if (oldPassword !== newPassword) {
                if (newPassword === confirmPassword) {
                    return newPassword;
                } else {
                    return ErrorCase.confirmNotMatchNewPass;
                }
            } else {
                return ErrorCase.oldPassMatchNewPass;
            }
        } else {
            return ErrorCase.fieldNull;
        }
        return null;
    }

    render = () => {
        const { showModal, errorMessages } = this.state;
        return (
            <Modal size="" centered backdrop="static" show={showModal} onHide={this.onHideModal}>
                <Modal.Header>
                    Đổi Mật Khẩu
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column mt-1 ml-2 mr-2 mb-1">
                        <label>
                            Mật khẩu hiện tại:
                            <input type="password" fieldName="oldPassword" className="form-control" placeholder="Mật khẩu hiện tại" onChange={this.onInputChange}/>
                        </label>
                        <label>
                            Mật khẩu mới:
                            <input type="password" fieldName="newPassword" className="form-control" placeholder="Mật khẩu mới" onChange={this.onInputChange}/>
                        </label>
                        <label>
                            Xác nhận mật khẩu mới:
                            <input type="password" fieldName="confirmPassword" className="form-control" placeholder="Xác nhận mật khẩu" onChange={this.onInputChange}/>
                        </label>
                    {
                        errorMessages && <span style={{ color: "red" }}><i>*{errorMessages}</i></span>
                    }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessAccount}><FontAwesomeIcon icon={faCheck} />Xác nhận</button>
                    <button className="btn btn-danger" onClick={this.onHideModal}><FontAwesomeIcon icon={faTimes} />Hủy bỏ</button>
                </Modal.Footer>
            </Modal>
        )
    }
}