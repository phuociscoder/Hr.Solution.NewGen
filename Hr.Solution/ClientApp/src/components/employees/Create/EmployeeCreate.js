import { faCheck, faFileInvoiceDollar, faInfoCircle, faList, faShareSquare, faTimes, faUserAlt, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Accordion, Button, Card, Col, Container, Jumbotron, ListGroup, Row } from "react-bootstrap";
import { ActionButtonsGroup } from "../../Common/ActionButtonsGroup";
import { EmployeeSection } from "../Constanst";
import { Allowance } from "../parts/Allowance";
import { Dependant } from "../parts/Dependant";
import { GeneralInformation } from "../parts/GeneralInformation";

export class EmployeeCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSection: EmployeeSection.Dependant
        };
    }

    componentDidMount = () => {

    }

    onChangeSection = (e) => {
        console.log(e.target);
        const value = e.target.getAttribute("fieldname");
        this.setState({ selectedSection: parseInt(value) });
        console.log(value);

    }

    onSaveChanges = () => {
        alert("save changes");
    }

    onSectionHeaderClick = (eventKey) => {
        this.setState({selectedSection: eventKey});
    }

    render = () => {
        return (
            <Container fluid>
                <Row>
                    <h4>THÊM NHÂN VIÊN</h4>
                </Row>
                <Row>
                    <Col>
                        {this.renderNavLinks()}
                    </Col>
                    <Col xs={8} >
                        {this.renderContents()}
                    </Col>
                    <Col>
                        <Card className="p2">
                            <ActionButtonsGroup className={"d-flex flex-column ml-2 mr-2"} enableDraft={true} onConfirmProcess={this.onSaveChanges} />
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

    renderNavLinks = () => {
        const { selectedSection } = this.state;
        return (
            <Card>
                <Card.Header>
                    <h5><FontAwesomeIcon icon={faList} /> LIÊN KẾT </h5>
                </Card.Header>
                <Card.Body className="pl-0 pr-0 pt-1 pb-0">
                    <ListGroup variant="flush" className="employee-link">

                        <ListGroup.Item className="pt-2 pb-2 pl-3"
                            fieldName={EmployeeSection.GeneralInformation}
                            onClick={this.onChangeSection}
                            active={selectedSection === EmployeeSection.GeneralInformation}>
                            <span fieldName={EmployeeSection.GeneralInformation}><FontAwesomeIcon icon={faUserAlt} /> THÔNG TIN CÁ NHÂN</span>
                        </ListGroup.Item>

                        <ListGroup.Item className="pt-2 pb-2 pl-3"
                            fieldName={EmployeeSection.Allowance}
                            onClick={this.onChangeSection}
                            active={selectedSection === EmployeeSection.Allowance} >
                            <span fieldName={EmployeeSection.Allowance}><FontAwesomeIcon icon={faUserAlt} /> PHỤ CẤP</span>
                        </ListGroup.Item>

                        <ListGroup.Item className="pt-2 pb-2 pl-3" style={{ zIndex: 100 }}
                            fieldName={EmployeeSection.Dependant}
                            onClick={this.onChangeSection}
                            active={selectedSection === EmployeeSection.Dependant} >
                            <span fieldName={EmployeeSection.Dependant}><FontAwesomeIcon icon={faUserAlt} /> NGƯỜI PHỤ THUỘC</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="pt-2 pb-2 pl-3"
                            fieldName={EmployeeSection.Constract}
                            onClick={this.onChangeSection}
                            active={selectedSection === EmployeeSection.Constract} >
                            <span fieldName={EmployeeSection.Constract}><FontAwesomeIcon icon={faUserAlt} /> HỢP ĐỒNG LAO ĐỘNG</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="pt-2 pb-2 pl-3"
                            fieldName={EmployeeSection.DayLeave}
                            onClick={this.onChangeSection}
                            active={selectedSection === EmployeeSection.DayLeave} >
                            <span fieldName={EmployeeSection.DayLeave}><FontAwesomeIcon icon={faUserAlt} /> NGÀY NGHỈ</span>
                        </ListGroup.Item>
                        <ListGroup.Item className="pt-2 pb-2 pl-3"
                            fieldName={EmployeeSection.PayrollInfo}
                            onClick={this.onChangeSection}
                            active={selectedSection === EmployeeSection.PayrollInfo} >
                            <span fieldName={EmployeeSection.PayrollInfo}><FontAwesomeIcon icon={faUserAlt} /> THÔNG TIN LƯƠNG</span>
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        )
    }

    renderContents = () => {
        const { selectedSection } = this.state;
        return (
            <Card>
                <Accordion activeKey={selectedSection} defaultActiveKey={EmployeeSection.GeneralInformation}>
                    <Card>
                        <Accordion.Toggle as={Card.Header} onClick={() => this.onSectionHeaderClick(EmployeeSection.GeneralInformation)} eventKey={EmployeeSection.GeneralInformation}>
                           <FontAwesomeIcon icon={faInfoCircle}/> THÔNG TIN CÁ NHÂN
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={EmployeeSection.GeneralInformation}>
                            <Card.Body>
                                <GeneralInformation></GeneralInformation>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} onClick={() => this.onSectionHeaderClick(EmployeeSection.Allowance)} eventKey={EmployeeSection.Allowance}>
                           <FontAwesomeIcon icon={faFileInvoiceDollar}/> PHỤ CẤP
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={EmployeeSection.Allowance}>
                            <Card.Body style={{padding: 0}}>
                                <Allowance/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} onClick={() => this.onSectionHeaderClick(EmployeeSection.Dependant)} eventKey={EmployeeSection.Dependant}>
                           <FontAwesomeIcon icon={faUserFriends}/> NGƯỜI PHỤ THUỘC
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={EmployeeSection.Dependant}>
                            <Card.Body>
                                <Dependant/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} onClick={() => this.onSectionHeaderClick(EmployeeSection.Constract)} eventKey={EmployeeSection.Constract}>
                            Click me!
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={EmployeeSection.Constract}>
                            <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} onClick={() => this.onSectionHeaderClick(EmployeeSection.DayLeave)} eventKey={EmployeeSection.DayLeave}>
                            Click me!
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={EmployeeSection.DayLeave}>
                            <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card>
                        <Accordion.Toggle as={Card.Header} onClick={() => this.onSectionHeaderClick(EmployeeSection.PayrollInfo)} eventKey={EmployeeSection.PayrollInfo}>
                            Click me!
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={EmployeeSection.PayrollInfo}>
                            <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Card>
        )
    }
}