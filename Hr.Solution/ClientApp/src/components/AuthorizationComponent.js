import React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Redirect } from "react-router-dom";
import { AppRoute } from "./AppRoute";
import { BreadcrumbCustom } from "./BreadcrumbCustom";

const AuthorizationComponent = WrappedComponent => {
    return class extends React.Component {
        constructor() {
            super();
            this.state = {
                path: '',
                title: ''
            }
        }

        componentDidMount = () => {
            this.setState({ path: window.location.pathname });
            this.getComponentName();
        }

        getComponentName =() => {
            const path = window.location.pathname;
            const title = AppRoute.ALL.find(x => x.path === path || path.includes(x.alias)).name;
            this.setState({title});
        }

        render = () => {
            const { path, title } = this.state;
            return (
                <div className="component-container">
                    <div className="d-flex align-items-center">
                        <span className="component-title uppercase">{title}</span>
                        <div className="ml-auto">
                            <BreadcrumbCustom path={path} />
                        </div>
                    </div>
                    <div className="component-content">
                    <ReactCSSTransitionGroup transitionName="example" transitionAppear={true}>
                    {WrappedComponent ? <WrappedComponent {...this.props} /> : <Redirect to="/login" />}
                    </ReactCSSTransitionGroup>
                    </div>
                    

                </div>
            )
        }
    }
}
export default AuthorizationComponent;
