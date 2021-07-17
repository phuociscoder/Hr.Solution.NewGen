import React from "react";
import { Breadcrumb, BreadcrumbItem } from "react-bootstrap";
import { RoutePath } from "./Common/Constants";
import { faHome, faAddressCard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export class BreadcrumbCustom extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            breadcrumbItems : []
        }
    }
    componentDidMount =() => {
        this.generateBreadcrumbItems();
    }

    generateBreadcrumbItems =() => {
        const {path} = window.location.pathname;
        let items = [];
        switch (path) {
            case RoutePath.EMPLOYEE_MANAGEMENT:
                items.push({name: "TRANG CHỦ", href: RoutePath.HOME, icon: {faHome} });
                items.push({name: "QUẢN LÝ NHÂN VIÊN", href: RoutePath.EMPLOYEE_MANAGEMENT, icon: {faAddressCard} });
                break;
        
            default:
                items.push({name: "TRANG CHỦ", href: RoutePath.HOME });
                break;
        }
        this.setState({breadcrumbItems: items});
        console.log(items);
    }

    render =() => {
        const {breadcrumbItems} = this.state;
        return (
            <Breadcrumb>
            {breadcrumbItems && breadcrumbItems.map((item, index) => {
                return(
                <Breadcrumb.Item href={item.href}><FontAwesomeIcon icon={faHome}/> {item.name}</Breadcrumb.Item>
                )
            })}
               
                    
            </Breadcrumb>
        )
    }
}