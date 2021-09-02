import React from "react";
import { Col, Row } from "react-bootstrap";
import './customTable.css';
import { Panigation } from "./panigation";

export class HTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: [],
            pageSize: 20,
            pageIndex: 1
        }
    }

    onPageIndexChange =(pageIndex) => {
        console.log(pageIndex);
    }

    onPageSizeChange =(e) => {
        const value = e.target.value;
        this.setState({pageSize: value});
    }

    render = () => {
        const {pageSize, pageIndex} = this.state;
        return (
            <div className="w-100 h-100">
                <div className="w-100 htable-container border shadow">
                    <div className="htable-header h-5 p-3">
                        <Row>
                            dsadsads
                        </Row>
                    </div>
                    <div className="htable-body p-1">
                            
                    </div>
                    <div className="htable-footer w-100 h-5 p-3 border-top">
                        <Row>
                            <Col xs={4}>
                                <Panigation selectedPage={pageIndex} pageSize={pageSize} total={235} onValueChange={this.onPageIndexChange} />
                            </Col>
                            <Col xs={4} className="d-flex align-items-center justify-content-center">
                                <label className=" d-flex pt-1">Hiển thị: </label>
                                <select value={pageSize} onChange={this.onPageSizeChange} className="form-control w-15 ml-1">
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </Col>
                            <Col xs={4} className="d-flex justify-content-end">
                                <span><b>Tổng cộng : 200 </b></span>
                            </Col>
                        </Row>
                    </div>
                </div>

            </div>
        )
    }
}