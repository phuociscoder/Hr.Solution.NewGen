import React from "react";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { Function } from "../../../Common/Constants";
import { CustomSelect } from "../../../Common/CustomSelect";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";

export class EmployeeTimekeeperInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: {}
        }
    }

    componentDidMount = () => {
        this.loadSelectOptions(Function.LSEM149, 'employeeTypeDropdown');
        this.loadSelectOptions(Function.LSTS100, 'shiftDropdown');
        this.loadSelectOptions(Function.LSEM125, 'weekOffDropdown');
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
            this.onGeneralInfoChange(newModel);
            return;
        }
        const newModel = Object.assign({}, { ...model, [fieldName]: value });
        this.onGeneralInfoChange(newModel);
    }

    onGeneralInfoChange = (newModel) => {
        const { onModelChange } = this.props;
        if (onModelChange) {
            this.setState({ model: newModel }, onModelChange(newModel));
        }
    }

    onCustomModelChange = (value, stateName) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, [stateName]: value });
        this.onGeneralInfoChange(newModel);
    }

    render = () => {
        const { employeeTypeDropdown, shiftDropdown, weekOffDropdown } = this.state;
        const { joinDate, dateFormal, employeeTypeId, barCode, leaveGroupId, shiftId, altShift, isNotlateEarly, isNotScan, isNotOTKow } = this.state.model;
        return (
            <div className="w-100">
                <div className="w-30 ml-4">
                    <label className="w-100 text-camelcase">
                        Ngày vào làm:
                        <CustomDatePicker value={joinDate} onDateChange={value => this.onCustomModelChange(value, 'joinDate')} />
                    </label>
                    <label className="w-100 mt-3 text-camelcase">
                        Ngày thành nhân viên chính thức:
                        <CustomDatePicker value={dateFormal} onDateChange={value => this.onCustomModelChange(value, 'dateFormal')} />
                    </label>
                    <label className="w-100 mt-3 text-camelcase">
                        Loại nhân viên:
                        <CustomSelect selectedValue={employeeTypeId} data={employeeTypeDropdown} labelField="name" placeHolder="-Chọn loại nhân viên-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'employeeTypeId')} />
                    </label>
                </div>
                <div className="mt-4 pl-4 pt-3 w-80">
                    <h4>THÔNG TIN CHẤM CÔNG</h4>
                    <div className="d-flex">
                        <div className="w-40">
                            <label className="w-100">
                                Mã chấm công:
                                <input fieldname="barCode" value={barCode} onChange={this.onInputChange} className="form-control" placeholder="Mã chấm công"></input>
                            </label>
                            <label className="w-100 mt-2">
                                Nhóm ngày nghỉ tuần:
                                <CustomSelect data={weekOffDropdown} selectedValue={leaveGroupId} labelField="name" placeHolder="-Chọn loại Nhóm ngày nghỉ tuần-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'leaveGroupId')} />
                            </label>
                        </div>
                        <div className="w-40 ml-4">
                            <label className="w-100">
                                Ca làm việc:
                                <CustomSelect data={shiftDropdown} selectedValue={shiftId} labelField="name" placeHolder="-Chọn loại ca làm việc-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'shiftId')} />
                            </label>
                            <label className="mt-3 w-100">
                                <input fieldname="altShift" checked={altShift} onChange={this.onInputChange} type="checkbox" /> Ca làm việc thay đổi
                            </label>
                            <label className="mt-1 w-100">
                                <input fieldname="isNotlateEarly" checked={isNotlateEarly} onChange={this.onInputChange} type="checkbox" /> Không tính đi trễ về sớm
                            </label>
                            <label className="mt-1 w-100">
                                <input fieldname="isNotScan" checked={isNotScan} onChange={this.onInputChange} type="checkbox" /> Không cần quét thẻ
                            </label>
                            <label className="mt-1 w-100">
                                <input fieldname="isNotOTKow" checked={isNotOTKow} onChange={this.onInputChange} type="checkbox" /> Không tính công ngoài giờ
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}