import React from "react";
import { Card, Container, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import notFoundImg from '../assets/404.gif';

export class NotFound404 extends React.Component {
    render =() => {
        return(
            <div className="d-flex flex-column justify-content-center align-items-center container-content">
                <Image className="notfound-image" src={notFoundImg}/>
                <span>Có lỗi xảy ra ! Chúng tôi không tìm thấy trang của bạn !</span>
                <Link to="/">Trở về trang chủ</Link>
            </div>
        )
    }
}