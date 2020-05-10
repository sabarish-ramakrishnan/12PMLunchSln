import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher'
import { EventEmitter } from 'events';
import $ from 'jquery'
import common from '../common/common';

var CHANGE_EVENT = 'change';

class AppMenuStore extends EventEmitter {
    constructor() {
        super();
        this._topMenuList = [];
        this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this))
    }

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }
    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    getMenuTypes(menuId) {
        let menuTypes=  this._topMenuList.filter(x => parseInt(x.MenuId,10) === parseInt(menuId,10));
        return menuTypes;
    }

    getMenuById(menuId) {
        let menu=  this._topMenuList.filter(x => parseInt(x.MenuId,10) === parseInt(menuId,10))[0];
        return menu;
    }

    getMenuByDate(menuDate) {
        let menu=  this._topMenuList.filter(x => common.getFormattedDate(new Date(x.MenuDate)) === common.getFormattedDate(new Date(menuDate)))[0];
        return menu;
    }

    getTopMenuList() {
        return this._topMenuList;
    }
    getTopMenuListCount() {
        return this._topMenuList.length;
    }

    dispatcherCallback(action) {
        // Switches over the action's type when an action is dispatched.
        switch (action.actionType) {
            case AppConstants.INITIALIZE_MENUS:
                this._topMenuList = action.topMenus
                //console.log(this._topMenuList);
                this.emit(CHANGE_EVENT);
                break;
            case AppConstants.ADD_MENU:
                this._topMenuList.push(action.menu);
                this.emit(CHANGE_EVENT);
                //console.log(action.menu);
                break;
            default:
                break;

        }
        return true;
    }

}

export default new AppMenuStore();