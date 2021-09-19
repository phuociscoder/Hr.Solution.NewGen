import React from "react";
import { Card } from "react-bootstrap";
// import { workShiftServices } from '../workShift.services';
import _, { debounce } from "lodash";

export class WorkShiftList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workShiftItems: [],
            loading: false,
            selectedItem: {}
        }
    }

    componentDidMount = () => {
        const { workShift } = this.props;
        if (!workShift) return;
        this.setState({ loading: true }, this.loadWorkShiftItems(workShift.id));
    }

    loadWorkShiftItems = (workShiftId) => {
        if (!workShiftId) return;
        // CALL_API
        // workShiftServices.GetworkShiftItems(workShiftId)
        //     .then(response => {
        //         let workShiftItems = _.orderBy(response.data, x => x.ordinal, "asc");
        //         this.setState({ workShiftItems: workShiftItems, originWorkShiftItems: workShiftItems, loading: false }, this.props.onRefreshed());
        //     }, error => {
        //         this.setState({ loading: false });
        //         ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể đọc các chỉ mục của danh mục");
        //     })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.workShift !== nextProps.workShift) {
            this.setState({ workShift: nextProps.workShift }, this.loadWorkShiftItems(nextProps.workShift.id));
        }
        if (nextProps.refresh) {
            this.loadWorkShiftItems(nextProps.workShift.id);
        }
        return true;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        const { workShift } = this.state;
        if (!value || value.trim() === '') {
            this.loadWorkShiftItems(workShift.id);
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchWorkShiftItems(value), 1000);

    searchWorkShiftItems = (value) => {
        const { originWorkShiftItems } = this.state;
        const filteredItems = originWorkShiftItems.filter(x => x.name.toLowerCase().trim().includes(value.toLowerCase().trim())
                                                           || x.code.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ workShiftItems: filteredItems });
    }

    onSelectItem = (item) => {
        const { selectedItem } = this.state;
        const { onChange } = this.props;
        if (item.id === selectedItem.id) return;
        this.setState({ selectedItem: item }, onChange(item));
    }

    render = () => {
        const { workShiftItems, loading, selectedItem } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            workShiftItems && workShiftItems.length > 0 && workShiftItems.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.name}</b></span>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.code}</i></span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !workShiftItems || workShiftItems.length === 0 &&
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