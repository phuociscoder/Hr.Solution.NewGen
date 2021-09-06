import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import DatePicker from 'react-date-picker';

export class CustomDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            disabled: false
        }
    }

    onDateChange = (value) => {
        const { onDateChange } = this.props;
        this.setState({ value }, onDateChange(value));
    }

    onClearDate = () => {
        this.onDateChange(null);
    }

    componentDidMount = () => {
        const { value, disabled } = this.props;
        if (value) {
            this.setState({ value: new Date(value) });
        }
        //Vantt12_TODO
        if (disabled) {
            this.setState({ disabled: disabled });
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.value != nextProps.value) {
            this.setState({ value: new Date(nextProps.value) });
        }

        if (this.props.disabled != nextProps.disabled) {
            this.setState({ disabled: nextProps.disabled });
        }
        return true;
    }

    render = () => {
        const { value, disabled } = this.state;
        return (
            <DatePicker
                //Vantt12_TODO
                // disabled={true}
                disabled={disabled}
                className="form-control"
                dayPlaceholder="Ngày"
                monthPlaceholder="Tháng"
                yearPlaceholder="Năm"
                value={value}
                showLeadingZeros={true}
                clearIcon={<FontAwesomeIcon icon={faTimes} onClick={this.onClearDate} />}
                onChange={this.onDateChange} />
        )
    }
}