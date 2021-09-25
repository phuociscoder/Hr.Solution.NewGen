import { faAngleRight, faBan, faEdit, faLock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import { CategoryServices } from '../Category.services';
import '../../admin.roles/admin.dataRole/admin.roles.css';
import _, { debounce } from "lodash";
import { InsuranceCategoryService } from "./insuranceCategory.services";
import { InsuranceType } from "../Constants";

export class InsuranceTypeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryItems: [],
            loading: false,
            selectedItem: {}
        }
    }

    componentDidMount = () => {
        const { category } = this.props;
        if (!category) return;
        this.setState({ loading: true }, this.loadCategoryItems(category.id));
    }

    loadCategoryItems = (categoryId) => {
        if (!categoryId) return;
        InsuranceCategoryService.getInsurances()
            .then(response => {
                let categoryItems = _.orderBy(response.data, x => x.ordinal, "asc");
                categoryItems = categoryItems.map(item => {
                    item.typeName = InsuranceType.ALL.find(x => x.id === item.insType)?.name;
                    return item;
                });
                console.log(categoryItems);
                this.setState({ categoryItems: categoryItems, originCategoryItems: categoryItems, loading: false }, this.props.onRefreshed());
            }, error => {
                this.setState({ loading: false });
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể đọc các chỉ mục của danh mục");
            })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.category !== nextProps.category) {
            this.setState({ category: nextProps.category }, this.loadCategoryItems(nextProps.category.id));
        }
        if (nextProps.refresh) {
            this.loadCategoryItems(nextProps.category.id);
        }
        return true;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        const { category } = this.state;
        if (!value || value.trim() === '') {
            this.loadCategoryItems(category.id);
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchCategoryItems(value), 1000);

    searchCategoryItems = (value) => {
        const { originCategoryItems } = this.state;
        const filteredItems = originCategoryItems.filter(x => x.name.toLowerCase().trim().includes(value.toLowerCase().trim())
                                                           || x.name2.toLowerCase().trim().includes(value.toLowerCase().trim())
                                                           || x.code.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ categoryItems: filteredItems });
    }

    onSelectItem = (item) => {
        const { selectedItem } = this.state;
        const { onChange } = this.props;
        if (item.id === selectedItem.id) return;
        this.setState({ selectedItem: item }, onChange(item));
    }

    render = () => {
        const { categoryItems, loading, selectedItem } = this.state;
        return (
            <Card className="h-100">
                <Card.Header className="h-8">
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            categoryItems && categoryItems.length > 0 && categoryItems.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <div className="d-flex">
                                        <span className="text-uppercase"><b>{item.siName}</b> - {item.siCode}</span>
                                        {item.lock && <FontAwesomeIcon className="ml-auto" icon={faLock} color="red" />}
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.siName2}</i></span>
                                            <span className="ml-auto">{item.typeName}</span>
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
        )
    }
}