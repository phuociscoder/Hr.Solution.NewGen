import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { AccountTable } from "./AccountTable";
import { AddEditAccountModal } from "./AddEditAccountModal";
import { DeactiveAccountModal } from "./DeactiveAccountModal";
import { UnlockAccountModal } from "./UnlockAccountModal";
import { Mode } from "./Constant";
import { AccountServices } from "./Account.services";
import { ShowNotification } from "../../Common/notification/Notification";
import { NotificationType } from "../../Common/notification/Constants";
import { debounce } from "lodash";
import { AuthenticationManager } from "../../../AuthenticationManager";
import { CustomTable, HTable } from "../../Common/CustomTable";

export class AccountListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            showAddEditModal: false,
            showDeactiveModal: false,
            showUnlockModal: false,
            mode: Mode.CREATE,
            selectedAccount: {}
        }
    }

    componentDidMount = () => {
        const { prefix } = this.props;
        this.setState({ prefix: prefix }, this.loadUsers());
    }

    loadUsers = (freeText) => {
        this.setState({ loading: true });
        AccountServices.GetAll({ freeText: freeText ?? '' })
            .then(response => {
                this.setState({ accounts: response.data, loading: false });
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể truy cập danh sách người dùng");
                this.setState({ loading: false });
            })
    }

    onShowCreateModal = () => {
        this.setState({ mode: Mode.CREATE, selectedAccount: {}, showAddEditModal: true });
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        this.setState({ searchText: value }, this.onDebouceSearchUsers(value));
    }

    onDebouceSearchUsers = debounce((value) => this.loadUsers(value), 1000);

    render = () => {
        const { prefix, accounts, mode, showUnlockModal, showDeactiveModal, showAddEditModal, selectedAccount, loading } = this.state;
        return (
            <div className="h-100">
                <div className="w-100 h-4 d-flex align-items-center justify-content-end">
                    <input type="text" className="w-30 form-control" onChange={this.onSearchTextChange} placeholder="Tìm kiếm..." />
                    {AuthenticationManager.AllowAdd(prefix) &&
                        <button onClick={this.onShowCreateModal} className="btn btn-primary ml-2"><FontAwesomeIcon icon={faPlus} /> <span> Thêm mới</span></button>
                    }
                </div>
                <div className="w-100 mt-1 h-96">
                    {/* <AccountTable prefix={prefix} loading={loading} data={accounts} onShowDeactiveModal={this.onShowDeactiveModal} onShowUnlockModal={this.onShowUnlockModal} onShowEditModal={this.onShowEditModal} /> */}
                    <HTable/>
                </div>
                {<DeactiveAccountModal model={selectedAccount} showModal={showDeactiveModal} onCancelProcess={this.onCancelProcessModal} onProcessConfirm={this.processDeactiveAccount} />}
                {<UnlockAccountModal model={selectedAccount} showModal={showUnlockModal} onCancelProcess={this.onCancelProcessModal} onProcessConfirm={this.processUnlockAccount} />}
                {<AddEditAccountModal mode={mode} model={selectedAccount} showModal={showAddEditModal} onCancelProcess={this.onCancelProcessModal} onProcessConfirm={this.processAddEditModal} />}
            </div>
        )
    }

    onShowDeactiveModal = (account) => {
        this.setState({ selectedAccount: account, showDeactiveModal: true });
    }

    onShowUnlockModal = (account) => {
        this.setState({ selectedAccount: account, showUnlockModal: true });
    }

    onShowEditModal = (account) => {
        this.setState({ selectedAccount: account, showAddEditModal: true, mode: Mode.EDIT });
    }

    onCancelProcessModal = () => {
        this.setState({ selectedAccount: {}, showAddEditModal: false, showDeactiveModal: false, showUnlockModal: false });
    }

    processDeactiveAccount = (model) => {
        AccountServices.Delete(model.id)
            .then(response => {
                ShowNotification(NotificationType.SUCCESS, "Xóa người dùng thành công");
                const { searchText } = this.state;
                this.loadUsers(searchText);
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể xóa người dùng");
            })
    }

    processAddEditModal = (mode, model) => {
        if (mode === Mode.CREATE) {
            AccountServices.Create(model).then(response => {
                if (response.data) {
                    ShowNotification(NotificationType.SUCCESS, `${mode === Mode.CREATE ? 'Thêm' : 'Thay đổi thông tin'} người dùng thành công`);
                    this.setState({ selectedAccount: {}, searchText: '', showAddEditModal: false }, this.loadUsers(null));
                }
            }, error => {
                ShowNotification(NotificationType.ERROR, `Có lỗi xảy ra ! Không thể ${mode === Mode.CREATE ? 'thêm' : 'thay đổi thông tin'} người dùng.`)
            });
        } else {
            AccountServices.Update(model.id, model)
                .then(response => {
                    if (response.data) {
                        ShowNotification(NotificationType.SUCCESS, `${mode === Mode.CREATE ? 'Thêm' : 'Thay đổi thông tin'} người dùng thành công`);
                        this.setState({ selectedAccount: {}, searchText: '', showAddEditModal: false }, this.loadUsers(null));
                    }
                }, error => {
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể cập nhật thông tin người dùng");
                })
        }
    }
}