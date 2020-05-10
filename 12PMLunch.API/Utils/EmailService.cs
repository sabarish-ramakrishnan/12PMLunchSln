using _12PMLunch.API.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace _12PMLunch.API.Utils
{
    public static class EmailService
    {
        public static void SendEmail(string To, string Subject, string Body)
        {
            try
            {
                if (GlobalSettings.GetValue("SendMail").ToUpper() != "TRUE")
                    return;
                SmtpClient mailServer;

                //if (GlobalSettings.GetValue("debug").ToUpper() == "TRUE")
#if DEBUG
                {
                    mailServer = new SmtpClient("localhost");
                    mailServer.Port = 25;
                }
#else
                {
                    mailServer = new SmtpClient(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.MailServer));
                    mailServer.DeliveryMethod = SmtpDeliveryMethod.Network;
                    mailServer.UseDefaultCredentials = false;
                    mailServer.Port = Convert.ToInt32(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.MailPort));
                    string userId = GlobalSettings.GetValue(Constants.GlobalSettingsKeys.MailUser);
                    string password = GlobalSettings.GetValue(Constants.GlobalSettingsKeys.MailPassword);
                    mailServer.Credentials = new System.Net.NetworkCredential(userId, password);
                    mailServer.EnableSsl = true;
                }
#endif
                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.MailFrom));
                mail.To.Add(To);

                string ccList = GlobalSettings.GetValue(Constants.GlobalSettingsKeys.MailCc);
                if (!string.IsNullOrEmpty(ccList))
                {
                    string[] CcemailIds = GlobalSettings.GetValue(Constants.GlobalSettingsKeys.MailCc).Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
                    if (CcemailIds.Count() > 0)
                    {
                        foreach (var item in CcemailIds)
                        {
                            mail.CC.Add(item);
                        }
                    }
                }
                //mail.Bcc.Add("12pmlunch@gmail.com");
                mail.Subject = Subject;
                mail.Body = Body;
                mail.IsBodyHtml = true;
                //SmtpServer.EnableSsl = true;
                mailServer.Send(mail);
            }
            catch (Exception e)
            {
                Log.Error("Error sending email :" + e.ToString());
            }
        }

        //private static void createCollection(string concatenatedEmail, MailAddressCollection mailCollection)
        //{

        //    string[] emailIds = concatenatedEmail.Split(new char[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
        //    if (emailIds.Count() > 0)
        //    {
        //        foreach (var item in emailIds)
        //        {
        //            mailCollection.Add(item);
        //        }
        //    }

        //}
    }
}