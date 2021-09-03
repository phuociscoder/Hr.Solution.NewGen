import React from "react";
import { Card, Col, Dropdown, DropdownButton, Pagination, Row, Table } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

export class BaseListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount = () => {
        const { data, onLoading, prefix } = this.props;
        if (data) {
            this.setState({ data });
        }
        if(onLoading !== undefined)
        {
            this.setState({onLoading: onLoading});
        }
        if(prefix)
        {
            this.setState({prefix: prefix});
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if(this.props.onLoading !== nextProps.onLoading)
        {
            this.setState({onLoading: nextProps.onLoading});
        }
        if (this.props.data != nextProps.data) {
            this.setState({ data: nextProps.data });
        }
        if(this.props.prefix !== nextProps.prefix)
        {
            this.setState({prefix: nextProps.prefix});
        }
        return true;
    }

    generateContent = () => { }

    render = () => {
        return (
            <>
                <div className="d-flex flex-column h-100 w-100" style={{ maxHeight: '100%' }}>
                    <Table striped bordered hover size="lg" className="custom-table-data">
                        {this.generateContent()}
                    </Table>
                </div>
            </>
        )
    }
}