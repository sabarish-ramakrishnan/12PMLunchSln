using _12PMLunch.API.DAL;
using _12PMLunch.API.Filters;
using _12PMLunch.API.Models;
using _12PMLunch.API.Utils;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Web.Http;
using System.Web.Http.Cors;

namespace _12PMLunch.API.Controllers
{
    public class UsersController : ApiController
    {
        [LogExceptionFilter]
        // GET api/values
        public IEnumerable<SecureUserModel> GetAllUsers()
        {
            return LunchDBEntity.Instance.Users.ToList().Select(x => new SecureUserModel(x));
        }

        // GET api/values/5
        public SecureUserModel GetUserById(int id)
        {
            User user = LunchDBEntity.Instance.Users.ToList()
                .FirstOrDefault(x => x.UserId == id && x.IsActive);
            if (user == null)
                return null;
            return new SecureUserModel(user);
        }

        public JObject GetUserByEmail(string email)
        {
            User user = LunchDBEntity.Instance.Users.ToList()
                .FirstOrDefault(x => string.Equals(x.EmailId, email, StringComparison.CurrentCultureIgnoreCase) && x.IsActive);
            if (user == null)
                return null;
            dynamic u = new JObject();
            u.EmailId = user.EmailId;
            u.FirstName = user.FirstName;
            u.LastName = user.LastName;
            u.Password = user.Password;
            u.Mobile = user.Mobile;
            return u;
        }

        [AllowAnonymous]
        [HttpPost]
        public JObject AuthenticateUser([FromBody]UserModel user1)
        {
            var dbEntities = LunchDBEntity.Instance;
            DateTime currentDate = Common.GetCSTTime();
            string decodedUsername = Common.returnDecodedString(user1.EmailId);
            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.EmailId.Trim().ToLower() == decodedUsername.Trim().ToLower() && x.IsActive);

            if (user != null && Common.returnDecodedString(user.Password) == Common.returnDecodedString(user1.Password))
            {
                if (!user.EmailVerified.HasValue)
                {
                    dynamic u = new JObject();
                    u.EmailId = user.EmailId;
                    u.EmailVerified = "false";
                    return u;
                }
                else
                {
                    dbEntities.Entry(user).State = System.Data.Entity.EntityState.Modified;
                    user.LoginToken = Guid.NewGuid();
                    user.LastLoginDate = currentDate;
                    user.LoginTokenExpiry = currentDate.AddMinutes(15);
                    dbEntities.SaveChanges();
                    //return new SecureUserModel(user);
                    dynamic u = new JObject();
                    u.EmailId = user.EmailId;
                    u.LoginToken = user.LoginToken;
                    u.LoginTokenExpiry = user.LoginTokenExpiry;
                    u.EmailVerified = "true";
                    u.UserId = user.UserId;
                    u.UserRole = user.UserRole == 1 ? Constants.UserType.User : Constants.UserType.Admin;
                    return u;
                }
            }
            else
                return null;

        }


