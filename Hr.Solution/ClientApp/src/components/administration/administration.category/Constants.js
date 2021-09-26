export class CategoryModule {
    static Department = 'LS0001';
    static WorkDay = "LSTS101";

    static EmployeeType = 'LSEM149';
    static AllowanceType = 'LSEM156';
    static Insurance ='LSSI100';
}

export class InsuranceType {
    static SI = 1;
    static SH = 2;
    static SU = 3;
    static ALL =[
        {id: this.SI, name: "Bảo hiểm xã hội"},
        {id: this.SH, name: "Bảo hiểm y tế"},
        {id: this.SU, name: "Bảo hiểm thất nghiệp"}
    ];
}