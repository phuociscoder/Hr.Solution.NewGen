import React from "react";
import ReactTooltip from "react-tooltip";
import { WorkMonthDetailItem } from "./work.month.detail";
import { WorkMonthList } from "./work.month.list";

export class WorkMonth extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            workMonth:{},
            selectedItem: {}
        }
    }

    componentDidMount =() => {
        const {workMonth} = this.props;
        if(!workMonth) return;
        this.setState({workMonth: workMonth});
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.workMonth !== nextProps.workMonth)
        {
            this.setState({workMonth: nextProps.workMonth});
        }
        return true;
    }

    onRefresh =(value) => {
        this.setState({refresh: value});
    }
    onRefreshed =()=> {
        this.setState({refresh: false});
    }

    onWorkMonthItemChange =(item) => {
        this.setState({selectedItem: item});
    }

    render =() => {
        const {workMonth, refresh, selectedItem} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <WorkMonthList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onWorkMonthItemChange} workMonth={workMonth}/>
            </div>
            <div className="flex-fill ml-2 h-100">
                <WorkMonthDetailItem workMonth={workMonth} onRefresh={this.onRefresh} model={selectedItem} />
            </div>
            <ReactTooltip />
        </div>
        )
    }
}