using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _12PMLunch.API.DAL
{
    public static class LunchDBEntity
    {
        public static DBEntities Instance
        {
            get
            {
                return new DBEntities();
            }
        }
    }
}