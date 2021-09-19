import React from "react";
import ReactTooltip from "react-tooltip";
import { WorkTypeDetailItem } from "./work.type.detail";
import { WorkTypeList } from "./work.type.list";

export class WorkType extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            workType:{},
            selectedItem: {}
        }
    }

    componentDidMount =() => {
        const {workType} = this.props;
        if(!workType) return;
        this.setState({workType: workType});
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.workType !== nextProps.workType)
        {
            this.setState({workType: nextProps.workType});
        }
        return true;
    }

    onRefresh =(value) => {
        this.setState({refresh: value});
    }
    onRefreshed =()=> {
        this.setState({refresh: false});
    }

    onWorkTypeItemChange =(item) => {
        this.setState({selectedItem: item});
    }

    render =() => {
        const {workType, refresh, selectedItem} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <WorkTypeList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onWorkTypeItemChange} workType={workType}/>
            </div>
            <div className="flex-fill ml-2 h-100">
                <WorkTypeDetailItem workType={workType} onRefresh={this.onRefresh} model={selectedItem} />
            </div>
            <ReactTooltip />
        </div>
        )
    }
}