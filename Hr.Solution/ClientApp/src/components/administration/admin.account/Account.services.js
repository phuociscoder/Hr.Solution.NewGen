import RestClient from "../../../services/common/RestClient";

export class AccountServices {
    static baseUrl ="/api/Authenticate";
    static createUrl = `${this.baseUrl}/register`;

    static baseUserUrl ="/api/User";
    
    static Create =(model) => {
        return RestClient.SendPostRequest(this.baseUrl, model);

    }

    static GetAll =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUserUrl, params);
    }
}