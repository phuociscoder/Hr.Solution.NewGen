import { faAngleRight, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container, ListGroup } from "react-bootstrap";
import { AppRoute } from "../../AppRoute";
import { Loading } from "../../Common/loading/Loading";
import { NotificationType } from "../../Common/notification/Constants";
import { ShowNotification } from "../../Common/notification/Notification";
import { CategoryServices } from "./Category.services";
import './Category.css';
import { debounce } from "lodash";
import { AuthenticationManager } from "../../../AuthenticationManager";

export class CategoryListing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            originCategories: [],
            loading: false
        }
    }

    componentDidMount = () => {
        this.setState({ loading: true });
        this.getCategories();
    }

    getCategories = () => {
        CategoryServices.getCategories()
            .then(response => {
                let categories = [];
                if (response.data) {
                    response.data.forEach(item => {
                        if (AuthenticationManager.AllowView(item.id)) {
                            categories.push(item);
                        }
                    });
                }
                this.setState({ categories: categories, originCategories: categories, loading: false });
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập dữ liệu danh mục");
                this.setState({ loading: false });
            })
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        const { originCategories } = this.state;
        if (!value || value.trim() === '') {
            this.setState({ categories: originCategories });
            return;
        }
        this.setState({ loading: true }, this.onDebounceSearch(value));
    }

    onDebounceSearch = debounce((name) => this.SearchCategories(name), 1000);

    SearchCategories = (name) => {
        const { originCategories } = this.state;
        const filteredCategories = originCategories.filter(x => x.id.toLowerCase().trim().includes(name.toLowerCase().trim())
            || x.name.toLowerCase().trim().includes(name.toLowerCase().trim()));
        this.setState({ loading: false, categories: filteredCategories });
    }

    onClickCategory = (code) => {
        const path = AppRoute.CATEGORY_DETAIL.path.replace(":id", code);
        this.props.history.push(path);
    }

    render = () => {
        const { loading, categories } = this.state;
        return (
            <Container>
                <Card>
                    <Card.Header>
                        <div>
                            <input type="text" onChange={this.onSearchTextChange} className="form-control" placeholder="Tìm kiếm danh mục..."></input>
                        </div>
                    </Card.Header>
                    <Card.Body className="category-container">
                        {loading &&
                            <div className="w-100 d-flex justify-content-center">
                                <Loading show={true} />
                            </div>
                        }
                        {!loading &&
                            <ListGroup>
                                {categories && categories.length > 0 && categories.map((item, index) => {
                                    return (
                                        <ListGroup.Item onClick={() => this.onClickCategory(item.id)} className="category-link">
                                            <div className="d-flex">
                                                <span><i>{item.id}</i> - <b>{item.name}</b></span>
                                                <FontAwesomeIcon className="ml-auto" icon={faAngleRight} color="grey" />
                                            </div>
                                        </ListGroup.Item>
                                    )
                                })}
                                {
                                    (!categories || categories.length === 0) && <ListGroup.Item>
                                        Không có dữ liệu.
                                    </ListGroup.Item>
                                }
                            </ListGroup>
                        }
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}