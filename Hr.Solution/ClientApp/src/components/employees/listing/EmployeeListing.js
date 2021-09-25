import { faCheck, faCheckCircle, faFemale, faMale, faMouse, faMousePointer, faSearch, faTimes, faTimesCircle, faUpload, faUserEdit, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { Image, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Type } from "../../administration/admin.department/Constants";
import { DepartmentServices } from "../../administration/admin.department/Department.services";
import { DepartmentList } from "../../administration/admin.department/DepartmentList";
import { AppRoute } from "../../AppRoute";
import { HTable } from "../../Common/CustomTable";
import { NotificationType } from "../../Common/notification/Constants";
import { ShowNotification } from "../../Common/notification/Notification";
import { DateTimeUltils } from "../../Utilities/DateTimeUltis";
import { EmployeeServices } from "../employee.Services";

export class EmployeeListing extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {},
            selectedDepartments: [],
            pageIndex: 1, 
            pageSize: 20,
            searchText: '',
            loading: false,
            showImportFileModal: false,
            showExportSampleFileModal: false,
        }
    }

    componentDidMount = () => {
        this.generateColumns();
        this.getDeptsInUserRoles();
        this.generateExportColumn();
    }

    getDeptsInUserRoles =() => {
        const {pageSize, pageIndex, searchText} = this.state;
        DepartmentServices.GetByCurrentUser().then(response => {
            this.setState({departmentsInUserRoles: response.data});
            this.loadEmployees(response.data, pageIndex, pageSize, searchText);
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra! Không thể truy cập được dữ liệu");
        });
    }

    loadEmployees =(deptIds, pageIndex, pageSize, freeText) => {
        EmployeeServices.GetByDepartments({departmentIds: deptIds, freeText: freeText, pageSize: pageSize, pageIndex: pageIndex}).then(response => {
            this.setState({data: response.data, pageIndex: pageIndex, pageSize: pageSize, freeText: freeText});
        }, error => {
            ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể truy cập danh sách nhân viên");
        });
    }

    generateColumns = () => {
        const columns = [
            { field: 'code', title: 'Mã NV', width: 5, order: 1 },
            { field: 'fullName', title: 'Họ Và Tên',width: 15, order: 2 , formatContent: (x) =>  {return <span><Image src={x.photo} width={25} height={25}/> {x.lastName} {x.firstName}</span>} },
            { field: 'isMale', title: 'Giới Tính', width: 8, align: "center", order: 3 , formatContent: (x) => {return <FontAwesomeIcon icon={x.isMale ? faMale : faFemale} color={x.isMale ? '#568fb1': 'pink'}/>}},
            {field: 'doB', title: "Ngày Sinh", width: 8, order: 4, formatContent: (x) => {return <span>{DateTimeUltils.toDateString(x.doB)}</span>}},
            { field: 'departmentName', title: 'Bộ Phận', width: 8, order: 5 },
            { field: 'isManager', title: 'Nhóm Quản Lý', width: 8, align: "center", order: 6, formatContent: (x) => {return <FontAwesomeIcon icon={faCheckCircle} color={x.isManager ? 'green': 'grey'}/>}},
            { field: 'isActive', title: 'Hoạt Động', width: 8, align: "center", order: 6, formatContent: (x) => {return <FontAwesomeIcon icon={faCheckCircle} color={x.isManager ? 'green': 'grey'}/>}},
            { field: 'contractType', title: 'Loại Hợp Đồng',width: 8, order: 7 },
            { field: 'contractDuration', title: 'Thời Hạn', width: 8, order: 8 },
            { field: 'validDate', title: 'Ngày Hết Hạn', width: 8, order: 9, formatContent: (x) => {return <span>{DateTimeUltils.toDateString(x.validDate)}</span>} },
            { field: 'joiningDate', title: 'Ngày Vào', width: 8, order: 10 , formatContent: (x) => {return <span>{DateTimeUltils.toDateString(x.joiningDate)}</span>}}
        ];
        this.setState({columns});
    }

    generateExportColumn = () => {
        // DRAFT data
        const exportSampleFile = [
                {id: 'id', name: 'Id', nullAble: false},
                {id: 'code', name: 'Mã Nhân Viên', nullAble: true}, 
                {id: 'code2', name: 'Mã Nhân Viên2323332243', nullAble: true}, 
                {id: 'code3', name: 'Mã Nhân Viên3', nullAble: false}, 
                {id: 'code4', name: 'Mã Nhân Viên4', nullAble: false}, 
                {id: 'code5', name: 'Mã Nhân Viên5', nullAble: false}, 
                {id: 'code6', name: 'Mã Nhân Viên6', nullAble: true}, 
                {id: 'code7', name: 'Mã Nhân Viên7', nullAble: true}, 
                {id: 'code8', name: '', nullAble: true}, 
                {id: 'code9', name: 'Mã Nhân Viênêfefe', nullAble: true}, 
                {id: 'code726712673', name: 'Mã Nhân Viên2323fe332243', nullAble: true}, 
                {id: 'code86833728', name: 'Mã Nhân Viênfefef3', nullAble: false}, 
                {id: 'code82', name: 'Mã Nhân Viên4fefefe', nullAble: false}, 
                {id: 'code32', name: 'Mã Nhân Viên5fefe', nullAble: false}, 
                {id: 'code872', name: 'Mã Nhân Viên6fef', nullAble: true}, 
                {id: 'code733', name: 'Mã Nhân Viên7fef', nullAble: true}, 
                {id: 'code444', name: '', nullAble: true}, 
            ]
        if (!exportSampleFile) return;
        const exportSampleFileFiltered = exportSampleFile.filter(x => (x.id !== "id") && (x.name !== ""));
        let checkedLists = [];
        exportSampleFileFiltered.forEach(item => {
            if(!item.nullAble) {
                checkedLists.push(item.id);
            }
        });
        this.setState({ exportSampleFile: exportSampleFile, exportSampleFileFiltered: exportSampleFileFiltered, checkedLists: checkedLists });
    }

    generateActions =(item) => {
        return <FontAwesomeIcon icon={faUserEdit}/>
    }

    onPageIndexChange =(index) => {
        const {selectedDepartments, pageSize, searchText} = this.state;
        this.loadEmployees(selectedDepartments, index, pageSize , searchText);
    }

    onPageSizeChange =(pageSize) => {
        const {departmentsInUserRoles} = this.state;
        this.loadEmployees(departmentsInUserRoles, 1, pageSize, '');
    }

    onDepartmentSelectedChange = (ids) => {
        const {departmentsInUserRoles, pageSize, pageIndex, searchText} = this.state;
        const validDepts = _.intersection(ids, departmentsInUserRoles);
        this.setState({selectedDepartments: validDepts}, this.loadEmployees(validDepts, pageIndex, pageSize, searchText));
        

    }

    render = () => {
        const { data, selectedDepartments, loading } = this.state;
        console.log(data);
        return (
            <>
                <div className="w-100 h-4 d-flex justify-content-end mb-2">
                    <input style={{ width: '400px' }} type="text" placeholder="Tìm Kiếm..." className="form-control"></input>
                    <Link to={AppRoute.EMPLOYEE_CREATE.path} className="btn btn-primary ml-1"><span><FontAwesomeIcon icon={faUserPlus} /> Thêm nhân viên</span></Link>
                    <button className="btn btn-primary ml-1" onClick={() => this.setState({ showImportFileModal: true })}><span><FontAwesomeIcon icon={faUpload} /> Chọn tập tin</span></button>
                </div>
                <div className="w-100 h-96 d-flex">
                    <div className="w-25 mr-1 ">
                    <DepartmentList isMultipleSelect={true} fullLoad={false} type={Type.Select} onValueChange={this.onDepartmentSelectedChange} values={selectedDepartments}/>
                    </div>
                    <div className="w-100 h-100 ml-2 shadow">
                        <HTable loading={loading} 
                        columns ={this.state.columns} 
                        data={data} 
                        actions={this.generateActions}
                        onPageIndexChange={this.onPageIndexChange} 
                        onPageSizeChange={this.onPageSizeChange}/>
                    </div>
                </div>
                {this.generateImportFileModal()}
                {this.generateExportSampleFileModal()}
            </>
        )
    }
    
    generateImportFileModal = () => {
        const { showImportFileModal, selectedImportFile, theInputKey } = this.state;
        return (
            <Modal show={showImportFileModal} backdrop="static" centered>
                <Modal.Header>
                    Chọn Tập Tin Thông Tin Nhân Viên
                </Modal.Header>
                <Modal.Body>
                    <div className="m-3">
                        <div className="d-flex">
                            <input type="file" id="fileImport" key={theInputKey || ''} onChange={this.onImportFileChange} style={{ display: "none" }} accept=".xlsx,.xls" />
                            <input className={`${!selectedImportFile ? 'w-70' : 'w-60'} form-control text-truncate`} value={selectedImportFile ? selectedImportFile.name : ""} id="fileImport"  placeholder="C:/abc.xlsx"/>
                            {selectedImportFile && <label className="btn ml-1" onClick={this.clearInputFile}><FontAwesomeIcon icon={faTimesCircle} /></label>}
                            <label for="fileImport" className="btn btn-info ml-1" >Chọn tập tin</label>
                        </div>
                        <label className="text-primary font-italic mt-3" onClick={ () => this.setState({ showExportSampleFileModal: true }) }><u>Tải tập tin mẫu</u></label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.processImportFile}><FontAwesomeIcon icon={faCheck} /> Xác nhận</button>
                    <button className="btn btn-danger" onClick={() => this.setState({ showImportFileModal: false }, this.clearInputFile)}><FontAwesomeIcon icon={faTimes} /> Hủy bỏ</button>
                </Modal.Footer>
            </Modal>
        )
    }

    onImportFileChange = (e) => {
        const files = e.target.files[0];
        this.setState({ selectedImportFile: files });
    }

    clearInputFile = () => {
        let randomString = Math.random().toString(36);
        this.setState({ selectedImportFile: null, theInputKey: randomString });
    }
    
    processImportFile = () => {
        const { selectedImportFile } = this.state;
        if(!selectedImportFile) return;
        console.log(selectedImportFile);
    }
    
    generateExportSampleFileModal = () => {
        const { showExportSampleFileModal, exportSampleFileFiltered } = this.state;
        return (
            <Modal size="lg" show={showExportSampleFileModal} backdrop="static" centered>
                <Modal.Header>
                    Tải tập tin mẫu
                </Modal.Header>
                <Modal.Body>
                    <div className="p-3" style={{ overflowY: "auto" }}>
                        <h3>Chọn những thông tin nhân viên cần điền</h3>
                        {exportSampleFileFiltered && exportSampleFileFiltered.map(item => {
                            return(
                                <label className="mt-3 w-33">
                                    <input type="checkbox" onChange={this.onCheckboxChange} fieldName={item.id} disabled={!item.nullAble && true} checked={!item.nullAble ? true : item?.checked} />  {item.name}
                                </label>
                            )
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.processExportSampleFile}><FontAwesomeIcon icon={faCheck} /> Xác nhận</button>
                    <button className="btn btn-danger" onClick={() => this.setState({ showExportSampleFileModal: false })}><FontAwesomeIcon icon={faTimes} /> Hủy bỏ</button>
                </Modal.Footer>
            </Modal>
        )
    }

    onCheckboxChange = (e) => {
        const fieldName = e.target.getAttribute("fieldName");
        const checked = e.target.checked;
        const { checkedLists } = this.state;
        let currentCheckedLists = checkedLists;
        if(!checked) {
            if(!currentCheckedLists.includes(fieldName)) return;
            currentCheckedLists = currentCheckedLists.filter(item => item !== fieldName);
            this.setState({ checkedLists: currentCheckedLists });
            return;
        }
        if(currentCheckedLists.includes(fieldName)) return;
        currentCheckedLists.push(fieldName);
        this.setState({ checkedLists: currentCheckedLists });
    }

    processExportSampleFile = () => {
        const { checkedLists } = this.state;
        if(!checkedLists) return;
        console.log(checkedLists);
    }

}