import React from "react";
import _, { isNaN } from "lodash";

export class Amount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: '',
            value: null
        }
    }

    componentDidMount = () => {
        const { seperator, amount } = this.props;
        this.setState({ seperator: seperator ?? '.', value: amount }, this.convertInput(amount));
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.seperator !== nextProps.seperator) {
            this.setState({ seperator: nextProps.seperator });
        }

        if (this.props.amount !== nextProps.amount) {
            this.setState({ value: nextProps.amount }, this.convertInput(nextProps.amount));
        }
        return true;
    }

    convertInput = (input) => {
        const { onAmountChange } = this.props;
        const seperator = this.state.seperator ?? '.';
        if (!input) {
            this.setState({ display: input, value: 0 }, onAmountChange(parseInt(0)));
            return;
        }
        let value = input.toString().replaceAll(seperator, '');
        if (!isFinite(value)) {
            return;
        } else {
            let arrReverted = _.reverse(value.split(''));
            arrReverted = _.reverse(_.chunk(arrReverted, 3));

            arrReverted = arrReverted.map(x => {
                return _.join(_.reverse(x), '');
            });
            arrReverted = _.concat(arrReverted);
            const displayValue = _.join(arrReverted, seperator ?? '.');
            this.setState({ display: displayValue, value: parseInt(value) }, onAmountChange(parseInt(value)));
        }
    }

    onChange = (e) => {
        const input = e.target.value;
        this.convertInput(input);
    }

    render = () => {
        const { display} = this.state;
        return (
            <input type="text" {...this.props} value={display} onChange={this.onChange} />
        )
    }
}