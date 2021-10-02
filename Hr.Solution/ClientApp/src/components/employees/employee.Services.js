import RestClient from "../../services/common/RestClient";

export class EmployeeServices {
    static baseUrl = "/api/Employee";
    static getByDeptsUrl = "/api/Employee/getByDepts";

    static GetManagers =() => {
        return RestClient.SendGetRequest(`${this.baseUrl}/managers`);
    }

    static GetByDepartments =(params) => {
        return RestClient.SendPostRequest(this.getByDeptsUrl, params);
    }

    static Add =(sectionName, params) => {
      return RestClient.SendPostRequest(`${this.baseUrl}/${sectionName}`, params);
    }

    static GetById =(id) => {
        return RestClient.SendGetRequest(`${this.baseUrl}/${id}`);
    }

    
}