import React from "react";
import { EmployeeType, LeaveWeekGroup, WorkerType } from "../Constanst";

export class PayrollBasic extends React.Component{
    constructor(props)
    {
        super(props);
    }

    render =() => {
        return (
            <div className="d-flex flex-column mt-2 mb-2 ml-2 mr-2">
                <div className="w-25">
                    <label htmlFor="joinDate">Ngày vào làm:</label>
                    <input name="joinDate" type="date" className="form-control"></input>
                    <label className="mt-2">Ngày thành NV chính thức:</label>
                    <input type="date" className="form-control"></input>
                    <label className="mt-2">Loại nhân viên:</label>
                    <select className="form-control">
                        <option key={0} value={0}>-Chọn loại nhân viên-</option>
                        {EmployeeType.All.map((item, index) => {
                            return (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            )
                        })}
                    </select>
                    <label className="mt-2">Loại lao động:</label>
                    <select className="form-control">
                        <option key={0} value={0}>-Chọn loại lao động-</option>
                        {WorkerType.All.map((item, index) => {
                            return (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            )
                        })}
                    </select>
                </div>
                <h6 className="mt-5">ThÔNG TIN CHẤM CÔNG</h6>
                <div className="w-100 d-flex flex-row">
                    <div className="w-25">
                        <label>Mã chấm công:</label>
                        <input className="form-control"></input>
                        <label className="mt-2">Nhóm ngày nghỉ tuần:</label>
                        <select className="form-control">
                            <option key={0} value={0}>-Chọn nhóm ngày nghỉ-</option>
                            {
                                LeaveWeekGroup.All.map((item, index) => {
                                    return (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                        <label className="mt-2">Vùng làm việc:</label>
                        <select className="form-control">
                            <option key={0} value={0}>-Chọn vùng làm việc-</option>
                        </select>
                    </div>
                    <div className="w-25 ml-5">
                        <label>Ca làm việc:</label>
                        <input className="form-control"></input>
                        <label className="mt-2">
                            <input type="checkbox"></input> Ca làm việc thay đổi
                        </label>
                        <label className="mt-2">
                            <input type="checkbox"></input> Không tính đi trễ về sớm
                        </label>
                        <label className="mt-2">
                            <input type="checkbox"></input> Không cần quét thẻ
                        </label>
                        <label className="mt-2">
                            <input type="checkbox"></input> Không tính công ngoài giờ
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}