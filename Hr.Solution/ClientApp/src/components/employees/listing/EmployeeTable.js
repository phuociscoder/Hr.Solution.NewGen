import { faFileAlt, faGripVertical, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BaseListing } from "../../Common/BaseListing";
import { RoutePath } from "../../Common/Constants";
import { NoDataTableContent } from "../../Common/NoDataTableContent";

export class EmployeeTable extends BaseListing {

    generateContent = () => {
        return (
            <>
                <thead>
                    <tr>
                        <th>Mã NV</th>
                        <th>Họ và Tên</th>
                        <th>Giới Tính</th>
                        <th>Bộ Phận</th>
                        <th>Chức Vụ</th>
                        <th>Ngày Sinh</th>
                        <th>Loại Hợp Đồng</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.data && this.state.data.map((item, index) => {
                            return (
                                <tr>
                                    <td>{item.code}</td>
                                    <td><Image width={40} height={40} roundedCircle src={item.avatar} /> {item.fullName}</td>
                                    <td style={{ alignContent: "center" }}>{item.gender === 1 ? <span color="darkblue">Nam</span> : <span color="pink">Nữ</span>}</td>
                                    <td>{item.department}</td>
                                    <td>{item.role}</td>
                                    <td>{item.doB}</td>
                                    <td>{item.contractType}</td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle as="span" variant="success" id="dropdown-employeeOptions">
                                                <FontAwesomeIcon className="btn-employee-options" color="#1b6ec2" icon={faGripVertical} size="2x"/>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item ><Link className="menu-link"><span><FontAwesomeIcon icon={faUserEdit}/> Thông tin cá nhân </span></Link></Dropdown.Item>
                                                <Dropdown.Item ><Link className="menu-link" to={`${RoutePath.EMPLOYEE_CONTRACT.replace(':id', item.id)}`}><span><FontAwesomeIcon icon={faFileAlt}/> Hợp đồng lao động </span></Link></Dropdown.Item>
                                                <Dropdown.Item ><Link className="menu-link"><span><FontAwesomeIcon icon={faFileAlt}/> Nghỉ phép </span></Link></Dropdown.Item>
                                                <Dropdown.Item ><Link className="menu-link"><span><FontAwesomeIcon icon={faFileAlt}/> TimeShift </span></Link></Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>

                            )
                        })
                    }
                    {
                        !this.state.data && <NoDataTableContent colspan={8}/>
                    }
                </tbody>
            </>
        )
    }
}