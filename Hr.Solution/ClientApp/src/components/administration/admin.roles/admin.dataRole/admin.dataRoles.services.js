import { AuthenticationManager } from "../../../../AuthenticationManager";
import RestClient from "../../../../services/common/RestClient";

export class AdminDataRoleServices {
    static baseUrl = "/api/DataRole";
    static baseSysRoleUrl ="/api/DataRole/sysrole/{0}";
    static baseDataRoleDepartmentUrl ="/api/DataRole/department/{0}";

    static GetAllRolesByName =(params) => {
        return RestClient.SendGetRequestWithParameters(this.baseUrl, params);
    }

    static Create =(params) => {
        return RestClient.SendPostRequest(this.baseUrl, params);
    }

    static Update =(id, params) => {
        return RestClient.SendPutRequest(`${this.baseUrl}/${id}`, params);
    }

    static SystemRoleLoadSearchUser =(params) => {
        return RestClient.SendGetRequestWithParameters(this.sysrolSearchUserUrl, params);
    }

    static AddSysRole =(domainId, params) => {
        return RestClient.SendPostRequest(this.baseSysRoleUrl.replace("{0}", domainId), params);
    }

    static GetSysRoles =(domainId, params) => {
        return RestClient.SendGetRequestWithParameters(this.baseSysRoleUrl.replace("{0}", domainId), params);
    }

    static RemoveSysRole =(id) => {
        return RestClient.SendDeleteRequest(this.baseSysRoleUrl.replace("{0}", id));
    }

    static GetDataRoleDepartments =(domainId) => {
        return RestClient.SendGetRequest(this.baseDataRoleDepartmentUrl.replace("{0}", domainId));
    }

    static UpdateDataRoleDepartments =(domainId ,departmentIds) => {
        return RestClient.SendPostRequest(this.baseDataRoleDepartmentUrl.replace("{0}", domainId), departmentIds);
    }
}