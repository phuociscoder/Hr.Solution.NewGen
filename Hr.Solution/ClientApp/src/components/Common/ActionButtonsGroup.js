import { faCheck, faShareSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "bootstrap";
import React from "react";
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";

export class ActionType {
    static SaveChange = 1;
    static SaveDraft = 2;
    static Cancel = 3;
}

export class ActionButtonsGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            enableDraft: false,
            className: 'd-flex flex-row',
            isShowModal: false,
            selectedAction: 0
        };
    }

    defaultMessages = () => {
        return {
            confirmMessage: "Chắc chắn lưu thông tin ?",
            confirmDraftMessage: "Chắc chắn lưu thông tin nháp ?",
            cancelMessage: "Bạn muốn hủy bỏ thao tác ?"
        }
    }

    componentDidMount = () => {
        const { enableDraft, className, confirmMessage, confirmDraftMessage, cancelMessage } = this.props;
        this.setState({
            enableDraft: enableDraft || false,
            messages: {
                confirmMessage: confirmMessage || this.defaultMessages().confirmMessage,
                confirmDraftMessage: confirmDraftMessage || this.defaultMessages().confirmDraftMessage,
                cancelMessage: cancelMessage || this.defaultMessages().cancelMessage
            },
            className: className
        })
    }

    getMessages = (type) => {
        const { messages } = this.state;
        let messageResult = "";
        switch (parseInt(type)) {
            case ActionType.SaveChange:
                messageResult = messages.confirmMessage;
                break;
            case ActionType.SaveDraft:
                messageResult = messages.confirmDraftMessage;
                break;

            case ActionType.Cancel:
                messageResult = messages.cancelMessage
                break;

            default:
                break;
        }

        return messageResult;
    }

    onButtonClick = (e) => {
        const type = e.target.getAttribute("fieldname");
        this.setState({ isShowModal: true, selectedAction: type });
    }

    handleModalHide = () => {
        this.setState({ isShowModal: false });
    }

    onConfirmProcess =() => {
        const {selectedAction} = this.state;
        switch (parseInt(selectedAction)) {
            case ActionType.SaveChange:
                const {onConfirmProcess} = this.props;
                if(onConfirmProcess)
                {
                    onConfirmProcess();
                }
                break;
            case ActionType.SaveDraft:
               
                break;

            case ActionType.Cancel:
               
                break;

            default:
                break;
        }
        this.setState({isShowModal: false});
    }

    render = () => {
        const { isShowModal, selectedAction } = this.state;
        const { className, enableDraft } = this.props;
        return (
            <>
                <div className={className}>
                    <button className="btn btn-success form-control mb-2 mt-2" fieldName={ActionType.SaveChange} onClick={this.onButtonClick}> <FontAwesomeIcon icon={faCheck} /> LƯU THAY ĐỔI</button>
                    {enableDraft && <button className="btn btn-warning form-control mb-2" fieldName={ActionType.SaveDraft} onClick={this.onButtonClick}> <FontAwesomeIcon icon={faShareSquare} /> LƯU NHÁP</button>}
                    <button className="btn btn-danger form-control mb-2" fieldName={ActionType.Cancel} onClick={this.onButtonClick}> <FontAwesomeIcon icon={faTimes} /> HỦY BỎ</button>
                </div>

                <Modal backdrop="static" show={isShowModal} centered onHide={this.handleModalHide}>
                    <Modal.Header >XÁC NHẬN</Modal.Header>
                    <Modal.Body>{this.getMessages(selectedAction)}</Modal.Body>
                    <Modal.Footer>
                        <div style={{width: "50%", display: "inline-flex"}} className="form-group">
                        <button className="btn btn-primary form-control" onClick={this.onConfirmProcess}>
                            LƯU
                        </button>
                        <button className="btn btn-danger form-control ml-1" onClick={this.handleModalHide}>
                            HỦY BỎ
                        </button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}