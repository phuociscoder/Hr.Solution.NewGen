import RestClient from "../../../../services/common/RestClient";

export class InsuranceCategoryService {
    static baseUrl = 'api/Category/insurance';

    static getInsurances = () => {
        return RestClient.SendGetRequest(this.baseUrl);
    }

    static getById =(id) => {
        return RestClient.SendGetRequest(`${this.baseUrl}/${id}`);
    }

    static insert =(params) => {
        return RestClient.SendPostRequest(this.baseUrl, params);
    }

    static update =(id, params) => {
        return RestClient.SendPutRequest(`${this.baseUrl}/${id}`, params);
    }

    static delete =(id) => {
        return RestClient.SendDeleteRequest(`${this.baseUrl}/${id}`);
    }
}