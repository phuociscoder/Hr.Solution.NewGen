import React from "react";
import { Card, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import notFoundImg from '../assets/404.gif';

export class NotFound404 extends React.Component {
    render =() => {
        return(
            <div className="d-flex flex-column justify-content-center align-items-center container-content w-100">
                <Image className="notfound-image" src={notFoundImg}/>
                <span><b>Có lỗi xảy ra !</b> <br/> Chúng tôi không tìm thấy trang của bạn .<br/>Hoặc bạn không có quyền truy cập vào trang này.</span>
                <span></span>
                <Link to="/">Trở về trang chủ</Link>
            </div>
        )
    }
}