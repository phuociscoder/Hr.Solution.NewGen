import React from "react";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { RoutePath } from "./Common/Constants";
import { faHome, faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class BreadcrumbCustom extends React.Component{
    constructor(props){
        super(props);
    }
    componentDidMount =() => {
        const path =window.location.pathname;
        this.setState({path});
    }

    generateBreadcrumbItems =() => {
        const {path} = this.state;
        let items = [];
        switch (path) {
            case RoutePath.EMPLOYEE_MANAGEMENT:
                items.push({name: "TRANG CHỦ", href: RoutePath.HOME, icon: {faHome} });
                items.push({name: "QUẢN LÝ NHÂN VIÊN", href: RoutePath.EMPLOYEE_MANAGEMENT, icon: {faAddressCard} });
                break;
        
            default:
                break;
        }
        this.setState({breadcrumbItems: items});
    }

    render =() => {
        return (
            <Breadcrumb>
               
                    <Breadcrumb.Item href="#"> TRANG CHỦ</Breadcrumb.Item>
            </Breadcrumb>
        )
    }
}