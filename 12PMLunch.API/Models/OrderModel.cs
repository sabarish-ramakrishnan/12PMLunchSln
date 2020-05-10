using _12PMLunch.API.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace _12PMLunch.API.Models
{
    public class OrderModel
    {
        public OrderModel()
        {

        }
        public OrderModel(DAL.Order x)
        {
            this.OrderId = x.OrderId;
            this.OrderNumber = x.OrderNumber;
            this.OrderDate = x.OrderDate;
            this.UserId = x.UserId;
            this.MenuTypeId = x.MenuTypeId;
            this.OrderQuantity = x.OrderQuantity;
            this.TotalAmount = x.TotalAmount;
            this.Comments = x.Comments;
            this.RequestedDate = x.RequestedDate;
            this.OrderStatusCode = x.OrderStatusCode;
            this.OrderStatusCode = x.OrderStatusCode;
            this.RequestedUser = new UserModel(x.User);
            this.MenuType = new MenuTypeModel(x.MenuType);

            if (x.OrderItemMappings.Count() > 0)
            {
                this.OrderItems = x.OrderItemMappings
                    .Select(mapping => new OrderItemMappingModel
                    {
                        ItemId = mapping.ItemId,
                        OrderId = x.OrderId,
                        OrderItemMappingId = mapping.OrderItemMappingId,
                        Quantity = mapping.Quantity,
                        ItemType = mapping.ItemType,
                        Item = new ItemModel(mapping.Item)
                    });
            }


        }

        public int OrderId { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; }
        public int UserId { get; set; }
        public int MenuTypeId { get; set; }
        public int OrderQuantity { get; set; }
        public decimal TotalAmount { get; set; }
        public string Comments { get; set; }
        public DateTime RequestedDate { get; set; }
        public int OrderStatusCode { get; set; }

        public IEnumerable<OrderItemMappingModel> OrderItems { get; set; }
        public UserModel RequestedUser { get; set; }
        public MenuTypeModel MenuType { get; set; }

        public string OrderStatus
        {
            get
            {
                switch (this.OrderStatusCode)
                {
                    case 2:
                        return Constants.OrderStatus.Cancelled;
                    case 3:
                        return Constants.OrderStatus.MaxedOut;
                    case 1:
                    default:
                        return Constants.OrderStatus.Received;
                }
            }
        }

        public string OtherItems
        {
            get
            {
                if (this.OrderItems != null && this.OrderItems.Count() > 0 && this.OrderId > 0)
                {
                    StringBuilder otherItems = new StringBuilder();
                    foreach (var item in this.OrderItems.Where(x => x.ItemType.ToString() != Constants.ItemType.ItemTypeCode.Main))
                    {
                        otherItems.AppendLine(string.Format("{0} : {1}", item.Item.ItemName, item.Quantity));
                    }
                    return otherItems.ToString();
                }
                return string.Empty;
            }
        }


        public string OrderDateStr
        {
            get
            {
                return this.OrderDate.ToString("MMM dd, yyyy");
            }
        }
        public string RequestedDateStr
        {
            get
            {
                return this.RequestedDate.ToString("MMM dd, yyyy hh:mm:ss tt");
            }
        }

        public string OrderedBy
        {
            get
            {
                return (this.RequestedUser != null ? string.Concat(this.RequestedUser.FirstName, ' ', this.RequestedUser.LastName) : string.Empty);
            }
        }

        public string OrderContactNo
        {
            get
            {
                if (this.RequestedUser == null)
                    return string.Empty;
                return this.RequestedUser.Mobile;
            }
        }

        public string OrderByEmail
        {
            get
            {
                if (this.RequestedUser == null)
                    return string.Empty;
                return this.RequestedUser.EmailId;
            }
        }

        public static DAL.Order createOrderEntity(OrderModel e)
        {
            DAL.Order o = new DAL.Order();
            o.OrderId = e.OrderId;
            o.OrderNumber = e.OrderNumber;
            o.OrderDate = e.OrderDate;
            o.UserId = e.UserId;
            o.MenuTypeId = e.MenuTypeId;
            o.OrderQuantity = e.OrderQuantity;
            o.TotalAmount = e.TotalAmount;
            o.Comments = e.Comments;
            o.OrderStatusCode = e.OrderStatusCode;
            //if (e.RequestedDate.Date == DateTime.MinValue.Date)
            o.RequestedDate = Common.GetCSTTime();

            foreach (var orderItem in e.OrderItems)
            {
                o.OrderItemMappings.Add(OrderItemMappingModel.createOrderItemMapping(orderItem));
            }

            return o;
        }
    }
}