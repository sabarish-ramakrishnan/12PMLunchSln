import baseApi from './baseApi';
import common from '../common/common'
import AppConstants from '../constants/AppConstants';


class OrderApi {
   
    submitOrder = (orderData) => {

        let selectedSpecialItem = orderData.selectedSpecialItem;
        let selectedAddOnItems = orderData.selectedAddOnItems;
        let orderItems = [];

        if (selectedSpecialItem.quantity !== 0 && selectedSpecialItem.ItemId !== 0) {
            orderItems.push(
                {
                    OrderItemMappingId: 0,
                    OrderId: 0,
                    ItemId: selectedSpecialItem.ItemId,
                    Quantity: selectedSpecialItem.quantity,
                    ItemType:2
                }
            )
        }

        for (let index = 0; index < selectedAddOnItems.length; index++) {
            if (selectedAddOnItems[index].ItemId !== 0 && selectedAddOnItems[index].quantity !== 0) {
                orderItems.push(
                    {
                        OrderItemMappingId: 0,
                        OrderId: 0,
                        ItemId: selectedAddOnItems[index].ItemId,
                        Quantity: selectedAddOnItems[index].quantity,
                        ItemType:3
                    }
                )
            }
        }


        let newOrder = {
            OrderId: 0,
            OrderNumber: '',
            OrderDate: orderData.menuDate,
            UserId: common.getTokenValue(AppConstants.USER_ID),
            MenuTypeId: orderData.menuTypeId,
            OrderQuantity: orderData.orderQuantity,
            TotalAmount: (orderData.menuPrice * orderData.orderQuantity) + (orderData.selectedSpecialItem.ItemPrice * orderData.selectedSpecialItem.quantity),
            Comments: orderData.Comments,
            RequestedDate: common.getFormattedDate(new Date()),
            RequestedUser: { EmailId: common.getcurrentUserEmail() },
            OrderItems: orderItems,
            OrderStatusCode: 1
        };
        return baseApi.super_post('/Orders/SubmitOrder', newOrder);
    }


    getAllOrdersByDate = (orderDate) => {
        return baseApi.super_get('/Orders/GetOrdersByDate?orderDateStr=' + orderDate);
    }


    getAllOrders = (reqObject) => {
        let url = '/Orders/GetAllOrders';
        return baseApi.super_get(url, reqObject);
    }

    deleteOrder = (reqObject) => {
        let url = '/Orders/DeleteOrder';
        return baseApi.super_post(url, reqObject);
    }
}

export default new OrderApi();