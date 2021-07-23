import { faAngleRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container, ListGroup } from "react-bootstrap";
import { AppRoute } from "../../AppRoute";

export class CategoryListing extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            data: [],
            name: null
        }
    }

    componentDidMount =() => {
        this.getCategories();
    }

    getCategories =(name) => {
        const data = [
            {id: 1,code: "department", name: "Bộ Phận / Phòng ban"},
            {id: 2,code: "NAT", name: "Quốc gia"},
            {id: 3,code: "CITY", name: "Thành phố"},
            {id: 4,code: "DIST", name: "Quận Huyện"},
        ];

        if(name)
        {
            const filtered = data.filter(x => x.name.toLowerCase().includes(name.toLowerCase()));
            const result = Object.assign([],filtered);
            this.setState({data: result});
            return;
        }

        this.setState({data: data});
    }

    onSearchTextChange =(e) => {
        const value = e.target.value;
        this.setState({name: value});
        this.getCategories(value);
    }
    
    onClickCategory=(code) => {
        const path = `${AppRoute.CONFIG}${code}`;
        this.props.history.push(path);
    }

    render = () => {
        const {data} = this.state;
        return (
            <Container>
                <div className="w-100">
                    <h4>THIẾT LẬP DANH MỤC</h4>
                </div>
                <Card>
                    <Card.Header>
                        <div>
                            <input type="text" onChange={this.onSearchTextChange} className="form-control" placeholder="Tìm kiếm danh mục..."></input>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ListGroup>
                            {data && data.length >0 && data.map((item, index) => {
                                return (
                                    <ListGroup.Item onClick={() =>this.onClickCategory(item.code)} className="category-link">
                                        <div className="d-flex">
                                            <span>{item.name}</span>
                                            <FontAwesomeIcon className="ml-auto" icon={faAngleRight} color="grey"/>
                                        </div>
                                    </ListGroup.Item>
                                )
                            })}
                            {
                                (!data || data.length ===0) && <ListGroup.Item>
                                    Không có dữ liệu.
                                </ListGroup.Item>
                            }
                        </ListGroup>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}