import React from "react";
import './loading.css';

export class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    componentDidMount=()=> {
        const {show} =this.props;
        this.setState({show:show});
    }

    shouldComponentUpdate =(nextProps) => {
        if(this.props.show !== nextProps.show)
        {
            this.setState({show: nextProps.show});
        }
        return true;
    }

    render = () => {
        const { show } = this.state;
        if (show) {
            return (
                <div className="loading"><div></div><div></div><div></div><div></div></div>
            )
        } else {
            return null;
        }
    }
}