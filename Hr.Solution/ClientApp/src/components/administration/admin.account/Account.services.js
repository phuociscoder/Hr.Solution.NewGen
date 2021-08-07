import RestClient from "../../../services/common/RestClient";

export class AccountServices {
    static baseUrl ="/api/Authenticate";
    static createUrl = `${this.baseUrl}/register`;
    
    static Create =(model) => {
        return RestClient.SendPostRequest(this.baseUrl, model);

    }
}