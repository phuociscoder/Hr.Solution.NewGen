import  RestClient  from "../../../services/common/RestClient"

export class AdminRoleServices {
    static baseUrl = "/api/SystemRole";

    static GetAllRolesByName =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUrl, params);
    }

    static Create =(params) => {
        return RestClient.SendPostRequest(this.baseUrl, params);
    }
}