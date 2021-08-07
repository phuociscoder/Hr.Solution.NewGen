import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import background from "../../assets/Background.jpg";
import logo from "../../assets/logo.png";
import { AuthenticationManager } from "../../AuthenticationManager";
import { LanguageSelect } from "../Common/language/LanguageSelect";
import LoginServices from "./Login.services";

export class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            userName: null,
            passWord: null,
            error: null
        }
    }

    isValid = () => {
        const { userName, passWord } = this.state;
        if (userName && userName != '' && passWord && passWord != '') return true;
        return false;
    }

    onTextboxChange = (e) => {
        const value = e.target.value;
        const fieldName = e.target.getAttribute("fieldname");
        this.setState({ [fieldName]: value });
    }

    onLogin = () => {
        if (!this.isValid()) return;
        const { userName, passWord } = this.state;
        LoginServices.Login(userName, passWord).then(result => {
            if(result.data)
            {
            const userInfo = Object.assign({}, {...result.data.userClaim, token: result.data.token});
            AuthenticationManager.SetUserInfo(userInfo);
            this.props.history.push("/");
            }
        }, error => {
            const data = error.response.data;
            switch (data.status) {
                case "LOCKED":
                    this.setState({error:{message:"Tài khoản đã bị khóa."}});
                    break;
                case "DEACTIVATED":
                    this.setState({error:{message:"Tài khoản đã bị ngừng hoạt động."}});
                    break;
            
                default:
                    this.setState({error:{message:"Sai tên đăng nhập hoặc mật khẩu"}});
                    break;
            }
        });
    }



    render = () => {
        const { error } = this.state;
        return (
            <>
                <div className="w-100 h-100">
                    <div className="justify-content-center align-items-center container-login"
                        style={{
                            backgroundImage: `url(${background})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            filter: 'blur(5px)',
                            zIndex: '1',
                            position: "relative"

                        }}></div>

                    <div className="form-login-container d-flex justify-content-center align-items-center">
                        <div className="form-login pt-3 pl-5 pr-5 pb-5">
                            <div className="w-100 d-flex justify-content-center" style={{ height: '100px', backgroundColor: "white" }}>
                                <Image src={logo} width={100} height="100%" />
                            </div>
                            <div className="w-100 mt-5">
                                <label><b>Tên đăng nhập</b></label>
                                <input type="text" fieldName="userName" onChange={this.onTextboxChange} field className="form-control" placeholder="Tên đăng nhập" />
                                <label className="mt-2"><b>Mật khẩu</b></label>
                                <input type="password" fieldName="passWord" className="form-control" onChange={this.onTextboxChange} placeholder="Mật khẩu" />
                                {
                                    error != null && <span style={{ color: "red" }}><i>*{error?.message}</i></span>
                                }
                            </div>
                            <div className="w-100 mt-2">
                                <LanguageSelect/>
                            </div>
                            <div className="w-100" style={{ marginTop: '25px' }}>
                                <button disabled={!this.isValid()} onClick={this.onLogin} className=" form-control btn btn-primary">Đăng nhập</button>
                                <div className="w-100 mt-2 d-flex justify-content-center">
                                    <Link href="#">Quên mật khẩu?</Link>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </>

        )
    }
}