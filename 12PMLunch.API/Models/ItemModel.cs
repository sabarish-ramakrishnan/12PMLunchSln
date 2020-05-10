using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _12PMLunch.API.Models
{
    public class ItemModel
    {
        public ItemModel()
        {

        }
        public ItemModel(DAL.Item x)
        {
            this.ItemId = x.ItemId;
            this.ItemName = x.ItemName;
            this.ItemDescription = x.ItemDescription;
            this.ItemPrice = x.ItemPrice;
            this.IsActive = x.IsActive;
            this.ImageUrl = x.ImageUrl;
        }
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public decimal ItemPrice { get; set; }
        public bool IsActive { get; set; }
        public string ImageUrl { get; set; }
    }
}