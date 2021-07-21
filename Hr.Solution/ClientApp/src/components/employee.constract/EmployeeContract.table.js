import { BaseListing } from "../Common/BaseListing";
import React from 'react';
import { ContractType } from "../employees/Constanst";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faDownload, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export class EmployeeContractTable extends BaseListing{
constructor(props){
    super(props)
}

generateContent =() => {
    const {data} = this.state;
    return (
        <>
        <thead>
            <tr>
                <th>Số HĐ</th>
                <th>Loại hợp đồng</th>
                <th>Thời hạn</th>
                <th>Ngày ký</th>
                <th>Ngày hiệu lực</th>
                <th>Ngày hết hạn</th>
                <th>Mức lương chính</th>
                <th style={{textAlign: "center"}}>Đang hiệu lực</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {data && data.length >0 && data.map((item, index) =>{
                return (
                    <tr>
                        <td>{item.contractNo}</td>
                        <td>{ContractType.All.find(x => x.id === item.contractType)?.name}</td>
                        <td>{item.duration}</td>
                        <td>{item.signDate}</td>
                        <td>{item.validDate}</td>
                        <td>{item.expiredDate}</td>
                        <td>{item.baseSalary}</td>
                        <td style={{textAlign: "center"}}>{item.isActive ? <FontAwesomeIcon icon={faCheckCircle} className="text-success"/> : null}</td>
                        <td>
                            <button className="btn btn-secondary"><FontAwesomeIcon icon={faDownload}/></button>
                            <button className="btn btn-primary ml-2"><FontAwesomeIcon icon={faEdit}/></button>
                            <button className="btn btn-danger ml-2"><FontAwesomeIcon icon={faTrash}/></button>
                        </td>
                    </tr>
                )
            })}
           {
               (!data ||data.length ===0) &&
               <tr>
                   <td colSpan={8}><b>Không có dữ liệu</b></td>
                   
               </tr>
           }
        </tbody>
        </>
    )
}
}