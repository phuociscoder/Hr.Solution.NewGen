import React from "react";
import { TreeView } from "../../Common/TreeView";

export class DepartmentFilter extends React.Component{
    constructor(props)
    {
        super(props);
        this.state ={
            departments : []
        }
    }

    componentDidMount =() => {
        this.getDepartment();
    }

    getDepartment =() => {
        const items = [
            { id: 1, name: "FPT Software HCM", parent: null, isExpanded: true, isSelected: false },
            { id: 2, name: "Department A", parent: 1, isExpanded: true, isSelected: false },
            { id: 3, name: "Department B", parent: 2, isExpanded: true, isSelected: false },
            { id: 4, name: "Department C", parent: 2, isExpanded: true, isSelected: false },
            { id: 5, name: "Department D", parent: 3, isExpanded: true, isSelected: false },
            { id: 6, name: "Department E", parent: 1, isExpanded: true, isSelected: false },
            { id: 7, name: "Department F", parent: 6, isExpanded: true, isSelected: false },
            { id: 8, name: "Department G", parent: 5, isExpanded: true, isSelected: false },
            { id: 9, name: "Global Cybersoft VN", parent: null, isExpanded: false, isSelected: false },
            { id: 10, name: "Department G", parent: 9, isExpanded: true, isSelected: false },
        ];
        this.setState({ departments: items });
    }
    
    onDepartmentSelectedChange =(ids) => {
        const {onDepartmentSelectedChange} = this.props;
        onDepartmentSelectedChange(ids);
    }

    render =() => {
        const {departments} = this.state;
        return (
           <TreeView model={departments} onModelChange={this.onDepartmentSelectedChange}></TreeView>
        )
    }
}