import React from "react";
import { Card } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import _, { debounce } from "lodash";
import { Function } from "../../../Common/Constants";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { DateTimeUltils } from '../../../Utilities/DateTimeUltis'

export class EmployeeSalaryProcessList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeSalaryProcesss: [],
            loading: false,
            selectedItem: {},
            models: []
        }
    }

    componentDidMount = () => {
        // this.loadSalaryProcess(Function.LSEM104, 'SalaryProcesss');
    }

    loadSalaryProcess = (functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if (options) this.setState({ [stateName]: options });
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách quá trình lương cơ bản.");
        });
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.models !== nextProps.models) {
            this.setState({ models: nextProps.models });
        }
        return true;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        const { salaryProcess } = this.state;
        if (!value || value.trim() === '') {
            // this.loadSalaryProcessList(salaryProcess.id);
            // CALL_DRAFT
            this.loadDraftList();
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchSalaryProcessItems(value), 1000);

    searchSalaryProcessItems = (value) => {
        const { originSalaryProcessItems } = this.state;
        const filteredItems = originSalaryProcessItems.filter(x => x.name.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ SalaryProcessItems: filteredItems });
    }

    onSelectItem = (item) => {
        const { selectedItem } = this.state;
        const { onChange } = this.props;
        if (item === selectedItem) return;
        this.setState({ selectedItem: item }, onChange(item));
    }

    render = () => {
        const { models, selectedItem } = this.state;
        
        return (
            <Card className="h-100">
                <Card.Header>
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            models && models.length > 0 && models.filter(x => x.type !== "DELETE").map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem === item ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <span className="text-uppercase"><b>{DateTimeUltils.toDateString(item.effectiveDate)}</b></span>
                                        <div className="w-100 d-flex">
                                            <span className="mr-auto"><i>{item.basicSalary}</i></span>
                                            <span className={item.isActive ? "ml-auto text-success" : "ml-auto text-danger"}><i>{item.salarySI}</i></span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !models || models.filter(x => x.type !== "DELETE").length === 0 &&
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