import { faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { Mode } from "../Constanst";
import { AllowanceInfo } from "./Allowance.info";

export class AllowanceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            model: null,
            showAddModal: false,
            addModel:null
        }
    }

    componentDidMount = () => {
        this.onLoadEmployee(0);

    }

    onSearchChange = (e) => {
        //TODO
    }

    onLoadEmployee = (employeeId) => {
        const data = [
            { id: 1, name: 'Cơm Trưa', amount: '900.000', startDate: '12/11/2020', endDate: '11/12/2021' },
            { id: 2, name: 'Vận chuyển', amount: '1.900.000', startDate: '07/10/2020', endDate: '31/12/2021' },
            { id: 3, name: 'Phụ cấp thiết bị', amount: '2.900.000', startDate: '12/10/2020', endDate: '11/12/2021' },
            { id: 4, name: 'lặt vặt', amount: '4.900.000', startDate: '12/10/2020', endDate: '11/12/2021' },
        ];
        const model = data[0];

        this.setState({ data: data, model });

    }

    onModelChange = () => {
        const { onModelChange } = this.props;
        if (onModelChange) onModelChange(this.state.model);
    }

    onChangeAllowance = (model) => {
        this.setState({ model }, this.onModelChange);
    }

    onRemoveAllowance = (model) => {
        this.setState({ showRemoveModal: true });

    }

    onModalClose = () => {
        this.setState({ showRemoveModal: false });
    }

    onAddNewModelToList = () => {
        let { data } = this.state;
        const {addModel} = this.state;
        if (!data) {
            data = [addModel];
        } else {
            data.push(addModel);
        }
        this.setState({data, showAddModal: false});

    }

    onAddModelChange =(model) => {
        this.setState({addModel: model});
    }

    onShowAddModal =() => {
        this.setState({showAddModal: true});
    }

    onCloseAddModal =() => {
        this.setState({showAddModal: false});
    }

    generateAddModal = () => {
        const { showAddModal } = this.state;
        return (
           <Modal size="lg" show={showAddModal}>
               <Modal.Header>Thêm phụ cấp</Modal.Header>
               <Modal.Body>
                   <AllowanceInfo mode={Mode.Create} onModelChange={this.onAddModelChange}/>
               </Modal.Body>
               <Modal.Footer>
                   <button className="btn btn-primary" onClick={this.onAddNewModelToList}><FontAwesomeIcon icon={faSave}/> Xác nhận</button>
                  <button className="btn btn-danger " onClick={this.onCloseAddModal}><FontAwesomeIcon icon={faTimes}/> Hủy bỏ</button>
               </Modal.Footer>
           </Modal>
        )
    }

    render = () => {
        const { data, model } = this.state;
        return (
            <>
                <div className="d-flex d-flex-column pt-1 pr-1 pl-1">
                    <input className="form-control flex-fill" onChange={this.onSearchChange} placeholder="Tìm kiếm" />
                    <button onClick={this.onShowAddModal} className=" btn btn-primary ml-1"><FontAwesomeIcon icon={faPlus} /></button>
                </div>
                <div className="d-flex d-flex-row pt-1 pr-1 pl-1 pb-1">
                    <div className="w-100 d-flex d-flex-row ">
                        <ListGroup className="w-100 allowance-link" variant="flush">
                            {data && data.map((item, index) => {
                                return (
                                    <ListGroupItem key={item.id} active={model.id === item.id}
                                        onClick={() => this.onChangeAllowance(item)}
                                    >{this.generateItem(item)}</ListGroupItem>
                                )
                            })
                            }
                            {!data && <ListGroupItem>Chưa có dữ liệu.</ListGroupItem>}
                        </ListGroup>
                    </div>
                </div>
                {this.generateAddModal()}
                
            </>
        )
    }

    

    generateItem = (item) => {
        return (
            <div className="d-flex">
                <div className>
                    <h6 className="align-self-start">{item.name}</h6>
                    <span className="font-weight-light text-muted">{`${item.startDate}-${item.endDate}`}</span>
                </div>
                <div className="d-flex flex-column ml-auto justify-content-around ">
                    <h6>{item.amount}</h6>
                </div>
            </div>
        )
    }
}