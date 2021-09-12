import { faAngleRight, faBan, faEdit, faLock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { NotificationType } from "../../../Common/notification/Constants";
import { ShowNotification } from "../../../Common/notification/Notification";
// import { dependenceServices } from '../dependence.services';
// import '../../admin.roles/admin.dataRole/admin.roles.css';
import _, { debounce, isLength } from "lodash";
import { Function } from "../../../Common/Constants";
import { CategoryServices } from "../../../administration/administration.category/Category.services";

export class DependenceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dependenceItems: [],
            loading: false,
            selectedItemDepend: {},
            depentceList : []
        }
    }

    componentDidMount = () => {
        const { dependence } = this.props;
        // CALL_DRAFT
        this.loadDraftList();
        this.loadDepenList(Function.LSEM104, 'depentceList');
        if (!dependence) return;
        this.setState({ loading: true }, this.loadDependenceList(dependence.id));
    }

    loadDependenceList = (dependenceId) => {
        if (!dependenceId) return;
        // CALL_API
        // dependenceServices.GetdependenceItems(dependenceId)
        //     .then(response => {
        //         let dependenceItems = _.orderBy(response.data, x => x.ordinal, "asc");
        //         this.setState({ dependenceItems: dependenceItems, originDependenceItems: dependenceItems, loading: false }, this.props.onRefreshed());
        //     }, error => {
        //         this.setState({ loading: false });
        //         ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể đọc các chỉ mục của danh mục");
        //     })
    }
    // CALL_DRAFT
    loadDraftList = () => {
        let listDraft = [
            { id: 1, code: 'Test1', name: 'Nguyễn Văn A', address: 'nhà', phone: '012345678', birthday: '01-01-1968', dependent: 5, isTax: true, note: 'cha' },
            { id: 2, code: 'Test2', name: 'Nguyễn Văn B', address: 'nhà', phone: '012345678', birthday: '10-10-1998', dependent: 6, isTax: false, note: 'anh' },
            { id: 3, code: 'Test3', name: 'Nguyễn Thị C', address: 'nhà', phone: '012345678', birthday: '02-05-1970', dependent: 7, isTax: true, note: 'mẹ' },
        ]
        this.setState({ dependenceItems: listDraft, originDependenceItems: listDraft, loading: false }, this.props.onRefreshed());
    }

    loadDepenList =(functionId, stateName) => {
        CategoryServices.GetCategoryItems(functionId).then(response => {
            const options = response.data;
            if(options) this.setState({[stateName]: options});
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập danh sách quan hệ");
        });
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.dependence !== nextProps.dependence) {
            this.setState({ dependence: nextProps.dependence }, this.loadDependenceList(nextProps.dependence.id));
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
        const { dependenceItems, loading, selectedItemDepend, depentceList } = this.state;
        return (
            <Card className="h-100">
                <Card.Header>
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            dependenceItems && dependenceItems.length > 0 && dependenceItems.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItemDepend.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <div className="d-flex">
                                            { item.dependent && depentceList && depentceList.map(l => {
                                                if(l.id !== item.dependent) return;
                                                return (
                                                    <span className="text-uppercase"><b>{l.name}</b></span> 
                                                )
                                            })}
                                        </div>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.name}</b></span>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.birthday}</i></span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !dependenceItems || dependenceItems.length === 0 &&
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