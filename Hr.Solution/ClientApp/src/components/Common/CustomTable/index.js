import _ from "lodash";
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

    componentDidMount = () => {
        const { data, columns, actions } = this.props;
        this.setState({ data, columns, actions });
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.data !== nextProps.data || this.props.columns !== nextProps.columns || this.props.actions !== nextProps.actions) {
            this.setState({ data: nextProps.data, columns: nextProps.columns, actions: nextProps.actions });
        }
        return true;
    }

    onPageIndexChange = (pageIndex) => {
        console.log(pageIndex);
    }

    onPageSizeChange = (e) => {
        const value = e.target.value;
        this.setState({ pageSize: value });
    }





    generateHeader = () => {
        const { columns, actions } = this.state;
        const colOrder = _.orderBy(columns, ["order"], ["asc"]);
        console.log(actions);

        return (
            <>
                {
                    colOrder && colOrder.length > 0 && colOrder.map(col => {
                        return (
                            <div className="htable-header-col d-flex align-items-center border-left p-2"
                                style={{ width: `${col.width}%` }}>
                                <span className="mt-2 text-uppercase font-weight-bold">
                                    {col.title}
                                </span>
                            </div>
                        )
                    })
                }
                {
                    actions && <div className="htable-header-col d-flex align-items-center border-left p-2 w-10"></div>
                }
            </>
        );
    }

    render = () => {
        const { pageSize, pageIndex } = this.state;
        return (
            <div className="w-100 h-100">
                <div className="w-100 htable-container border shadow">
                    <div className="htable-header w-100 d-flex h-5">
                        {this.generateHeader()}
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