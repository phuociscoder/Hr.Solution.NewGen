import React from "react";
import { DayLeaveTable } from "./DayLeaveTable";
import { EmployeesDayLeaveList } from "./Employee.list";
import ReactTooltip from "react-tooltip";

export class DayLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: true,
            employee: {}
        }
    }

    onRefresh =(value) => {
        this.setState({refresh: value});
    }

    onRefreshed =()=> {
        this.setState({refresh: false});
    }

    onEmployeeChange = (value) => {
        this.setState({ employee: value });
    }

    render = () => {
        const { refresh, employee } = this.state;
        return (
            <div className="d-flex w-100 h-100">
                <div className="w-20 h-100">
                    <EmployeesDayLeaveList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onEmployeeChange}/>
                </div>
                <div className="flex-fill ml-2 h-100">
                    <DayLeaveTable onRefresh={this.onRefresh} employee={employee} />
                </div>
                <ReactTooltip />
            </div>
        )
    }
}