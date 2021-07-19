import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { AllowanceInfo } from "./Allowance.info";
import { AllowanceList } from "./Allowance.list";

export class Allowance extends React.Component{
    constructor(props)
    {
        super(props);
    }

    onModelChange =(model) => {
        console.log(model);
    }

    render =() => {
        return(
            <Container fluid className="mt-1 ml-1">
        <Row>
            <Col xs={4}>
                <div className="form-group list-sub-content ">
                    <AllowanceList onModelChange={this.onModelChange}/>
                    </div> 
            </Col>
            <Col>
            <AllowanceInfo/>
            </Col>
        </Row>
            </Container>
        
        )
    }
}