import React from "react";
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { DepartmentServices } from '../../administration/admin.department/Department.services';
import _ from "lodash";
import './DepartmentSelect.css';
import { Image } from "react-bootstrap";

export class DepartmentSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            selectItem: null
        }
    }

    componentDidMount = () => {
        // this.loadDepartments().then(
        //     response => {
        //         console.log(response);
        //     }, error => { }
        // );
    }

    loadDepartments = (freeText) => {
        return new Promise(resolve => {
            DepartmentServices.GetByFreeText({ freeText: freeText ?? '' })
                .then(response => {
                    const options = this.generateDepartmentOptions(response.data);
                    this.setState({ options: options });
                    resolve(options);
                }, error => { });
        });

    }

    generateDepartmentOptions = (departments) => {
        let options = [];
        const levels = _.uniq(_.orderBy(departments, ['level'], ['asc']).map(x => { return x.level }));
        levels.forEach(level => {
            let depts = departments.filter(x => x.level === level);
            if (depts && depts.length > 0) {
                depts = _.orderBy(depts, ["departmentCode"], ["desc"]);
            }
            depts.forEach(dept => {
                const parent = options.find(x => x.id === dept.parentId);
                if (!parent) {
                    options.splice(0, 0, dept);
                } else {
                    const parentIndex = options.findIndex(x => x.id === parent.id);
                    options.splice(parentIndex + 1, 0, dept);
                }
            });

        });

        return options;
    }



    onChange = (e) => {
        this.setState({ selectItem: e });
    }

    optionFormat = (opt) => {
        const { options } = this.state;
        const isRoot = opt.parentId === null || opt.parent === '';
        const isHasChilds = options.some(x => x.parentId === opt.id);
        return (
            <>
                <div className={`w-100 border-bottom ${isRoot ? 'root-option' : isHasChilds ? 'sub-option' : 'option'}`} style={{ paddingLeft: `${opt.level * 2}rem` }}>
                    <div className="h-100 border-left pl-2">{opt.logo ? <Image className="mb-1" src={opt.logo} width={25} height={25} /> : null} {opt.departmentName} - <i>{opt.departmentCode}</i></div>
                </div>
            </>
        )
    }

    render = () => {
        const { options, selectItem } = this.state;
        const placeholder = "- Chọn bộ phận -";
        return (
            <AsyncSelect
                loadOptions={this.loadDepartments}
                defaultOptions
                value={selectItem}
                isClearable
                isMulti={false}
                noOptionsMessage={x => x.inputValue = "Không có dữ liệu"}
                placeholder={placeholder}
                onChange={this.onChange}
                formatOptionLabel={this.optionFormat}
                components={this.SingleValue}
                getOptionLabel={x => x.departmentName}
                getOptionValue={x => x.id}
                {...this.props}
            />
        )
    }
}