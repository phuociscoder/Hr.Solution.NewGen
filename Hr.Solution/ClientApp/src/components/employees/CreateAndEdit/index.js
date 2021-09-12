import { faRecycle, faSave, faTimes, faTimesCircle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { EmpMenus, Mode } from "../Constanst";
import { EmployeeGeneralInfo } from "../parts/generalInfo";
import { EmployeeLeftMenu } from "./left-menu";

export class EmployeeCreateEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            mode: Mode.Create,
            menuId: EmpMenus.GeneralInfo
        }
    }

    onMenuChange = (menuId) => {
        this.setState({ menuId });
    }

    render = () => {
        const menu = EmpMenus.All.find(x => x.id === this.state.menuId);
        const { mode } = this.state;

        return (
            <div className="w-100 h-100 d-flex">
                <div className="w-15 h-100 p-2 ">
                    <EmployeeLeftMenu onMenuChange={this.onMenuChange} />
                    {
                        mode === Mode.Edit && <button className="btn btn-primary btn-change-user"><FontAwesomeIcon icon={faUsers} /></button>
                    }
                </div>
                <div className="w-100 h-100 pt-3 pl-2 pb-2 pr-2 ">
                    <div className="emp-detail-header text-uppercase font-weight-bold p-2 d-flex align-items-center border w-100 h-5">
                        {menu.icon} <span className="ml-1 mt-1">{menu.name}</span>
                    </div>
                    <div className="emp-detail-body p-3 border w-100 h-90">
                        {menu.id === EmpMenus.GeneralInfo && <EmployeeGeneralInfo />}
                    </div>
                    <div className="emp-detail-footer justify-content-end d-flex p-2 border w-100 ">
                        <button className="btn btn-info mr-auto"><FontAwesomeIcon icon={faRecycle} /><span className="ml-1">Hoàn tác</span></button>
                        <button className="btn btn-primary"><FontAwesomeIcon icon={faSave} /><span className="ml-1">Lưu Thay Đổi</span></button>
                        <button className="btn btn-danger ml-2"><FontAwesomeIcon icon={faTimesCircle} /><span className="ml-1">Hủy bỏ</span></button>
                    </div>
                </div>
            </div>
        )
    }
}