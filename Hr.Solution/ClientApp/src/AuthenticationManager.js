export class AuthenticationManager {
    static SetUserInfo = (userInfo) => {
        if (!userInfo) return;

        localStorage.setItem(AuthenInfo.TOKEN, userInfo.token);
        localStorage.setItem(AuthenInfo.AVATAR, userInfo.avatar);
        const user = {
            userName: userInfo.userName,
            email: userInfo.email,
            fullName: userInfo.fullName,
            isAdmin: userInfo.isAdmin,
            sysRoles: userInfo.userSysRoles,
            permissions: userInfo.userPermissions

        }
        localStorage.setItem(AuthenInfo.USER_INFO, JSON.stringify(user));
    }

    static ClearAuthenInfo = () => {
        AuthenInfo.ALL.forEach(authItem => {
            localStorage.removeItem(authItem);
        });
    }

    static SysRoles = () => {
        if (!this.IsAuthorized()) return null;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        return userInfo.sysRoles;
    }

    static Permissions = () => {
        if (!this.IsAuthorized()) return null;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        return userInfo.permissions;
    }

    static AllowView = (functionId) => {
        if (!this.IsAuthorized() || !functionId) return false;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        if (userInfo.isAdmin) return true;
        var permissions = userInfo.permissions;
        if (!permissions || permissions.length === 0) return false;
        var funcPermission = permissions.find(x => x.functionId === functionId);
        return funcPermission ? funcPermission.view : false;
    }

    static AllowAdd = (functionId) => {
        if (!this.IsAuthorized() || !functionId) return false;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        if (userInfo.isAdmin) return true;
        var permissions = userInfo.permissions;
        if (!permissions || permissions.length === 0) return false;
        return permissions.find(x => x.functionId === functionId).add;
    }

    static AllowEdit = (functionId) => {
        if (!this.IsAuthorized() || !functionId) return false;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        if (userInfo.isAdmin) return true;
        var permissions = userInfo.permissions;
        if (!permissions || permissions.length === 0) return false;
        return permissions.find(x => x.functionId === functionId).edit;
    }

    static AllowDelete = (functionId) => {
        if (!this.IsAuthorized() || !functionId) return false;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        if (userInfo.isAdmin) return true;
        var permissions = userInfo.permissions;
        if (!permissions || permissions.length === 0) return false;
        return permissions.find(x => x.functionId === functionId).delete;
    }

    static AllowImport = (functionId) => {
        if (!this.IsAuthorized() || !functionId) return false;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        if (userInfo.isAdmin) return true;
        var permissions = userInfo.permissions;
        if (!permissions || permissions.length === 0) return false;
        return permissions.find(x => x.functionId === functionId).import;
    }

    static AllowExport = (functionId) => {
        if (!this.IsAuthorized() || !functionId) return false;
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        if (userInfo.isAdmin) return true;
        var permissions = userInfo.permissions;
        if (!permissions || permissions.length === 0) return false;
        return permissions.find(x => x.functionId === functionId).export;
    }

    static UserId = () => {
        return JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO))?.id;
    }

    static UserName = () => {
        var userInfo = JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO));
        return userInfo ? userInfo["userName"] : "administrator";

    }

    static FullName = () => {
        return JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO))?.fullName;
    }

    static Avatar = () => {
        const avatar = localStorage.getItem(AuthenInfo.AVATAR);
        return avatar;
    }

    static Token = () => {
        return localStorage.getItem(AuthenInfo.TOKEN);
    }

    static Language = () => {
        return localStorage.getItem(AuthenInfo.LANGUAGE);
    }

    static IsAuthorized = () => {
        const token = localStorage.getItem(AuthenInfo.TOKEN);
        if (token != null) return true;
        return false;
    }

    static IsAdmin = () => {
        return JSON.parse(localStorage.getItem(AuthenInfo.USER_INFO))?.isAdmin;
    }

    // static IsHasPermission = (prefix, permission) => {

    // }

}

export class AuthenInfo {
    static TOKEN = "token";
    static USER_INFO = "user_info";
    static AVATAR = "avatar";
    static SYS_ROLES = "sys_roles";
    static DATA_ROLES = "data_roles";
    static LANGUAGE = "lang";
    static ALL = [this.TOKEN, this.USER_INFO, this.AVATAR, this.SYS_ROLES, this.DATA_ROLES, this.LANGUAGE];

}
