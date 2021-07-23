import { AuthenticationManager } from "../AuthenticationManager";

export class AuthorizeService {

    static login = (username, password) => {
        //TODO : call API here
        const users = [
            { id: 1, userName: 'admin', passWord: '123456', name: "Administration" },
            { id: 2, userName: 'phuoc.nguyen', passWord: '123456', name: "Nguyễn Hữu Phước" }];

        const user = users.find(x => x.userName === username && x.passWord === password);

        if (user) {
            AuthenticationManager.setAuthenInfo(user);
            return Object.assign({}, { status: "success", message: null });
        } else {
            return Object.assign({}, { status: "error", message: "Sai tên đăng nhập hoặc mật khẩu." });
        }

    }

    static logout = () => {
        AuthenticationManager.clearAuthenInfo();

    }

}

