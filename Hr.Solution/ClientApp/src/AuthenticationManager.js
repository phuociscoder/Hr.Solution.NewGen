export class AuthenticationManager {
    static SetUserInfo = (userInfo) => {
        if (!userInfo) return;

        localStorage.setItem(AuthenInfo.TOKEN, userInfo.token);
        localStorage.setItem(AuthenInfo.AVATAR, userInfo.avatar);
        const user = {
            userName: userInfo.userName,
            email: userInfo.email,
            fullName: userInfo.fullName,
            roles: userInfo.SystemRoles
        }
        localStorage.setItem(AuthenInfo.USER_INFO, JSON.stringify(user));
    }

    static SetSystemRoles = (sysRoles) => {
        localStorage.setItem(AuthenInfo.SYS_ROLES, JSON.stringify(sysRoles));
    }

    static SetDataRoles = (dataRoles) => {
        localStorage.setItem(AuthenInfo.DATA_ROLES, JSON.stringify(dataRoles));
    }

    static ClearAuthenInfo = () => {
        AuthenInfo.ALL.forEach(authItem => {
            localStorage.removeItem(authItem);
        });
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

    static Avatar =() => {
        return localStorage.getItem(AuthenInfo.AVATAR);
    }

    static Token =() => {
        return localStorage.getItem(AuthenInfo.TOKEN);
    }

    static Language =() => {
        return localStorage.getItem(AuthenInfo.LANGUAGE);
    }

    static IsAuthorized = () => {
        const token = localStorage.getItem(AuthenInfo.TOKEN);
        if (token != null) return true;
        return false;
    }

    static IsHasPermission =(prefix, permission) => {

    }

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
