import React from "react";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { InsuranceType } from "../../../administration/administration.category/Constants";
import { InsuranceCategoryService } from "../../../administration/administration.category/insurance/insuranceCategory.services";
import { CustomSelect } from "../../../Common/CustomSelect";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { Insurance, SectionState } from "../../Constanst";
import {Function} from '../../../Common/Constants';

export class EmployeeInsurance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: [
                { type: InsuranceType.SI, state: SectionState.NOT_CHANGE },
                { type: InsuranceType.SH , state: SectionState.NOT_CHANGE},
                { type: InsuranceType.SU , state: SectionState.NOT_CHANGE}],

            selectedTab: Insurance.SOCIAL,
            insurances: [],
            hospitals: []
        }
    }

    componentDidMount = () => {
        this.loadInsurances();
        this.loadSelectOptions(Function.LSEM108, 'hospitals');
        // const { model } = this.props;
        // this.setState({ model: model });
    }

    loadSelectOptions = (functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if (options) this.setState({ [stateName]: options });
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách");
        });
    }

    loadInsurances = () => {
        InsuranceCategoryService.getInsurances().then(
            response => {
                this.setState({ insurances: response.data });
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập vào danh sách");
            }
        );
    }

    onInputChange = (e, modelType) => {
        const fieldName = e.target.getAttribute("fieldname");
        const value = e.target.value;
        const { model } = this.state;
        const insTypeModel = model.find(x => x.type === modelType);
        const type = e.target.type;
        if (type === 'checkbox') {
            const checked = e.target.checked;
            const newModel = Object.assign({}, { ...insTypeModel, [fieldName]: checked, state: SectionState.CHANGED });
            this.onModelChange(newModel);
            return;
        }
        if (type === 'text' || type === 'textarea') {
            const value = e.target.value;
            const newModel = Object.assign({}, { ...insTypeModel, [fieldName]: value, state: SectionState.CHANGED });
            this.onModelChange(newModel);
            return;
        }
        const newModel = Object.assign({}, { ...insTypeModel, [fieldName]: value, state: SectionState.CHANGED });
        this.onModelChange(newModel);
    }

    onModelChange = (newModel) => {
        let model = this.state.model;
        model.splice(model.findIndex(x => x.type === newModel.type), 1, newModel);
        const { onModelChange } = this.props;
        if (onModelChange) {
            this.setState({ model: model }, onModelChange(model));
        }
    }

    onCustomModelChange = (value, stateName, insType) => {
        const { model } = this.state;
        const insModel = model.find(x => x.type === insType);
        const newModel = Object.assign({}, { ...insModel, [stateName]: value , state: SectionState.CHANGED});
        this.onModelChange(newModel);
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
                    {tab.map(item => {
                        return (
                            <label className={`${item.id === selectedTab ? 'border-bottom border-info text-info' : ''} ml-5 pb-2 pt-2"`} onClick={() => this.onChangeTab(item.id)}>
                                <b>{item.name}</b>
                            </label>
                        )
                    })
                    }
                </div>
                <div>
                    {selectedTab == Insurance.SOCIAL && this.renderSocial()}
                    {selectedTab == Insurance.HEALTH && this.renderHealth()}
                    {selectedTab == Insurance.UNEMPLOYMENT && this.renderUnemployment()}
                </div>

            </div>
        )
    }

    renderSocial = () => {
        const {insurances, model } = this.state;
        const siInsurances = insurances.filter(x => x.insType === InsuranceType.SI);
        const siModel = model.find(x => x.type === InsuranceType.SI);
        return (
            <div className="w-60 pt-4 pl-5">
                <div className="d-flex">
                    <label className="w-50">
                        Tham gia BHXH:
                        <CustomSelect data={siInsurances} selectedValue={siModel.insTypeId} labelField="siName" placeHolder="-Tham gia BHXH-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'insTypeId', InsuranceType.SI)} />
                    </label>
                    <label className="w-50 ml-4">
                        Ngày cấp:
                        <CustomDatePicker value={siModel.issueDate} onDateChange={value => this.onCustomModelChange(value, 'issueDate', InsuranceType.SI)} />
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <label className="w-50">
                        Số BHXH:
                        <input fieldname="insCode" value={siModel.insCode} onChange={e => this.onInputChange(e, InsuranceType.SI)} className="form-control" placeholder="Số BHXH"></input>
                    </label>
                    <label className="w-50 ml-4">
                        Người bàn giao:
                        <input fieldname="transferer" value={siModel.transferer} onChange={e => this.onInputChange(e, InsuranceType.SI)} className="form-control" placeholder="Người bàn giao"></input>
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <label className="w-50">
                        Ngày tham gia:
                        <CustomDatePicker value={siModel.joinDate} onDateChange={value => this.onCustomModelChange(value, 'joinDate', InsuranceType.SI)} />
                    </label>
                    <label className="w-50 ml-4">
                        Người nhận số:
                        <input fieldname="transferee" value={siModel.transferee} onChange={e => this.onInputChange(e, InsuranceType.SI)} className="form-control" placeholder="Người nhận số"></input>
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <div className="w-50">
                        <label className="w-100">
                            <input fieldname="isCo" checked={siModel.isCo} onChange={e => this.onInputChange(e, InsuranceType.SI)} type="checkbox" /> Đã nộp sổ cho công ty
                        </label>
                        <label className="w-100 mt-2">
                            <input fieldname="isNew" checked={siModel.isNew} onChange={e => this.onInputChange(e, InsuranceType.SI)} type="checkbox" /> Mở mới tại công ty
                        </label>
                    </div>
                    <label className="w-50 ml-4">
                        <input fieldname="isTransfer" checked={siModel.isTransfer} onChange={e => this.onInputChange(e, InsuranceType.SI)} type="checkbox" /> Đã bàn giao
                    </label>
                </div>
                <label className="w-100 ">
                    Ghi chú:
                    <textarea fieldname="note" onChange={e => this.onInputChange(e, InsuranceType.SI)} value={siModel.note} className="form-control" rows={5} placeholder="Ghi chú"></textarea>
                </label>
            </div>
        )
    }

    renderHealth = () => {
        const { hospitals, insurances, model } = this.state;
        const shInsurances = insurances.filter(x => x.insType === InsuranceType.SH);
        const shModel = model.find(x => x.type === InsuranceType.SH);
        return (
            <div className="w-60 pt-4 pl-5">
                <div className="d-flex">
                    <label className="w-50">
                        Tham gia BHYT:
                        <CustomSelect data={shInsurances} selectedValue={shModel.insTypeId} labelField="siName" placeHolder="-Tham gia BHYT-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'insTypeId', InsuranceType.SH)} />
                    </label>
                    <label className="w-50 ml-4">
                        Ngày cấp:
                        <CustomDatePicker value={shModel.issueDate} onDateChange={value => this.onCustomModelChange(value, 'issueDate', InsuranceType.SH)} />
                    </label>
                </div>
                <div className="d-flex mt-2">
                    <label className="w-50">
                        Số BHYT:
                        <input fieldname="insCode" value={shModel.insCode} onChange={e => this.onInputChange(e, InsuranceType.SH)} className="form-control" placeholder="Số BHYT"></input>
                    </label>
                    <label className="w-50 ml-4">
                        Nơi KCB ban đầu:
                        <CustomSelect data={hospitals} selectedValue={shModel.hospitalId} labelField="name" placeHolder="-Nơi KCB ban đầu-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'hospitalId', InsuranceType.SH)} />
                    </label>
                </div>
            </div>
        )
    }

    renderUnemployment = () => {
        const { model, insurances } = this.state;
        const suInsurances = insurances.filter(x => x.insType === InsuranceType.SU);
        const suModel = model.find(x => x.type === InsuranceType.SU);
        return (
            <div className="w-60 pt-4 pl-5">
                <div className="d-flex">
                    <label className="w-50">
                        Tham gia BHTN:
                        <CustomSelect data={suInsurances} selectedValue={suModel.insTypeId} labelField="siName" placeHolder="-Tham gia BHTN-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'insTypeId', InsuranceType.SU)} />
                    </label>
                    <label className="w-50 ml-4">
                        Ngày cấp:
                        <CustomDatePicker value={suModel.issueDate} onDateChange={value => this.onCustomModelChange(value, 'issueDate', InsuranceType.SU)} />
                    </label>
                </div>
                <div className="d-flex">
                    <label className="w-50 mt-2">
                        Số BHTN:
                        <input fieldname="insCode" value={suModel.insCode} onChange={e => this.onInputChange(e, InsuranceType.SU)} className="form-control" placeholder="Số BHTN"></input>
                    </label>
                    <label className="w-50 ml-4">
                    </label>
                </div>
            </div>
        )
    }

}

