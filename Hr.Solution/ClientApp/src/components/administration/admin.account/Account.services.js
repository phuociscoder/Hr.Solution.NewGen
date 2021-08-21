import RestClient from "../../../services/common/RestClient";

export class AccountServices {
    static baseUrl ="/api/Authenticate";
    static createUrl = `${this.baseUrl}/register`;
    static deleteUrl ="/api/User/delete/{0}";

    static baseUserUrl ="/api/User";
    
    static Create =(model) => {
        return RestClient.SendPostRequest(this.baseUrl, model);
    }

    static Update =(id, params) => {
        return RestClient.SendPutRequest(`${this.baseUrl}/${id}`, params);
    }

    static Delete =(id) => {
        return RestClient.SendPutRequest(this.deleteUrl.replace("{0}", id));
    }

    static GetAll =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUserUrl, params);
    }
}