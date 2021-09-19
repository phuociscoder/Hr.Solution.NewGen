import React from "react";
import { Card } from "react-bootstrap";
// import { workTypeServices } from '../workType.services';
import _, { debounce } from "lodash";

export class WorkTypeList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            workTypeItems: [],
            loading: false,
            selectedItem: {}
        }
    }

    componentDidMount = () => {
        const { workType } = this.props;
        if (!workType) return;
        this.setState({ loading: true }, this.loadWorkTypeItems(workType.id));
    }

    loadWorkTypeItems = (workTypeId) => {
        if (!workTypeId) return;
        // CALL_API
        // workTypeServices.GetworkTypeItems(workTypeId)
        //     .then(response => {
        //         let workTypeItems = _.orderBy(response.data, x => x.ordinal, "asc");
        //         this.setState({ workTypeItems: workTypeItems, originWorkTypeItems: workTypeItems, loading: false }, this.props.onRefreshed());
        //     }, error => {
        //         this.setState({ loading: false });
        //         ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể đọc các chỉ mục của danh mục");
        //     })
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.workType !== nextProps.workType) {
            this.setState({ workType: nextProps.workType }, this.loadWorkTypeItems(nextProps.workType.id));
        }
        if (nextProps.refresh) {
            this.loadWorkTypeItems(nextProps.workType.id);
        }
        return true;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        const { workType } = this.state;
        if (!value || value.trim() === '') {
            this.loadWorkTypeItems(workType.id);
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchWorkTypeItems(value), 1000);

    searchWorkTypeItems = (value) => {
        const { originWorkTypeItems } = this.state;
        const filteredItems = originWorkTypeItems.filter(x => x.name.toLowerCase().trim().includes(value.toLowerCase().trim())
                                                           || x.code.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ workTypeItems: filteredItems });
    }

    onSelectItem = (item) => {
        const { selectedItem } = this.state;
        const { onChange } = this.props;
        if (item.id === selectedItem.id) return;
        this.setState({ selectedItem: item }, onChange(item));
    }

    render = () => {
        const { workTypeItems, loading, selectedItem } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            workTypeItems && workTypeItems.length > 0 && workTypeItems.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.name}</b></span>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.code}</i></span>
                                            <span className="ml-auto" style={{ color: "green" }}><i>{item.type}</i></span>
                                            
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !workTypeItems || workTypeItems.length === 0 &&
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