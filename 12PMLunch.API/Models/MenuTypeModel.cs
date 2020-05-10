using _12PMLunch.API.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _12PMLunch.API.Models
{
    public class MenuTypeModel
    {
        public MenuTypeModel()
        {

        }
        public MenuTypeModel(DAL.MenuType m)
        {
            this.Description = m.Description;
            this.MenuId = m.MenuId;
            this.MenuTypeId = m.MenuTypeId;
            this.MenuTypeName = m.MenuTypeName;
            this.Price = m.Price;
            this.ImageUrl = m.ImageUrl;

            if (m.MenuItemMappings != null && m.MenuItemMappings.Count() > 0)
            {
                this.MenuItems = m.MenuItemMappings.OrderBy(x => x.SortOrder)
                    .Select(mapping => new MenuItemMappingModel
                    {
                        ItemId = mapping.ItemId,
                        ItemType = mapping.ItemType,
                        MenuTypeId = mapping.MenuTypeId,
                        MenuItemMappingId = mapping.MenuItemMappingId,
                        ItemPrice = mapping.ItemPrice,
                        SortOrder = mapping.SortOrder,
                        Item = new ItemModel(mapping.Item)
                    });
                //this.MenuItemsStr = string.Join(", ", dm.MenuItemMappings.Where(x => x.ItemType == Constants.ItemType.ItemTypeCode.Main)
                //   .Select(mapping => mapping.Item.ItemName).ToArray());
            }
        }
        public int MenuTypeId { get; set; }
        public int MenuId { get; set; }
        public string MenuTypeName { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public decimal Price { get; set; }
        public IEnumerable<MenuItemMappingModel> MenuItems { get; set; }

        public string MenuItemsStr
        {
            get
            {
                if (this.MenuItems == null || this.MenuItems.Count() == 0)
                    return string.Empty;
                return string.Join(", ", this.MenuItems.Where(x => x.ItemType == Constants.ItemType.ItemTypeCode.Main)
                    .Select(mapping => mapping.Item.ItemName).ToArray());
            }
        }
    }
}