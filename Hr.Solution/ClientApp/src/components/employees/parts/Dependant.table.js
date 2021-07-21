import { faCheck, faCheckCircle, faEdit, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BaseListing } from "../../Common/BaseListing";
import React from 'react';
import { Relation } from "../Constanst";
import { Modal } from "react-bootstrap";
import { DependantInformation } from "./Dependant.info";

export class DependantTable extends BaseListing{

    constructor(props)
    {
        super();
        this.state={
            showRemoveModal: false,
            removeItem: null,
            showEditModal: false,
            editModel: null
        }
    }
    

    onShowRemoveModal =(item) => {
        this.setState({showRemoveModal: true, removeItem: item});
    }

    onHideRemoveModal =() => {
        this.setState({showRemoveModal: false, removeItem: null});
    }

    onProcessRemoveItem =() => {
        const {removeItem} = this.state;
        if(!removeItem) return;

        const {onProcessRemoveItem} = this.props;
        onProcessRemoveItem(removeItem);
        this.onHideRemoveModal();

    }

    generateRemoveModal =() => {
        const {removeItem, showRemoveModal} = this.state;
        return (
            <Modal show={showRemoveModal} backdrop="static" centered>
                <Modal.Header>Xóa người phụ thuộc</Modal.Header>
                <Modal.Body>
                    Xác nhận xóa người phụ thuộc <b>{`${removeItem?.firstName} ${removeItem?.lastName}`}</b> ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessRemoveItem}><FontAwesomeIcon icon={faCheck} /> Xác nhận</button>
                    <button className="btn btn-danger" onClick={this.onHideRemoveModal}><FontAwesomeIcon icon={faTimes}/> Hủy bỏ</button>
                </Modal.Footer>
            </Modal>
        )
    }

    onShowEditModal=(item) => {
        this.setState({showEditModal: true, editModel: item});
    }
    
    onHideEditModal=(item) => {
        this.setState({showEditModal: false, editModel: null});
    }

    onProcessEditModel =()=> {

    }

    generaEditModal=()=> {
        const {showEditModal, editModel} = this.state;
        return (
            <Modal show={showEditModal} backdrop="static" centered>
                <Modal.Header>Sửa thông tin người phụ thuộc</Modal.Header>
                <Modal.Body>
                    <DependantInformation model={editModel}/>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessEditModel}><FontAwesomeIcon icon={faEdit}/> Xác nhận</button>
                    <button className="btn btn-danger" onClick={this.onHideEditModal}><FontAwesomeIcon icon={faTimes}/> Hủy bỏ</button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateContent =() => {
        const {data} = this.state;
        return(
            <>
            <thead>
                <tr>
                <th>Mã Số</th>
                <th>Họ & Tên</th>
                <th>Năm Sinh</th>
                <th>Địa chỉ</th>
                <th>Quan hệ</th>
                <th>Điện thoại</th>
                <th>Tính thuế</th>
                <th></th>
                </tr>
            </thead>
            <tbody style={{maxWidth:'500px', overflowY: 'auto'}}>
              {data && data.length >0  && data.map((item, index) => {
                  return (
                      <tr>
                          <td>{item.code}</td>
                          <td>{`${item.firstName} ${item.lastName}`}</td>
                          <td>{item.yearOfBirth}</td>
                          <td>{item.address}</td>
                          <td>{Relation.All.find(x => x.id === item.relation).name}</td>
                          <td>{item.phone}</td>
                          <td className="align-middle" style={{textAlign: "center"}}>{item.isTax ? <FontAwesomeIcon className="text-success" icon={faCheckCircle}/> : null }</td>
                          <td>
                              <button className="btn btn-info" onClick={() => this.onShowEditModal(item)}><FontAwesomeIcon icon={faEdit}/></button>
                              <button fieldValue={item.id} onClick={() => this.onShowRemoveModal(item)} className="btn btn-danger ml-2"><FontAwesomeIcon icon={faTrash}/></button>
                          </td>
                      </tr>
                  )
              })} 
              {(!data || data.length ===0) && <tr>
                  <td colSpan={8}><b>Không có dữ liệu.</b></td>
                  </tr>} 
            </tbody>
            {this.generateRemoveModal()}
            {this.generaEditModal()}
            </>
        )
    }
}