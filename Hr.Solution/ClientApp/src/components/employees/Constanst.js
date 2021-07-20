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

export class AllowanceType{
    static Lunch =1;
    static Transport =2;
    static All =[
        {id: this.Lunch, name :'Cơm trưa'},
        {id: this.Transport, name: 'Di Chuyển'}
    ];
}

export class AllowanceLevel{
    static Level1 =1;s
    static Level2 =2;
    static All =[
        {id: this.Level1, name :'Mức I'},
        {id: this.Level2, name: 'Mức II'}
    ];
}

export class Mode {
    static Create =1;
    static Edit=2;
    static View =3;
}

export class Relation {
    static Father = 1; 
    static Mother =2;
    static Child =3;
    static All=[
        {id: this.Father, name: "Cha"},
        {id: this.Mother, name: "Mẹ"},
        {id: this.Child, name: "Con cái"}
    ];
}