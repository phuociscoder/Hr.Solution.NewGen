import React from "react";
import { CategoryCommonDetail } from "./common";
import { CategoryModule } from "./Constants";
import { DepartmentConfig } from "./department";

export class CategoryDetail extends React.Component{
    constructor(props)
    {
        super(props);
        this.state ={
            category: null
        }
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.category !== nextProps.category)
        {
            this.setState({category: nextProps.category});
        }
        if(this.props.prefix !== nextProps.prefix)
        {
            this.setState({prefix: nextProps.prefix});
        }
        return true;
    }

    generateContentModule =(category) => {
        if(!category) return null;
        let result;
        switch (category.id) {
            case CategoryModule.Department:
              result = <DepartmentConfig prefix={this.state.prefix} />;
                break;
            default:
               result = <CategoryCommonDetail category={category} />;
                break;
        }
        return result;
    }

    render =() => {
        const {category} = this.state;
        return (
            <div className="h-100">
                {this.generateContentModule(category)}
            </div>
        )
    }
}