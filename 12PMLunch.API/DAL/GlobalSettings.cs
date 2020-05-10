using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _12PMLunch.API.DAL
{
    public static class GlobalSettings
    {
        public static string GetValue(string key, DBEntities dbEntities = null)
        {
            if (dbEntities == null)
                dbEntities = LunchDBEntity.Instance;

            GlobalSetting setting = dbEntities.GlobalSettings.ToList()
                .FirstOrDefault(x => string.Equals(x.SettingsKey, key, StringComparison.InvariantCultureIgnoreCase) && x.IsActive);

            if (setting == null)
                return string.Empty;
            else
                return Convert.ToString(setting.SettingsValue).Trim();
        }
    }
}