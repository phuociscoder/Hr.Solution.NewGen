import RestClient from "../../../services/common/RestClient";

export class DepartmentServices {
    static baseUrl = "/api/Department";
    static searchByFreeTextUrl = "/api/Department/{0}";

    static GetByFreeText =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUrl, params);
    }
}