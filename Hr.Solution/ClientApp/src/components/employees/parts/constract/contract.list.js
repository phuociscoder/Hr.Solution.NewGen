import React from "react";
import { Card } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
import _, { debounce } from "lodash";
import { Function } from "../../../Common/Constants";
import { CategoryServices } from "../../../administration/administration.category/Category.services";
import { DateTimeUltils } from '../../../Utilities/DateTimeUltis'
import { NumberUltis } from "../../../Utilities/NumberUltis";

export class EmployeeContractList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeContracts: [],
            loading: false,
            selectedItem: {},
            models: []
        }
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.models !== nextProps.models) {
            this.setState({ models: nextProps.models });
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
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="T??m ki???m"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            models && models.length > 0 && models.filter(x => x.type !== "DELETE").map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem === item ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <span className="text-uppercase"><b>{item.contractTypeName}</b></span>
                                        <div className="w-100 d-flex">
                                            <span><i>{DateTimeUltils.toDateString(item.validDate)}</i></span>
                                            <span className="ml-auto">{NumberUltis.convertToAmountText(item.basicSalary)}</span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !models || models.filter(x => x.type !== "DELETE").length === 0 &&
                            <div className="w-100 h-100 group-role-item-blank">
                                Kh??ng c?? d??? li???u.
                            </div>
                        }

                    </div>
                </Card.Body>
            </Card>
        )
    }
}