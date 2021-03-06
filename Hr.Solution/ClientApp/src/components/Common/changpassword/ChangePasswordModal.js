import { faCheck, faKey, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal } from "react-bootstrap";
import { ShowNotification } from '../notification/Notification';
import { NotificationType } from '../notification/Constants';
import { ErrorCase } from "./Constants";
import ChangePasswordServices from "./ChangePassword.services";
import { Error } from "../Constants";
import { result } from "lodash";


export class ChangePasswordModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            currentPassword: null,
            newPassword: null,
            confirmPassword: null,
            invalidError: {
                invalid: false,
                message: ""
            }
        }
    }

    componentDidMount = () => {
        const { showModal } = this.props;
        if (showModal) {
            this.setState({ showModal: showModal });
        }
    }

    onHideModal = () => {
        const { onCancelProcess } = this.props;
        this.setState({ showModal: false, errorMessages: '', currentPassword: null, newPassword: null, confirmPassword: null }, onCancelProcess());
    }

    onInputChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        this.setState({ [fieldName]: value, errorMessages: '' });
    }

    onProcessAccount = () => {
        const password = this.getPassword();
        const { currentPassword, newPassword } = this.state;
        if (password.invalid){
            this.setState({ errorMessages: password.message });
            return;
        }
        const { userName } = this.props;
        this.setState({newPassword: password, errorMessages: null}, this.processConfirmChange(userName, currentPassword, newPassword));
    }

    processConfirmChange = (userName, currentPassword, newPassword) => {
        ChangePasswordServices.UpdatePassword(userName, currentPassword, newPassword)
              .then(response => {
                if(response.data) {
                  ShowNotification(NotificationType.SUCCESS, "?????i m???t kh???u th??nh c??ng!");
                  this.setState({ showModal: false }, this.onHideModal);
                }
              }, error => {
                const errors = error.response.data.errors;
                let results = [];
                errors.forEach(e => {
                    const error = Error.All.find(x => x.code === e.code);
                    if (error) {
                        results.push(error.message);
                    }
                });
                results.forEach(r => {
                    ShowNotification(NotificationType.ERROR, r);
                })
              })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }
        return true;
    }

    getPassword = () => {
        const { currentPassword, newPassword, confirmPassword } = this.state;
        if (!currentPassword || !newPassword || !confirmPassword){
            return { invalid: true, message: ErrorCase.fieldNull };
        }
        if (currentPassword === newPassword){
            return { invalid: true, message: ErrorCase.oldPassMatchNewPass };
        }
        if (newPassword !== confirmPassword){
            return { invalid: true, message: ErrorCase.confirmNotMatchNewPass };
        }
        return newPassword;
    }

    render = () => {
        const { showModal, errorMessages } = this.state;
        return (
            <Modal size="" centered backdrop="static" show={showModal} onHide={this.onHideModal}>
                <Modal.Header>
                    ?????i M???t Kh???u
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column mt-1 ml-2 mr-2 mb-1">
                        <label>
                            M???t kh???u hi???n t???i:
                            <input type="password" fieldName="currentPassword" className="form-control" placeholder="M???t kh???u hi???n t???i" onChange={this.onInputChange}/>
                        </label>
                        <label>
                            M???t kh???u m???i:
                            <input type="password" fieldName="newPassword" className="form-control" placeholder="M???t kh???u m???i" onChange={this.onInputChange}/>
                        </label>
                        <label>
                            X??c nh???n m???t kh???u m???i:
                            <input type="password" fieldName="confirmPassword" className="form-control" placeholder="X??c nh???n m???t kh???u" onChange={this.onInputChange}/>
                        </label>
                    {
                        errorMessages && <span style={{ color: "red" }}><i>*{errorMessages}</i></span>
                    }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessAccount}><FontAwesomeIcon icon={faCheck} />X??c nh???n</button>
                    <button className="btn btn-danger" onClick={this.onHideModal}><FontAwesomeIcon icon={faTimes} />H???y b???</button>
                </Modal.Footer>
            </Modal>
        )
    }
}