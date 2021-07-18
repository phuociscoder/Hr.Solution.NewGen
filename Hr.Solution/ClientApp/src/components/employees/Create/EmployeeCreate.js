import { faCheck, faList, faShareSquare, faTimes, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col, Container, Jumbotron, ListGroup, Row } from "react-bootstrap";
import { ActionButtonsGroup } from "../../Common/ActionButtonsGroup";

export class EmployeeCreate extends React.Component{
    constructor(props){
        super(props);
        this.state={};
    }

    componentDidMount =()=> {

    }

    onSaveChanges =() => {
        alert("save changes");
    }

    render =() => {
        return(
            <Container fluid>
                <Row>
                    <h4>THÊM NHÂN VIÊN</h4>
                </Row>
                <Row>
                    <Col>
                    <Card>
                        <Card.Header>
                            <h5><FontAwesomeIcon icon={faList}/> LIÊN KẾT </h5>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush" className="employee-link">
                                <ListGroup.Item className="pt-2 pb-2" >
                                    <div><h7><FontAwesomeIcon icon={faUserAlt}/> THÔNG TIN CÁ NHÂN</h7></div>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="pt-2 pb-2" >
                                    <div><h7><FontAwesomeIcon icon={faUserAlt}/> PHỤ CẤP</h7></div>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="pt-2 pb-2" >
                                    <div><h7><FontAwesomeIcon icon={faUserAlt}/> NGƯỜI PHỤ THUỘC</h7></div>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="pt-2 pb-2" >
                                    <div><h7><FontAwesomeIcon icon={faUserAlt}/> HỢP ĐỒNG LAO ĐỘNG</h7></div>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="pt-2 pb-2" >
                                    <div><h7><FontAwesomeIcon icon={faUserAlt}/> NGÀY NGHỈ</h7></div>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="pt-2 pb-2" >
                                    <div><h7><FontAwesomeIcon icon={faUserAlt}/> THÔNG TIN LƯƠNG</h7></div>
                                    </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    </Col>
                    <Col xs={8} >
                        <Card></Card>
                    </Col>
                    <Col>
                    <Card className="p2">
                        <ActionButtonsGroup className={"d-flex flex-column ml-2 mr-2"} enableDraft={true}  onConfirmProcess={this.onSaveChanges}/>
                    </Card>
                    <Card className="mt-5">
                        <Card.Header>
                            CÁC BẢN NHÁP
                        </Card.Header>
                        <Card.Body>
                            dsadsadsa
                        </Card.Body>
                        <Card.Footer>
                            Total: 100
                        </Card.Footer>
                    </Card>
                    </Col>
                </Row>
            </Container>
        )
    }
}