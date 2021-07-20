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
        const { data } = this.props;
        if (data) {
            this.setState({ data });
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.data != nextProps.data) {
            this.setState({ data: nextProps.data });
        }
        return true;
    }

    generateContent = () => { }

    render = () => {
        return (
            <>
                <div className="d-flex flex-column" style={{ maxHeight: '100%' }}>
                    <Table striped bordered hover size="lg" className="custom-table-data">
                        {this.generateContent()}
                    </Table>
                    {
                        this.state.data && <Row style={{ width: '100%' }}>
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
                    }
                </div>
            </>
        )
    }
}