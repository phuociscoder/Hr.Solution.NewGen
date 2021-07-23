import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { AppRoute } from "./AppRoute";
import { Link } from "react-router-dom";

export class BreadcrumbCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems: [],
            path: ''
        }
    }
    componentDidMount = () => {
        this.generateBreadcrumbItems();
    }

    generateBreadcrumbItems = () => {
        const { path } = this.state;
        return AppRoute.ALL.find(x => x.path === path || path.includes(x.alias));
    }


    shouldComponentUpdate = (nextProps) => {
        if (this.props.path != nextProps.path) {
            this.setState({ path: nextProps.path });
        }
        return true;
    }



    render = () => {
        const breadcrumbItem = this.generateBreadcrumbItems();
        const name = breadcrumbItem ? breadcrumbItem.name : "TRANG CHỦ";
        return (
            <>
                <Breadcrumb>
                    {breadcrumbItem?.parent && breadcrumbItem.parent.map((item, index) => {
                        return (
                            <Breadcrumb.Item><Link to={item.path}>{item.name}</Link></Breadcrumb.Item>
                        )
                    })}
                    <Breadcrumb.Item active>{name}</Breadcrumb.Item>
                </Breadcrumb>
            </>
        )
    }
}
