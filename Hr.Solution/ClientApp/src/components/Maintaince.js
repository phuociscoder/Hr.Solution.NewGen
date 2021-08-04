import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import maintainImage from '../assets/maintain.gif';

export class MaintainPage extends React.Component{

    render =() => {
        return(
            <div className="w-100 main-container d-flex flex-column justify-content-center align-items-center">
                <span><b>Chức năng này đang được phát triển hoặc bảo trì !</b></span>
                <Image src={maintainImage}/>
                <Link to="/">Trở về trang chủ</Link>
            </div>
        )
    }
}