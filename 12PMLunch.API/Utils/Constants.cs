using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace _12PMLunch.API.Utils
{
    public static class Constants
    {
        public static class OrderStatus
        {
            public static class OrderStatusCode
            {
                public const int Received = 1;
                public const int Cancelled = 2;
                public const int MaxedOut = 3;
            }
            public const string Received = "Received";
            public const string Cancelled = "Cancelled";
            public const string MaxedOut = "MaxedOut";
        }
        public static class UserType
        {
            public static class UserTypeCode
            {
                public const int User = 1;
                public const int Admin = 2;
            }
            public const string User = "User";
            public const string Admin = "Admin";
        }
        public static class ItemType
        {
            public static class ItemTypeCode
            {
                public const string Main = "1";
                public const string Special = "2";
                public const string AddOn = "3";
            }
            public const string Main = "Main";
            public const string Special = "Special";
            public const string AddOn = "Add On";
        }
        public static class Common
        {
            public const string DateFormat = "MMddyyyy";
            public const string DateReadable = "MM/dd/yyyy";
            public const string DateReadableWithTime = "MM/dd/yyyy hh:mm:ss tt";
            public const string OrderPrefix = "ORD";
        }

        public static class GlobalSettingsKeys
        {
            public const string CutoffTime = "CutoffTime";
            public const string OrderingDisabled = "OrderingDisabled";

            public const string MailServer = "MailServer";
            public const string MailFrom = "MailFrom";
            public const string MailCc = "MailCc";
            public const string MailPort = "MailPort";
            public const string MailUser = "MailUser";
            public const string MailPassword = "MailPassword";

            public const string UserRegistrationEmailSubject = "UserRegistrationEmailSubject";
            public const string VerificationCompletedSubject = "VerificationCompletedSubject";
            public const string ForgotPasswordSubject = "ForgotPasswordSubject";
            public const string PasswordResetSubject = "PasswordResetSubject";
            public const string SurveyCompletedSubject = "SurveyCompletedSubject";

            public const string Option1Max = "CHICKEN BIRIYANI";
            public const string Option2Max = "VEG PULAV";
            public const string Option3Max = "VEG KOTHU PARATHA";
        }
    }

}