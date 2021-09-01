import { faCheck, faKey, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal } from "react-bootstrap";
import { AccountServices } from '../../administration/admin.account/Account.services';
import { ShowNotification } from '../notification/Notification';
import { NotificationType } from '../notification/Constants';
import { ImageUploader } from "../../Common/ImageUploader";
import { AuthenticationManager } from "../../../AuthenticationManager";

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
        const avatar = AuthenticationManager.Avatar();
        const fullName = AuthenticationManager.FullName();
        const email = AuthenticationManager.Email();
        this.setState({ avatar: avatar, fullName: fullName, email: email, showModal: showModal });
    }

    onHideModal = () => {
        const { onCancelProcess } = this.props;
        this.setState({ showModal: false }, onCancelProcess());
    }

    onInputChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        this.setState({ [fieldName]: value });
    }

    onAvatarChange = (image) => {
        this.setState({ avatar: image });
    }

    onProcessAccount = () => {
        const userName = AuthenticationManager.UserName();
        const { fullName, avatar, email } = this.state;
        const model = Object.assign({}, { fullName: fullName, email: email, avatar: avatar });
        AccountServices.UpdateUserNavMenu(userName, model).then(
            response => {
                if (response.data) {
                    ShowNotification(NotificationType.SUCCESS, "Thay đổi tên người dùng thành công");
                    this.setState({ avatar: model.avatar, fullName: model.fullName, email: model.email, showModal: false }, this.onHideModal())
                }
            },
            error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể cập nhật thông tin người dùng");
            }
        );
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
                                    <input value={fullName} fieldName="fullName" className="form-control" placeholder="Họ Và tên" onChange={this.onInputChange} />
                                </label>
                                <label>
                                    Email
                                    <input value={email} fieldName="email" className="form-control" placeholder="email" onChange={this.onInputChange} />
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