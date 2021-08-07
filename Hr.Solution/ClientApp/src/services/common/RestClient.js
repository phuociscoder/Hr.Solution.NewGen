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
        return axios.put(url, params, this.getHeader());
    }

    static SendGetRequest = (url) => {
        return axios.get(url);
    }

    static SendGetRequestWithParameters = (url, params) => {
        const query = this.convertToQueryString(params);
        return axios.get(`${url}${query}`);
    }

    static convertToQueryString = (params) => {
        let query = "?";
        Object.keys(params).map((item, index) => {
            query = query + `${item}=${params[item]}&`;
        });

        return query;
    }

}