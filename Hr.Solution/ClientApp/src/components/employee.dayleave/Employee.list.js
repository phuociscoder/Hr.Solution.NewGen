import { debounce } from "lodash";
import React from "react";
import { Card } from "react-bootstrap";

export class EmployeesDayLeaveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employees : [],
            selectedItem : {},
            loading: false,
        }
    }

    componentDidMount = () => {
        this.setState({ loading: true }, this.loadEmployeesList());
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.employees !== nextProps.employees) {
            this.setState({ employees: nextProps.employees }, this.loadEmployeesList());
        }
        return true;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        if(!value || value.trim() === ""){
            this.loadEmployeesList();
            const { originEmployees } = this.state;
            this.setState({ employees: originEmployees });
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchEmployee(value), 1000);

    searchEmployee = (value) => {
        const { originEmployees } = this.state;
        const filteredItems = originEmployees.filter(x => x.fullName.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                                                          x.code.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                                                          x.role.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ employees: filteredItems });
    }

    loadEmployeesList = () => {
        // CALL_API get list nhân viên
        this.setState({ employees: this.loadDraftEmployeesList(), originEmployees: this.loadDraftEmployeesList() });
    }

    // CALL_DRAFT
    loadDraftEmployeesList = () => {
        const draft = [
            { id: 1, code: 'EMP001', fullName: 'Nguyễn Quang Hải', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '12/04/1997', contractType: 'Toàn thời gian', avatar: 'https://secure.cache.images.core.optasports.com/soccer/players/150x150/352991.png' },
            { id: 2, code: 'EMP002', fullName: 'Đặng Văn Lâm', gender: 1, department: 'Đội Tuyển VN', role: 'Thủ môn', doB: '13/08/1993', contractType: 'Bán thời gian', avatar: 'https://static-znews.zadn.vn/static/topic/person/van%20lam.jpg' },
            { id: 3, code: 'EMP003', fullName: 'Lương Xuân Trường', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '14/04/1997', contractType: 'Toàn thời gian', avatar: 'https://streaming1.danviet.vn/upload/2-2020/images/2020-04-29/Luong-Xuan-Truong-Chang-lang-tu-tu-san-co-den-ngoai-doi-xt-00-1588142536-width660height504.jpg' },
            { id: 4, code: 'EMP004', fullName: 'Nguyễn Tiến Linh', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền đạo', doB: '12/06/1997', contractType: 'Toàn thời gian', avatar: 'https://static.bongda24h.vn/medias/original/2020/8/20/22-NguyenTienLinh-Tiendao.jpg' },
            { id: 5, code: 'EMP005', fullName: 'Đỗ Hùng Dũng', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '17/04/1995', contractType: 'Toàn thời gian', avatar: 'https://vff.org.vn/uploads/news/1570370365Do%20hung%20Dung.jpg' },
            { id: 6, code: 'EMP006', fullName: 'Nguyễn Hoàng Đức', gender: 1, department: 'Đội Tuyển VN', role: 'Tiền vệ', doB: '22/01/1998', contractType: 'Toàn thời gian', avatar: 'https://nguoinoitieng.tv/images/nnt/99/0/bdyn.jpg' },
            { id: 7, code: 'EMP007', fullName: 'Quế Ngọc Hải', gender: 1, department: 'Đội Tuyển VN', role: 'Hậu vệ', doB: '25/07/1994', contractType: 'Toàn thời gian', avatar: 'https://photo-cms-baonghean.zadn.vn/w607/Uploaded/2021/eslysyrlmyl/2021_06_21/2file458991289_2162021.jpg' }
        ];
        return draft;
    }

    onSelectItem = (item) => {
        const { selectedItem } = this.state;
        const { onChange } = this.props;
        if (item.id === selectedItem.id) return;
        this.setState({ selectedItem: item }, onChange(item));
    }

    render = () => {
        const { employees, selectedItem } = this.state;
        return (
            <Card className="h-100">
                <Card.Header className="h-8">
                    <input onChange={this.onSearchTextChange} className="form-control flex-fill" placeholder="Tìm kiếm"></input>
                </Card.Header>
                <Card.Body>
                    <div className="w-100 d-flex flex-column group-role-container">
                        {
                            employees && employees.length > 0 && employees.map((item, index) => {
                                return (
                                    <div key={item.id} fieldName={item.id} className={selectedItem.id === item.id ? "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown active" : "w-100 group-role-item d-flex flex-column animate__animated animate__fadeInDown"}
                                        onClick={() => this.onSelectItem(item)}>
                                        <div className="d-flex">
                                            <span className="text-uppercase"><b>{item.fullName}</b> - {item.code}</span>
                                        </div>
                                        <div className="d-flex">
                                            <span><i>{item.role}</i></span>
                                        </div>
                                    </div>
                                )
                            })

                        }
                        {
                            !employees || employees.length === 0 &&
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
