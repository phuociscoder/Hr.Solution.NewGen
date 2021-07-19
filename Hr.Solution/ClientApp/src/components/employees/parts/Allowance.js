import React from "react";
import { Card, Col, Container, Jumbotron, Row } from "react-bootstrap";
import { AllowanceList } from "./Allowance.list";

export class Allowance extends React.Component{
    constructor(props)
    {
        super(props);
    }

    render =() => {
        return(
            <Container fluid className="mt-1 ml-1">
        <Row>
            <Col xs={4}>
                <div className="form-group list-sub-content ">
                    <AllowanceList/>
                    </div> 
            </Col>
            <Col></Col>
        </Row>
            </Container>
        
        )
    }
}