 export class AuthenticationManager {
    static setAuthenInfo =(authen) => {
        if(!authen) return;
    
        const user = {
            userName : authen.userName,
            name: authen.name,
            id: authen.id
        }
    
        localStorage.setItem("user", JSON.stringify(user));
    }

    static clearAuthenInfo =() => {
        localStorage.removeItem("user");
    }

    static userId =() =>{
        return JSON.parse(localStorage.getItem("user"))?.id;
    }

    static userName =() => {
        return JSON.parse(localStorage.getItem("user")?.name);
    }

    static isAuthorized =() => {
        const user = localStorage.getItem("user");
        if (user != null) return true;
        return false;
    }

 }
 