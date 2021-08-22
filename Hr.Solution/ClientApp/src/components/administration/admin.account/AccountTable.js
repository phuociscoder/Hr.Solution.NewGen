
import { BaseListing } from "../../Common/BaseListing";
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheck, faCheckCircle, faEdit, faLock, faLockOpen, faTrash } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import { NoDataTableContent } from "../../Common/NoDataTableContent";
import { DateTimeUltils } from "../../Utilities/DateTimeUltis";
import {Loading} from '../../Common/loading/Loading';
import { Image } from "react-bootstrap";
import NoAvatar from '../../../assets/no-avatar.jpg';
import { AuthenticationManager } from "../../../AuthenticationManager";

export class AccountTable extends BaseListing {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }

    }
    componentDidMount = () => {
        const { data, prefix } = this.props;
        if (data) {
            this.setState({ data });
        }
        if(prefix)
        {
            this.setState({prefix: prefix});
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.data !== nextProps.data) {
            this.setState({ data: nextProps.data });
        }
        if(this.props.prefix !== nextProps.prefix)
        {
            this.setState({prefix: nextProps.prefix});
        }

        if(this.props.loading !== nextProps.loading)
        {
            this.setState({loading: nextProps.loading});
        }
        return true;
    }

    onShowDeactiveModal = (account) => {
        const { onShowDeactiveModal } = this.props;
        if (onShowDeactiveModal) {
            onShowDeactiveModal(account);
        }
    }

    onShowUnlockModal = (account) => {
        const { onShowUnlockModal } = this.props;
        if (onShowUnlockModal) {
            onShowUnlockModal(account);
        }
    }

    onShowEditModal = (account) => {
        const { onShowEditModal } = this.props;
        if (onShowEditModal) {
            onShowEditModal(account);
        }
    }

    generateContent = () => {
        const { data, loading, prefix } = this.state;
        return (
            <>
                <thead>
                    <tr>
                        <th className="w-5" >Mã TK</th>
                        <th className="w-15">Họ & Tên</th>
                        <th className="w-10">Tên Đăng Nhập</th>
                        <th className="w-15">Email</th>
                        <th>Nhóm Phân Quyền</th>
                        <th>Vùng Dữ Liệu</th>
                        <th className="w-5">Hoạt Động</th>
                        <th className="w-5">Quản Trị</th>
                        <th className="w-5">Bị Khóa</th>
                        <th>Ngày Hiệu Lực</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading && 
                        <tr>
                            <td colSpan={11}>
                                <div className="w-100 d-flex justify-content-center">
                                    <Loading show={true} />
                                </div>
                            </td>
                        </tr>
                    }
                    {!loading && data && data.length > 0 && data.map((item, index) => {
                        return (
                            <tr>
                                <td>{item.code}</td>
                                <td><div className="w-100 d-flex align-items-center">
                                    <Image src={item.avatar ?? NoAvatar} width={45} height={50} className="shadow"/>
                                    <span className="ml-2">{item.fullName}</span>
                                </div>
                                </td>
                                <td>{item.userName}</td>
                                <td>{item.email}</td>
                                <td>{item.systemRoles}</td>
                                <td>{item.dataDomains}</td>
                                <td style={{ alignContent: "center" }}>
                                    <div className="w-100 d-flex justify-content-center">
                                        <FontAwesomeIcon icon={faCheckCircle} color={item.isActive ? 'green' : 'lightgrey'} /></div>
                                </td>
                                <td style={{ alignContent: "center" }}>
                                        <div className="w-100 d-flex justify-content-center">
                                            <FontAwesomeIcon icon={faCheckCircle} color={item.isAdmin ? 'green' : 'lightgrey'} /></div> 
                                </td>
                                <td style={{ alignContent: "center" }}>
                                    <div className="w-100 d-flex justify-content-center">
                                        <FontAwesomeIcon icon={faCheckCircle} color={item.isLock ? 'red' : 'lightgrey'} /></div>
                                </td>
                                <td>{DateTimeUltils.toDateString(item.validDate)}</td>
                                <td>
                                    <div className="d-flex w-100 justify-content-center"> 
                                    {AuthenticationManager.AllowEdit(prefix) &&<button onClick={() => this.onShowEditModal(item)} className="btn btn-info"><FontAwesomeIcon icon={faEdit} /></button>}
                                    {AuthenticationManager.AllowDelete(prefix) &&<button onClick={() => this.onShowDeactiveModal(item)} className="btn btn-danger ml-2"><FontAwesomeIcon icon={faTrash} /></button>}
                                        <ReactTooltip />
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                    {!loading && (!data || data.length === 0) &&
                        <NoDataTableContent colspan={11} />
                    }
                </tbody>
            </>
        )
    }

}