export class EmployeeSection {
    static GeneralInformation = 1;
    static Allowance = 2;
    static Dependant = 3;
    static Constract = 4;
    static DayLeave = 5;
    static PayrollInfo = 6;

}

export class MarialStatus{
    static Single =1;
    static Married =2;
    static All =[
        {id: this.Single, name: 'Độc thân'}, 
        {id: this.Single, name: 'Đã lập gia đình'}];
}