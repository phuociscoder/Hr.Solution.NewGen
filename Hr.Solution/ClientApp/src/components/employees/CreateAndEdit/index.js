import { faCheck, faCheckCircle, faRecycle, faSave, faTimes, faTimesCircle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { Modal, ProgressBar, Spinner } from "react-bootstrap";
import { CategoryServices } from "../../administration/administration.category/Category.services";
import { Function } from "../../Common/Constants";
import { NotificationType } from "../../Common/notification/Constants";
import { ShowNotification } from "../../Common/notification/Notification";
import { EmpMenus, Mode, SectionState, SectionStatus } from "../Constanst";
import { EmployeeServices } from "../employee.Services";
import { EmployeeAllowance } from "../parts/allowance";
import { EmployeeSalaryProcess } from "../parts/basicSalaryProcess";
import { EmployeeContract } from "../parts/constract";
import { EmployeeDependant } from "../parts/dependence";
import { EmployeeGeneralInfo } from "../parts/generalInfo";
import { EmployeeInsurance } from "../parts/insurance";
import { EmployeeTimekeeperInfo } from "../parts/timekeepInfo";
import { EmployeeLeftMenu } from "./left-menu";

export class EmployeeCreateEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            mode: Mode.Create,
            menuId: EmpMenus.GeneralInfo,
            sections: [
                { id: EmpMenus.GeneralInfo, status: SectionStatus.IDLE, state: SectionState.NOT_CHANGE, model: {} },
                { id: EmpMenus.Allowance, status: SectionStatus.IDLE, state: SectionState.NOT_CHANGE, model: [] },
                { id: EmpMenus.Dependant, status: SectionStatus.IDLE, state: SectionState.NOT_CHANGE, model: [] },
                { id: EmpMenus.BasicSalaryInfo, status: SectionStatus.IDLE, state: SectionState.NOT_CHANGE, model: {} },
                { id: EmpMenus.Contract, status: SectionStatus.IDLE, state: SectionState.NOT_CHANGE, model: [] },
                { id: EmpMenus.Insurance, status: SectionStatus.IDLE, state: SectionState.NOT_CHANGE, model: [] },
                { id: EmpMenus.SalaryProcess, status: SectionStatus.IDLE, state: SectionState.NOT_CHANGE, model: [] },
            ],

            percentProgress: 0,
            processSections: []
        }
    }

    onInit =() => {
        const empId = this.props.match.params.id;
        if(!empId) return;
        this.setState({mode: Mode.Edit});
        this.loadEmployeeInformation(empId);
    }

    loadEmployeeInformation =(empId) => {
        const {sections} = this.state;
        let newSections = Object.assign([], sections);
       EmployeeServices.GetById(empId).then(response => {
           let generalInfo = response.data.generalInformation;
           this.setDataToModelSection(generalInfo, EmpMenus.GeneralInfo, newSections);
     
          const allowances = response.data.allowances;
          this.setDataToModelSection(allowances, EmpMenus.Allowance, newSections);

          const dependants = response.data.dependants;
          this.setDataToModelSection(dependants, EmpMenus.Dependant, newSections);

          const basicSalaryInfo = response.data.basicSalaryInfo;
          this.setDataToModelSection(basicSalaryInfo, EmpMenus.BasicSalaryInfo, newSections);

          const contracts = response.data.contracts;
          this.setDataToModelSection(contracts, EmpMenus.Contract, newSections);

          const insurances = response.data.insurances;
          this.setDataToModelSection(insurances, EmpMenus.Insurance, newSections);

          const basicSalaryProcess = response.data.basicSalaryProcess;
          this.setDataToModelSection(basicSalaryProcess, EmpMenus.SalaryProcess, newSections);

          this.setState({sections: newSections});

       }, error => {
           debugger;
       });
        
    }

    setDataToModelSection =(data, sectionId, sections) => {
        let section = sections.find(x => x.id === sectionId);
        section.model = data;
        sections.splice(sections.findIndex(x => x.id === sectionId), 1, section);
    }

    componentDidMount =() => {
        this.onInit();
    }


    onSectionModelChange = (model, sectionId) => {
        const { sections } = this.state;
        let newSections = Object.assign([], sections);
        let modelSection = newSections.find(x => x.id === sectionId);
        let newModelSection = Object.assign({}, { ...modelSection, state: SectionState.CHANGED, model: model });
        newSections.splice(newSections.findIndex(x => x.id === sectionId), 1, newModelSection);
        this.setState({ sections: newSections });

    }

    onMenuChange = (menuId) => {
        this.setState({ menuId });
    }

    onBasicSalProcChange = (model) => {
        this.setState({ basicSalProcs: model });
    }

    onSocialInsur = (model) => {
        this.setState({ socialInsur: model });
    }

    render = () => {
        const menu = EmpMenus.All.find(x => x.id === this.state.menuId);
        const { mode, sections } = this.state;
        const generalInfo = sections.find(x => x.id === EmpMenus.GeneralInfo)?.model;
        const allowances = sections.find(x => x.id === EmpMenus.Allowance)?.model;
        const dependants = sections.find(x => x.id === EmpMenus.Dependant)?.model;
        const basicSalaryInfo = sections.find(x => x.id === EmpMenus.BasicSalaryInfo)?.model;
        const contracts = sections.find(x => x.id === EmpMenus.Contract)?.model;
        const insurances = sections.find(x => x.id === EmpMenus.Insurance)?.model;
        const salaryProcess = sections.find(x => x.id === EmpMenus.SalaryProcess)?.model;
        return (
            <div className="w-100 h-100 d-flex">
                <div className="w-15 h-100 p-2 ">
                    <EmployeeLeftMenu onMenuChange={this.onMenuChange} />
                    {
                        mode === Mode.Edit && <button className="btn btn-primary btn-change-user"><FontAwesomeIcon icon={faUsers} /></button>
                    }
                </div>
                <div className="w-100 h-100 pt-3 pl-2 pb-2 pr-2 ">
                    <div className="emp-detail-header text-uppercase font-weight-bold p-2 d-flex align-items-center border w-100 h-5">
                        {menu.icon} <span className="ml-1 mt-1">{menu.name}</span>
                    </div>
                    <div className="emp-detail-body p-3 border w-100 h-90">
                        {menu.id === EmpMenus.GeneralInfo && <EmployeeGeneralInfo model={generalInfo} onModelChange={model => this.onSectionModelChange(model, EmpMenus.GeneralInfo)} />}
                        {menu.id === EmpMenus.Dependant && <EmployeeDependant models={dependants} onModelChange={model => this.onSectionModelChange(model, EmpMenus.Dependant)} />}
                        {menu.id === EmpMenus.Allowance && <EmployeeAllowance models={allowances} onModelChange={model => this.onSectionModelChange(model, EmpMenus.Allowance)} />}
                        {menu.id === EmpMenus.BasicSalaryInfo && <EmployeeTimekeeperInfo model={basicSalaryInfo} onModelChange={model => this.onSectionModelChange(model, EmpMenus.BasicSalaryInfo)} />}
                        {menu.id === EmpMenus.Contract && <EmployeeContract models={contracts} onModelChange={model => this.onSectionModelChange(model, EmpMenus.Contract)} />}
                        {menu.id === EmpMenus.Insurance && <EmployeeInsurance model={insurances} onModelChange={model => this.onSectionModelChange(model, EmpMenus.Insurance)} />}
                        {menu.id === EmpMenus.SalaryProcess && <EmployeeSalaryProcess models={salaryProcess} onModelChange={model => this.onSectionModelChange(model, EmpMenus.SalaryProcess)} />}
                    </div>
                    <div className="emp-detail-footer justify-content-end d-flex p-2 border w-100 ">
                        <button className="btn btn-info mr-auto"><FontAwesomeIcon icon={faRecycle} /><span className="ml-1">Ho??n t??c</span></button>
                        <button className="btn btn-primary" onClick={this.onShowConfirmModal}><FontAwesomeIcon icon={faSave} /><span className="ml-1">L??u Thay ?????i</span></button>
                        <button className="btn btn-danger ml-2"><FontAwesomeIcon icon={faTimesCircle} /><span className="ml-1">H???y b???</span></button>
                    </div>
                </div>
                {this.generateConfirmModal()}
                {this.generateProcessModal()}
            </div>
        )
    }

    onShowConfirmModal = () => {
        const { sections, mode } = this.state;
        const processSections = sections.filter(x => x.state === SectionState.CHANGED);
        if (mode === Mode.Create) {
            const isProcessGeneralInfo = processSections.some(x => x.id === EmpMenus.GeneralInfo);
            this.setState({ processSections: processSections, showConfirmModal: isProcessGeneralInfo })
        } else {
            this.setState({ processSections: processSections, showConfirmModal: processSections.length > 0 });
        }
    }

    onProcessConfirm = () => {
        this.setState({ showProcessModal: true, showConfirmModal: false });

    }

    changeStatusSection = (section, status) => {
        const { processSections } = this.state;
        const sec = processSections.find(x => x.id === section.id);
        if (!sec) return;
        sec.status = status;
        const secIndex = processSections.findIndex(x => x.id === section.id)
        const newProcessSections = Object.assign([], processSections);
        newProcessSections.splice(secIndex, 1, sec);
        return newProcessSections;
    }

    processWaitingSection = () => {
        const { processSections } = this.state;
        const waitings = processSections.filter(x => x.status === SectionStatus.IDLE);
        if (waitings.length === 0) return;
        let selectSec = _.first(waitings);

        const newProcessSections = this.changeStatusSection(selectSec, SectionStatus.PROCESSING);
        this.setState({ processSections: newProcessSections });

    }

    componentDidUpdate = () => {
        const { processSections, showProcessModal } = this.state;
        const processing = processSections.some(x => x.status === SectionStatus.PROCESSING);
        if (!showProcessModal) return;

        if (!processing) {
            this.processWaitingSection();
            return;
        }

        const processSec = processSections.find(x => x.status === SectionStatus.PROCESSING);

        switch (processSec.id) {
            case EmpMenus.GeneralInfo:
                this.onProcessGeneralInfo(processSec);
                break;
            case EmpMenus.Allowance:
                this.onProcessAllowances(processSec);
                break;
            case EmpMenus.Dependant:
                this.onProcessDependants(processSec);
                break;
            case EmpMenus.BasicSalaryInfo:
                this.onProcessBasicSalaryInfo(processSec);
                break;
            case EmpMenus.Contract:
                this.onProcessContracts(processSec);
                break;
            case EmpMenus.SalaryProcess:
                this.onProcessBasicSalProc(processSec);
                break;
            case EmpMenus.Insurance:
                this.onProcessInsurance(processSec);
                break;

            default:
                break;
        }

    }

    calculatePercentProcess = (processSections) => {
        const completed = processSections.filter(x => x.status === SectionStatus.DONE).length;
        const total = processSections.length;
        return (100 / total) * completed;
    }

    onProcessGeneralInfo = (section) => {
        const model = section.model;
        EmployeeServices.Add('generalInfo', model).then(response => {
            const responseStatus = response.data;
            const newProcessSections = this.changeStatusSection(section, responseStatus.status === "SUCCESS" ? SectionStatus.DONE : SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent, employeeId: responseStatus.value });
        }, error => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        });
    }

    onProcessAllowances = (section) => {
        let models = section.model;
        models = models.map(x => {
            x.employeeId = this.state.employeeId;
            return x;
        });
        const createModels = models.filter(x => x.id === 0 && x.type === "ADD");
        const updateModels = models.filter(x => x.id !== 0 && x.type === "EDIT");
        const deleteModels = models.filter(x => x.id !== 0 && x.type === "DELETE");
        const newParams = { createAllowances: createModels, updateAllowances: updateModels, deleteAllowances: deleteModels };
        EmployeeServices.Add('allowances', newParams).then(response => {
            const responseStatus = response.data;
            const newProcessSections = this.changeStatusSection(section, responseStatus.status === "SUCCESS" ? SectionStatus.DONE : SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });

        }, error => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        });
    }

    onProcessContracts = (section) => {
        let models = section.model;
        models = models.map(x => {
            x.employeeId = this.state.employeeId;
            return x;
        });
        const createModels = models.filter(x => x.id === 0 && x.type === "ADD");
        const updateModels = models.filter(x => x.id !== 0 && x.type === "EDIT");
        const deleteModels = models.filter(x => x.id !== 0 && x.type === "DELETE");
        const newParams = { createContracts: createModels, updateContracts: updateModels, deleteContracts: deleteModels };
        EmployeeServices.Add('contracts', newParams).then(response => {
            const responseStatus = response.data;
            const newProcessSections = this.changeStatusSection(section, responseStatus.status === "SUCCESS" ? SectionStatus.DONE : SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });

        }, error => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        });
    }

    onProcessDependants = (section) => {
        let models = section.model;
        models = models.map(x => {
            x.employeeId = this.state.employeeId;
            return x;
        });
        const createModels = models.filter(x => x.id === 0 && x.type === "ADD");
        const updateModels = models.filter(x => x.id !== 0 && x.type === "EDIT");
        const deleteModels = models.filter(x => x.id !== 0 && x.type === "DELETE");
        const newParams = { createDependants: createModels, updateDependants: updateModels, deleteDependants: deleteModels };
        EmployeeServices.Add('dependants', newParams).then(response => {
            const responseStatus = response.data;
            const newProcessSections = this.changeStatusSection(section, responseStatus.status === "SUCCESS" ? SectionStatus.DONE : SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });

        }, error => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        });
    }

    onProcessBasicSalaryInfo = (section) => {
        let model = section.model;
        model.id = this.state.employeeId;
       
      EmployeeServices.Add('basicSalaryInfo', model).then(response => {
        const responseStatus = response.data;
        const newProcessSections = this.changeStatusSection(section, responseStatus.status === "SUCCESS" ? SectionStatus.DONE : SectionStatus.ERROR);
        const percent = this.calculatePercentProcess(newProcessSections);
        this.setState({ processSections: newProcessSections, percentProgress: percent });
      }, error => {
        const newProcessSections = this.changeStatusSection(section, SectionStatus.ERROR);
        const percent = this.calculatePercentProcess(newProcessSections);
        this.setState({ processSections: newProcessSections, percentProgress: percent });
      });
    }

    onProcessBasicSalProc = (section) => {
        let models = section.model;
        models = models.map(x => {
            x.employeeId = this.state.employeeId;
            return x;
        });
        const createModels = models.filter(x => x.id === 0 && x.type === "ADD");
        const updateModels = models.filter(x => x.id !== 0 && x.type === "EDIT");
        const deleteModels = models.filter(x => x.id !== 0 && x.type === "DELETE");
        const newParams = { createBasicSal: createModels, updateBasicSal: updateModels, deleteBasicSal: deleteModels };
        EmployeeServices.Add('basicSalaryProcess', newParams).then(response => {
            const responseStatus = response.data;
            const newProcessSections = this.changeStatusSection(section, responseStatus.status === "SUCCESS" ? SectionStatus.DONE : SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });

        }, error => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        });
    }

    onProcessInsurance = (section) => {
        let models = section.model;
        models = models.map(x => {
            x.employeeId = this.state.employeeId;
            return x;
        });
        const newParams = { employeeInsurances: models };
        EmployeeServices.Add('insurances', newParams).then(response => {
            const responseStatus = response.data;
            const newProcessSections = this.changeStatusSection(section, responseStatus.status === "SUCCESS" ? SectionStatus.DONE : SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });

        }, error => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.ERROR);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        });
    }

    generateConfirmModal = () => {
        const { showConfirmModal } = this.state;
        return (
            <Modal show={showConfirmModal} backdrop="static" centered >
                <Modal.Header> X??C NH???N</Modal.Header>
                <Modal.Body>
                    X??c nh???n l??u th??ng tin nh??n vi??n ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessConfirm}><FontAwesomeIcon icon={faCheck} /> <span className="ml-1"> ?????ng ??</span> </button>
                    <button className="btn btn-danger ml-2" onClick={() => this.setState({ showConfirmModal: false })}><FontAwesomeIcon icon={faTimes} /> <span className="ml-1"> H???y b???</span> </button>
                </Modal.Footer>
            </Modal>
        )
    }

    generateProcessModal = () => {
        const { showProcessModal, processSections } = this.state;
        return (
            <Modal centered show={showProcessModal} backdrop="static">
                <Modal.Body className="pt-3 pb-3 pl-3 pr-3">
                    <div className="w-100 d-flex flex-column mb-2">
                        {processSections && processSections.map(item => {
                            return (
                                <div className="d-flex p-2">
                                    {item.status === SectionStatus.PROCESSING &&
                                        <>
                                            <Spinner animation="border" size="sm" variant="primary" />
                                            <span className="ml-2 font-weight-bold">{EmpMenus.All.find(x => x.id === item.id)?.name}</span>
                                        </>
                                    }

                                    {item.status === SectionStatus.ERROR &&
                                        <>
                                            <FontAwesomeIcon icon={faTimesCircle} color="red" />
                                            <span className="ml-2" style={{ color: "red" }}>{EmpMenus.All.find(x => x.id === item.id)?.name}</span>
                                        </>
                                    }
                                    {item.status === SectionStatus.DONE &&
                                        <>
                                            <FontAwesomeIcon icon={faCheckCircle} color="green" />
                                            <span className="ml-2 ">{EmpMenus.All.find(x => x.id === item.id)?.name}</span>
                                        </>
                                    }

                                    {item.status === SectionStatus.IDLE &&
                                        <>
                                            <span className="font-weight-light ml-4" style={{ color: "lightgrey" }}>{EmpMenus.All.find(x => x.id === item.id)?.name}</span>
                                        </>
                                    }

                                </div>
                            )
                        })}
                    </div>
                    <ProgressBar animated now={this.state.percentProgress} />
                    <div className="w-100 d-flex mt-2">
                        <button onClick={this.onCompleteProcess} style={{ visibility: processSections.every(x => x.status !== SectionStatus.IDLE && x.status !== SectionStatus.PROCESSING) ? '' : 'hidden' }} className="btn btn-primary ml-auto"><FontAwesomeIcon icon={faCheck} /> <span className="ml-1">Ho??n t???t</span></button>
                    </div>
                </Modal.Body>



            </Modal>
        )
    }

    onCompleteProcess = () => {
        ShowNotification(NotificationType.SUCCESS, "Th??m nh??n vi??n m???i th??nh c??ng");
        this.setState({showProcessModal: false});
        this.props.history.push("/employees");
    }
}

