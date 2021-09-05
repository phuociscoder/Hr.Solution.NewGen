import { faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { Type } from "../../administration/admin.department/Constants";
import { DepartmentServices } from "../../administration/admin.department/Department.services";
import { DepartmentList } from "../../administration/admin.department/DepartmentList";
import { AppRoute } from "../../AppRoute";
import { EmployeeServices } from "../employee.Services";
import { EmployeeTable } from "./EmployeeTable";

export class EmployeeListing extends React.Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            selectedDepartments: []
        }
    }

    componentDidMount = () => {
        this.getDeptsInUserRoles();
    }

    getDeptsInUserRoles =() => {
        DepartmentServices.GetByCurrentUser().then(response => {
            this.setState({departmentsInUserRoles: response.data});
            this.loadEmployees(response.data);
        }, error => {
            debugger;
        });
    }

    loadEmployees =(deptIds) => {
        EmployeeServices.GetByDepartments({departmentIds: deptIds, freeText: ''}).then(response => {
            this.setState({employees: response.data.data});
            console.log(response.data.data);
        }, error => {
            debugger;
        });
    }

    

    getEmployees = () => {
        const employees = [
            { id: 1, code: 'EMP001', fullName: 'Nguyễn Quang Hải', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '12/04/1997', contractType: 'Toàn thời gian', avatar: 'https://secure.cache.images.core.optasports.com/soccer/players/150x150/352991.png' },
            { id: 2, code: 'EMP002', fullName: 'Đặng Văn Lâm', gender: 1, department: 'Đội Tuyển VN', role: 'Thủ môn', doB: '13/08/1993', contractType: 'Bán thời gian', avatar: 'https://static-znews.zadn.vn/static/topic/person/van%20lam.jpg' },
            { id: 3, code: 'EMP003', fullName: 'Lương Xuân Trường', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '14/04/1997', contractType: 'Toàn thời gian', avatar: 'https://streaming1.danviet.vn/upload/2-2020/images/2020-04-29/Luong-Xuan-Truong-Chang-lang-tu-tu-san-co-den-ngoai-doi-xt-00-1588142536-width660height504.jpg' },
            { id: 4, code: 'EMP004', fullName: 'Nguyễn Tiến Linh', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền đạo', doB: '12/06/1997', contractType: 'Toàn thời gian', avatar: 'https://static.bongda24h.vn/medias/original/2020/8/20/22-NguyenTienLinh-Tiendao.jpg' },
            { id: 5, code: 'EMP005', fullName: 'Đỗ Hùng Dũng', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '17/04/1995', contractType: 'Toàn thời gian', avatar: 'https://vff.org.vn/uploads/news/1570370365Do%20hung%20Dung.jpg' },
            { id: 6, code: 'EMP006', fullName: 'Nguyễn Hoàng Đức', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '22/01/1998', contractType: 'Toàn thời gian', avatar: 'https://nguoinoitieng.tv/images/nnt/99/0/bdyn.jpg' },
            { id: 7, code: 'EMP007', fullName: 'Quế Ngọc Hải', gender: 1, department: 'Đội Tuyển VN', role: 'Hậu vệ', doB: '25/07/1994', contractType: 'Toàn thời gian', avatar: 'https://photo-cms-baonghean.zadn.vn/w607/Uploaded/2021/eslysyrlmyl/2021_06_21/2file458991289_2162021.jpg' }
        ];
        this.setState({ employees });
    }

    onDepartmentSelectedChange = (ids) => {
        const {departmentsInUserRoles} = this.state;
        const validDepts = _.intersection(ids, departmentsInUserRoles);
        this.loadEmployees(validDepts);

    }

    render = () => {
        const { employees, selectedDepartments } = this.state;
        return (
            <>
                <div className="w-100 d-flex justify-content-end mb-2">
                    <input style={{ width: '400px' }} type="text" placeholder="Tìm Kiếm..." className="form-control"></input>
                    <button className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faSearch} /> Tìm kiếm</span></button>
                    <Link to={AppRoute.EMPLOYEE_CREATE.path} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faUserPlus} /> Thêm nhân viên</span></Link>
                </div>
                <div className="w-100 h-100 d-flex">
                    <div className="w-25 mr-1 ">
                    <DepartmentList isMultipleSelect={true} fullLoad={false} type={Type.Select} onValueChange={this.onDepartmentSelectedChange} values={selectedDepartments}/>
                    </div>
                    <div className="w-100 h-100 ml-2 shadow">
                    <EmployeeTable data={employees}></EmployeeTable>
                    </div>
                </div>
            </>
        )
    }


}