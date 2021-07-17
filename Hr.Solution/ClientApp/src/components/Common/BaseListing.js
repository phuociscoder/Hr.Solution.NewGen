import React from "react";
import { Card, Col, Dropdown, DropdownButton, Pagination, Row, Table } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

export class BaseListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount = () => {
        let items = [
            { id: 1, name: "Nguyễn Hữu Phước", department: "AVI", role: "Trưởng Dự Án", phone: "0909991991", email: "mike@gmail.com" },
            { id: 1, name: "Nguyễn Hữu Phước", department: "AVI", role: "Trưởng Dự Án", phone: "0909991991", email: "mike@gmail.com" },
            { id: 1, name: "Nguyễn Hữu Phước", department: "AVI", role: "Trưởng Dự Án", phone: "0909991991", email: "mike@gmail.com" },
            { id: 1, name: "Nguyễn Hữu Phước", department: "AVI", role: "Trưởng Dự Án", phone: "0909991991", email: "mike@gmail.com" }
        ];
        this.setState({ data: items });
    }

    generateContent =() => {}

    render = () => {
        return (
            <>
                <div className="row" style={{ maxHeight: '100%' }}>
                    <Table striped bordered hover size="lg" className="custom-table-data">
                        {this.generateContent()}
                    </Table>
                    <Row style={{ width: '100%' }}>
                        <Col xs={3}>
                            <Pagination style={{ width: '30%' }}>
                                <Pagination.First />
                                <Pagination.Prev />
                                <Pagination.Item>{1}</Pagination.Item>
                                <Pagination.Item>{2}</Pagination.Item>
                                <Pagination.Item>{3}</Pagination.Item>
                                <Pagination.Next />
                                <Pagination.Last />
                            </Pagination>
                        </Col>
                        <Col xs={6} >
                        <div className="d-flex align-items-center justify-content-center">
                            <label> Hiển thị: </label>
                            <select style={{ width: '80px' }} className="form-control ml-1">
                                <option>10</option>
                                <option>20</option>
                                <option>50</option>
                                <option>100</option>
                            </select>
                            <label className="ml-1"> dòng. </label>
                            </div>
                        </Col>
                        <Col>
                        <div className="d-flex flex-row-reverse align-items-center">
                            <span>Tổng cộng: <b>100</b></span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }
}