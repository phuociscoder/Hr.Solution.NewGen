import { faAlignJustify, faCheck, faCheckCircle, faEdit, faFemale, faMale, faSearch, faUserEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Type } from "../../administration/admin.department/Constants";
import { DepartmentServices } from "../../administration/admin.department/Department.services";
import { DepartmentList } from "../../administration/admin.department/DepartmentList";
import { AppRoute } from "../../AppRoute";
import { HTable } from "../../Common/CustomTable";
import { NotificationType } from "../../Common/notification/Constants";
import { ShowNotification } from "../../Common/notification/Notification";
import { DateTimeUltils } from "../../Utilities/DateTimeUltis";
import { EmployeeServices } from "../employee.Services";
import { EmployeeTable } from "./EmployeeTable";

export class EmployeeListing extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {},
            selectedDepartments: [],
            pageIndex: 1, 
            pageSize: 20,
            loading: false
        }
    }

    componentDidMount = () => {
        this.getDeptsInUserRoles();
        this.generateColumns();
    }

    getDeptsInUserRoles =() => {
        this.setState({loading: true});
        DepartmentServices.GetByCurrentUser().then(response => {
            this.setState({departmentsInUserRoles: response.data});
            this.loadEmployees(response.data, 1, 20, '');
        }, error => {
            debugger;
        });
    }

    loadEmployees =(deptIds, pageIndex, pageSize, freeText) => {
        EmployeeServices.GetByDepartments({departmentIds: deptIds, freeText: freeText, pageSize: pageSize, pageIndex: pageIndex}).then(response => {
            this.setState({data: response.data, pageIndex: pageIndex, pageSize: pageSize, freeText: freeText, loading: false});
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể truy cập danh sách nhân viên");
        });
    }

    componentDidUpdate =() => {
        const {loading} = this.state;
        if(loading) this.setState({loading: false});
    }

    generateColumns = () => {
        const columns = [
            { field: 'code', title: 'Mã NV', width: 5, order: 1 },
            { field: 'fullName', title: 'Họ Và Tên',width: 15, order: 2 , formatContent: (x) =>  {return <span><Image src={x.photo} width={25} height={25}/> {x.lastName} {x.firstName}</span>} },
            { field: 'isMale', title: 'Giới Tính', width: 8, align: "center", order: 3 , formatContent: (x) => {return <FontAwesomeIcon icon={x.isMale ? faMale : faFemale} color={x.isMale ? '#568fb1': 'pink'}/>}},
            {field: 'doB', title: "Ngày Sinh", width: 8, order: 4, formatContent: (x) => {return <span>{DateTimeUltils.toDateString(x.doB)}</span>}},
            { field: 'departmentName', title: 'Bộ Phận', width: 8, order: 5 },
            { field: 'isManager', title: 'Nhóm Quản Lý', width: 8, align: "center", order: 6, formatContent: (x) => {return <FontAwesomeIcon icon={faCheckCircle} color={x.isManager ? 'green': 'grey'}/>}},
            { field: 'isActive', title: 'Hoạt Động', width: 8, align: "center", order: 6, formatContent: (x) => {return <FontAwesomeIcon icon={faCheckCircle} color={x.isManager ? 'green': 'grey'}/>}},
            { field: 'contractType', title: 'Loại Hợp Đồng',width: 8, order: 7 },
            { field: 'contractDuration', title: 'Thời Hạn', width: 8, order: 8 },
            { field: 'validDate', title: 'Ngày Hết Hạn', width: 8, order: 9, formatContent: (x) => {return <span>{DateTimeUltils.toDateString(x.validDate)}</span>} },
            { field: 'joiningDate', title: 'Ngày Vào', width: 8, order: 10 , formatContent: (x) => {return <span>{DateTimeUltils.toDateString(x.joiningDate)}</span>}}
        ];
        this.setState({columns});
    }

    generateActions =(item) => {
        return <FontAwesomeIcon icon={faUserEdit}/>
    }

    onPageIndexChange =(index) => {
        const {departmentsInUserRoles} = this.state;
        this.loadEmployees(departmentsInUserRoles, index, 20, '');
    }

    onPageSizeChange =(pageSize) => {
        const {departmentsInUserRoles} = this.state;
        this.loadEmployees(departmentsInUserRoles, 1, pageSize, '');
    }

    onDepartmentSelectedChange = (ids) => {
        const {departmentsInUserRoles, pageSize, pageIndex} = this.state;
        const validDepts = _.intersection(ids, departmentsInUserRoles);
        this.loadEmployees(validDepts, pageIndex, pageSize, '');

    }

    render = () => {
        const { data, selectedDepartments, loading } = this.state;
        return (
            <>
                <div className="w-100 h-4 d-flex justify-content-end mb-2">
                    <input style={{ width: '400px' }} type="text" placeholder="Tìm Kiếm..." className="form-control"></input>
                    <button className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faSearch} /> Tìm kiếm</span></button>
                    <Link to={AppRoute.EMPLOYEE_CREATE.path} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faUserPlus} /> Thêm nhân viên</span></Link>
                </div>
                <div className="w-100 h-96 d-flex">
                    <div className="w-25 mr-1 ">
                    <DepartmentList isMultipleSelect={true} fullLoad={false} type={Type.Select} onValueChange={this.onDepartmentSelectedChange} values={selectedDepartments}/>
                    </div>
                    <div className="w-100 h-100 ml-2 shadow">
                        <HTable loading={loading} 
                        columns ={this.state.columns} 
                        data={data} 
                        actions={this.generateActions}
                        onPageIndexChange={this.onPageIndexChange} 
                        onPageSizeChange={this.onPageSizeChange}/>
                    </div>
                </div>
            </>
        )
    }


}