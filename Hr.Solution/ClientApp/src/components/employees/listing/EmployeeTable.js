import React from "react";
import { BaseListing } from "../../Common/BaseListing";

export class EmployeeTable extends BaseListing{

   generateContent =() => {
       return (
           <>
        <thead>
        <tr>
            <th>#</th>
            <th>Họ và Tên</th>
            <th>Bộ Phận</th>
            <th>Chức Vụ</th>
            <th>Email</th>
        </tr>
    </thead>
    <tbody>
        {
            this.state.data && this.state.data.map((item, index) => {
                return (
                    <tr>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.department}</td>
                        <td>{item.role}</td>
                        <td>{item.email}</td>
                    </tr>

                )
            })
        }
    </tbody>
    </>
       )
   }
}