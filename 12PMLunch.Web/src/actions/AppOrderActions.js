import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import OrderApi from '../api/OrderApi';

class AppOrderActions {

    getAllOrders(reqObject){

        OrderApi.getAllOrders(reqObject)
        .then((response) => {
            let responseData = response.body;
            AppDispatcher.dispatch({
                actionType: AppConstants.INITIALIZE_ORDERS,
                orderList:  responseData
            });
            return responseData;
          
        }).catch((err) => {
            console.log(err);
        });
        
    }

    submitOrder(order){
        OrderApi.submitOrder(order)
        .then((response) => {
            let responseData = response.body;
            order.OrderId=responseData.OrderId;
            AppDispatcher.dispatch({
                actionType: AppConstants.SUBMIT_ORDER,
                order:  order
            });          
        }).catch((err) => {
            console.log(err);
        });
        
    }
    
};

export default new AppOrderActions();