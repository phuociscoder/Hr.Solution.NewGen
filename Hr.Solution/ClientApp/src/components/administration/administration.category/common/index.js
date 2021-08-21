import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { CategoryCommonDetailItem } from "./Common.detail";
import { CategoryCommonList } from "./Common.list";

export class CategoryCommonDetail extends React.Component{
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

    onRefesh =(value) => {
        this.setState({refesh: value});
    }

    onCategoryItemChange =(item) => {
        this.setState({selectedItem: item});
    }

    render =() => {
        const {category, refesh, selectedItem} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <CategoryCommonList onChange={this.onCategoryItemChange} category={category}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <CategoryCommonDetailItem category={category} onRefesh={this.onRefesh} model={selectedItem} />
            </div>
            <ReactTooltip />
        </div>
        )
    }
}