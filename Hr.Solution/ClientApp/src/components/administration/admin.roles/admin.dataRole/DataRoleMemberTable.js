import { BaseListing } from "../../../Common/BaseListing";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NoDataTableContent } from "../../../Common/NoDataTableContent";
import { Modal } from "react-bootstrap";
import { Loading } from "../../../Common/loading/Loading";

export class DataRoleMemberTable extends BaseListing{

    generateRemoveModal =() => {
        const {showRemoveModal} = this.state;
        return(
            <Modal show={showRemoveModal} backdrop="static" centered>
                <Modal.Header>
                    XÁC NHẬN XÓA PHÂN QUYỀN
                </Modal.Header>
                <Modal.Body>
                    <span>Chắc chắn xóa phân quyền khỏi vùng dữ liệu ?</span>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessRemoveRole}><FontAwesomeIcon icon={faCheck}/><span> Đồng ý</span></button>
                    <button className="btn btn-danger" onClick={this.onHideRemoveModal}><FontAwesomeIcon icon={faTimes}/><span> Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    onHideRemoveModal =() => {
        this.setState({showRemoveModal: false, id: null});
    }

    onProcessRemoveRole =() => {
        const {id} = this.state;
        const {onProcessRemoveRole} =this.props;
        if(!onProcessRemoveRole) return;
        onProcessRemoveRole(id);
        this.onHideRemoveModal();
    }

    generateContent =() => {
        const {data, onLoading} = this.state;
        return(
            <>
                <thead>
                    <tr>
                        <th>Mã Phân Quyền</th>
                        <th>Tên Phân Quyền</th>
                        <th>Tên Thay Thế</th>
                        <th>Bị Khóa</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="animate__animated animate__fadeIn">
                    {
                        onLoading && 
                        <tr>
                            <td className="text-center" colspan={5}>
                                <Loading show={true}/> 
                            </td>
                        </tr>
                    }
                    {
                      !onLoading && data && data.length >0 && data.map((item, index) => {
                           return (
                               <tr key={item.id}>
                                   <td>{item.roleCode}</td>
                                   <td>{item.roleName}</td>
                                   <td>{item.roleSubName}</td>
                                   <td>{item.lock}</td>
                                   <td>
                                       <button className="btn btn-danger" onClick={() => this.showRemoveRoleModal(item.id)}><FontAwesomeIcon icon={faTrash}/></button>
                                   </td>
                               </tr>
                           )
                       })
                    }
                    {
                       !onLoading && (!data || data.length ===0) && <NoDataTableContent colspan={5}/>
                    }
                </tbody>
                {this.generateRemoveModal()}
            </>
        )
    }

    showRemoveRoleModal =(id) => {
        this.setState({showRemoveModal: true, id: id});
    }
}