import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import MenuApi from '../api/MenuApi';

class AppMenuActions {

    getTopMenus(){
        MenuApi.getTopMenus()
            .then((response) => {
                let topMenus = response.body;
               // console.log(topMenu);
                AppDispatcher.dispatch({
                    actionType: AppConstants.INITIALIZE_MENUS,
                    topMenus:  topMenus
                });
            }).catch((err) => {
                console.log(err);
            });
    }

};

export default new AppMenuActions();