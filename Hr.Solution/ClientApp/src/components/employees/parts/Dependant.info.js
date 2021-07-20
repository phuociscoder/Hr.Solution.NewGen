import React from "react";
import { DateTimeUltils } from "../../Utilities/DateTimeUltis";

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
            <div className="d-flex flex-row pt-2 pb-2 pr-2 pl-2">
                <label>Mã số:
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
            </div>
        )
    }
}