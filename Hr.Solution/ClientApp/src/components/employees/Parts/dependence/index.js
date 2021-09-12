import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { DependenceDetailItem } from "./dependence.detail";
import { DependenceList } from "./dependences.list";

export class EmpDependence extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            dependence:{},
            selectedItemDepend: {}
        }
    }

    componentDidMount =() => {
        const {dependence} = this.props;
        if(!dependence) return;
        this.setState({dependence: dependence});
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.dependence !== nextProps.dependence)
        {
            this.setState({dependence: nextProps.dependence});
        }
        return true;
    }

    onRefresh =(value) => {
        this.setState({refresh: value});
    }
    onRefreshed =()=> {
        this.setState({refresh: false});
    }

    onDependenceItemChange =(item) => {
        this.setState({selectedItemDepend: item});
    }

    render =() => {
        const {dependence, refresh, selectedItemDepend} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <DependenceList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onDependenceItemChange} dependence={dependence}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <DependenceDetailItem dependence={dependence} onRefresh={this.onRefresh} model={selectedItemDepend} />
            </div>
            <ReactTooltip />
        </div>
        )
    }
}