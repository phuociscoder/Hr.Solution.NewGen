import { faBuffer } from "@fortawesome/free-brands-svg-icons";
import { faAddressCard, faCalendarMinus, faFileContract, faFileMedical, faMoneyCheckAlt, faPeopleArrows, faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export class EmployeeSection {
    static GeneralInformation = 1;
    static Allowance = 2;
    static Dependant = 3;
    static Constract = 4;
    static DayLeave = 5;
    static PayrollInfo = 6;

}

export class EmpMenus {
    static GeneralInfo = 1;
    static Allowance = 2;
    static Dependant = 3;
    static BasicSalaryInfo = 4;
    static DayLeave = 5;
    static Contract = 6;
    static SalaryProcess = 7;
    static Insurance = 8;
    static All = [{ id: this.GeneralInfo, name: "Thông tin cá nhân", icon :<FontAwesomeIcon icon={faAddressCard}/>},
    { id: this.Allowance, name: "Phụ Cấp" , icon :<FontAwesomeIcon icon={faBuffer}/>},
    { id: this.Dependant, name: "Người phụ thuộc", icon :<FontAwesomeIcon icon={faPeopleArrows}/> },
    { id: this.BasicSalaryInfo, name: "Thông tin CB tính công" , icon :<FontAwesomeIcon icon={faUserEdit}/>},
    { id: this.DayLeave, name: "Ngày Nghỉ Phép" , icon :<FontAwesomeIcon icon={faCalendarMinus}/>},
    { id: this.Contract, name: "Hợp đồng lao động" , icon :<FontAwesomeIcon icon={faFileContract}/>},
    { id: this.SalaryProcess, name: "Quá trình lương cơ bản" , icon :<FontAwesomeIcon icon={faMoneyCheckAlt}/>},
    { id: this.Insurance, name: "Bảo Hiểm" , icon :<FontAwesomeIcon icon={faFileMedical}/>},

]
}

export class SectionState{
    static NOT_CHANGE = 1;
    static CHANGED = 2;
}

export class SectionStatus{
    static IDLE = 1;
    static PROCESSING =2;
    static ERROR = 3;
    static DONE = 4;
}

export class Insurance{
    static SOCIAL = 1;
    static HEALTH = 2;
    static UNEMPLOYMENT = 3;
    static ALL = [
        { id: this.SOCIAL, name: "BẢO HIỂM XÃ HỘI" },
        { id: this.HEALTH, name: "BẢO HIỂM Y TẾ" },
        { id: this.UNEMPLOYMENT, name: "BẢO HIỂM THẤT NGHIỆP" }
    ]
}
