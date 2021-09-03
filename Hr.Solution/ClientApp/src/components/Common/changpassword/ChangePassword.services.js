import RestClient from "../../../services/common/RestClient";
export default class ChangePasswordServices {

    static BaseUrl ='/api/Authenticate';
    static changPasswordUrl=`${this.BaseUrl}/changePassword`;

    static UpdatePassword = (userName, currentPassword, newPassword) => {
        const params = {currentPassword: currentPassword, newPassword: newPassword};
        return RestClient.SendPutRequest(`${this.changPasswordUrl}/${userName}`, params);
    }
}