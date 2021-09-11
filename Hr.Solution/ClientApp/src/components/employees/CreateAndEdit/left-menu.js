import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { EmpMenus } from "../Constanst";
import './empCreateEdit.css';

export class EmployeeLeftMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedMenu: EmpMenus.GeneralInfo
        }
    }

    onMenuClick = (id) => {
        const {onMenuChange} = this.props;
        const { selectedMenu } = this.state;
        if (id === selectedMenu) return;
        this.setState({ selectedMenu: id }, onMenuChange(id));
    }

    render = () => {
        const menus = EmpMenus.All;
        const { selectedMenu } = this.state;
        return (
            <div className="w-100 h-100 d-flex flex-column">
                {
                    menus.map(menu => {
                        return (
                            <div className={`${selectedMenu === menu.id ? 'emp-left-menu-item-active' : 'emp-left-menu-item'} w-100 d-flex align-items-center border mt-1 p-3`}
                                onClick={() => this.onMenuClick(menu.id)}
                            >
                                {menu.icon}
                                <span className="font-weight-bold text-uppercase ml-1 mt-1">
                                    {menu.name}
                                </span>
                                {
                                    selectedMenu === menu.id &&
                                    <span className="ml-auto"><FontAwesomeIcon icon={faArrowRight} /> </span>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}