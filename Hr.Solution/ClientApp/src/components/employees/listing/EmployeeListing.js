import { faSearch, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { BaseListing } from "../../Common/BaseListing";
import { DepartmentFilter } from "../parts/DepartmentFilter";
import { EmployeeTable } from "./EmployeeTable";

export class EmployeeListing extends React.Component {
    constructor(){
        super();
        this.state ={
            data: [{id: 1, name : "Phuoc", email: "phuoc@mail"}, {id: 2, name: "abbb", email: "abb.com"}]
        }
    }

    generateColumns =() => {
        const columns = [
            {
                id: 1,
                field: 'checkbox',
                pinned: true
            },
            {id: 2, field: 'name', label: 'Họ Tên'},
            {id: 3, field: 'email', label: 'Email'}
            
        ];
        return columns;
    }

    onDepartmentSelectedChange =(ids) => {
        console.log(ids);
    }

    render =() => {
        return (
            <Container fluid>
                <Row>
                    <h4>QUẢN LÝ NHÂN VIÊN</h4>
                </Row>
                
                <Row className="d-flex justify-content-end mb-2">
                    <div>
                    <input style={{width: '400px'}} type="text"  placeholder="Tìm Kiếm..."
                     className="form-control"></input>
                     </div>
                     <div>
                         <button className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faSearch}/> Tìm kiếm</span></button>
                         <button className="btn btn-success ml-1"><span><FontAwesomeIcon icon={faUserPlus}/> Thêm nhân viên</span></button>
                     </div>
                </Row>
                <Row style={{height: '100%'}}>
                    <Col xs={3}>
                        <DepartmentFilter onDepartmentSelectedChange={this.onDepartmentSelectedChange}/>
                    </Col>
                    <Col xs={9}>
                        <EmployeeTable></EmployeeTable>
                    </Col>
                </Row>
            </Container>
        )
    }

    
}