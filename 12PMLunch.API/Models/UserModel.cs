using System;
using _12PMLunch.API.DAL;
using Newtonsoft.Json;
using _12PMLunch.API.Utils;

namespace _12PMLunch.API.Models
{
    public class UserModel
    {
        public UserModel()
        {

        }
        public UserModel(DAL.User user)
        {
            this.UserId = user.UserId;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.EmailId = user.EmailId;
            this.Mobile = user.Mobile;
            this.IsActive = user.IsActive;
            this.EmailVerified = user.EmailVerified;
            this.UpdatedBy = user.UpdatedBy;
            this.UpdatedDate = user.UpdatedDate;
            this.RegistrationToken = user.RegistrationToken;
            this.UserRole = user.UserRole;
        }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        //[JsonIgnore]
        public string Password { get; set; }
        public string Mobile { get; set; }
        public bool IsActive { get; set; }
        public Nullable<System.DateTime> EmailVerified { get; set; }
        public string UpdatedBy { get; set; }
        public System.DateTime UpdatedDate { get; set; }
        public Nullable<System.Guid> RegistrationToken { get; set; }
        public string EncodedRegToken { get; set; }
        public Nullable<System.Guid> LoginToken { get; set; }
        public Nullable<System.DateTime> LoginTokenExpiry { get; set; }
        public Nullable<System.DateTime> LastLoginDate { get; set; }
        public int UserRole { get; set; }

        public string UserRoleStr
        {
            get
            {
                switch(UserRole)
                {
                    case 2:
                        return Constants.UserType.Admin;
                    case 1:
                    default:
                        return Constants.UserType.User;
                }
            }
        }

        public string FullName
        {
            get
            {
                return string.Concat(this.FirstName, ' ', this.LastName);
            }
        }

        public static User createUserEntity(UserModel x)
        {
            User user = new User();
            user.UserId = x.UserId;
            user.FirstName = x.FirstName;
            user.LastName = x.LastName;
            user.EmailId = x.EmailId;
            user.Password = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(x.Password));
            user.Mobile = x.Mobile;
            user.IsActive = true;
            user.EmailVerified = null;
            user.UpdatedBy = x.UpdatedBy;
            user.UpdatedDate = (x.UpdatedDate.Date == DateTime.MinValue.Date ? Common.GetCSTTime() : x.UpdatedDate);
            user.RegistrationToken = Guid.NewGuid();
            user.UserRole = x.UserRole;
            return user;
        }
    }

    public class SecureUserModel
    {
        public SecureUserModel()
        {

        }
        public SecureUserModel(DAL.User user)
        {
            this.UserId = user.UserId;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.EmailId = user.EmailId;
            this.Mobile = user.Mobile;
            this.IsActive = user.IsActive;
            this.EmailVerified = user.EmailVerified;
            this.UpdatedBy = user.UpdatedBy;
            this.UpdatedDate = user.UpdatedDate;
            this.UserRole = user.UserRole;
        }
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string Mobile { get; set; }
        public bool IsActive { get; set; }
        public Nullable<System.DateTime> EmailVerified { get; set; }
        public string UpdatedBy { get; set; }
        public System.DateTime UpdatedDate { get; set; }
        public int UserRole { get; set; }
        public string UserRoleStr
        {
            get
            {
                switch (UserRole)
                {
                    case 2:
                        return Constants.UserType.Admin;
                    case 1:
                    default:
                        return Constants.UserType.User;
                }
            }
        }
    }
}