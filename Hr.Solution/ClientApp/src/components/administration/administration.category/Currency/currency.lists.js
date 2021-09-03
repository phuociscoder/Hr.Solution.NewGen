import { faAngleRight, faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { _, debounce } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { CategoryServices } from "../Category.services";


export class CurrencyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryItems: [],
            selectedItem: {},
            loading: false
        };
    }

    componentDidMount = () => {
        const { category } = this.props;
        if (!category) return;
        this.setState({ loading: true }, this.loadCategoryItems(category.id));
    }

    loadCategoryItems = (categoryId) => {
        if (!categoryId) return;
        CategoryServices.GetCategoryItems(categoryId)
            .then(
                response => {
                    let categoryItems = _.orderBy(response.data, x => x.oridinal, "asc");
                    this.setState({ categoryItems: categoryItems, originCategoryItems: categoryItems, loading: false }, this.props.onRefreshed());
                },
                error => {
                    this.setState({ loading: false });
                    ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể đọc các chỉ mục của danh mục");
                }
            );
    }

    onSearchTextChange = (event) => {
        const value = event.target.value;
        // const { category } = this.state;
        // if (!value || value.trim() === "") {
        //     this.loadCategoryItems(category.id);
        //     return;
        // }
        console.log("call debounce here");
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchCategoryItems(value), 1000);

    searchCategoryItems = (value) => {
        // const { originCategoryItems } = this.state;
        // const filteredItems = originCategoryItems.filter(x => x.name.toLowerCase().trim().includes(value.toLowerCase().trim())
        //     || x.name2.toLowerCase().trim().includes(value.toLowerCase().trim())
        //     || x.code.toLowerCase().trim().includes(value.toLowerCase().trim()));
        // this.setState({ categoryItems: filteredItems });
        console.log(value);
    }

    onSelectItem = (item) => {
        const { selectedItem } = this.state;
        const { onChange } = this.props;
        if (item.id === selectedItem.id) return;
        this.setState({ selectedItem: item }, onChange(item));
    }

    render = () => {
        const { selectedItem, categoryItems, loading } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            categoryItems && categoryItems.length > 0 && categoryItems.map((item) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.name}</b> - {item.code}</span>
                                            <div className="ml-auto">
                                                <FontAwesomeIcon className="mr-2" icon={faAngleRight} />
                                                {
                                                    !item.isActive && <FontAwesomeIcon icon={faBan} color="red" />
                                                }
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.name2}</i></span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            !categoryItems || categoryItems.length === 0 &&
                            <div className="w-100 h-100 group-role-item-blank">
                                Không có dữ liệu.
                            </div>
                        }
                    </div>
                </Card.Body>
            </Card>
        );
    }
}