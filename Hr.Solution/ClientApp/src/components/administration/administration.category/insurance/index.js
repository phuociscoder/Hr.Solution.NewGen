import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { EmployeeTypeDetailItem, InsuranceTypeDetail } from "./InsuranceType.Detail";
import { EmployeeTypeList, InsuranceTypeList } from "./InsuranceType.list";

export class InsuranceConfig extends React.Component{
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
        this.setState({selectedItem: item});
    }

    render =() => {
        const {category, refresh, selectedItem} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <InsuranceTypeList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onCategoryItemChange} category={category}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <InsuranceTypeDetail category={category} onRefresh={this.onRefresh} model={selectedItem} />
            </div>
            <ReactTooltip />
        </div>
        )
    }
}