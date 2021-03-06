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
import { EmployeeServices } from "../../employee.Services";

export class EmployeeGeneralInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            model: {},
            mode: Mode.Create,
            photo: null
        }
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.model !== nextProps.model)
        {
            const employeePhotoId = nextProps.model.photoId;
            this.setState({model : nextProps.model, mode: Mode.Edit}, this.getEmployeePhoto(employeePhotoId));
        }
        return true;
    }

    getEmployeePhoto =(photoId) => {
        EmployeeServices.GetEmployeePhoto(photoId).then(response => {
            this.setState({photo: response.data});
        }, error => {

        });
    }

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
            ShowNotification(NotificationType.ERROR, "C?? l???i x???y ra! Kh??ng th??? truy c???p danh s??ch ch???c v???");
        });
    }

    onCustomModelChange = (value, stateName) => {
        if(stateName === 'photo')
        {
            this.setState({photo: value});
        }
        const { model } = this.state;
        const newModel = Object.assign({}, { ...model, [stateName]: value });
        this.onGeneralInfoChange(newModel);
    }

    render = () => {
        const { code, firstName, lastName, isMale, doB, tAddress, pAddress, educationId, educationNote, departmentId, jobPosId, isManager, nationId,
            religionId, marialStatusId, phoneNumber, faxNumber, email, joinDate, isActive, idCardNo, idCardNoPlace, idCardNoDate, passPortNo,
            passPortNoDate, passPortNoPlace, taxNo, taxNoPlace, taxNoDate, note } = this.state.model;

        const { jobPositions, nations, religions, marialStatuses, educations, photo } = this.state;
        return (
            <div className="w-100 h-100 d-flex animate__animated animate__fadeIn">
                <div className="w-15 align-items-center d-flex flex-column">
                    <ImageUploader imageSrc={photo} onChangeImage={(value => this.onCustomModelChange(value, 'photo'))} type="avatar" />
                </div>
                <div className="w-50 h-100 p-3 d-flex flex-column">
                    <label className="w-100">
                        M?? nh??n vi??n: <span className="require">*</span>
                        <input value={code} fieldName="code" onChange={this.onModelChange} className="form-control w-50" placeholder="M?? nh??n vi??n" />
                    </label>

                    <div className="w-100 d-flex">
                        <label className="w-100">
                            H??? nh??n vi??n: <span className="require">*</span>
                            <input value={lastName} fieldName="lastName" onChange={this.onModelChange} className="form-control" placeholder="h??? nh??n vi??n" />
                        </label>
                        <label className="pl-4 w-100">
                            T??n nh??n vi??n: <span className="require">*</span>
                            <input value={firstName} fieldName="firstName" onChange={this.onModelChange} className="form-control" placeholder="T??n nh??n vi??n" />
                        </label>
                    </div>

                    <div className="w-50">
                        <label className="w-100">
                            Gi???i t??nh:
                        </label>
                        <label className="w-20">
                            <input checked={isMale} fieldName="male" onChange={this.onGenderChange} type="checkbox" /> <span>Nam</span>
                        </label>
                        <label className="w-20 ml-3">
                            <input checked={!isMale} fieldName="female" onChange={this.onGenderChange} type="checkbox" /> <span>N???</span>
                        </label>
                    </div>

                    <label className="w-50">
                        Ng??y sinh:
                        <CustomDatePicker value={doB} onDateChange={value => this.onCustomModelChange(value, 'doB')} />
                    </label>

                    <label className="w-100">
                        ?????a ch??? th?????ng tr??:
                        <input value={tAddress} fieldName="tAddress" onChange={this.onModelChange} className="form-control" placeholder="?????a ch??? th?????ng tr??" />
                    </label>

                    <label className="w-100">
                        ?????a ch??? t???m tr??:
                        <input value={pAddress} fieldName="pAddress" onChange={this.onModelChange} className="form-control" placeholder="?????a ch??? t???m tr??" />
                    </label>

                    <div className="w-100 d-flex">
                        <label className="w-50">
                            Tr??nh ????? h???c v???n:
                            <CustomSelect selectedValue={educationId} data={educations} labelField="name" placeHolder="-Ch???n tr??nh ?????-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'educationId')} />
                        </label>
                        <label className="w-100 pl-4">
                            Ghi ch??:
                            <input value={educationNote} fieldName="educationNote" onChange={this.onModelChange} className="form-control" />
                        </label>
                    </div>

                    <label className="w-50">
                        B??? ph???n: <span className="require">*</span>
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
                            Ch???c v???:
                            <CustomSelect selectedValue={jobPosId} data={jobPositions} labelField="name" placeHolder="-Ch???n ch???c v???-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'jobPosId')} />
                        </label>
                        <label className="ml-3 mt-2">
                            <label className="w-100"></label>
                            <input checked={isManager} fieldName="isManager" onChange={this.onModelChange} type="checkbox" /> <span className="ml-1">Thu???c nh??m qu???n l??</span>
                        </label>
                    </div>

                    <div className="w-100 d-flex">
                        <label className="w-30">
                            D??n t???c:
                            <CustomSelect selectedValue={nationId} data={nations} labelField="name" placeHolder="-Ch???n d??n t???c-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'nationId')} />
                        </label>
                        <label className="w-30 ml-4">
                            T??n gi??o:
                            <CustomSelect selectedValue={religionId} data={religions} labelField="name" placeHolder="-Ch???n t??n gi??o-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'religionId')} />
                        </label>
                        <label className="w-30 ml-4">
                            T??nh tr???ng h??n nh??n:
                            <CustomSelect selectedValue={marialStatusId} data={marialStatuses} labelField="name" placeHolder="-Ch???n t??nh tr???ng h??n nh??n-" isClearable={true} onValueChange={(value) => this.onCustomModelChange(value, 'marialStatusId')} />
                        </label>
                    </div>

                    <div className="w-100 d-flex">
                        <label className="w-30">
                            ??i???n tho???i:
                            <input value={phoneNumber} fieldName="phoneNumber" onChange={this.onModelChange} className="form-control" placeholder="S??? ??i???n tho???i" />
                        </label>
                        <label className="w-30 ml-4">
                            Fax:
                            <input value={faxNumber} fieldName="faxNumber" onChange={this.onModelChange} className="form-control" placeholder="S??? Fax" />
                        </label>
                        <label className="w-30 ml-4">
                            Email:
                            <input value={email} fieldName="email" onChange={this.onModelChange} className="form-control " placeholder="Email" />
                        </label>
                    </div>
                    <label className="w-20 mt-2">
                        <input checked={isActive} fieldName="isActive" onChange={this.onModelChange} type="checkbox" /> <span className="ml-1">??ang ho???t ?????ng</span>
                    </label>
                </div>
                <div className="w-40 ml-3 d-flex border-radius-2 align-items-end flex-column h-100">
                    <div className="w-100 border p-3">
                        <label className="w-50 pr-4">
                            S??? CMND/CCCD:
                            <input value={idCardNo} fieldName="idCardNo" onChange={this.onModelChange} className="form-control" placeholder="S??? CMND / CCCD" />
                        </label>
                        <label className="w-50">
                            Ng??y c???p:
                            <CustomDatePicker value={idCardNoDate} onDateChange={value => this.onCustomModelChange(value, 'idCardNoDate')} />
                        </label>
                        <label className="w-100">
                            N??i c???p:
                            <input value={idCardNoPlace} fieldName="idCardNoPlace" onChange={this.onModelChange} className="form-control" placeholder="N??i c???p CMND/CCCD" />
                        </label>
                    </div>

                    <div className="w-100 border mt-3 p-3">
                        <label className="w-50 pr-4">
                            S??? h??? chi???u:
                            <input value={passPortNo} fieldName="passPortNo" onChange={this.onModelChange} className="form-control" placeholder="S??? h??? chi???u" />
                        </label>
                        <label className="w-50">
                            Ng??y c???p:
                            <CustomDatePicker value={passPortNoDate} onDateChange={value => this.onCustomModelChange(value, 'passPortNoDate')} />
                        </label>
                        <label className="w-100">
                            N??i c???p:
                            <input value={passPortNoPlace} fieldName="passPortNoPlace" onChange={this.onModelChange} className="form-control" placeholder="N??i c???p h??? chi???u" />
                        </label>
                    </div>

                    <div className="w-100 border mt-3 p-3">
                        <label className="w-50 pr-4">
                            M?? s??? thu???:
                            <input value={taxNo} fieldName="taxNo" onChange={this.onModelChange} className="form-control" placeholder="M?? s??? thu???" />
                        </label>
                        <label className="w-50">
                            Ng??y c???p:
                            <CustomDatePicker value={taxNoDate} onDateChange={value => this.onCustomModelChange(value, 'taxNoDate')} />
                        </label>
                        <label className="w-100">
                            N??i c???p:
                            <input value={taxNoPlace} fieldName="taxNoPlace" onChange={this.onModelChange} className="form-control" placeholder="N??i c???p m?? s??? thu???" />
                        </label>
                    </div>

                    <label className="w-100 mt-auto">
                        Ghi ch??:
                        <textarea value={note} fieldName="note" onChange={this.onModelChange} rows={6} className="form-control" />
                    </label>
                </div>
            </div>

        )
    }
}