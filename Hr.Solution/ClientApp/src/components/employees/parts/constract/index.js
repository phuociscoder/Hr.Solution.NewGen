import React from "react";
import { DependenceDetailItem, EmployeeContractDetail, EmployeeDependantDetail } from "./contract.detail";
import { EmployeeContractList, EmployeeDependantList } from "./contract.list";

export class EmployeeContract extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            employeeContracts:[],
            selectedContract: {}
        }
    }

    componentDidMount =() => {
        const {models} = this.props;
        if(!models) return;
        this.setState({employeeContracts: models});
    }

    updateModels = (contract) => {
        switch (contract.type) {
            case "A":
                this.addModel(contract.model);
                break;
            case "E":
                this.updateModel(contract.model);
                break;
            case "D":
                this.removeModel(contract.model);
                break;
            default:
                break;
        }
    }

    addModel = (newModel) => {
        const {onModelChange} = this.props;
        newModel.type = "ADD";
        const { employeeContracts } = this.state;
        const newModels = [...employeeContracts, newModel];
        this.setState({ employeeContracts: newModels }, onModelChange(newModels));
    }

    updateModel = (editModel) => {
        const {onModelChange} = this.props;
        if (editModel.id) {
            editModel.type = "EDIT";
        }
        const { employeeContracts, selectedContract } = this.state;
        const newModels = [...employeeContracts.filter(x => x !== selectedContract), editModel];
        this.setState({ employeeContracts: newModels }, onModelChange(newModels));
    }

    removeModel = (deleteModel) => {
        const {onModelChange} = this.props;
        deleteModel.type = "DELETE";
        const { employeeContracts, selectedContract } = this.state;
        const newModels = [...employeeContracts.filter(x => x !== selectedContract), deleteModel];
        this.setState({ employeeContracts: newModels }, onModelChange(newModels));
    }

    onSelectItemChange =(item) => {
        this.setState({selectedContract: item});
    }

    render =() => {
        const {employeeContracts, selectedContract} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <EmployeeContractList models={employeeContracts} onChange={this.onSelectItemChange}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <EmployeeContractDetail onRefresh={this.onRefresh} model={selectedContract} onUpdateModels={this.updateModels} />
            </div>
        </div>
        )
    }
}