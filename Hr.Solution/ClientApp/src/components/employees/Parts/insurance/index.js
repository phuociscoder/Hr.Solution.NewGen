import React from "react";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { CustomSelect } from "../../../Common/CustomSelect";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { Insurance } from "../../Constanst";

export class EmployeeInsurance extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            model: {},
            selectedTab: Insurance.SOCIAL,
            joinSocialInsurance: [],
            joinHealthInsurance: [],
            placeOfMedical: [],
            joinUnemploymentInsurance: [],
        }
    }

    componentDidMount = () => {
        // tham gia BHXH
        // this.loadSelectOptions(Function.LSEM149, 'joinSocialInsurance');
        // tham gia BHYT
        // this.loadSelectOptions(Function.LSTS100, 'joinHealthInsurance');
        // nơi KCB ban đầu
        // this.loadSelectOptions(Function.LSEM125, 'placeOfMedical');
        // tham gia BHTN
        // this.loadSelectOptions(Function.LSEM125, 'joinUnemploymentInsurance');
        const { model } = this.props;
        this.setState({ model: model });
    }

    loadSelectOptions = (functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if (options) this.setState({ [stateName]: options });
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách");
        });
    }

    onInputChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        const { model } = this.state;
        const type = e.target.type;
        if (type === 'checkbox') {
            const checked = e.target.checked;
            const newModel = Object.assign({}, { ...model, [fieldName]: checked });
            this.onInsuranceChange(newModel);
            return;
        }
        if (type === 'text' || type === 'textarea') {
            const value = e.target.value;
            const newModel = Object.assign({}, { ...model, [fieldName]: value });
            this.onInsuranceChange(newModel);
            return;
        }
        const newModel = Object.assign({}, { ...model, [fieldName]: value });
        this.onInsuranceChange(newModel);
    }

    onInsuranceChange = (newModel) => {
        const { onModelChange } = this.props;
        if (onModelChange) {
            this.setState({ model: newModel }, onModelChange(newModel));
        }
    }

    onCustomModelChange = (value, stateName) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, [stateName]: value });
        this.onInsuranceChange(newModel);
    }

    onChangeTab = (tabId) => {
        this.setState({ selectedTab: tabId });
    }

    onSummitOrCreateSocialChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const checked = e.target.checked;
        const isSummit = checked && fieldName === "isSubmitCompany";
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, isSubmitCompany: isSummit, isCreateAtCompany: !isSummit });
        this.onInsuranceChange(newModel);
    }

    render = () => {
        const tab = Insurance.ALL;
        const { selectedTab } = this.state;
        return (
            <div>
                <div className="border-bottom">
                { tab.map(item => {
                    return(
                        <label className={`${item.id === selectedTab ? 'border-bottom border-info text-info' : ''} ml-5 pb-2 pt-2"`} onClick={() => this.onChangeTab(item.id)}>
                            <b>{item.name}</b>
                        </label>
                    )
                    })
                }
                </div>
                <div>
                    { selectedTab == Insurance.SOCIAL && this.renderSocial() }
                    { selectedTab == Insurance.HEALTH && this.renderHealth() }
                    { selectedTab == Insurance.UNEMPLOYMENT && this.renderUnemployment() }
                </div>

            </div>
        )
    }

    renderSocial = () => {
        const { joinSocialInsurance } = this.state;
        const { joinSocialInsuranceId, dateOfSocialInsurance, socialInsuranceNumber, handOverPersonSocialIn, takeOverPersonSocialIn, joinDateSocialInsurance, isHandedOver, isSubmitCompany, isCreateAtCompany, noteSocialInsurance } = this.state.model;
        return (
            <div className="w-60 pt-4 pl-5">
                <div className="d-flex">
                    <label className="w-50">
                        Tham gia BHXH:
                        <CustomSelect data={joinSocialInsurance} selectedValue={joinSocialInsuranceId} labelField="name" placeHolder="-Tham gia BHXH-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'joinSocialInsuranceId')} />
                    </label>
                    <label className="w-50 ml-4">
                        Ngày cấp:
                        <CustomDatePicker value={dateOfSocialInsurance} onDateChange={value => this.onCustomModelChange(value, 'dateOfSocialInsurance')} />
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <label className="w-50">
                        Số BHXH:
                        <input fieldname="socialInsuranceNumber" value={socialInsuranceNumber} onChange={this.onInputChange} className="form-control" placeholder="Số BHXH"></input>
                    </label>
                   <label className="w-50 ml-4">
                        Người bàn giao:
                        <input fieldname="handOverPersonSocialIn" value={handOverPersonSocialIn} onChange={this.onInputChange} className="form-control" placeholder="Người bàn giao"></input>
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <label className="w-50">
                        Ngày tham gia:
                        <CustomDatePicker value={joinDateSocialInsurance} onDateChange={value => this.onCustomModelChange(value, 'joinDateSocialInsurance')} />
                    </label>
                   <label className="w-50 ml-4">
                        Người nhận số:
                        <input fieldname="takeOverPersonSocialIn" value={takeOverPersonSocialIn} onChange={this.onInputChange} className="form-control" placeholder="Người nhận số"></input>
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <div className="w-50">
                        <label className="w-100">
                            <input fieldname="isSubmitCompany" checked={isSubmitCompany} onChange={this.onSummitOrCreateSocialChange} type="checkbox" /> Đã nộp sổ cho công ty
                        </label>
                        <label className="w-100 mt-2">
                            <input fieldname="isCreateAtCompany" checked={isCreateAtCompany} onChange={this.onSummitOrCreateSocialChange} type="checkbox" /> Mở mới tại công ty
                        </label>
                    </div>
                    <label className="w-50 ml-4">
                        <input fieldname="isHandedOver" checked={isHandedOver} onChange={this.onInputChange} type="checkbox" /> Đã bàn giao
                    </label>
                </div>
                <label className="w-100 ">
                    Ghi chú:
                    <textarea fieldname="noteSocialInsurance" onChange={this.onInputChange} value={noteSocialInsurance} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                </label>
            </div>
        )
    }

    renderHealth = () => {
        const { joinHealthInsurance, placeOfMedical } = this.state;
        const { joinHealthInsuranceId, dateOfHealthInsurance, healthInsuranceNumber, placeOfMedicalId } = this.state.model;
        return (
            <div className="w-60 pt-4 pl-5">
                <div className="d-flex">
                    <label className="w-50">
                        Tham gia BHYT:
                        <CustomSelect data={joinHealthInsurance} selectedValue={joinHealthInsuranceId} labelField="name" placeHolder="-Tham gia BHYT-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'joinHealthInsuranceId')} />
                    </label>
                    <label className="w-50 ml-4">
                        Ngày cấp:
                        <CustomDatePicker value={dateOfHealthInsurance} onDateChange={value => this.onCustomModelChange(value, 'dateOfHealthInsurance')} />
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <label className="w-50">
                        Số BHYT:
                        <input fieldname="healthInsuranceNumber" value={healthInsuranceNumber} onChange={this.onInputChange} className="form-control" placeholder="Số BHYT"></input>
                    </label>
                   <label className="w-50 ml-4">
                        Nơi KCB ban đầu:
                        <CustomSelect data={placeOfMedical} selectedValue={placeOfMedicalId} labelField="name" placeHolder="-Nơi KCB ban đầu-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'placeOfMedicalId')} />
                    </label>
                </div>
            </div>
        )
    }

    renderUnemployment = () => {
        const { joinUnemploymentInsurance } = this.state;
        const { joinUnemploymentInsuranceId, dateOfUnemploymentInsurance, unemploymentInsuranceNumber } = this.state.model;
        return (
            <div className="w-60 pt-4 pl-5">
                <div className="d-flex">
                    <label className="w-50">
                        Tham gia BHTN:
                        <CustomSelect data={joinUnemploymentInsurance} selectedValue={joinUnemploymentInsuranceId} labelField="name" placeHolder="-Tham gia BHTN-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'joinUnemploymentInsuranceId')} />
                    </label>
                    <label className="w-50 ml-4">
                        Ngày cấp:
                        <CustomDatePicker value={dateOfUnemploymentInsurance} onDateChange={value => this.onCustomModelChange(value, 'dateOfUnemploymentInsurance')} />
                    </label>
                </div>
                <div className="d-flex">
                    <label className="w-50 mt-2">
                        Số BHTN:
                        <input fieldname="unemploymentInsuranceNumber" value={unemploymentInsuranceNumber} onChange={this.onInputChange} className="form-control" placeholder="Số BHTN"></input>
                    </label>
                    <label className="w-50 ml-4">
                    </label>
                </div>
            </div>
        )
    }

}
