import { sequenceExpression } from "@babel/types";
import { faCheck, faCheckCircle, faRecycle, faSave, faTimes, faTimesCircle, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import React from "react";
import { Modal, ProgressBar, Spinner } from "react-bootstrap";
import { EmpMenus, Mode, SectionState, SectionStatus } from "../Constanst";
import { EmployeeAllowance } from "../parts/allowance";
import { EmployeeBasicSalProc } from "../parts/basicSalaryProcess";
import { EmployeeContract } from "../parts/constract";
import { EmployeeDependant } from "../parts/dependence";
import { EmployeeGeneralInfo } from "../parts/generalInfo";
import { EmployeeSocialInsur } from "../parts/socialInsurance";
import { EmployeeTimekeeperInfo } from "../parts/timekeepInfo";
import { EmployeeLeftMenu } from "./left-menu";

export class EmployeeCreateEdit extends React.Component {
    constructor() {
        super();
        this.state = {
            mode: Mode.Create,
            menuId: EmpMenus.GeneralInfo,
            sections: [
                { id: EmpMenus.GeneralInfo, status: SectionStatus.IDLE, state: SectionState.CHANGED },
                { id: EmpMenus.Allowance, status: SectionStatus.IDLE, state: SectionState.CHANGED },
                { id: EmpMenus.Dependant, status: SectionStatus.IDLE, state: SectionState.CHANGED },
                { id: EmpMenus.BasicSalaryInfo, status: SectionStatus.IDLE, state: SectionState.CHANGED },
                { id: EmpMenus.Contract, status: SectionStatus.IDLE, state: SectionState.CHANGED },
                { id: EmpMenus.BasicSalaryProcess, status: SectionStatus.IDLE, state: SectionState.CHANGED }],

            generalInfo: {},
            allowances: [],
            dependants: [],
            basicSalaryInfo: {},
            contracts: [],
            basicSalProcs: [],

            waiting: false,
            percentProgress: 0,
            processSections: []
        }
    }



    onMenuChange = (menuId) => {
        this.setState({ menuId });
    }

    onGeneralInfoModelChange = (model) => {
        const { sectionStates } = this.state;
        const newStates = Object.assign({}, { ...sectionStates, generaInfo: SectionState.CHANGED });
        const newModel = Object.assign({}, { ...model });
        this.setState({ generalInfo: newModel, sectionStates: newStates });
    }

    onAllowanceChange = (models) => {
        this.setState({ allowances: models });
    }

    onDependantChange = (models) => {
        this.setState({ dependants: models });
    }

    onTimekeeperInfoModelChange = (model) => {
        this.setState({ basicSalaryInfo: model });
    }

    onBasicSalProcChange = (model) => {
        this.setState({ basicSalProcs: model });
    }

    onSocialInsur = (model) => {
        this.setState({ socialInsur: model });
    }

    render = () => {
        const menu = EmpMenus.All.find(x => x.id === this.state.menuId);
        const { mode, allowances, generalInfo, dependants, basicSalaryInfo, basicSalProcs, socialInsur } = this.state;
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
                        {menu.id === EmpMenus.GeneralInfo && <EmployeeGeneralInfo model={generalInfo} onModelChange={this.onGeneralInfoModelChange} />}
                        {menu.id === EmpMenus.Dependant && <EmployeeDependant models={dependants} onModelChange={this.onDependantChange} />}
                        {menu.id === EmpMenus.Allowance && <EmployeeAllowance models={allowances} onModelChange={this.onAllowanceChange} />}
                        {menu.id === EmpMenus.TimekeeperInfo && <EmployeeTimekeeperInfo model={basicSalaryInfo} onModelChange={this.onTimekeeperInfoModelChange} />}
                        {menu.id === EmpMenus.Contract && <EmployeeContract models={dependants} onModelChange={this.onDependantChange} />}
                        {menu.id === EmpMenus.SocialInsurance && <EmployeeSocialInsur models={socialInsur} onModelChange={this.onSocialInsur} />}
                        {menu.id === EmpMenus.BasicSalaryProcess && <EmployeeBasicSalProc models={basicSalProcs} onModelChange={this.onBasicSalProcChange} />}
                    </div>
                    <div className="emp-detail-footer justify-content-end d-flex p-2 border w-100 ">
                        <button className="btn btn-info mr-auto"><FontAwesomeIcon icon={faRecycle} /><span className="ml-1">Hoàn tác</span></button>
                        <button className="btn btn-primary" onClick={this.onShowConfirmModal}><FontAwesomeIcon icon={faSave} /><span className="ml-1">Lưu Thay Đổi</span></button>
                        <button className="btn btn-danger ml-2"><FontAwesomeIcon icon={faTimesCircle} /><span className="ml-1">Hủy bỏ</span></button>
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
        console.log("here");
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
            case EmpMenus.BasicSalaryProcess:
                this.onProcessBasicSalProc(processSec);
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
        const { generalInfo, processSections } = this.state;
        setTimeout(() => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.DONE);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        }, 1000);
    }

    onProcessAllowances = (section) => {
        const { generalInfo, processSections } = this.state;
        setTimeout(() => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.DONE);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        }, 1000);
    }

    onProcessContracts = (section) => {
        console.log('go to contract');
        const { generalInfo, processSections } = this.state;
        setTimeout(() => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.DONE);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        }, 1000);
    }

    onProcessDependants = (section) => {
        const { generalInfo, processSections } = this.state;
        setTimeout(() => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.DONE);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        }, 1000);
    }

    onProcessBasicSalaryInfo = (section) => {
        const { generalInfo, processSections } = this.state;
        setTimeout(() => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.DONE);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        }, 1000);
    }

    onProcessBasicSalProc = (section) => {
        const { basicSalaryProc, processSections } = this.state;
        setTimeout(() => {
            const newProcessSections = this.changeStatusSection(section, SectionStatus.DONE);
            const percent = this.calculatePercentProcess(newProcessSections);
            this.setState({ processSections: newProcessSections, percentProgress: percent });
        }, 1000);
    }




    generateConfirmModal = () => {
        const { showConfirmModal } = this.state;
        return (
            <Modal show={showConfirmModal} backdrop="static" centered >
                <Modal.Header> XÁC NHẬN</Modal.Header>
                <Modal.Body>
                    Xác nhận lưu thông tin nhân viên ?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.onProcessConfirm}><FontAwesomeIcon icon={faCheck} /> <span className="ml-1"> Đồng ý</span> </button>
                    <button className="btn btn-danger ml-2" onClick={() => this.setState({ showConfirmModal: false })}><FontAwesomeIcon icon={faTimes} /> <span className="ml-1"> Hủy bỏ</span> </button>
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
                            <button onClick={() => this.setState({showProcessModal: false})} style={{visibility: processSections.every(x => x.status !== SectionStatus.IDLE && x.status !== SectionStatus.PROCESSING) ? '' : 'hidden'}} className="btn btn-primary ml-auto"><FontAwesomeIcon icon={faCheck} /> <span className="ml-1">Hoàn tất</span></button>
                        </div>
                </Modal.Body>



            </Modal>
        )
    }
}