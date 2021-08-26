import React from "react";
import { Loading } from "../../Common/loading/Loading";
import { NotificationType } from "../../Common/notification/Constants";
import { ShowNotification } from "../../Common/notification/Notification";
import { SelectMode, Type } from "./Constants";
import { DepartmentServices } from "./Department.services";
import './department.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { debounce } from "lodash";

//prop : onValueChange : []
//values: []
//isMultipleSelect: true/false
//CRUD: true/false 
//Type: Type.Select /Type.Module
//fullLoad: true/false
export class DepartmentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            CRUD: false,
            Mode: SelectMode.Multiple,
            selectedIds: [],
            departments: [],
            originDepartments: [],
            loading: false,
            type: Type.Module,
            isMultipleSelect: true,
            fullLoad: true
        }
    }

    componentDidMount = () => {
        const { values, type, isMultipleSelect, fullLoad, prefix } = this.props;
        const newType = type ?? this.state.type;
        const newIsMultipleSelect = isMultipleSelect ?? false;
        const newFullLoad = fullLoad ?? false;
        this.setState({ selectedIds: values, type: newType, isMultipleSelect: newIsMultipleSelect, fullLoad: newFullLoad, prefix: prefix }, this.loadDepartment(null));

    }

    shouldComponentUpdate = (nextProps) => {
        if (this.props.values !== nextProps.values || this.props.prefix !== nextProps.prefix) {
            this.setState({ selectedIds: nextProps.values, prefix: nextProps.prefix }, this.loadDepartment(null));
        }

        return true;
    }


    loadDepartment = (freeText) => {
        if(this.state.type === Type.Module) this.setState({ loading: true });
        DepartmentServices.GetByFreeText({ freeText: '' })
            .then(response => {
                let departments = this.initDepartmentTree(null, response.data);
                departments = this.filterBySearchText(freeText, departments);
                this.setState({ departments: departments, originDepartments: response.data, loading: false });
            }, error => {
                ShowNotification(NotificationType.ERROR, "Có lỗi xảy ra ! Không thể thao tác");
                this.setState({ loading: false });
            })
    }

    initDepartmentTree = (root, departments) => {
        const { selectedIds } = this.state;
        this.setChildCounts(root, departments);
        this.setExpanded(departments);



        return departments;

    }

    getDepartmentLevels = (departments) => {
        return !departments || departments.length === 0 ? [] : _.orderBy(_.uniq(departments.map(item => { return item.level; })), [], ["desc"]);
    }

    setExpanded = (departments) => {
        const { selectedIds } = this.state;
        const parents = departments.filter(x => x.childCount > 0);

        let parentLevels = this.getDepartmentLevels(parents);
        parentLevels.forEach(level => {
            let levelDepts = departments.filter(x => x.level === level);
            if (level === 0) {
                levelDepts.forEach(dept => {
                    dept.isExpanded = true;
                });
            }
            levelDepts.forEach(parent => {
                const childs = departments.filter(x => x.parentId === parent.id);
                const isHasChildSelected = childs.some(x => selectedIds.includes(x.id));
                const isHasChildExpanded = childs.some(x => x.isExpanded === true);
                if (isHasChildSelected || isHasChildExpanded) {
                    parent.isExpanded = true
                }
            });



        });
    }

    setChildCounts = (dept, departments) => {
        if (!departments || departments.length === 0) return;
        if (!dept) {
            dept = departments.find(x => x.level === 0);
        }

        const childs = departments.filter(x => x.parentId === dept.id);
        dept.childCount = childs.length;
        childs.forEach(x => {
            this.setChildCounts(x, departments);
        });
    }

    filterBySearchText = (freeText, departments) => {
        if (!freeText || freeText.trim() === '')
            return departments;

        let results = [];
        let departmentsFiltered = departments.filter(x => x.departmentCode.toLowerCase().includes(freeText.toLowerCase()) || x.departmentName.toLowerCase().includes(freeText.toLowerCase()));
        if (!departmentsFiltered && departmentsFiltered.length === 0) return [];

        departmentsFiltered.forEach(dept => {
            this.retriveChilds(dept, departments, results);
            this.retriveParents(dept, departments, results);
        });

        return _.uniq(results);
    }

    retriveChilds = (dept, departments, results) => {
        let department = departments.find(x => x.id === dept.id);
        if (department) results.push(department);
        const childs = departments.filter(x => x.parentId === dept.id);
        if (childs.length === 0) {
            return;
        }
        department.isExpanded = true;
        childs.forEach(child => {
            this.retriveChilds(child, departments, results);
        });
    }

    retriveParents = (dept, departments, results) => {
        const parentDept = departments.find(x => x.id === dept.parentId);
        if (!parentDept) return;
        parentDept.isExpanded = true;
        results.push(parentDept);
        this.retriveParents(parentDept, departments, results);
    }


    renderToggle = (dept) => {
        const { departments } = this.state;
        const isHasChild = departments.some(x => x.parentId === dept.id);
        if (!isHasChild) {
            return null;
        }
        return <FontAwesomeIcon className="float-right" icon={dept.isExpanded ? faAngleUp : faAngleDown} />

    }

    onToggleClick = (id) => {
        const { departments } = this.state;
        const dept = departments.find(x => x.id === id);
        dept.isExpanded = !dept.isExpanded ? true : false;
        this.setState({ departments: Object.assign([], [...departments]) });
    }

    onDepartmentCheckChange = (e) => {
        const { isMultipleSelect } = this.state;
        const id = parseInt(e.target.getAttribute("departmentid"));
        const isChecked = e.target.checked;
        let { selectedIds } = this.state;
        const { onValueChange } = this.props

        if (isMultipleSelect) {
            if (isChecked) {
                this.relativeChecked(id, selectedIds);
                this.parentsChecked(id, selectedIds);

            } else {
                this.relativeUnChecked(id, selectedIds);
                this.parentsUnChecked(id, selectedIds);
            }
        }else
        {
            selectedIds =[id];
        }
        this.setState({ selectedIds: selectedIds }, onValueChange(selectedIds[0]));
    }

    relativeChecked = (id, selectedIds) => {
        if (!selectedIds.includes(id)) {
            selectedIds.push(id);
        }
        const { originDepartments } = this.state;
        const childs = originDepartments.filter(x => x.parentId === id);
        if (childs.length > 0) {
            childs.forEach(item => {
                this.relativeChecked(item.id, selectedIds);
            });
        }
    }

    parentsChecked = (id, selectedIds) => {
        const { originDepartments } = this.state;
        const department = originDepartments.find(x => x.id === id);
        if (!department.parentId) return;
        const deptsWithSameParent = originDepartments.filter(x => x.parentId === department.parentId);
        const isAllChecked = deptsWithSameParent.every(x => selectedIds.includes(x.id));
        if (isAllChecked) {
            selectedIds.push(department.parentId);
            this.parentsChecked(department.parentId, selectedIds);
        }
    }

    relativeUnChecked = (id, selectedIds) => {
        selectedIds = _.pull(selectedIds, id);
        const { originDepartments } = this.state;
        const childs = originDepartments.filter(x => x.parentId === id);
        if (childs.length > 0) {
            childs.forEach(item => {
                this.relativeUnChecked(item.id, selectedIds);
            });
        }
    }

    parentsUnChecked = (id, selectedIds) => {
        const { originDepartments } = this.state;
        const department = originDepartments.find(x => x.id === id);
        if (selectedIds.includes(department.parentId))
            selectedIds = _.pull(selectedIds, department.parentId);
        if (!department.parentId) return;
        this.parentsUnChecked(department.parentId, selectedIds);

    }

    onDepartmentSearchChange = (e) => {
        const value = e.target.value;
        this.setState({ searchText: value });
        this.debounceDepartmentSearch(value);

    }

    debounceDepartmentSearch = debounce((value) => { this.loadDepartment(value) }, 1000);

    generateChilds = (dept) => {
        const { departments, selectedIds, type, isMultipleSelect } = this.state;
        const childs = departments.filter(x => x.parentId === dept.id);
        return (
            <div>
                {childs.map((department, index) => {
                    const isHasChild = departments.some(x => x.parentId === department.id);
                    const deptClassName = isHasChild ? "w-100 sub-deparment cursor-pointer d-flex mt-1" : "w-100 department cursor-pointer d-flex mt-1 border-bottom"
                    return (
                        <>
                            <div key={department.id} style={{ paddingLeft: `${department.level * 2}rem` }} 
                            className={`${type===Type.Select && !isMultipleSelect && selectedIds.includes(department.id) ?'department-selected': ''} ${deptClassName}`}>
                                <input departmentid={department.id}
                                    onClick={this.onDepartmentCheckChange}
                                    className="department-checkbox"
                                    type="checkbox"
                                    checked={selectedIds.includes(department.id)} />
                                <span className={isHasChild ? "text-uppercase ml-2" : "ml-2"}>{department.departmentName} - <i>{department.departmentCode}</i></span>
                                <span className="ml-auto w-50" onClick={() => this.onToggleClick(department.id)}>{this.renderToggle(department)}</span>
                            </div>
                            {department.isExpanded && this.generateChilds(department)}
                        </>
                    )
                })}
            </div>
        )
    }

    render = () => {
        const { departments, loading, selectedIds, searchText, type, isMultipleSelect } = this.state;
        if (loading) {
            return (
                <div className="d-flex mt-5 justify-content-center">
                    <Loading show={true} />
                </div>
            )
        }
        else {
            return (
                <div className={`${type === Type.Select ? 'shadow' : ''} w-100 h-100 d-flex flex-column `}>
                    <div className={`${type === Type.Select ? 'card-header' : ''} h-6 w-100 d-flex `}>
                        <input className={`${type === Type.Select ? 'w-100' : 'w-40 mb-2 mt-1 mr-1'} ml-auto form-control `} value={searchText} placeholder="Tìm kiếm" onChange={this.onDepartmentSearchChange}></input>
                    </div>
                    {departments && departments.length > 0 && departments.filter(x => x.isCompany).map((company, index) => {
                        return (
                            <div className="department-container">
                                <div key={company.id} 
                                className={`${type===Type.Select && !isMultipleSelect && selectedIds.includes(company.id) ?'department-selected': ''} w-100 company-container cursor-pointer d-flex`}> 
                                    <input
                                        departmentid={company.id}
                                        onClick={this.onDepartmentCheckChange}
                                        className="department-checkbox"
                                        type="checkbox"
                                        checked={selectedIds.includes(company.id)} />
                                    <span className="text-uppercase ml-1"> <b>{company.departmentName}</b></span>
                                    <span className="ml-auto w-50" onClick={() => this.onToggleClick(company.id)}>{this.renderToggle(company)}</span>
                                </div>
                                {company.isExpanded && this.generateChilds(company)}
                            </div>
                        )
                    })}
                    {
                        !departments || departments.length === 0 &&
                        <div className="w-100 company-container justify-content-center" >
                            <span><b>Không tìm thấy bộ phận.</b></span>
                        </div>
                    }
                </div>
            )
        }

    }
}