export class RoutePath {
    static HOME ="/";
    static EMPLOYEE_MANAGEMENT ="/employees";
    static EMPLOYEE_CREATE="/employees/create";
    
}

export class Currency {
    static VND = 1;
    static JPY = 2;
    static USD = 3;
    static EUR = 4;
    static All =[
        {id: this.VND, name: "Việt nam đồng"},
        {id: this.JPY, name: "Yên nhật"},
        {id: this.USD, name: "Đô la mỹ"},
        {id: this.EUR, name: "Bảng anh"},
    ];
}