using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace _12PMLunch.API.Utils
{
    public static class Common
    {
        public static string returnDecodedString(string encodedString)
        {
            try
            {
                if (string.IsNullOrEmpty(encodedString))
                    return string.Empty;
                return Convert.ToString(Encoding.UTF8.GetString(Convert.FromBase64String(encodedString)));
            }
            catch (Exception e)
            {
                Log.Error("Error in returnDecodedString: " + e.ToString());
                return string.Empty;
            }

        }

        public static string EncodedString(string str)
        {
            if (string.IsNullOrEmpty(str))
                return string.Empty;
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(str));
        }

        public static DateTime GetCSTTime()
        {
            try
            {
                DateTime timeUtc = DateTime.UtcNow;
                TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
                DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(timeUtc, cstZone);
                return cstTime;
            }
            catch (TimeZoneNotFoundException)
            {
                return DateTime.Now;
            }
            catch (InvalidTimeZoneException)
            {
                return DateTime.Now;
            }
            catch (Exception)
            {
                return DateTime.Now;
            }
        }
    }
}