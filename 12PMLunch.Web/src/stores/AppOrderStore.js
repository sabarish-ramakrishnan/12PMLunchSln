import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher'
import { EventEmitter } from 'events';
import $ from 'jquery'
import common from '../common/common';

var CHANGE_EVENT = 'change';

class AppOrderStore extends EventEmitter {
    constructor() {
        super();
        this._orderList = [];
        this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this))
    }

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }
    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    getOrderId(orderId) {
        let order = null;
        $.grep(this._orderList, (obj) => {
            if (parseInt(obj.OrderId,10) === parseInt(orderId,10)) {
                order = obj;
            }
        });
        return order;
    }

    getOrderByDate(orderDate) {
        let order = null;
        $.grep(this._orderList, (obj) => {
            if (common.getFormattedDate(new Date(orderDate)) === common.getFormattedDate(new Date(obj.OrderDate)) ) {
                order = obj;
            }
        });
        return order;
    }

    getOrderList() {
        return this._orderList;      
    }

    getLastOrder() {
        //alert(this._orderList.length);
        let length=this._orderList.length;
        let order= this._orderList[length-1];
        return  order;   
    }

    dispatcherCallback(action) {
        // Switches over the action's type when an action is dispatched.
        switch (action.actionType) {
            case AppConstants.INITIALIZE_ORDERS:
                this._orderList = action.orderList
                //console.log(this._orderList);
                this.emit(CHANGE_EVENT);
                break;
            case AppConstants.SUBMIT_ORDER:
                //console.log(action.order);
                this._orderList.push(action.order);
                this.emit(CHANGE_EVENT);
                break;
            default:
                break;

        }
        return true;
    }

}

export default new AppOrderStore();