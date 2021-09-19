import React from "react";
import { Card } from "react-bootstrap";
// import { workMonthServices } from '../workMonth.services';
import _, { debounce } from "lodash";

export class WorkMonthList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workMonthItems: [],
            loading: false,
            selectedItem: {}
        }
    }

    componentDidMount = () => {
        const { workMonth } = this.props;
        if (!workMonth) return;
        this.setState({ loading: true }, this.loadWorkMonthItems(workMonth.id));
    }

    loadWorkMonthItems = (workMonthId) => {
        if (!workMonthId) return;
        // CALL_API
        // workMonthServices.GetworkMonthItems(workMonthId)
        //     .then(response => {
        //         let workMonthItems = _.orderBy(response.data, x => x.ordinal, "asc");
        //         this.setState({ workMonthItems: workMonthItems, originWorkMonthItems: workMonthItems, loading: false }, this.props.onRefreshed());
        //     }, error => {
        //         this.setState({ loading: false });
        //         ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể đọc các chỉ mục của danh mục");
        //     })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.workMonth !== nextProps.workMonth) {
            this.setState({ workMonth: nextProps.workMonth }, this.loadWorkMonthItems(nextProps.workMonth.id));
        }
        if (nextProps.refresh) {
            this.loadWorkMonthItems(nextProps.workMonth.id);
        }
        return true;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        const { workMonth } = this.state;
        if (!value || value.trim() === '') {
            this.loadWorkMonthItems(workMonth.id);
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchWorkMonthItems(value), 1000);

    searchWorkMonthItems = (value) => {
        const { originWorkMonthItems } = this.state;
        const filteredItems = originWorkMonthItems.filter(x => x.name.toLowerCase().trim().includes(value.toLowerCase().trim())
                                                           || x.code.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ workMonthItems: filteredItems });
    }

    onSelectItem = (item) => {
        const { selectedItem } = this.state;
        const { onChange } = this.props;
        if (item.id === selectedItem.id) return;
        this.setState({ selectedItem: item }, onChange(item));
    }

    render = () => {
        const { workMonthItems, loading, selectedItem } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            workMonthItems && workMonthItems.length > 0 && workMonthItems.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.yearMonth}</b></span>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.startDate} - {item.endDate}</i></span>
                                            <span className="ml-auto" style={{ color: "green" }}><i>{item.totalWork}</i></span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !workMonthItems || workMonthItems.length === 0 &&
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