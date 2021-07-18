import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export class NoDataTableContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colspan: 0
        }
    }

    componentDidMount = () => {
        const {colspan} = this.props;
        if(colspan)
        {
            this.setState({colspan});
        }
    }

    render = () => {
        const {colspan} = this.state;
        return (
            <tr>
                <td colSpan={colspan}>
                    <div className="d-flex justify-content-center">
                        <h6><FontAwesomeIcon icon={faExclamationTriangle} color="#e89a2e" /> Chưa có dữ liệu.</h6>
                    </div>
                </td>
            </tr>
        )
    }
}