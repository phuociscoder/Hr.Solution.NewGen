import _ from "lodash";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { Loading } from "../loading/Loading";
import './customTable.css';
import { Panigation } from "./panigation";

export class HTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [],
            data: [],
            pageSize: 20,
            pageIndex: 1,
            total: 0,
            loading: false
        }
    }

    componentDidMount = () => {
        const { data, columns, actions, loading } = this.props;
        this.setState({ data: data.data, total: data.total, pageSize: data.pageSize, pageIndex: data.pageIndex, columns, actions, loading });
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.data !== nextProps.data || this.props.columns !== nextProps.columns || this.props.actions !== nextProps.actions) {
            this.setState({ data: nextProps.data.data, total: nextProps.data.total, pageSize: nextProps.data.pageSize, columns: nextProps.columns, actions: nextProps.actions });
        }

        if (this.props.loading !== nextProps.loading) {
            this.setState({ loading: nextProps.loading });
        }
        return true;
    }

    onPageIndexChange = (pageIndex) => {
        const { onPageIndexChange } = this.props;
        if (onPageIndexChange) this.setState({ pageIndex: pageIndex }, onPageIndexChange(pageIndex));
    }

    onPageSizeChange = (e) => {
        const value = e.target.value;
        this.setState({ pageSize: value });
    }


    generateHeader = () => {
        const { columns, actions } = this.state;
        const colOrder = _.orderBy(columns, ["order"], ["asc"]);
        return (
            <>
                {
                    colOrder && colOrder.length > 0 && colOrder.map(col => {
                        return (
                            <div className="htable-header-col d-flex align-items-center pt-2 pb-2 border-left"
                                style={{ width: `${col.width}%` }}>
                                <span className=" text-uppercase font-weight-bold w-100 text-center">
                                    {col.title}
                                </span>
                            </div>
                        )
                    })
                }
                {
                    actions && <div className="htable-header-col d-flex align-items-center border-left p-1 w-10"></div>
                }
            </>
        );
    }

    generateContent = () => {
        const { columns, actions, data, loading } = this.state;
        const colOrder = _.orderBy(columns, ["order"], ["asc"]);
        if (!data || data.length === 0) return '';
        return (
            <>
                {
                    data.map(item => {
                        return (
                            <div className="w-100 d-flex border table-row" style={{height:'50px'}}>

                                    {colOrder && colOrder.length > 0 && colOrder.map(col => {
                                    return (
                                        <div className={`${col.align === "center" ? 'justify-content-center': ''}  d-flex align-items-center pl-2 border-left`}
                                            style={{ width: `${col.width}%`}}>
                                            {col.formatContent ? col.formatContent(item) : <span>{item[col.field]}</span>}
                                        </div>
                                    )
                                })}
                                <div className= "justify-content-center d-flex align-items-center pl-1 w-10 border-left">
                                            {actions(item)}
                                        </div>
                            </div>        
                    )
                })}
            </>
        );

    }

    render = () => {
        const { pageSize, pageIndex, total, data, loading } = this.state;
        return (
            <>
                <div className="w-100 h-100 htable-container border shadow">
                    <div className="htable-header d-flex h-5" style={{width: '98.8%'}}>
                        {this.generateHeader()}
                    </div>
                    <div className="htable-body h-90">
                        {loading && <div className="w-100 p-2 d-flex justify-content-center">
                            <Loading show={true} />
                        </div>}
                        {(!data || data.length === 0)  && <div className="w-100 p-2 d-flex justify-content-center font-weight-bold">Không có dữ liệu.</div>}
                        {this.generateContent()}
                    </div>
                    <div className="htable-footer w-100 h-5 pt-1 border-top">
                        <Row>
                            <Col xs={4}>
                                <Panigation selectedPage={pageIndex} pageSize={pageSize} total={total} onValueChange={this.onPageIndexChange} />
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
                                <span><b>Tổng cộng : {total} </b></span>
                            </Col>
                        </Row>
                    </div>
                </div>
            </>
        )
    }
}