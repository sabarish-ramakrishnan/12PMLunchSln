import baseApi from './baseApi';
import common from '../common/common'


class MenuApi {
   
    getTopMenus = () => {
        return baseApi.super_get('/Menus/GetAllMenu/5');
    }

    getMenuById = (menuId) => {
        return baseApi.super_get('/Menus/GetMenuById/' + menuId);
    }


    getMenuByDate = (date) => {
        let formattedDate = common.getFormattedDate(date);
        return baseApi.super_get('/Menus/GetMenuByDate?menuDateStr=' + formattedDate);
    }

    
}

export default new MenuApi();