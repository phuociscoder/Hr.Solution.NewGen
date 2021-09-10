import React from "react";
import { TypeValidation } from "./Constants";

export class ValidateFieldMessage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inValid: false,
            fieldName: '',
            value: '',
            property: '',
        }
    }

    componentDidMount = () => {
        const { fieldName, property, value } = this.props;
        const inValid = this.checkRequired(value);
        const newModel = {inValid: inValid, fieldName: fieldName};
        this.setState({ fieldName: fieldName, property: property, value: value }, this.props.onValidate(newModel));        
    }

    shouldComponentUpdate = (nextProps) => {
        if(this.props.value != nextProps.value){
            const inValid = this.checkRequired(nextProps.value);
            const newModel = {inValid: inValid, fieldName: nextProps.fieldName};
            this.setState({ value: nextProps.value, inValid: inValid }, this.props.onValidate(newModel));
        }
        // if(nextProps.isSubmit){
        //     const inValid = this.checkRequired(nextProps.value);
        //     this.setState({ isSubmit: nextProps.isSubmit, inValid: inValid });
        // }
        return true;
    }

    checkRequired = (value) => {
        if(!value || (value.trim() === "") || (value === undefined)){
            return true;
        }
        return false;
    }

    render = () => {

        const { inValid, fieldName, value, property } = this.state;
        return (
            <>
                { inValid && <span style={{ color: "red", fontStyle: "italic" }} >*Không được bỏ trống {property}</span>}
            </>
        )
    }
}

export function ValidateField(fields){
    if(!fields) return;
    let fieldInValids = [];
    // fields
    // fields.forEach(e => {
    //     switch (e.type){
    //         case TypeValidation.required:
    //             if(requiredField(e.value)){
    //                 fieldInValids.push({field: e.field, inValid: true, type: e.type});
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // });

    return fieldInValids;

}

export function requiredField(value) {
    if(!value || (value.trim() === "") || (value === undefined)){
        return true;
    }
    return false;
}

