import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { AccountTable } from "./AccountTable";
import { store } from 'react-notifications-component';
import { AddEditAccountModal } from "./AddEditAccountModal";
import { DeactiveAccountModal } from "./DeactiveAccountModal";
import { UnlockAccountModal } from "./UnlockAccountModal";
import { Mode } from "./Constant";
import RestClient from "../../../services/common/RestClient";
import { AccountServices } from "./Account.services";

export class AccountListing extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            accounts: [],
            showAddEditModal: false,
            showDeactiveModal: false,
            showUnlockModal: false,
            mode: Mode.CREATE,
            selectedAccount: {}
        }
    }

    componentDidMount =() => {
        this.loadData();

    }

    loadData =() => {
        const data = [
            { id: 1, code: "A001", userName:"phuoc.nguyen", firstName: "Nguyễn", lastName: "Hữu Phước", email: "huu.phuoc@yopmail.com", groupRoles: "ADMIN", isLocked: false, lockedDate: null, isActive: true, activeDate: (new Date()).toDateString() },
            { id: 2, code: "A002", userName: "truong.ho11", firstName: "Hồ", lastName: "Nhật Trường", email: "ho.truong@yopmail.com", groupRoles: "ADMIN", isLocked: true, lockedDate: (new Date()).toDateString(), isActive: true, activeDate: (new Date()).toDateString() },
            { id: 3, code: "A003", userName: "anh.tran04", firstName: "Trần", lastName: "Tuấn Anh", email: "anh.tran@yopmail.com", groupRoles: "ADMIN", isLocked: false, lockedDate: null, isActive: false, activeDate: (new Date()).toDateString() },
            { id: 4, code: "A004", userName: "hoang.au", firstName: "Âu", lastName: "Văn Hoàng", email: "au.hoang@yopmail.com", groupRoles: "ADMIN", isLocked: false, lockedDate: null, isActive: true, activeDate: (new Date()).toDateString() }
        ];
        this.setState({ accounts: data });
    }

    onShowCreateModal=()=> {
        // store.addNotification({
        //     title: "Wonderful!",
        //     message: "teodosii@react-notifications-component",
        //     type: "success",
        //     insert: "top",
        //     container: "bottom-right",
        //     animationIn: ["animate__animated", "animate__backInRight"],
        //     animationOut: ["animate__animated", "animate__fadeOut"],
        //     dismiss: {
        //       duration: 5000,
        //       onScreen: true
        //     }
        //   });
        this.setState({mode: Mode.CREATE, selectedAccount: {}, showAddEditModal: true});

          
    }

    render =() => {
        const {accounts, mode, showUnlockModal, showDeactiveModal, showAddEditModal, selectedAccount} = this.state;
        return (
            <>
                <div className="w-100 d-flex justify-content-end">
                    <input type="text" className="w-40 form-control" placeholder="Tìm kiếm..."/>
                    <button className="btn btn-primary ml-1"><FontAwesomeIcon icon={faSearch} /></button>
                    <button onClick={this.onShowCreateModal} className="btn btn-primary ml-1"><FontAwesomeIcon icon={faPlus}/> <span> Thêm mới</span></button>
                </div>
                <div className="w-100 mt-1">
                    <AccountTable data={accounts} onShowDeactiveModal={this.onShowDeactiveModal} onShowUnlockModal={this.onShowUnlockModal} onShowEditModal={this.onShowEditModal} />
                </div>
                {<DeactiveAccountModal model={selectedAccount} showModal={showDeactiveModal} onCancelProcess={this.onCancelProcessModal} onProcessConfirm={this.processDeactiveAccount}/>}
                {<UnlockAccountModal model={selectedAccount} showModal={showUnlockModal} onCancelProcess={this.onCancelProcessModal} onProcessConfirm={this.processUnlockAccount}/>}
                {<AddEditAccountModal mode={mode} model={selectedAccount} showModal={showAddEditModal} onCancelProcess={this.onCancelProcessModal} onProcessConfirm={this.processAddEditModal}/>}
            </>
        )
    }

    onShowDeactiveModal =(account) => {
        this.setState({selectedAccount: account, showDeactiveModal: true});
    }

    onShowUnlockModal =(account) => {
        this.setState({selectedAccount: account, showUnlockModal: true});

    }

    onShowEditModal =(account) => {
        this.setState({selectedAccount: account, showAddEditModal: true, mode: Mode.EDIT});
    }

    onCancelProcessModal= ()=> {
        this.setState({ selectedAccount: {}, showAddEditModal: false, showDeactiveModal: false, showUnlockModal: false});
    }

    processDeactiveAccount =() => {

    }

    processAddEditModal =(mode, model) => {
        if(mode === Mode.CREATE)
        {
            AccountServices.Create(model).then(result => {
                debugger;
                var a = result;
            }, error => {
                debugger;
                var a= error;
            });
        }

    }

    processUnlockAccount =()=> {

    }
}