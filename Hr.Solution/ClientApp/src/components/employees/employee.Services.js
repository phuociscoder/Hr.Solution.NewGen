import RestClient from "../../services/common/RestClient";

export class EmployeeServices {
    static baseUrl = "/api/Employee";
    static getByDeptsUrl = "/api/Employee/getByDepts";
    static getColumnNameExport = "api/ExportTemplate";

    static GetManagers =() => {
        return RestClient.SendGetRequest(`${this.baseUrl}/managers`);
    }

    static GetByDepartments =(params) => {
        return RestClient.SendPostRequest(this.getByDeptsUrl, params);
    }

    static Add =(sectionName, params) => {
        console.log(params);
      return RestClient.SendPostRequest(`${this.baseUrl}/${sectionName}`, params);
    }

    static getColumnNameExportFile = (tableName) => {
        return RestClient.SendGetRequest(`${this.getColumnNameExport}?tableName=${tableName}`)
    }

}
