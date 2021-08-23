import RestClient from "../../../services/common/RestClient";

export class DepartmentServices {
    static baseUrl = "/api/Department";
    static baseUrlById = "/api/Department/{0}";

    static GetByFreeText =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUrl, params);
    }

    static GetById=(id) => {
        return RestClient.SendGetRequest(this.baseUrlById.replace("{0}", id));
    }
}