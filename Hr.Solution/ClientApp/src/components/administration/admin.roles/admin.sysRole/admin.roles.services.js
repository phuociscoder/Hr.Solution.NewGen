import { AuthenticationManager } from "../../../../AuthenticationManager";
import RestClient from "../../../../services/common/RestClient";

export class AdminRoleServices {
    static baseUrl = "/api/SystemRole";
    static addUserUrl ="/api/SystemRole/add-user";
    static getUsersUrl ="/api/SystemRole/get-users/{0}";
    static removeUserUrl ="/api/SystemRole/delete-user/{0}";
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

    static AddUser =(params) => {
        return RestClient.SendPostRequest(this.addUserUrl, params);
    }

    static GetUsers =(roleId, params) => {
        return RestClient.SendGetRequestWithParameters(this.getUsersUrl.replace("{0}", roleId), params)
    }

    static RemoveUser =(userRoleId) => {
        return RestClient.SendDeleteRequest(this.removeUserUrl.replace("{0}", userRoleId));
    }

    static GetFunctions =() => {
        return RestClient.SendGetRequest(this.getFunctionsUrl);
    }

    static GetRolePermissions =(roleId) => {
        return RestClient.SendGetRequest(this.getRolePermissionsUrl.replace("{0}", roleId));
    }

    static UpdateRolePermissions =(roleId, params) => {
        return RestClient.SendPostRequest(this.updateRolePermissionUrl.replace("{0}", roleId), params);
    }
}