import React from "react";
import { Card } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import { CustomSelect } from "../../../Common/CustomSelect";
import { CategoryCommonList } from "../common/Common.list";
import { CategoryModule } from "../Constants";
import { TypeNations } from "./Constants";
import { NatiProvDiscWardDetails } from "./NatiProvDiscWard.detail";
import { NatiProvDiscWardList } from "./NatiProvDiscWardList";

export class NatiProvDiscWardConfig extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            refesh: false,
            category:{},
            selectedItem: {},
            prefix: '',
            apiDropdown: '/api/Department',
            labelField: 'departmentName',
            valueField: 'id',
            idTypeCategory: ''
        }
    }

    componentDidMount =() => {
        const { category, prefix } = this.props;
        if(!category) return;
        this.setState({category: category, prefix: prefix});
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

    onRefresh =(value) => {
        this.setState({refresh: value});
    }
    onRefreshed =()=> {
        this.setState({refresh: false});
    }

    onCategoryItemChange =(item) => {
        this.setState({selectedItem: item});
    }

    onDepartmentChange =(id) => {
        console.log(id);
        this.setState({idTypeCategory: id});
    }

    render =() => {
        const {category, refresh, selectedItem, apiDropdown, valueField, labelField, prefix, idTypeCategory} = this.state;
        console.log('category: ', category);
        console.log('prefix: ', prefix);
        console.log('idTypeCategory: ', idTypeCategory);
        return (
            <div>
                {
                    ((prefix == CategoryModule.Province) || (prefix == CategoryModule.District) || (prefix == CategoryModule.Ward))
                    && <label className="w-20 mt-2 mr-2 text-camelcase">
                                <b>Quốc gia:</b>
                                <CustomSelect dataUrl={apiDropdown} className="w-100" 
                                orderBy="desc" 
                                isHierachy={true}
                                // disabledValue={id}
                                // valueField={valueField}
                                labelField={labelField}
                                onValueChange={this.onDepartmentChange} />
                            </label>
                }
                {
                    ((prefix == CategoryModule.District) || (prefix == CategoryModule.Ward))
                    && <label className="w-20 mt-2 mr-2 text-camelcase">
                                <b>Tỉnh/ Thành phố:</b>
                                <CustomSelect dataUrl={apiDropdown} className="w-100" 
                                orderBy="desc" 
                                isHierachy={true}
                                // disabledValue={id}
                                // valueField={valueField}
                                labelField={labelField}
                                onValueChange={this.onDepartmentChange} />
                            </label>
                }
                {
                    (prefix == CategoryModule.Ward) && <label className="w-20 mt-2 mr-2 text-camelcase">
                                <b>Quận/ Huyện:</b>
                                <CustomSelect dataUrl={apiDropdown} className="w-100" 
                                orderBy="desc" 
                                isHierachy={true}
                                // disabledValue={id}
                                // valueField={valueField}
                                labelField={labelField}
                                onValueChange={this.onDepartmentChange} />
                            </label>
                }
                <div className="d-flex w-100 h-100">
                    <div className="w-20 h-100">
                        <NatiProvDiscWardList onRefreshed={this.onRefreshed} refresh={refresh} onChange={this.onCategoryItemChange} category={category} idTypeCategory={idTypeCategory}/>
                    </div>
                    <div className="flex-fill ml-2 h-100">
                        <NatiProvDiscWardDetails category={category} onRefresh={this.onRefresh} model={selectedItem} />
                    </div>
                    <ReactTooltip />
                </div>
            </div>
        )
    }
}
