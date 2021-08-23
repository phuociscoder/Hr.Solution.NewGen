import React from "react";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { Type } from "../../admin.department/Constants";
import { DepartmentList } from "../../admin.department/DepartmentList";
import { AdminDataRoleServices } from "./admin.dataRoles.services";

export class DataRoleDepartments extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            selectedDataRoleId: null,
            selectedDepartments: []
        }
    }

    componentDidMount= () => {
        const {selectedRoleId} = this.props;
        if(selectedRoleId)
        {
            this.setState({selectedDataRoleId: selectedRoleId}, this.loadDataRoleDepartments(selectedRoleId));
        }
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.selectedRoleId !== nextProps.selectedRoleId)
        {
            this.setState({selectedDataRoleId: nextProps.selectedRoleId}, this.loadDataRoleDepartments(nextProps.selectedRoleId));
        }
        return true;
    }

    loadDataRoleDepartments =(roleId) => {
        AdminDataRoleServices.GetDataRoleDepartments(roleId)
        .then(response => {
            let selectedValues =[];
           if(response.data && response.data.length > 0)
           {
                selectedValues = response.data.map(item => {
                    return item.departmentId;
                });
           }
           this.setState({selectedDepartments: selectedValues});
        }, error => {
            debugger;
        });
    }

    onValueChange =(values) => {
        const {selectedDataRoleId} = this.state; 
        AdminDataRoleServices.UpdateDataRoleDepartments(selectedDataRoleId, {departmentIds: values?? []})
        .then(response => {
            ShowNotification(NotificationType.SUCCESS, "Cập nhật bộ phận cho vùng dữ liệu thành công");
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! không thể cập nhật bộ phận cho vùng dữ liệu");
        })

    }

    render=() => {
        const {selectedDepartments} = this.state;
        return (
            <DepartmentList onValueChange={this.onValueChange} values={selectedDepartments} isMultipleSelect={true} type={Type.Module}/>
        )
    }
}