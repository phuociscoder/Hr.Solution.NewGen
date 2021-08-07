
import { BaseListing } from "../../Common/BaseListing";
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faEdit, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { NoDataTableContent } from "../../Common/NoDataTableContent";

export class AccountTable extends BaseListing {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

    }
    componentDidMount= ()=> {
        const {data} = this.props;
        if(data)
        {
            this.setState({data});
        }
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.data != nextProps.data)
        {
            this.setState({data: nextProps.data});
        }
        return true;
    }

    onShowDeactiveModal =(account) => {
        const {onShowDeactiveModal} = this.props;
        if(onShowDeactiveModal)
        {
            onShowDeactiveModal(account);
        }
    }

    onShowUnlockModal= (account) => {
        const {onShowUnlockModal} = this.props;
        if(onShowUnlockModal){
            onShowUnlockModal(account);
        }
    }

    onShowEditModal =(account) => {
        const {onShowEditModal} = this.props;
        if(onShowEditModal)
        {
            onShowEditModal(account);
        }
    }

    generateContent = () => {
        const { data } = this.state;
        return (
            <>
                <thead>
                    <tr>
                        <th >Mã Tài Khoản</th>
                        <th className="w-15">Họ & Tên</th>
                        <th className="w-15">Email</th>
                        <th>Nhóm Quyền</th>
                        <th className="w-10">Đang Hoạt Động</th>
                        <th>Bị Khóa</th>
                        <th>Ngày Khóa</th>
                        <th>Ngày Hiệu Lực</th>
                        <th className="w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 && data.map((item, index) => {
                        return (
                            <tr>
                                <td>{item.code}</td>
                                <td>{`${item.firstName} ${item.lastName}`}</td>
                                <td>{item.email}</td>
                                <td>{item.groupRoles}</td>
                                <td style={{ alignContent: "center" }}>
                                    {item.isActive ?
                                     <div className="w-100 d-flex justify-content-center"> 
                                            <FontAwesomeIcon icon={faCheckCircle} color="green" /></div> :
                                            null}
                                </td>
                                <td style={{ alignContent: "center" }}>{item.isLocked ? 
                                    <div className="w-100 d-flex justify-content-center">
                                    <FontAwesomeIcon icon={faLock} color="red" /></div>
                                     : null}
                                </td>
                                <td>{item.lockedDate}</td>
                                <td>{item.activeDate}</td>
                                <td>
                                    <div className="d-flex w-100 justify-content-center">
                                        <button onClick={() => this.onShowEditModal(item)}  data-tip="Chỉnh sửa tài khoản" className="btn btn-info"><FontAwesomeIcon icon={faEdit} /></button>
                                        <button onClick={() => this.onShowUnlockModal(item)} disabled={!item.isLocked} data-tip="Mở khóa tài khoản" className="btn btn-success ml-2"><FontAwesomeIcon icon={faLockOpen} /></button>
                                        <button onClick={() => this.onShowDeactiveModal(item)} data-tip="Vô hiệu hóa tài khoản" className="btn btn-danger ml-2"><FontAwesomeIcon icon={faBan} /></button>
                                        <ReactTooltip />
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    {(!data || data.length === 0) &&
                       <NoDataTableContent colspan={9} />
                    }
                </tbody>
            </>
        )
    }

}