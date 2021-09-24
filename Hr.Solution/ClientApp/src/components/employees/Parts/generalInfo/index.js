import React from "react";
import { ImageUploader } from "../../../Common/ImageUploader";
import { CustomDatePicker } from "../../../Common/DatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMars } from "@fortawesome/free-solid-svg-icons";
import { DepartmentSelect } from "../../../Common/DepartmentSelect/DepartmentSelect";
import { CardGroup } from "react-bootstrap";
import { Mode } from "../../Constanst";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { Function } from "../../../Common/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { NotificationType } from "../../../Common/notification/Constants";
import { CustomSelect } from "../../../Common/CustomSelect";

export class EmployeeGeneralInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: {},
            mode: Mode.Create
        }
    }

    // shouldComponentUpdate =(nextProps) => {
    //     if(this.props.model !== nextProps.model)
    //     {
    //         this.setState({model : nextProps.model});
    //     }
    // }

    onGeneralInfoChange = (newModel) => {
        const { onModelChange } = this.props;
        if (onModelChange) {
            this.setState({ model: newModel }, onModelChange(newModel));
        }
    }

    componentDidMount = () => {
        this.loadSelectOptions(Function.LSEM142, 'jobPositions');
        this.loadSelectOptions(Function.LSEM100, 'nations');
        this.loadSelectOptions(Function.LSEM122, 'religions');
        this.loadSelectOptions(Function.LSEM121, 'marialStatuses');
        this.loadSelectOptions(Function.LSEM144, 'educations');

        const {model} = this.props;
        if(model){
            this.setState({model: model});
        }
    }

    onModelChange = (e) => {
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

    onGenderChange = (e) => {
        const fieldName = e.target.getAttribute("fieldname");
        const checked = e.target.checked;
        const isMale = checked && fieldName === "male";
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, isMale: isMale });
        this.onGeneralInfoChange(newModel);
    }

    loadSelectOptions = (functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if (options) this.setState({ [stateName]: options });
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách chức vụ");
        });
    }

    onCustomModelChange = (value, stateName) => {
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, [stateName]: value });
        this.onGeneralInfoChange(newModel);
    }

    render = () => {
        const { code, firstName, lastName, isMale, dOb, tAddress, pAddress, education, eduNote, departmentId, jobPosId, isManager, nationId,
            religionId, mariageStatusId, phoneNumber, faxNumber, email, joinDate, isActive, idCardNo, idCardNoPlace, idCardNoDate, passportNo,
            passportNoPlace, passportNoDate, taxNo, taxNoPlace, taxNoDate, note, photo } = this.state.model;

        const { jobPositions, nations, religions, marialStatuses, educations } = this.state;
        return (
            <div className="w-100 h-100 d-flex animate__animated animate__fadeIn">
                <div className="w-15 align-items-center d-flex flex-column">
                    <ImageUploader imageSrc={photo} onChangeImage={(value => this.onCustomModelChange(value, 'photo'))} type="avatar" />
                </div>
                <div className="w-50 h-100 p-3 d-flex flex-column">
                    <label className="w-100">
                        Mã nhân viên: <span className="require">*</span>
                        <input value={code} fieldName="code" onChange={this.onModelChange} className="form-control w-50" placeholder="Mã nhân viên" />
                    </label>

                    <div className="w-100 d-flex">
                        <label className="w-100">
                            Họ nhân viên:
                            <input value={lastName} fieldName="lastName" onChange={this.onModelChange} className="form-control" placeholder="họ nhân viên" />
                        </label>
                        <label className="pl-4 w-100">
                            Tên nhân viên:
                            <input value={firstName} fieldName="firstName" onChange={this.onModelChange} className="form-control" placeholder="Tên nhân viên" />
                        </label>
                    </div>

                    <div className="w-50">
                        <label className="w-100">
                            Giới tính:
                        </label>
                        <label className="w-20">
                            <input checked={isMale} fieldName="male" onChange={this.onGenderChange} type="checkbox" /> <span>Nam</span>
                        </label>
                        <label className="w-20 ml-3">
                            <input checked={!isMale} fieldName="female" onChange={this.onGenderChange} type="checkbox" /> <span>Nữ</span>
                        </label>
                    </div>

                    <label className="w-50">
                        Ngày sinh:
                        <CustomDatePicker value={dOb} onDateChange={value => this.onCustomModelChange(value, 'doB')} />
                    </label>

                    <label className="w-100">
                        Địa chỉ thường trú:
                        <input value={tAddress} fieldName="tAddress" onChange={this.onModelChange} className="form-control" placeholder="Địa chỉ thường trú" />
                    </label>

                    <label className="w-100">
                        Địa chỉ tạm trú:
                        <input value={pAddress} fieldName="pAddress" onChange={this.onModelChange} className="form-control" placeholder="Địa chỉ tạm trú" />
                    </label>

                    <div className="w-100 d-flex">
                        <label className="w-50">
                            Trình độ học vấn:
                            <CustomSelect selectedValue={education} data={educations} labelField="name" placeHolder="-Chọn trình độ-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'education')} />
                        </label>
                        <label className="w-100 pl-4">
                            Ghi chú:
                            <input value={eduNote} fieldName="eduNote" onChange={this.onModelChange} className="form-control" />
                        </label>
                    </div>

                    <label className="w-50">
                        Bộ phận:
                        <CustomSelect dataUrl="/api/Department" className="w-100"
                            orderFieldName={["level"]}
                            orderBy="desc"
                            selectedValue={departmentId}
                            isHierachy={true}
                            valueField="id"
                            labelField="departmentName"
                            isClearable={true}
                            onValueChange={(value) => this.onCustomModelChange(value, 'departmentId')} />
                    </label>

                    <div className="w-100 d-flex ">
                        <label className="w-50">
                            Chức vụ:
                            <CustomSelect selectedValue={jobPosId} data={jobPositions} labelField="name" placeHolder="-Chọn chức vụ-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'jobPosId')} />
                        </label>
                        <label className="ml-3 mt-2">
                            <label className="w-100"></label>
                            <input checked={isManager} fieldName="isManager" onChange={this.onModelChange} type="checkbox" /> <span className="ml-1">Thuộc nhóm quản lý</span>
                        </label>
                    </div>

                    <div className="w-100 d-flex">
                        <label className="w-30">
                            Dân tộc:
                            <CustomSelect selectedValue={nationId} data={nations} labelField="name" placeHolder="-Chọn dân tộc-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'nationId')} />
                        </label>
                        <label className="w-30 ml-4">
                            Tôn giáo:
                            <CustomSelect selectedValue={religionId} data={religions} labelField="name" placeHolder="-Chọn tôn giáo-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'religionId')} />
                        </label>
                        <label className="w-30 ml-4">
                            Tình trạng hôn nhân:
                            <CustomSelect selectedValue={mariageStatusId} data={marialStatuses} labelField="name" placeHolder="-Chọn tình trạng hôn nhân-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'marialStatusId')} />
                        </label>
                    </div>

                    <div className="w-100 d-flex">
                        <label className="w-30">
                            Điện thoại:
                            <input value={phoneNumber} fieldName="phoneNumber" onChange={this.onModelChange} className="form-control" placeholder="Số điện thoại" />
                        </label>
                        <label className="w-30 ml-4">
                            Fax:
                            <input value={faxNumber} fieldName="faxNumber" onChange={this.onModelChange} className="form-control" placeholder="Số Fax" />
                        </label>
                        <label className="w-30 ml-4">
                            Email:
                            <input value={email} fieldName="email" onChange={this.onModelChange} className="form-control " placeholder="Email" />
                        </label>
                    </div>
                    <label className="w-20 mt-2">
                        <input checked={isActive} fieldName="isActive" onChange={this.onModelChange} type="checkbox" /> <span className="ml-1">Đang hoạt động</span>
                    </label>
                </div>
                <div className="w-40 ml-3 d-flex border-radius-2 align-items-end flex-column h-100">
                    <div className="w-100 border p-3">
                        <label className="w-50 pr-4">
                            Số CMND/CCCD:
                            <input value={idCardNo} fieldName="idCardNo" onChange={this.onModelChange} className="form-control" placeholder="Số CMND / CCCD" />
                        </label>
                        <label className="w-50">
                            Ngày cấp:
                            <CustomDatePicker value={idCardNoDate} onDateChange={value => this.onCustomModelChange(value, 'idCardNoDate')} />
                        </label>
                        <label className="w-100">
                            Nơi cấp:
                            <input value={idCardNoPlace} fieldName="idCardNoPlace" onChange={this.onModelChange} className="form-control" placeholder="Nơi cấp CMND/CCCD" />
                        </label>
                    </div>

                    <div className="w-100 border mt-3 p-3">
                        <label className="w-50 pr-4">
                            Số hộ chiếu:
                            <input value={passportNo} fieldName="passPortNo" onChange={this.onModelChange} className="form-control" placeholder="Số hộ chiếu" />
                        </label>
                        <label className="w-50">
                            Ngày cấp:
                            <CustomDatePicker value={passportNoDate} onDateChange={value => this.onCustomModelChange(value, 'passportNoDate')} />
                        </label>
                        <label className="w-100">
                            Nơi cấp:
                            <input value={passportNoPlace} fieldName="passportNoPlace" onChange={this.onModelChange} className="form-control" placeholder="Nơi cấp hộ chiếu" />
                        </label>
                    </div>

                    <div className="w-100 border mt-3 p-3">
                        <label className="w-50 pr-4">
                            Mã số thuế:
                            <input value={taxNo} fieldName="taxNo" onChange={this.onModelChange} className="form-control" placeholder="Mã số thuế" />
                        </label>
                        <label className="w-50">
                            Ngày cấp:
                            <CustomDatePicker value={taxNoDate} onDateChange={value => this.onCustomModelChange(value, 'taxNoDate')} />
                        </label>
                        <label className="w-100">
                            Nơi cấp:
                            <input value={taxNoPlace} fieldName="taxNoPlace" onChange={this.onModelChange} className="form-control" placeholder="Nơi cấp mã số thuế" />
                        </label>
                    </div>

                    <label className="w-100 mt-auto">
                        Ghi chú:
                        <textarea value={note} fieldName="note" onChange={this.onModelChange} rows={6} className="form-control" />
                    </label>
                </div>
            </div>

        )
    }
}