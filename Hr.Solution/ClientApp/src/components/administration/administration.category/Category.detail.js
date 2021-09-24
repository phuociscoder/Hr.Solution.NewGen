import React from "react";
import { AllowanceTypeConfig } from "./allowancetype";
import { CategoryCommonDetail } from "./common";
import { CategoryModule } from "./Constants";
import { DepartmentConfig } from "./department";
import { EmployeeTypeConfig } from "./employeetype";
import { WorkDayConfig } from "./WorkDay";

export class CategoryDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: null
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.category !== nextProps.category) {
            this.setState({ category: nextProps.category });
        }
        if (this.props.prefix !== nextProps.prefix) {
            this.setState({ prefix: nextProps.prefix });
        }
        return true;
    }

    generateContentModule = (category) => {
        if (!category) return null;
        let result;
        switch (category.id) {
            case CategoryModule.Department:
                result = <DepartmentConfig prefix={this.state.prefix} />;
                break;
            case CategoryModule.WorkDay:
                result = <WorkDayConfig category={category} />
                break;
            case CategoryModule.EmployeeType:
              result = <EmployeeTypeConfig prefix={this.state.prefix} category={category} />;
                break;     
            case CategoryModule.AllowanceType:
              result = <AllowanceTypeConfig category={category} />; // 
                break;     
            default:
                result = <CategoryCommonDetail category={category} />;
                break;
        }
        return result;
    }

    render = () => {
        const { category } = this.state;
        return (
            <div className="h-100">
                {this.generateContentModule(category)}
            </div>
        )
    }
}