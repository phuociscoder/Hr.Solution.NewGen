import React from "react";
import ReactTooltip from "react-tooltip";
import { WorkShiftDetailItem } from "./work.shift.detail";
import { WorkShiftList } from "./work.shift.list";

export class WorkShift extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            workShift:{},
            selectedItem: {}
        }
    }

    componentDidMount =() => {
        const {workShift} = this.props;
        if(!workShift) return;
        this.setState({workShift: workShift});
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.workShift !== nextProps.workShift)
        {
            this.setState({workShift: nextProps.workShift});
        }
        return true;
    }

    onRefresh =(value) => {
        this.setState({refresh: value});
    }
    onRefreshed =()=> {
        this.setState({refresh: false});
    }

    onWorkShiftItemChange =(item) => {
        this.setState({selectedItem: item});
    }

    render =() => {
        const {workShift, refresh, selectedItem} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <WorkShiftList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onWorkShiftItemChange} workShift={workShift}/>
            </div>
            <div className="flex-fill ml-2 h-100">
                <WorkShiftDetailItem workShift={workShift} onRefresh={this.onRefresh} model={selectedItem} />
            </div>
            <ReactTooltip />
        </div>
        )
    }
}