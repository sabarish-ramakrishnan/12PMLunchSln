using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using _12PMLunch.API.DAL;
using _12PMLunch.API.Utils;

namespace _12PMLunch.API.Models
{
    public class MenuItemMappingModel
    {
        public int MenuItemMappingId { get; set; }
        public int MenuId { get; set; }
        public int ItemId { get; set; }
        public string ItemType { get; set; }
        public decimal ItemPrice { get; set; }
        public int SortOrder { get; set; }
        public int MenuTypeId { get; set; }

        public ItemModel Item { get; set; }
        public MenuTypeModel MenuType { get; set; }

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

        public static MenuItemMapping createMenuItemMapping(MenuItemMappingModel item)
        {
            MenuItemMapping map = new MenuItemMapping();
            map.ItemId = item.ItemId;
            //map.MenuId = item.MenuId;
            map.ItemType = item.ItemType;
            map.ItemPrice = item.ItemPrice;
            map.SortOrder = item.SortOrder;
            map.MenuTypeId = item.MenuTypeId;
            return map;
        }
    }
}