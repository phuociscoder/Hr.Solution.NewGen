import React from "react";
import { Redirect } from "react-router-dom";

const AuthorizationComponent = WrappedComponent => {
    console.log(WrappedComponent);
    return class extends React.Component {

        render = () => {
            return (
                <div>
                    {window.location.pathname}
                    {!WrappedComponent ?<WrappedComponent {...this.props} /> : <Redirect to="/login"/>}
                    
                </div>
            )
        }
    }
}
export default AuthorizationComponent;
