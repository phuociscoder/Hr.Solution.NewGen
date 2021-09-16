import React from "react";
import { DependenceDetailItem, EmployeeDependantDetail } from "./dependence.detail";
import { EmployeeDependantList } from "./dependences.list";

export class EmployeeDependant extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            employeeDependants:[],
            selectedDependant: {}
        }
    }

    componentDidMount =() => {
        const {models} = this.props;
        if(!models) return;
        this.setState({employeeDependants: models});
    }

    updateModels = (dependant) => {
        switch (dependant.type) {
            case "A":
                this.addDependant(dependant.model);
                break;
            case "E":
                this.updateDependant(dependant.model);
                break;
            case "D":
                this.removeDependant(dependant.model);
                break;
            default:
                break;
        }
    }

    addDependant = (newModel) => {
        const {onModelChange} = this.props;
        newModel.type = "ADD";
        const { employeeDependants } = this.state;
        const newModels = [...employeeDependants, newModel];
        this.setState({ employeeDependants: newModels }, onModelChange(newModels));
    }

    updateDependant = (editModel) => {
        const {onModelChange} = this.props;
        if (editModel.id) {
            editModel.type = "EDIT";
        }
        const { employeeDependants, selectedDependant } = this.state;
        const newModels = [...employeeDependants.filter(x => x !== selectedDependant), editModel];
        this.setState({ employeeDependants: newModels }, onModelChange(newModels));
    }

    removeDependant = (rAllowance) => {
        const {onModelChange} = this.props;
        rAllowance.type = "DELETE";
        const { employeeDependants, selectedDependant } = this.state;
        const newModels = [...employeeDependants.filter(x => x !== selectedDependant), rAllowance];
        this.setState({ employeeDependants: newModels }, onModelChange(newModels));
    }

    onSelectItemChange =(item) => {
        this.setState({selectedDependant: item});
    }

    render =() => {
        const {employeeDependants, selectedDependant} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <EmployeeDependantList models={employeeDependants} onChange={this.onSelectItemChange}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <EmployeeDependantDetail onRefresh={this.onRefresh} model={selectedDependant} onUpdateModels={this.updateModels} />
            </div>
        </div>
        )
    }
}