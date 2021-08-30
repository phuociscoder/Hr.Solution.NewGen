import RestClient from "../../services/common/RestClient";

export class EmployeeServices {
    static baseUrl = "/api/Employee";

    static GetManagers =() => {
        return RestClient.SendGetRequest(`${this.baseUrl}/managers`);
    }
}