import React, { Children } from "react";
import Select ,{components}  from 'react-select';

export class CustomSelect extends React.Component{
    constructor(props)
    {
        super(props);
        this.state ={
            options: [],
            placeholder: '',
            selectedModel: {}
        }
        
    }

    componentDidMount =() => {
        const {options, placeholder} = this.props;
        if(options)
        {
            this.setState({options});
        }
        if(placeholder)
        {
            this.setState({placeholder});
        }

        const select = options.filter(x => x.id===1);
        this.setState({selectedMmodel: select});
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.options != nextProps.options)
        {
            this.setState({options: nextProps.options})
            const select = nextProps.options.filter(x => x.id===1);
            this.setState({selectedMmodel: select});
        }
        return true;
    }

    onChange =(value) => {
        this.setState({selectedModel: value});
    }

    render =() => {
        const {options, placeholder, selectedModel} = this.state;
        return (
            <Select
                options={options}
                isClearable
                isMulti
                noOptionsMessage={x => x.inputValue = "Không có dữ liệu"}
                placeholder= {placeholder}
                onChange ={this.onChange}
                getOptionLabel={x=> x.name}
                getOptionValue={x=> x.id}
            >

            </Select>
        )
    }
}