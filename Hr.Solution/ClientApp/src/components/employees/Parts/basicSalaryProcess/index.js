import React from "react";
import { EmployeeSalaryProcessDetail } from "./basicSalProc.detail";
import { EmployeeSalaryProcessList } from "./basicSalProc.list";

export class EmployeeSalaryProcess extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            employeeSalaryProcesss:[],
            selectedSalaryProcess: {}
        }
    }

    componentDidMount =() => {
        const {models} = this.props;
        if(!models) return;
        this.setState({employeeSalaryProcesss: models});
    }

    updateModels = (SalaryProcess) => {
        switch (SalaryProcess.type) {
            case "A":
                this.addSalaryProcess(SalaryProcess.model);
                break;
            case "E":
                this.updateSalaryProcess(SalaryProcess.model);
                break;
            case "D":
                this.removeSalaryProcess(SalaryProcess.model);
                break;
            default:
                break;
        }
    }

    addSalaryProcess = (newModel) => {
        const {onModelChange} = this.props;
        newModel.type = "ADD";
        const { employeeSalaryProcesss } = this.state;
        const newModels = [...employeeSalaryProcesss, newModel];
        this.setState({ employeeSalaryProcesss: newModels }, onModelChange(newModels));
    }

    updateSalaryProcess = (editModel) => {
        const {onModelChange} = this.props;
        if (editModel.id) {
            editModel.type = "EDIT";
        }
        const { employeeSalaryProcesss, selectedSalaryProcess } = this.state;
        const newModels = [...employeeSalaryProcesss.filter(x => x !== selectedSalaryProcess), editModel];
        this.setState({ employeeSalaryProcesss: newModels }, onModelChange(newModels));
    }

    removeSalaryProcess = (rAllowance) => {
        const {onModelChange} = this.props;
        rAllowance.type = "DELETE";
        const { employeeSalaryProcesss, selectedSalaryProcess } = this.state;
        const newModels = [...employeeSalaryProcesss.filter(x => x !== selectedSalaryProcess), rAllowance];
        this.setState({ employeeSalaryProcesss: newModels }, onModelChange(newModels));
    }

    onSelectItemChange =(item) => {
        this.setState({selectedSalaryProcess: item});
    }

    render =() => {
        const {employeeSalaryProcesss, selectedSalaryProcess} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <EmployeeSalaryProcessList models={employeeSalaryProcesss} onChange={this.onSelectItemChange}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <EmployeeSalaryProcessDetail onRefresh={this.onRefresh} model={selectedSalaryProcess} onUpdateModels={this.updateModels} />
            </div>
        </div>
        )
    }
}