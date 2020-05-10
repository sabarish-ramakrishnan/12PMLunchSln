using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _12PMLunch.API.Utils
{
    public static class Log
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public static void Info(string message)
        {
            logger.Info(message);
        }

        public static void Error(string error)
        {
            logger.Info(error);
        }
    }
}