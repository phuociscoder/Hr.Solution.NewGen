import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { Type } from "../../admin.department/Constants";
import { DepartmentList } from "../../admin.department/DepartmentList";
import { DepartmentDetails } from "./Department.detail";

export class DepartmentConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refesh: false,
            selectedItem: {}
        }
    }

    componentDidMount = () => {
        const { prefix } = this.props;
        if (!prefix) return;
        this.setState({ prefix: prefix });
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.prefix !== nextProps.prefix) {
            this.setState({ prefix: nextProps.prefix });
        }
        return true;
    }

    onRefresh = (value) => {
        this.setState({ refresh: value });
    }
    onRefreshed = () => {
        this.setState({ refresh: false });
    }

    onCategoryItemChange = (item) => {
        this.setState({ selectedItem: item });
    }

    render = () => {
        const { prefix, refresh, selectedItem, mode } = this.state;
        return (
            <div className="d-flex w-100 h-100">
                <div className="w-30 h-100 card">
                    <DepartmentList isMutipleSelect={false} fullLoad={false} type={Type.Select} onValueChange={this.onCategoryItemChange} values={[selectedItem]} />
                </div>
                <div className="flex-fill ml-2 h-100">
                    <DepartmentDetails departmentId={selectedItem} prefix={prefix} onRefresh={this.onRefresh} />
                </div>
                <ReactTooltip />
            </div>
        )
    }
}