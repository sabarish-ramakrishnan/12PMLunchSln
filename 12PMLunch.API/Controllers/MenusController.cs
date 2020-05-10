using _12PMLunch.API.DAL;
using _12PMLunch.API.Models;
using _12PMLunch.API.Utils;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace _12PMLunch.API.Controllers
{
    [AllowAnonymous]
    public class MenusController : ApiController
    {
        // GET api/values
        public IEnumerable<DailyMenuModel> GetAllMenu(int top = 0)
        {
            var dbEntities = LunchDBEntity.Instance;
            DateTime localDateTime = Common.GetCSTTime();
            int cutOffHour = Convert.ToInt32(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.CutoffTime, dbEntities));

            DateTime startingDate = localDateTime.Hour < cutOffHour ? localDateTime.AddDays(1).Date : localDateTime.AddDays(2).Date;

            IEnumerable<DailyMenuModel> allMenus = dbEntities.DailyMenus.ToList().Where(x => x.IsActive == true)
                .Where(x => x.MenuDate >= startingDate).OrderBy(x => x.MenuDate)
                .Select(x => new DailyMenuModel(x));

            if (top > 0 && allMenus != null && allMenus.Count() > top)
                return allMenus.Take(top);

            return allMenus;
        }

        public JObject GetMenus(int top = 0)
        {
            dynamic returnData = new JObject();
            var dbEntities = LunchDBEntity.Instance;
            DateTime localDateTime = Common.GetCSTTime();
            IEnumerable<DailyMenuModel> allMenus = Enumerable.Empty<DailyMenuModel>();
            if (IsOrderingDisabled(dbEntities))
            {
                returnData.OrderingDisabled = true;
                returnData.Menus = JToken.FromObject(allMenus);
                return returnData;
            }
            int cutOffHour = Convert.ToInt32(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.CutoffTime, dbEntities));

            DateTime startingDate = localDateTime.Hour < cutOffHour ? localDateTime.AddDays(1).Date : localDateTime.AddDays(2).Date;

            allMenus = dbEntities.DailyMenus.ToList().Where(x => x.IsActive == true)
                .Where(x => x.MenuDate >= startingDate).OrderBy(x => x.MenuDate)
                .Select(x => new DailyMenuModel(x));

            returnData.OrderingDisabled = false;
            if (top > 0 && allMenus != null && allMenus.Count() > top)
                returnData.Menus = JToken.FromObject(allMenus.Take(top));
            else
                returnData.Menus = JToken.FromObject(allMenus);
            
            return returnData;
        }

        // GET api/Menus/GetMenuByDate/5
        public DailyMenuModel GetMenuById(int id)
        {
            DAL.DailyMenu menuItem = LunchDBEntity.Instance.DailyMenus.ToList()
                .FirstOrDefault(x => x.MenuId == id);
            if (menuItem == null)
                return null;
            return new DailyMenuModel(menuItem);
        }

        // GET api/Menus/GetMenuByDate/12312017
        public DailyMenuModel GetMenuByDate(string menuDateStr)
        {
            var dbEntities = LunchDBEntity.Instance;
            DateTime menuDate = DateTime.MinValue;
            DateTime localDateTime = Common.GetCSTTime();

            if (!DateTime.TryParseExact(menuDateStr, Constants.Common.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out menuDate))
            {
                return null;
            }
            int cutOffTime = Convert.ToInt32(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.CutoffTime, dbEntities));
            if (localDateTime.Date >= menuDate.Date)
            {
                return null;
            }
            if (localDateTime.Hour >= cutOffTime && localDateTime.AddDays(1).Date == menuDate.Date)
            {
                return null;
            }

            DAL.DailyMenu menuItem = dbEntities.DailyMenus.ToList()
                .FirstOrDefault(x => x.MenuDate == menuDate);
            if (menuItem == null)
                return null;
            return new DailyMenuModel(menuItem);
        }

        // POST api/values
        [HttpPost]
        public void AddMenu([FromBody]DailyMenuModel menuItem)
        {
            var dbEntities = LunchDBEntity.Instance;
            dbEntities.DailyMenus.Add(DailyMenuModel.createDailyMenuEntity(menuItem));
            dbEntities.SaveChanges();
        }

        // PUT api/values/5
        public void UpdateMenu(int id, [FromBody]string value)
        {
            throw new NotImplementedException();
        }

        // DELETE api/values/5
        [HttpPost]
        public void DeleteMenu(int id)
        {
            var dbEntities = LunchDBEntity.Instance;
            DAL.DailyMenu menuItem = dbEntities.DailyMenus.ToList()
                .FirstOrDefault(x => x.MenuId == id);
            if (menuItem == null)
                return;
            dbEntities.DailyMenus.Remove(menuItem);
            dbEntities.SaveChanges();
        }

        private bool IsOrderingDisabled(DBEntities dbEntities)
        {
            string orderingDisabledStr = GlobalSettings.GetValue(Constants.GlobalSettingsKeys.OrderingDisabled, dbEntities);
            if (string.IsNullOrEmpty(orderingDisabledStr))
                return false;
            else
                return Convert.ToBoolean(orderingDisabledStr);
        }
    }
}
