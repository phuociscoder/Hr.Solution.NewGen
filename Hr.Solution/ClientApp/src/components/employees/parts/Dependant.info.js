import React from "react";
import { DateTimeUltils } from "../../Utilities/DateTimeUltis";
import { Relation } from "../Constanst";

export class DependantInformation extends React.Component{
    constructor(props)
    {
        super(props);
        this.state ={
            years: []
        }
    }

    componentDidMount =() => {
        const years = DateTimeUltils.getYears();
        this.setState({years: years});
    }

    render=() => {
        const {years} = this.state;
        return(
            <div className="d-flex flex-column pt-2 pb-2 pr-2 pl-2">
                <label className="w-50">Mã số:
                    <input className="form-control" placeholder="Mã số người phụ thuộc"></input>
                </label>
                <label>
                    Họ:
                    <input className="form-control" placeholder="Họ người phụ thuộc"></input>
                </label>
                <label>
                    Đệm và tên:
                    <input className="form-control" placeholder="Đệm và tên"></input>
                </label>
                <label> 
                    Năm sinh:
                    <select className="form-control">
                        <option key={0} value={0}>-Chọn năm sinh-</option>
                        {
                            years && years.map((item, index) => {
                                return (
                                    <option key={item} value={item}>{item}</option>
                                )
                            })
                        }
                    </select>
                </label>
                <label>
                    Địa chỉ:
                    <input className="form-control" placeholder="Địa chỉ"></input>
                </label>
                <label>
                    Quan hệ: 
                    <select className="form-control">
                        <option key={0} value={0}>-Chọn quan hệ-</option>
                        {
                            Relation.All.map((item, index) => {
                                return (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                            })
                        }
                    </select>
                </label>
                <label>
                    Số điện thoại:
                    <input className="form-control" placeholder="Số điện thoại"></input>
                </label>
                <label>
                    <input type="checkbox"></input> Tính thuế
                </label>
                
            </div>
        )
    }
}