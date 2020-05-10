using _12PMLunch.API.DAL;
using _12PMLunch.API.Models;
using _12PMLunch.API.Utils;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace _12PMLunch.API.Controllers
{
    public class OrdersController : ApiController
    {
        public IEnumerable<OrderModel> GetAllOrders(string currentUser, string fromDateStr = null, string toDateStr = null)
        {
            var dbEntities = LunchDBEntity.Instance;
            DateTime fromDate = DateTime.MinValue, toDate = DateTime.MaxValue; DateTime outDate;
            if (DateTime.TryParseExact(fromDateStr, Constants.Common.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out outDate))
            {
                fromDate = outDate;
            }
            if (DateTime.TryParseExact(toDateStr, Constants.Common.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out outDate))
            {
                toDate = outDate;
            }
            IEnumerable<OrderModel> allOrders = dbEntities.Orders.ToList()
                .Where(x => x.OrderDate >= fromDate && x.OrderDate <= toDate
                            && x.OrderStatusCode != Constants.OrderStatus.OrderStatusCode.MaxedOut)
                .OrderByDescending(x => x.RequestedDate)
                .Select(x => new OrderModel(x));

            if (!string.IsNullOrEmpty(currentUser))
            {
                User user = dbEntities.Users.FirstOrDefault(x => x.EmailId == currentUser);
                if (user != null)
                {
                    if (user.UserRole == 1)
                        allOrders = allOrders.Where(x => x.RequestedUser.EmailId == currentUser);
                }
            }
            return allOrders;
        }

        // GET api/Orders/GetOrderById/5
        public OrderModel GetOrderById(int id)
        {
            Order order = LunchDBEntity.Instance.Orders.ToList()
                .FirstOrDefault(x => x.OrderId == id);
            if (order == null)
                return null;
            return new OrderModel(order);
        }

        // GET api/Orders/GetOrdersByDate/12312017
        public IEnumerable<OrderModel> GetOrdersByDate(string orderDateStr)
        {
            DateTime orderDate = DateTime.MinValue;
            if (!DateTime.TryParseExact(orderDateStr, Constants.Common.DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out orderDate))
            {
                return null;
            }
            IEnumerable<OrderModel> orders = LunchDBEntity.Instance.Orders.ToList()
                .Where(x => x.OrderDate.Date == orderDate.Date).Select(x => new OrderModel(x));
            return orders;
        }

        // POST api/values
        [HttpPost]
        public JObject SubmitOrder([FromBody]OrderModel order)
        {
            var dbEntities = LunchDBEntity.Instance;
            dynamic returnData = new JObject();

            User requestedUser = dbEntities.Users.FirstOrDefault(us => us.EmailId == order.RequestedUser.EmailId);
            order.UserId = requestedUser.UserId;
            order.OrderNumber = GetOrderNumber(dbEntities);

            IEnumerable<Order> todayOrders = dbEntities.Orders.ToList()
                .Where(x => x.OrderDate.Date == order.OrderDate.Date);
            if (todayOrders.Count() >= Convert.ToInt32(GlobalSettings.GetValue("DailyMax", dbEntities)))
            {
                returnData.OrderId = -1;
                returnData.MaxedOut = true;
                order.OrderStatusCode = Constants.OrderStatus.OrderStatusCode.MaxedOut;
                //save order
                Order newOrder = dbEntities.Orders.Add(OrderModel.createOrderEntity(order));
                //change order status
                dbEntities.SaveChanges();
                return returnData;
            }
            else
            {
                Order newOrder = dbEntities.Orders.Add(OrderModel.createOrderEntity(order));
                dbEntities.SaveChanges();
                //send email

                //if (newOrder.User == null)
                //{
                //    newOrder.User = requestedUser;
                //}
                //if (newOrder.MenuType == null)
                //{
                //    newOrder.MenuType = dbEntities.MenuTypes.Where(x => x.MenuTypeId == newOrder.MenuTypeId).FirstOrDefault();
                //}
                //for (int i = 0; i < newOrder.OrderItemMappings.Count(); i++)
                //{
                //    if (newOrder.OrderItemMappings.ElementAt(i).Item == null)
                //    {
                //        newOrder.OrderItemMappings.ElementAt(i).Item = dbEntities.Items.Where(x => x.ItemId == newOrder.OrderItemMappings.ElementAt(i).ItemId).FirstOrDefault();
                //    }
                //}
                SendOrderConfirmationEmail(LunchDBEntity.Instance.Orders.Where(x => x.OrderId == newOrder.OrderId).FirstOrDefault());
                returnData.OrderId = newOrder.OrderId;
                returnData.MaxedOut = false;
                //Order a = dbEntities.Orders.First(x => x.OrderId == newOrder.OrderId);
                //returnData.Order = JObject.FromObject(new OrderModel(dbEntities.Orders.First(x => x.OrderId == newOrder.OrderId)));
                return returnData;
            }
        }
        private string GetOrderNumber(DBEntities dbEntities)
        {
            string orderNumber = string.Empty;
            var allOrders = dbEntities.Orders;
            if (allOrders.Count() > 0)
            {
                Order latestOrder = allOrders.OrderByDescending(x => x.OrderId).First();
                string[] latestOrderNoParts = latestOrder.OrderNumber.Split(new char[] { '-' }, StringSplitOptions.RemoveEmptyEntries);

                orderNumber = (Convert.ToInt32(latestOrderNoParts.Last()) + 1).ToString();
            }
            else
            {
                orderNumber = "1000";
            }
            return string.Format("{0}-{1}-{2}", Constants.Common.OrderPrefix,
                    Common.GetCSTTime().ToString(Constants.Common.DateFormat),
                   orderNumber);
            //return orderNumber;
        }
        private void SendOrderConfirmationEmail(Order order)
        {
            OrderModel newOrder = new OrderModel(order);
            if (newOrder == null || newOrder.RequestedUser == null)
                return;


            string mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/OrderConfirmation.html"));

            mailBody = mailBody.Replace("[#FullName]", string.Concat(newOrder.RequestedUser.FirstName, ' ', newOrder.RequestedUser.LastName));
            mailBody = mailBody.Replace("[#OrderNumber]", newOrder.OrderNumber);
            mailBody = mailBody.Replace("[#Mobile]", String.Format("{0:(###) ###-####}", newOrder.RequestedUser.Mobile));
            mailBody = mailBody.Replace("[#Email]", newOrder.RequestedUser.EmailId);
            mailBody = mailBody.Replace("[#Status]", newOrder.OrderStatus);
            mailBody = mailBody.Replace("[#MenuType]", newOrder.MenuType.MenuTypeName);
            mailBody = mailBody.Replace("[#MenuDate]", newOrder.OrderDate.ToString(Constants.Common.DateReadable));
            mailBody = mailBody.Replace("[#SubmittedDate]", newOrder.RequestedDate.ToString(Constants.Common.DateReadableWithTime));
            mailBody = mailBody.Replace("[#OtherItems]", newOrder.OtherItems);
            mailBody = mailBody.Replace("[#Quantity]", newOrder.OrderQuantity.ToString());
            mailBody = mailBody.Replace("[#Price]", String.Format("{0:C}", newOrder.MenuType.Price.ToString()));
            mailBody = mailBody.Replace("[#TotalAmount]", String.Format("{0:C}", newOrder.TotalAmount.ToString()));
            mailBody = mailBody.Replace("[#Comments]", newOrder.Comments);

            EmailService.SendEmail(newOrder.RequestedUser.EmailId, "12 PM Lunch : Order request received", mailBody);
        }

        private void SendOrderCancellationEmail(Order newOrder)
        {
            if (newOrder == null || newOrder.User == null)
                return;
            string mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/OrderCancellation.html"));
            mailBody = mailBody.Replace("[#FullName]", string.Concat(newOrder.User.FirstName, ' ', newOrder.User.LastName));

            mailBody = mailBody.Replace("[#OrderNumber]", newOrder.OrderNumber);
            mailBody = mailBody.Replace("[#OrderDate]", newOrder.OrderDate.ToString(Constants.Common.DateReadable));
            mailBody = mailBody.Replace("[#RequestedDate]", newOrder.RequestedDate.ToString(Constants.Common.DateReadableWithTime));

            EmailService.SendEmail(newOrder.User.EmailId, "12 PM Lunch : Your order is cancelled", mailBody);
        }

        // PUT api/values/5
        [HttpPost]
        public JObject DeleteOrder([FromBody]OrderModel o)
        {
            var dbEntities = LunchDBEntity.Instance;
            dynamic returnData = new JObject();
            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.EmailId == o.RequestedUser.EmailId && x.IsActive);
            if (user == null)
            {
                returnData.OrderId = -1;
                return returnData;
            }

            Order order;
            if (user.UserRole.ToString() == Constants.UserType.User)
                order = dbEntities.Orders.ToList()
                 .FirstOrDefault(x => x.OrderId == o.OrderId && x.UserId == user.UserId);
            else
                order = dbEntities.Orders.ToList()
                     .FirstOrDefault(x => x.OrderId == o.OrderId);
            if (order == null)
            {
                returnData.OrderId = -1;
                return returnData;
            }
            dbEntities.Entry(order).State = System.Data.Entity.EntityState.Modified;
            order.OrderStatusCode = Constants.OrderStatus.OrderStatusCode.Cancelled;
            dbEntities.SaveChanges();
            if (order.User == null)
            {
                order.User = dbEntities.Users.FirstOrDefault(us => us.UserId == order.UserId);
            }
            SendOrderCancellationEmail(order);

            returnData.OrderId = order.OrderId;
            return returnData;
        }

    }
}
