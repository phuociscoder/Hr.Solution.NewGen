import { faEdit, faTimesCircle, faTrash, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Table } from "react-bootstrap";
import { AuthenticationManager } from "../../AuthenticationManager";
import { NoDataTableContent } from "../Common/NoDataTableContent";
import ReactTooltip from "react-tooltip";
import { debounce } from "lodash";
import { CustomDatePicker } from "../Common/DatePicker";

export class DayLeaveTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTable: [],
            typeDropdown: [],
            selectedTypeDropdown: {},
            endDate: null,
            startDate: null
        }
    }

    componentDidMount = () => {
        const { employee } = this.props;
        if (!employee) return;
        this.setState({ employee: employee });
        this.loadTypeDropdown();
        this.loadDataTable(employee.code);
    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.dataTable !== nextProps.dataTable) {
            this.setState({ dataTable: nextProps.dataTable }, this.loadDataTable());
        }
        if (this.props.employee !== nextProps.employee) {
            this.setState({ employee: nextProps.employee }, this.loadDataTable());
        }
        return true;
    }

    onChangeTypeDropdown = (e) => {
        const valueSelected = e.target.value;
        const { originDataTable, typeDropdown } = this.state;
        this.setState({ selectedTypeDropdown: valueSelected });
        if (!valueSelected) {
            this.loadDataTable();
            this.setState({ dataTable: originDataTable });
            return;
        };
        const valueFilter = typeDropdown.find(x => x.code === valueSelected);
        const filteredType = originDataTable.filter(x => x.type === valueFilter.name);
        this.setState({ dataTable: filteredType });
    }

    getDuration = (startDate, endDate) => {
        let start = new Date(startDate);
        let end = new Date(endDate);
        let duration = (end - start)/(60*60*24*1000);
        return duration + 1;
    }

    loadTypeDropdown = () => {
        // CALL_API get dropdowm loại ngày nghỉ phép
        this.setState({ typeDropdown: this.loadDraftDropdown() })
    }

    // CALL_DRAFT
    loadDraftDropdown = () => {
        const draftDropdown = [
            { code: 'type1', name: 'Nghỉ bệnh' },
            { code: 'type2', name: 'Nghỉ mát' },
            { code: 'type3', name: 'Nghỉ không lương' },
            { code: 'type4', name: 'Nghỉ bù' },
            { code: 'type5', name: 'Nghỉ phép' },
        ];
        return draftDropdown;
    }

    loadDataTable = (code) => {
        // CALL_API get date leave theo employee code
        this.setState({ dataTable: this.loadDraftDataTable(), originDataTable: this.loadDraftDataTable() });
    }

    // CALL_DRAFT
    loadDraftDataTable = () => {
        const draft = [
            { code: 'test1', type: 'Nghỉ bệnh', startDate : '09-03-2021', endDate : '09-03-2021', partialDay : 'Cả ngày', reason: 'Covid', isApproved: false, employeeCode: 'EMP001' },
            { code: 'test2', type: 'Nghỉ mát', startDate : '09-04-2021', endDate : '09-05-2021', partialDay : 'Cả ngày', reason: 'Thích', isApproved: true, employeeCode: 'EMP002' },
            { code: 'test3', type: 'Nghỉ không lương', startDate : '08-01-2021', endDate : '08-30-2021', partialDay : 'Cả ngày',  reason: 'Không thích làm nữa', isApproved: true, employeeCode: 'EMP003' },
            { code: 'test4', type: 'Nghỉ bù', startDate : '08-30-2021', endDate : '09-01-2021', partialDay : 'Cả ngày', reason: 'Mệt', isApproved: false, employeeCode: 'EMP005' },
            { code: 'test5', type: 'Nghỉ phép', startDate : '09-05-2021', endDate : '09-05-2021', partialDay : 'Cả ngày', reason: 'Du lịch', isApproved: false, employeeCode: 'EMP006' },
        ];
        return draft;
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        if(!value || value.trim() === ""){
            this.loadDataTable();
            const { originDataTable } = this.state;
            this.setState({ dataTable: originDataTable });
            return;
        }
        this.onDebounceSearch(value);
    }

    onDebounceSearch = debounce(value => this.searchDayLeave(value), 1000);

    searchDayLeave = (value) => {
        const { originDataTable } = this.state;
        const filteredItems = originDataTable.filter(x => x.code.toLowerCase().trim().includes(value.toLowerCase().trim()) ||
                                                          x.type.toLowerCase().trim().includes(value.toLowerCase().trim()));
        this.setState({ dataTable: filteredItems });
    }

    onChangeStartDate = (value) => {
        this.setState({ startDate: value });
        const { originDataTable } = this.state;
        let filterItemsDate = [];
        if(!this.state.endDate){
            if (!value) {
                this.setState({ dataTable: originDataTable });
                return;
            }
            filterItemsDate = originDataTable.filter(x => (new Date(x.startDate) > new Date(value)) || (this.compareEqualTime(x.startDate, value)));
            this.setState({ dataTable: filterItemsDate });
            return;
        }
        if (!value) {
            filterItemsDate = originDataTable.filter(x => (new Date(x.startDate) < new Date(this.state.endDate)) || (this.compareEqualTime(x.startDate, this.state.endDate)));
            this.setState({ dataTable: filterItemsDate });
            return;
        }
        filterItemsDate = originDataTable.filter(x => ((new Date(x.startDate) > new Date(value)) || (this.compareEqualTime(x.startDate, value)))
                                                && ((new Date(x.startDate) < new Date(this.state.endDate)) || (this.compareEqualTime(x.startDate, this.state.endDate))));
        this.setState({ dataTable: filterItemsDate });
    }

    onChangeEndDate = (value) => {
        this.setState({ endDate: value });
        const { originDataTable } = this.state;
        let filterItemsDate = [];
        if(!this.state.startDate){
            if (!value) {
                this.setState({ dataTable: originDataTable });
                return;
            }
            filterItemsDate = originDataTable.filter(x => (new Date(x.endDate) < new Date(value)) || (this.compareEqualTime(x.endDate, value)));
            this.setState({ dataTable: filterItemsDate });
            return;
        }
        if (!value) {
            filterItemsDate = originDataTable.filter(x => (new Date(x.startDate) > new Date(this.state.startDate)) || (this.compareEqualTime(x.startDate, this.state.startDate)));
            this.setState({ dataTable: filterItemsDate });
            return;
        }
        filterItemsDate = originDataTable.filter(x => ((new Date(x.startDate) > new Date(this.state.startDate)) || (this.compareEqualTime(x.startDate, this.state.startDate)))
                                                && ((new Date(x.startDate) < new Date(value)) || (this.compareEqualTime(x.startDate, value))));
        this.setState({ dataTable: filterItemsDate });
    }

    compareEqualTime = (date1, date2) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear()
               && d1.getMonth() === d2.getMonth()
               && d1.getDate() === d2.getDate()
    }

    render = () => {
        const { employee, typeDropdown, selectedTypeDropdown, endDate, startDate } = this.state;
        return (
            <div>
                <div className="d-flex">
                    <div className="w-50">
                        <label className="mr-3 w-30">
                            Từ ngày: <CustomDatePicker value={startDate} onDateChange={this.onChangeStartDate} />
                        </label>
                        <label className="mr-3 w-30">
                            Đến ngày: <CustomDatePicker value={endDate} onDateChange={this.onChangeEndDate} />
                        </label>
                        <label className="mr-3">
                            Loại nghỉ phép:
                            <select className="form-control" value={selectedTypeDropdown} onChange={this.onChangeTypeDropdown}>
                                <option value=''>--Chọn loại nghỉ phép--</option>
                                { typeDropdown && typeDropdown.map(item => {
                                    return (
                                        <option value={item.code}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </label>
                    </div>
                    <div className="d-flex w-50 justify-content-end align-self-end mb-2">
                        <input type="text" className="form-control w-40 mr-3" onChange={this.onSearchTextChange} placeholder="Tìm kiếm"/>
                        <button className="btn btn-primary form-control w-30">Thêm Loại Nghỉ Phép</button>
                    </div>
                </div>
                
                <div className="d-flex flex-column h-100 w-100" style={{ maxHeight: '100%' }}>
                    <Table striped bordered hover size="lg" className="custom-table-data">
                    <>
                        <thead className="w-100">
                            <tr>
                                <th>Mã Ngày Nghỉ</th>
                                <th>Loại Ngày Nghỉ</th>
                                <th>Ngày Bắt Đầu</th>
                                <th>Ngày Kết Thúc</th>
                                <th>Ca Đăng Ký</th>
                                <th>Số Ngày Nghỉ</th>
                                <th>Lý Do</th>
                                <th>Duyệt</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.dataTable && this.state.dataTable.map(item => {
                                    return (
                                        <tr>
                                            <td>{item.code}</td>
                                            <td>{item.type}</td>
                                            <td>{item.startDate}</td>
                                            <td>{item.endDate}</td>
                                            <td>{item.partialDay}</td>
                                            <td>{this.getDuration(item.startDate, item.endDate)}</td>
                                            <td>{item.reason}</td>
                                            <td style={{ alignContent: "center" }}>{item.isApproved ? <FontAwesomeIcon icon={faCheckCircle} color="green"/> : <FontAwesomeIcon icon={faTimesCircle} color="red" />}</td>
                                            <td>
                                                <div className="d-flex w-100 justify-content-center"> 
                                                    <button onClick={() => this.onShowEditModal(item)} className="btn btn-info"><FontAwesomeIcon icon={faEdit} /></button>
                                                    <button onClick={() => this.onShowDeleteModal(item)} className="btn btn-danger ml-2"><FontAwesomeIcon icon={faTrash} /></button>
                                                    <ReactTooltip />
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {
                            !this.state.dataTable && <NoDataTableContent colspan={9}/>
                            }
                        </tbody>
                    </>
                    </Table>
                </div>
            </div>
        )
    }

    onShowEditModal = (item) => {
        console.log(item);
    }

    onShowDeleteModal = (item) => {
        console.log(item);
    }
}