import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal } from "react-bootstrap";

export class UnlockAccountModal extends React.Component{
    constructor(props)
    {
        super(props);
        this.state ={
            showModal: false,
            model : null
        }
    }
    componentDidMount =() => {
        const {showModal, model} = this.props;
         if(showModal)
         {
             this.setState({showModal});
         }

         if(model)
         {
             this.setState({model});
         }
    }

    handleHideModal =() => {
        const {onCancelProcess} = this.props;
        this.setState({showModal : false}, onCancelProcess());
    }

    onProcessConfirm =() => {
        const {onProcessConfirm} = this.props;
        onProcessConfirm(this.state.model);
        this.handleHideModal();
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.model != nextProps.model)
        {
            this.setState({model: nextProps.model});
        }

        if(this.props.showModal != nextProps.showModal)
        {
            this.setState({showModal: nextProps.showModal});
        }
        return true;
    }

    render =() => {
        const {showModal, model} = this.state;
        return (
            <Modal show={showModal} backdrop="static" centered onHide={this.handleHideModal}>
                <Modal.Header>
                    XÁC NHẬN
                </Modal.Header>
                <Modal.Body>
                    Bạn chắc chắn muốn mở khóa tài khoản ?
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.onProcessConfirm} className="btn btn-primary"><FontAwesomeIcon icon={faCheck}/><span> Đồng ý</span></button>
                    <button className="btn btn-danger ml-2" onClick={this.handleHideModal}><FontAwesomeIcon icon={faTimes}/><span> Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }
}