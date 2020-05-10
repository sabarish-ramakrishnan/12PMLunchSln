using _12PMLunch.API.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _12PMLunch.API.Models
{
    public class OrderItemMappingModel
    {
        public int OrderItemMappingId { get; set; }
        public int OrderId { get; set; }
        public int ItemId { get; set; }
        public int Quantity { get; set; }
        public int ItemType { get; set; }

        public ItemModel Item { get; set; }

        public static DAL.OrderItemMapping createOrderItemMapping(OrderItemMappingModel e)
        {
            DAL.OrderItemMapping a = new DAL.OrderItemMapping();
            a.ItemId = e.ItemId;
            a.OrderId = e.OrderId;
            a.Quantity = e.Quantity;
            a.ItemType = e.ItemType;
            return a;
        }

        public string ItemTypeStr
        {
            get
            {
                //return ReturnItemTypeStr(this.ItemType.Trim());
                switch (Convert.ToString(this.ItemType).Trim())
                {
                    case "2":
                        return Constants.ItemType.Special;

                    case "3":
                        return Constants.ItemType.AddOn;
                    case "1":
                    default:
                        return Constants.ItemType.Main;
                }
            }
        }
    }
}