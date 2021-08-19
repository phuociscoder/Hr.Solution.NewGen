import { AuthenticationManager } from "../../../../AuthenticationManager";
import RestClient from "../../../../services/common/RestClient";

export class AdminDataRoleServices {
    static baseUrl = "/api/DataRole";
    static baseSysRoleUrl ="/api/DataRole/sysrole/{0}";
    static getFunctionsUrl ="/api/SystemRole/functions";
    static getRolePermissionsUrl ="/api/SystemRole/permissions/{0}";
    static updateRolePermissionUrl ="/api/SystemRole/permissions/{0}";

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

    static GetFunctions =() => {
        return RestClient.SendGetRequest(this.getFunctionsUrl);
    }

    static GetRolePermissions =(roleId) => {
        return RestClient.SendGetRequest(this.getRolePermissionsUrl.replace("{0}", roleId));
    }

    static UpdateRolePermission =(roleId, params) => {
        params["user"] =AuthenticationManager.UserName();
        return RestClient.SendPostRequest(this.updateRolePermissionUrl.replace("{0}", roleId), params);
    }
}