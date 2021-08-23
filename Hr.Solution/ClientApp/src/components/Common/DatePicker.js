import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import DatePicker from 'react-date-picker';

export class CustomDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
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
        const { value } = this.props;
        if (value) {
            this.setState({ value: new Date(value) });
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.value != nextProps.value) {
            this.setState({ value: new Date(nextProps.value) });
        }
        return true;
    }

    render = () => {
        const { value } = this.state;
        return (
            <DatePicker
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