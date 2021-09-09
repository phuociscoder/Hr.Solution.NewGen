import React from "react";
import { TypeValidation } from "./Constants";

export class ValidateFieldMessage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message: "Không được bỏ trống trường này."
        }
    }

    componentDidMount = () => {
        const { message } = this.props;
        if (!message){ return; }
        this.setState({ message: message });        
    }

    render = () => {
        const { message } = this.state;
        return (
            <div>
                <label style={{ color: "red", fontStyle: "italic" }} >*{message}</label>
            </div>
        )
    }
}

export function ValidateField(fields){
    if(!fields) return;
    let fieldInValids = [];
    fields.forEach(e => {
        switch (e.type){
            case TypeValidation.required:
                if(!e.type) break;
                if(requiredField(e.value)){
                    fieldInValids.push({field: e.field, inValid: true, type: e.type});
                }
                break;
            default:
                break;
        }
    });

    return fieldInValids;

}

export function requiredField(value) {
    if(!value || (value.trim() === "")){
        return true;
    }
    return false;
}

