import React from "react";
import { DependenceDetailItem, EmployeeBasicSalProcDetail } from "./basicSalProc.detail";
import { EmployeeBasicSalProcList } from "./basicSalProc.list";

export class EmployeeBasicSalProc extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            employeeBasicSalProcs:[],
            selectedBasicSalProc: {}
        }
    }

    componentDidMount =() => {
        const {models} = this.props;
        if(!models) return;
        this.setState({employeeBasicSalProcs: models});
    }

    updateModels = (BasicSalProc) => {
        switch (BasicSalProc.type) {
            case "A":
                this.addBasicSalProc(BasicSalProc.model);
                break;
            case "E":
                this.updateBasicSalProc(BasicSalProc.model);
                break;
            case "D":
                this.removeBasicSalProc(BasicSalProc.model);
                break;
            default:
                break;
        }
    }

    addBasicSalProc = (newModel) => {
        const {onModelChange} = this.props;
        newModel.type = "ADD";
        const { employeeBasicSalProcs } = this.state;
        const newModels = [...employeeBasicSalProcs, newModel];
        this.setState({ employeeBasicSalProcs: newModels }, onModelChange(newModels));
    }

    updateBasicSalProc = (editModel) => {
        const {onModelChange} = this.props;
        if (editModel.id) {
            editModel.type = "EDIT";
        }
        const { employeeBasicSalProcs, selectedBasicSalProc } = this.state;
        const newModels = [...employeeBasicSalProcs.filter(x => x !== selectedBasicSalProc), editModel];
        this.setState({ employeeBasicSalProcs: newModels }, onModelChange(newModels));
    }

    removeBasicSalProc = (rAllowance) => {
        const {onModelChange} = this.props;
        rAllowance.type = "DELETE";
        const { employeeBasicSalProcs, selectedBasicSalProc } = this.state;
        const newModels = [...employeeBasicSalProcs.filter(x => x !== selectedBasicSalProc), rAllowance];
        this.setState({ employeeBasicSalProcs: newModels }, onModelChange(newModels));
    }

    onSelectItemChange =(item) => {
        this.setState({selectedBasicSalProc: item});
    }

    render =() => {
        const {employeeBasicSalProcs, selectedBasicSalProc} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <EmployeeBasicSalProcList models={employeeBasicSalProcs} onChange={this.onSelectItemChange}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <EmployeeBasicSalProcDetail onRefresh={this.onRefresh} model={selectedBasicSalProc} onUpdateModels={this.updateModels} />
            </div>
        </div>
        )
    }
}