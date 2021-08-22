import { BaseListing } from "../../../Common/BaseListing";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NoDataTableContent } from "../../../Common/NoDataTableContent";
import { Modal } from "react-bootstrap";
import { Loading } from "../../../Common/loading/Loading";
import { AuthenticationManager } from "../../../../AuthenticationManager";

export class MemberTable extends BaseListing{

    generateRemoveModal =() => {
        const {showRemoveModal} = this.state;
        return(
            <Modal show={showRemoveModal} backdrop="static" centered>
                <Modal.Header>
                    XÁC NHẬN XÓA TÀI KHOẢN
                </Modal.Header>
                <Modal.Body>
                    <span>Chắc chắn xóa tài khoản khỏi phân quyền ?</span>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessRemoveUser}><FontAwesomeIcon icon={faCheck}/><span> Đồng ý</span></button>
                    <button className="btn btn-danger" onClick={this.onHideRemoveModal}><FontAwesomeIcon icon={faTimes}/><span> Hủy bỏ</span></button>
                </Modal.Footer>
            </Modal>
        )
    }

    onHideRemoveModal =() => {
        this.setState({showRemoveModal: false, userRoleId: null});
    }

    onProcessRemoveUser =() => {
        const {userRoleId} = this.state;
        const {onProcessRemoveUser} =this.props;
        if(!onProcessRemoveUser) return;
        onProcessRemoveUser(userRoleId);
        this.onHideRemoveModal();
    }

    generateContent =() => {
        const {data, onLoading, prefix} = this.state;
        return(
            <>
                <thead>
                    <tr>
                        <th>Mã Tài Khoản</th>
                        <th>Họ Tên</th>
                        <th>Email</th>
                        <th>Tên Đăng Nhập</th>
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
                               <tr>
                                   <td>{item.userCode}</td>
                                   <td>{item.fullName}</td>
                                   <td>{item.email}</td>
                                   <td>{item.userName}</td>
                                   <td>
                                       {AuthenticationManager.AllowEdit(prefix) && <button className="btn btn-danger" onClick={() => this.showRemoveUserModal(item.id)}><FontAwesomeIcon icon={faTrash}/></button>}
                                       
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

    showRemoveUserModal =(id) => {
        this.setState({showRemoveModal: true, userRoleId: id});
    }
}