import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { DependantTable } from "./Dependant.table";

export class Dependant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: null,
            data: null,
        }
    }

    componentDidMount = () => {
        this.getEmployeeDependants();
    }

    getEmployeeDependants = (id) => {
        const data = [
            { id: 1, code: "DP001", firstName: "Nguyễn", lastName: "Văn A", yearOfBirth: 1959, address: "Hiệp Thành , Q.12", relation: 1, phone: "0123456789", isTax: true },
            { id: 2, code: "DP002", firstName: "Trần", lastName: "Thị B", yearOfBirth: 1969, address: "Hiệp Thành , Q.12", relation: 2, phone: "0909991332", isTax: true },
            { id: 3, code: "DP003", firstName: "Nguyễn", lastName: "Hữu C", yearOfBirth: 2003, address: "Long Thạnh Mỹ, Q9", relation: 3, phone: "0933125478", isTax: false },

        ];
        this.setState({ data: data });
    }

    onSearchTextChange = (e) => {
        const value = e.target.value;
        this.setState({ searchText: value });
    }

    onSearch = () => {
        console.log(`search data with params :${this.state.searchText}`);
    }

    onProcessRemoveItem = (item) => {
        const { data } = this.state;
        const itemIndex = data.findIndex(x => x.id === item.id);
        data.splice(itemIndex, 1);
        console.log(data);
    }

    render = () => {
        const { data } = this.state;
        return (
            <div className="w-100 mt-2 mb-2">
                <div className="d-flex justify-content-end pr-0">
                    <input className="form-control w-50" onChange={this.onSearchTextChange} type="text" placeholder="Tìm kiếm"></input>
                    <button className="btn btn-primary " onClick={this.onSearch}><FontAwesomeIcon icon={faSearch} /></button>
                    <button className="btn btn-primary ml-2"><FontAwesomeIcon icon={faPlus} /> Thêm mới</button>
                </div>
                <div className="mt-2">
                    <DependantTable onProcessRemoveItem={this.onProcessRemoveItem} data={data} />
                </div>
            </div>

        )
    }
}