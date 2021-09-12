import React from "react";
import { Card } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import _, { debounce } from "lodash";
import { Function } from "../../../Common/Constants";
import { CategoryServices } from "../../../administration/administration.category/Category.services";

export class EmployeeAllowanceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeAllownances: [],
            loading: false,
            selectedItem: {},
            depentceList : []
        }
    }

    componentDidMount = () => {
        this.loadAllowances(Function.LSEM165, 'allowances');
        
    }

    loadAllowances =(functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if(options) this.setState({[stateName]: options});
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách quan hệ");
        });
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.models !== nextProps.models) {
            this.setState({ models: nextProps.models });
        }
        if (nextProps.refresh) {
            this.loadDependenceList(nextProps.dependence.id);
        }
        if (nextProps.refresh) {
            // CALL_DRAFT
            this.loadDraftList();
        }
        return true;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        const { dependence } = this.state;
        if (!value || value.trim() === '') {
            // this.loadDependenceList(dependence.id);
            // CALL_DRAFT
            this.loadDraftList();
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchDependenceItems(value), 1000);

    searchDependenceItems = (value) => {
        const { originDependenceItems } = this.state;
        const filteredItems = originDependenceItems.filter(x => x.name.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ dependenceItems: filteredItems });
    }

    onSelectItem = (item) => {
        const { selectedItemDepend } = this.state;
        const { onChange } = this.props;
        if (item.id === selectedItemDepend.id) return;
        this.setState({ selectedItemDepend: item }, onChange(item));
    }

    render = () => {
        const { models, loading, selectedItem, allowances } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            models && models.length > 0 && models.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <span>{item.allowanceTypeName} {item.amountDisplay}</span>
                                    </div>
                                )
                            })

                        }
                        {
                            !models || models.length === 0 &&
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