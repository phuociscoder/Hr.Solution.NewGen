import { faCheck, faKey, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal } from "react-bootstrap";
import { AccountServices } from '../../administration/admin.account/Account.services';
import { ShowNotification } from '../notification/Notification';
import { NotificationType } from '../notification/Constants';
import { ImageUploader } from "../../Common/ImageUploader";

export class ChangeUserInfoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            fullName: '',
            avatar: null,
            email: ''
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
        this.setState({ showModal: false, fullName: '', avatar: null, email: '' }, onCancelProcess());
    }

    onInputChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        this.setState({ [fieldName]: value });
    }

    onProcessAccount = () => {

    }

    processConfirmChange = (id, newPassword) => {

    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.showModal != nextProps.showModal) {
            this.setState({ showModal: nextProps.showModal });
        }

        return true;
    }

    render = () => {
        const { showModal, fullName, avatar, email } = this.state;
        return (
            <Modal size="" centered backdrop="static" show={showModal} onHide={this.onHideModal}>
                <Modal.Header>
                    Đổi Thông Tin Cá Nhân
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column mt-1 ml-2 mr-2 mb-1">
                        <div className="w-100 d-flex">
                            <div className="w-50 d-flex flex-column">
                                <label>
                                    Họ và Tên
                                    <input value={fullName} fieldName="fullName" className="form-control" placeholder="Họ Và Tên" onChange={this.onInputChange} />
                                </label>
                                <label>
                                    Email
                                    <input type={email} fieldName="email" className="form-control" placeholder="email" onChange={this.onInputChange} />
                                </label>
                            </div>
                            <div className="d-flex flex-column ml-5" style={{ marginTop: '10px' }}>
                                <label>
                                    <div>
                                        <ImageUploader imageSrc={avatar} width={100} height={100} onChangeImage={this.onAvatarChange} />
                                    </div>
                                </label>
                            </div>
                        </div>
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