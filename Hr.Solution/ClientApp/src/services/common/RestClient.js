import axios from "axios";
import { AuthenticationManager } from "../../AuthenticationManager";


export default class RestClient {
    static getHeader = () => {
        const token = AuthenticationManager.Token();
        if (token) {
            return { 'Authorization': `Bearer ${token}` }
        }
        return null;
    }

    static SendPostRequest = (url, params) => {
        return axios.post(url, params, { headers: this.getHeader() });
    }

    static SendPutRequest = (url, params) => {
        return axios.put(url, params, { headers: this.getHeader() });
    }

    static SendGetRequest = (url) => {
        return axios.get(url, {headers: this.getHeader()});
    }

    static SendGetRequestWithParameters = (url, params) => {
        const query = this.convertToQueryString(params);
        return axios.get(`${url}${query}`, { headers: this.getHeader() });
    }

    static SendDeleteRequest =(url) => {
        return axios.delete(url, { headers: this.getHeader() });
    }

    static convertToQueryString = (params) => {
        
        let query = "?";
        for (const [key, value] of Object.entries(params)) {
            query = query + `${key}=${value}&`
        }
        return query;
    }

}