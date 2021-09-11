import React from "react";

export class EmployeeGeneralInfo extends React.Component{
    constructor(props){
        super(props);
    }

    render = () => {
        return(
            <div className="w-100 h-100 animate__animated animate__fadeIn">
                General Info
            </div>
        )
    }
}