        [AllowAnonymous]
        [HttpPost]
        // PUT api/values/5
        public dynamic VerifyUser([FromBody]UserModel userModel)
        {
            string decodedUsername = Common.returnDecodedString(userModel.EmailId);
            string decodedToken = Common.returnDecodedString(userModel.EncodedRegToken);
            var dbEntities = LunchDBEntity.Instance;
            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.EmailId.Trim().ToLower() == decodedUsername.Trim().ToLower()
                                && x.IsActive
                                && x.RegistrationToken.ToString() == decodedToken.Trim().ToLower());
            dynamic u = new JObject();
            if (user != null && !user.EmailVerified.HasValue)
            {
                dbEntities.Entry(user).State = System.Data.Entity.EntityState.Modified;
                user.EmailVerified = Common.GetCSTTime();
                dbEntities.SaveChanges();

                SendVerificationCompletedEmail(user, GlobalSettings.GetValue(Constants.GlobalSettingsKeys.VerificationCompletedSubject, dbEntities));

                u.EmailId = user.EmailId;
                u.EmailVerified = "true";
            }
            else if (user != null && user.EmailVerified.HasValue)
            {
                u.EmailId = user.EmailId;
                u.EmailVerified = "true";
            }
            else
            {
                u.EmailVerified = "false";
            }
            return u;
        }

        [HttpPost]
        public void DeactivateUser(int id)
        {
            var dbEntities = LunchDBEntity.Instance;
            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.UserId == id && x.IsActive);
            if (user == null)
                return;
            dbEntities.Entry(user).State = System.Data.Entity.EntityState.Modified;
            user.IsActive = false;
            dbEntities.SaveChanges();
        }

        [HttpPost]
        public SecureUserModel UpdateUser([FromBody]UserModel u)
        {
            var dbEntities = LunchDBEntity.Instance;
            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.EmailId == u.EmailId && x.IsActive);
            if (user == null)
                return null;
            dbEntities.Entry(user).State = System.Data.Entity.EntityState.Modified;
            user.FirstName = u.FirstName;
            user.LastName = u.LastName;
            user.Mobile = u.Mobile;
            //user.Password = u.Password;
            user.UpdatedBy = u.UpdatedBy;
            user.UpdatedDate = Common.GetCSTTime();
            dbEntities.SaveChanges();
            return new SecureUserModel(user);
        }

        [AllowAnonymous] //Added by Ajeesh
        [HttpPost]
        public dynamic AddUser([FromBody]UserModel user)
        {
            dynamic returnData = new JObject();
            var dbEntities = LunchDBEntity.Instance;

            if (dbEntities.Users.ToList().Where(x => x.EmailId == user.EmailId).Count() > 0)
            {
                returnData.UserAlreadyExists = true;
                returnData.UserId = -1;
                return returnData;
            }
            User newUser = dbEntities.Users.Add(UserModel.createUserEntity(user));
            dbEntities.SaveChanges();
            SendUserCreatedEmail(newUser, GlobalSettings.GetValue(Constants.GlobalSettingsKeys.UserRegistrationEmailSubject, dbEntities));

            returnData.UserAlreadyExists = false;
            returnData.UserId = newUser.UserId;
            return returnData;
        }

        [HttpPost]
        //public JObject UpdateUserPassword([FromBody]string OldPassword, [FromBody]string NewPassword, [FromBody]int UserId)
        public JObject UpdateUserPassword([FromBody]JObject data)
        {
            string OldPassword = Convert.ToString(data["OldPassword"]);
            string NewPassword = Convert.ToString(data["NewPassword"]);
            int UserId = Convert.ToInt32(data["UserId"]);

            dynamic returnData = new JObject();
            var dbEntities = LunchDBEntity.Instance;

            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.UserId == UserId && x.IsActive);
            if (user == null)
            {
                returnData.UserId = -1;
                returnData.PasswordMatch = false;
                returnData.PasswordUpdated = false;
            }
            else if (user.Password != OldPassword)
            {
                //passowrd dont match
                returnData.UserId = UserId;
                returnData.PasswordMatch = false;
                returnData.PasswordUpdated = false;
            }
            else
            {
                dbEntities.Entry(user).State = System.Data.Entity.EntityState.Modified;
                user.Password = NewPassword;
                user.UpdatedDate = Common.GetCSTTime();
                dbEntities.SaveChanges();
                returnData.UserId = user.UserId;
                returnData.PasswordMatch = true;
                returnData.PasswordUpdated = true;
            }
            return returnData;
        }


        private void SendUserCreatedEmail(User newUser, string subject)
        {
            string mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/UserRegistration.html"));
            mailBody = mailBody.Replace("[#FullName]", string.Concat(newUser.FirstName, ' ', newUser.LastName));
            //mailBody = mailBody.Replace("[#EmailId]", newUser.EmailId);
            string queryStriing = string.Format("/{0}/{1}", Common.EncodedString(newUser.RegistrationToken.ToString()), Common.EncodedString(newUser.EmailId.ToString()));
            mailBody = mailBody.Replace("[#Link]", ConfigurationManager.AppSettings["verificationUrl"].ToString() + queryStriing);
            //mailBody = mailBody.Replace("[#LinkLabel]", "Click Here");

            EmailService.SendEmail(newUser.EmailId, subject, mailBody);
        }

        private void SendVerificationCompletedEmail(User newUser, string subject)
        {
            string mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/VerificationConfirmation.html"));
            mailBody = mailBody.Replace("[#FullName]", string.Concat(newUser.FirstName, ' ', newUser.LastName));
            EmailService.SendEmail(newUser.EmailId, subject, mailBody);
        }

        [AllowAnonymous]
        [HttpPost]
        public JObject ForgotPassword([FromBody]UserModel user1)
        {
            var dbEntities = LunchDBEntity.Instance;
            DateTime currentDate = Common.GetCSTTime();
            string decodedUsername = Common.returnDecodedString(user1.EmailId);
            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.EmailId.Trim().ToLower() == decodedUsername.Trim().ToLower() && x.IsActive);
            dynamic u = new JObject();
            if (user != null)
            {
                dbEntities.Entry(user).State = System.Data.Entity.EntityState.Modified;
                user.RegistrationToken = Guid.NewGuid();
                dbEntities.SaveChanges();

                //send email
                SendForgotPasswordEmail(user, GlobalSettings.GetValue(Constants.GlobalSettingsKeys.ForgotPasswordSubject, dbEntities));

                u.EmailId = user.EmailId;
                u.UserExists = true;
                return u;
            }
            else
            {
                u.UserExists = false;
                return u;
            }

        }
        private void SendForgotPasswordEmail(User newUser, string subject)
        {
            string mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/ForgotPassword.html"));
            mailBody = mailBody.Replace("[#FullName]", string.Concat(newUser.FirstName, ' ', newUser.LastName));
            string queryStriing = string.Format("/{0}/{1}", Common.EncodedString(newUser.RegistrationToken.ToString()), Common.EncodedString(newUser.EmailId.ToString()));
            mailBody = mailBody.Replace("[#Link]", ConfigurationManager.AppSettings["ResetPasswordUrl"].ToString() + queryStriing);
            EmailService.SendEmail(newUser.EmailId, subject, mailBody);
        }

        [AllowAnonymous]
        [HttpPost]
        // PUT api/values/5
        public dynamic PasswordReset([FromBody]UserModel userModel)
        {
            string decodedUsername = Common.returnDecodedString(userModel.EmailId);
            string decodedToken = Common.returnDecodedString(userModel.EncodedRegToken);
            var dbEntities = LunchDBEntity.Instance;
            User user = dbEntities.Users.ToList()
                .FirstOrDefault(x => x.EmailId.Trim().ToLower() == decodedUsername.Trim().ToLower()
                                && x.IsActive
                                && x.RegistrationToken.ToString() == decodedToken.Trim().ToLower());
            dynamic u = new JObject();
            if (user != null)
            {
                dbEntities.Entry(user).State = System.Data.Entity.EntityState.Modified;
                user.Password = userModel.Password;
                dbEntities.SaveChanges();

                SendPasswordResetEmail(user, GlobalSettings.GetValue(Constants.GlobalSettingsKeys.PasswordResetSubject, dbEntities));

                u.EmailId = user.EmailId;
                u.PasswordReset = true;
            }
            else 
            {
                u.PasswordReset = false;
            }
            return u;
        }

        private void SendPasswordResetEmail(User newUser, string subject)
        {
            string mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/PasswordChangeConfirmation.html"));
            mailBody = mailBody.Replace("[#FullName]", string.Concat(newUser.FirstName, ' ', newUser.LastName));
            EmailService.SendEmail(newUser.EmailId, subject, mailBody);
        }
    }
}
