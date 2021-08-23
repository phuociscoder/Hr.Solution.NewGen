import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Breadcrumb } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { AuthenticationManager } from "../../../AuthenticationManager";
import { AppRoute } from "../../AppRoute";
import { BreadcrumbCustom } from "../../BreadcrumbCustom";
import { NotificationType } from "../../Common/notification/Constants";
import { ShowNotification } from "../../Common/notification/Notification";
import { CategoryServices } from "./Category.services";

const WrapperCategoryDetail = WrappedComponent => {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                categoryInfo: {},
                path: '',
                title: ''
            }
        }

        componentDidMount = () => {
            const categoryId = this.props.match.params.id;
            if(!AuthenticationManager.AllowView(categoryId)) 
            {
                this.props.history.push('/notFound');
                return;
            }
            this.getCategory(categoryId);
        }

        getCategory = (id) => {
            CategoryServices.GetCategoryById(id)
                .then(response => {
                    if (response.data) {
                        let categoryInfo = response.data;
                        this.setState({ categoryInfo: categoryInfo });
                    }
                }, error => {
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể đi đến trang thiết lập");
                    const categoryPath = AppRoute.CATEGORY_LIST.path;
                    this.props.history.push(categoryPath);
                });
        }

        render = () => {
            const { categoryInfo } = this.state;
            return (
                <div className="component-container">
                    <div className="d-flex align-items-center h-5">
                        <span className="component-title text-uppercase">{`Thiết lập ${categoryInfo.name}`}</span>
                        <div className="ml-auto">
                            <Breadcrumb>
                                <Breadcrumb.Item><Link to={AppRoute.HOME.path}>{AppRoute.HOME.name}</Link></Breadcrumb.Item>
                                <Breadcrumb.Item><Link to={AppRoute.CATEGORY_LIST.path}>{AppRoute.CATEGORY_LIST.name}</Link></Breadcrumb.Item>
                                <Breadcrumb.Item active className="text-uppercase">{`Thiết lập ${categoryInfo.name}`}</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>

                    <ReactCSSTransitionGroup transitionName="example" transitionAppear={true}>
                        <div className="component-content d-flex flex-column w-100 h-95">
                            {WrappedComponent ? <WrappedComponent category={categoryInfo} {...this.props} /> : <Redirect to="/login" />}
                        </div>
                    </ReactCSSTransitionGroup>
                </div>
            )
        }
    }
}
export default WrapperCategoryDetail;
