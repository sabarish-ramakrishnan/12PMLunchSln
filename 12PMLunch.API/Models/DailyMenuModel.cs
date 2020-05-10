using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using _12PMLunch.API.DAL;
using _12PMLunch.API.Utils;
using System.Web.Hosting;
using System.IO;

namespace _12PMLunch.API.Models
{
    public class DailyMenuModel
    {
        public DailyMenuModel()
        {

        }
        public DailyMenuModel(DAL.DailyMenu dm)
        {
            this.MenuId = dm.MenuId;
            this.MenuDate = dm.MenuDate;
            this.Price = dm.Price;
            this.ImageUrl = dm.ImageUrl;
            this.Comments = dm.Comments;
            this.IsActive = dm.IsActive;
            this.MenuName = dm.MenuName;

            
            if (dm.MenuTypes != null && dm.MenuTypes.Count() > 0)
            {
                this.MenuTypes = dm.MenuTypes
                    .Select(mapping => new MenuTypeModel(mapping));
            }
            //if (!string.IsNullOrEmpty(this.ImageUrl))
            //    this.ImageBinary = GetBinaryEncoded(this.ImageUrl);

        }
        public int MenuId { get; set; }
        public System.DateTime MenuDate { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string ImageBinary { get; set; }
        public string Comments { get; set; }
        public bool IsActive { get; set; }
        public string MenuName { get; set; }
        public string MenuItemsStr { get; set; }
        
        public IEnumerable<MenuTypeModel> MenuTypes { get; set; }

        public static DailyMenu createDailyMenuEntity(DailyMenuModel menu)
        {
            DailyMenu o = new DailyMenu();
            o.MenuId = menu.MenuId;
            o.MenuDate = menu.MenuDate;
            o.Price = menu.Price;
            o.ImageUrl = menu.ImageUrl;
            o.Comments = menu.Comments;
            o.IsActive = menu.IsActive;
            o.MenuName = menu.MenuName;

            //foreach (var item in menu.MenuItems)
            //{
            //    o.MenuItemMappings.Add(MenuItemMappingModel.createMenuItemMapping(item));
            //}
            return o;
        }

        private string GetBinaryEncoded(string fileName)
        {
            try
            {
                byte[] b;
                string imagepath = Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "Content/MenuImages/", fileName);
                if (File.Exists(imagepath))
                {
                    b = File.ReadAllBytes(imagepath);
                    return "data:image/jpg;base64," + Convert.ToBase64String(b);
                }
                else
                {
                    string noimagepath = Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "Content/MenuImages/noimage.png");
                    b = File.ReadAllBytes(noimagepath);
                    return "data:image/png;base64," + Convert.ToBase64String(b);
                }
            }
            catch (Exception e)
            {
                Log.Error("Error in image binary load:" + e.ToString());
                return string.Empty;
            }

        }
    }
}