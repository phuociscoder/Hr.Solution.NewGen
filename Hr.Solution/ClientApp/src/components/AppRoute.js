

export class AppRoute {
    static HOME = { path: "/", name: "TRANG CHỦ", parent: null }
    static MAINTAIN = { path: "/maintain", name: "Bảo TRÌ", parent: null }
    //Employee
    static EMPLOYEE_MANAGEMENT = { path: "/employees", name: "QUẢN LÝ NHÂN VIÊN", parent: [this.HOME] };
    static EMPLOYEE_CREATE = { path: "/employees/create", name: "THÊM NHÂN VIÊN", parent: [this.HOME, this.EMPLOYEE_MANAGEMENT] };

    static EMPLOYEE_CONTRACT = { path: "/employees/contract/:id", alias: "/employees/contract/", name: "HỢP ĐỒNG LAO ĐỘNG", parent: [this.HOME, this.EMPLOYEE_MANAGEMENT] };

    //Config
    static CONFIG = "/config/"
    static CATEGORY_LIST = { path: "/category", name: "THIẾT LẬP DANH MỤC", parent: [this.HOME] };

    static CONFIG_DEPARTMENT = { path: `${this.CONFIG}department`, name: "THIẾT LẬP PHÒNG BAN/BỘ PHẬN", parent: [this.HOME, this.CATEGORY_LIST] }; // /config/deparment

    //admin
    static ADMIN = "/admin";
    static ADMIN_ACOUNT = { path: `${this.ADMIN}/account`, name: "QUẢN LÝ TÀI KHOẢN", parent: [this.HOME] };
    static ADMIN_SYSTEM_ROLE = { path: `${this.ADMIN}/sysrole`, name: "PHÂN QUYỀN CHỨC NĂNG", parent: [this.HOME] };
    static ADMIN_DATA_ROLE = { path: `${this.ADMIN}/datarole`, name: "PHÂN QUYỀN VÙNG DỮ LIỆU", parent: [this.HOME] };

    static ALL = [this.HOME,
    this.EMPLOYEE_MANAGEMENT,
    this.EMPLOYEE_CONTRACT,
    this.EMPLOYEE_CREATE,
    this.CATEGORY_LIST,
    this.CONFIG_DEPARTMENT,
    this.ADMIN_ACOUNT,
    this.ADMIN_SYSTEM_ROLE,
    this.ADMIN_DATA_ROLE
    ];
}