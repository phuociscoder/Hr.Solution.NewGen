import RestClient from "../../../services/common/RestClient";

export class DepartmentServices {
    static baseUrl = "/api/Department";
    static baseUrlByUser ="/api/Department/userDepartments";
    static baseUrlByDomain = "/api/Department/roles";
    static baseUrlById = "/api/Department/{0}";

    static GetByFreeText =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUrl, params);
    }

    static GetById=(id) => {
        return RestClient.SendGetRequest(this.baseUrlById.replace("{0}", id));
    }

    static Add =(params) => {
        return RestClient.SendPostRequest(this.baseUrl, params);
    }

    static GetByDomains =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUrlByDomain, params);
    }

    static GetByCurrentUser =() => {
        return RestClient.SendGetRequest(this.baseUrlByUser);
    }

    static CheckExisting(departmentCode)
    {
        return RestClient.SendGetRequest(`${this.baseUrl}/existing/${departmentCode}`);
    }

    static Delete(id)
    {
        return RestClient.SendDeleteRequest(`${this.baseUrl}/${id}`);
    }

    static Update = (id, params) => {
        return RestClient.SendPutRequest(`${this.baseUrl}/${id}`, params);    
    }

    
}