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

export class MarialStatus {
    static Single = 1;
    static Married = 2;
    static All = [
        { id: this.Single, name: 'Độc thân' },
        { id: this.Single, name: 'Đã lập gia đình' }];
}

export class AllowanceType {
    static Lunch = 1;
    static Transport = 2;
    static All = [
        { id: this.Lunch, name: 'Cơm trưa' },
        { id: this.Transport, name: 'Di Chuyển' }
    ];
}

export class AllowanceLevel {
    static Level1 = 1; s
    static Level2 = 2;
    static All = [
        { id: this.Level1, name: 'Mức I' },
        { id: this.Level2, name: 'Mức II' }
    ];
}

export class Mode {
    static Create = 1;
    static Edit = 2;
    static View = 3;
}

export class Relation {
    static Father = 1;
    static Mother = 2;
    static Child = 3;
    static All = [
        { id: this.Father, name: "Cha" },
        { id: this.Mother, name: "Mẹ" },
        { id: this.Child, name: "Con cái" }
    ];
}

export class EmployeeType {
    static Official = 1;
    static PartTime = 2;
    static Probation = 3;
    static Intern = 4;
    static All = [
        { id: this.Official, name: "Chính thức" },
        { id: this.PartTime, name: "Bán thời gian" },
        { id: this.Probation, name: "Thử việc" },
        { id: this.Intern, name: "Thực tập sinh" }
    ];
}

export class WorkerType {
    static Nomal = 1;
    static All = [
        { id: this.Nomal, name: "Nhân viên bình thường" }
    ];
}

export class LeaveWeekGroup {
    static Sunday = 1;
    static Weekend = 2;
    static All = [
        { id: this.Sunday, name: "Nghỉ chủ nhật" },
        { id: this.Weekend, name: "Nghỉ Thứ 7/CN" }
    ];
}

export class ContractType {
    static Pernament = 1;
    static NotPernament = 2;
    static Probation = 3;
    static All = [
        { id: this.Pernament, name: "Không thời hạn" },
        { id: this.NotPernament, name: "Có thời hạn" },
        { id: this.Probation, name: "Thử việc" }
    ]
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
