import axios from "axios";
import RestClient from "../../services/common/RestClient";
export default class LoginServices {

    static BaseUrl ='/api/Authenticate';
    static LoginUrl=`${this.BaseUrl}/login`;

    static Login =(userName, password) => {
        const params = {userName: userName, password: password};
        return RestClient.SendPostRequest(this.LoginUrl, params);
    }
}