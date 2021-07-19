import { faEdit, faPlug, faPlus, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col, Container, Jumbotron, ListGroup, ListGroupItem, Row } from "react-bootstrap";

export class AllowanceList extends React.Component{
    constructor(props)
    {
        super(props);
    }

    componentDidMount = () => {

    }

    onSearchChange =(e) => {
        //TODO
    }

    onLoadEmployee =(employeeId) => {

    }

    render =() => {
        return (
        <>
            <div className="d-flex d-flex-column pt-1 pr-1 pl-1">
                <input className="form-control flex-fill" onChange={this.onSearchChange} placeholder="Tìm kiếm"/>
                <button className=" btn btn-primary ml-1"><FontAwesomeIcon icon={faPlus}/></button>
            </div>
            <div className="d-flex d-flex-row pt-1 pr-1 pl-1 pb-1">
                <div className="w-100 d-flex d-flex-row ">
                    <ListGroup className="w-100 allowance-link" variant="flush">
                        <ListGroupItem active>{this.generateItem()}</ListGroupItem>
                        <ListGroupItem>sdsad</ListGroupItem>
                        <ListGroupItem>sdsad</ListGroupItem>
                        <ListGroupItem>sdsad</ListGroupItem>
                        <ListGroupItem>sdsad</ListGroupItem>
                    </ListGroup>
                </div>
            </div>
        </>
        )
    }

    generateItem =(item) => {
        return (
            <div className="d-flex">
                <div className>
                    <h6 className="align-self-start">Cơm Trưa</h6>
                    <span className="font-weight-light text-muted">12/07/2021 31/12/2021</span>
                </div>
                <div className="d-flex flex-column ml-auto justify-content-around ">
                    <h6>600.000</h6>
                    <FontAwesomeIcon className="shadow rounded btn-icon-menu mt-2 ml-auto text-info"  icon={faTrash}/>
                </div>
            </div>
        )
    }
}