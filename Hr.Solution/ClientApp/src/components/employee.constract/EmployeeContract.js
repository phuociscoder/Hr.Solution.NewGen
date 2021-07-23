import React from "react";
import { Card, Container, Jumbotron } from "react-bootstrap";
import { EmployeeInfoCard } from "../employees/parts/Employee.InfoCard";
import { EmployeeContractTable } from "./EmployeeContract.table";

export class EmployeeContract extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: []
        }
    }

    componentDidMount =() => {
        this.getEmployeeContract(0);
    }

    

    getEmployeeContract =(empId) => {
        const data =[
            {id:1, contractNo: "QD-100/HDXD2021-01", contractType:1, duration:null, signDate:"21/07/2021", validDate:"21/07/2027", expiredDate:null, baseSalary:"23.000.000",isActive: true}
        ];
        this.setState({data: data});
    }

    render = () => {
        const {data} = this.state;
        return (
            
            <Container fluid >
                <div className="w-100"><h4>HỢP ĐỒNG LAO ĐỘNG</h4></div>
                <div className="w-100">
                <EmployeeInfoCard />
                </div>
                <div>
                    <EmployeeContractTable data={data}/>
                </div>
            </Container>

        )
    }
}