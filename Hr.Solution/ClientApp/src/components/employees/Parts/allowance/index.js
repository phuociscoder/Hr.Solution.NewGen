import _ from "lodash";
import React from "react";
import { Mode } from "../../Constanst";
import { EmployeeAllowanceDetail } from "./allowance.detail";
import { EmployeeAllowanceList } from "./allowance.list";


export class EmployeeAllowance  extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            employeeAllowances: [],
            mode: Mode.Create
        }
    }

    componentDidMount =() => {
      
    }

    updateModels =(allowance) => {
        switch (allowance.type) {
            case "A":
                this.addAllowance(allowance.model);
                break;
            case "E":
                this.updateAllowance(allowance.model);
                break;
            case "D":
                this.removeAllowance(allowance.model);
                break;
            default:
                break;
        }
    }

    addAllowance =(newModel) => {
        newModel.type = "ADD";
        const {employeeAllowances} = this.state;
        const newModels = [...employeeAllowances, newModel];
        this.setState({employeeAllowances: newModels});
    }

    loadEmployeeAllowances =() => {
        const {mode} = this.state;
        if(mode === Mode.Edit)
        {
            
        }
    }


    render =() => {
        const {employeeAllowances, refresh, selectedItemDepend} = this.state;
        return (
            <div className="d-flex w-100 h-100">
            <div className="w-20 h-100">
                <EmployeeAllowanceList refresh={refresh} models={employeeAllowances}/>
            </div>
            <div className="flex-fill ml-2 h-100">
               <EmployeeAllowanceDetail updateModels={this.updateModels} />
            </div>
        </div>
        )
    }
}