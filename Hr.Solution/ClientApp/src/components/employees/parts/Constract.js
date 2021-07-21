import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export class Constract extends React.Component{
    constructor(props){
        super(props);
    }

    onSearchTextChange =() => {

    }

    onSearch=() => {

    }

    onShowAddModal =() => {

    }

    render =() => {
        return (
        <div className="w-100 mt-2 mb-2">
        <div className="d-flex justify-content-end pr-0">
            <input className="form-control w-50" onChange={this.onSearchTextChange} type="text" placeholder="Tìm kiếm"></input>
            <button className="btn btn-primary " onClick={this.onSearch}><FontAwesomeIcon icon={faSearch} /></button>
            <button className="btn btn-primary ml-2" onClick={this.onShowAddModal}><FontAwesomeIcon icon={faPlus} /> Thêm mới</button>
        </div>
        <div className="mt-2">
            {/* <DependantTable onProcessRemoveItem={this.onProcessRemoveItem} data={data} /> */}
        </div>
        {/* {this.generateAddModal()} */}
    </div>
        )

    }
}