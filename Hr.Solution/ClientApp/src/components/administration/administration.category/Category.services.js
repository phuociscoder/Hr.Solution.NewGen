import { AuthenticationManager } from "../../../AuthenticationManager";
import RestClient from "../../../services/common/RestClient"

export class CategoryServices {

    static baseCategoryUrl ="/api/Category";
    static baseCategoryItem="/api/Category/item";
    static nationsURL = `${this.baseCategoryUrl}/nations`;

    static getCategories =() => {
       return RestClient.SendGetRequest(this.baseCategoryUrl);
    }
    
    static GetCategoryById =(id) => {
        return RestClient.SendGetRequest(`${this.baseCategoryUrl}/${id}`);
    }
    
    static GetCategoryItems =(categoryId) => {
        return RestClient.SendGetRequest(`${this.baseCategoryItem}/${categoryId}`);
    }
    
    static AddCategoryItem =(params) => {
        return RestClient.SendPostRequest(this.baseCategoryItem, params);
    }

    static UpdateCategoryItem =(itemId, params) => {
        return RestClient.SendPutRequest(`${this.baseCategoryItem}/${itemId}`, params);
    }
    
    static DeleteCategoryItem =(itemId) => {
        const currentUser = AuthenticationManager.UserName();
        return RestClient.SendPutRequest(`${this.baseCategoryItem}/delete/${itemId}`, {deletedBy: currentUser});
    }

    static getNations = (prefix, parentCode) => {
       return RestClient.SendGetRequest(`${this.nationsURL}/${prefix}?parentCode=${parentCode}`);
    }
}