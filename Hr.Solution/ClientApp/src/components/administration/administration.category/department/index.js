import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { Type } from "../../admin.department/Constants";
import { DepartmentList } from "../../admin.department/DepartmentList";
import { DepartmentDetails } from "./Department.detail";

export class DepartmentConfig extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            category:{},
            selectedItem: {}
        }
    }

    componentDidMount =() => {
        const {category} = this.props;
        if(!category) return;
        this.setState({category: category});
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.category !== nextProps.category)
        {
            this.setState({category: nextProps.category});
        }
        return true;
    }

    onRefresh =(value) => {
        this.setState({refresh: value});
    }
    onRefreshed =()=> {
        this.setState({refresh: false});
    }

    onCategoryItemChange =(item) => {
        console.log(item);
        this.setState({selectedItem: item});
    }

    render =() => {
        const {category, refresh, selectedItem} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-30 h-100 card">
                <DepartmentList isMutipleSelect={false} fullLoad={false} type={Type.Select} onValueChange={this.onCategoryItemChange} values={[selectedItem]}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <DepartmentDetails category={category} onRefresh={this.onRefresh} model={selectedItem} />
            </div>
            <ReactTooltip />
        </div>
        )
    }
}