import React from "react";
import { Card, Image } from "react-bootstrap";

export class EmployeeInfoCard extends React.Component{
    constructor(props)
    {
        super(props);
    }

    render=()=> {
        return (
            <div className="d-flex pl-3 pt-2 pr-3 pb-2" style={{backgroundColor: "#e9ecef"}}>
                    <div>
                    <Image  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR_BSXPlBjoBeJruSaCamv7kQuMNjoIIWX0CITXUVoapFCbRM9g" className="img-thumb" />
                    </div>
                    <div className="d-flex flex-column ml-2">
                        <span style={{fontSize:'16px'}} className="text-uppercase"><b>Nguyễn Hữu Phước</b></span>
                        <span className="mt-2 text-info">FHM/FHM.AVI</span>
                        <span className="mt-2">Trưởng Phòng </span>
                    </div>
            </div>
        )
    }
}