using _12PMLunch.API.Models;
using _12PMLunch.API.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using _12PMLunch.API.Utils;
using System.IO;

namespace _12PMLunch.API.Controllers
{
    public class SurveyController : ApiController
    {
        [HttpPost]
        public JObject SubmitSurvey([FromBody]SurveyResponseModel survey)
        {
            string mailBody;
            SurveyRespons f;
            dynamic responseData = new JObject();
            var dbEntities = LunchDBEntity.Instance;
            if (dbEntities.SurveyResponses.Any(x => x.UserId == survey.UserId))
            {
                //user already submitted
                responseData.UserExists = true;
                return responseData;
            }
            else if (dbEntities.SurveyResponses.Any(x => x.Apartment == survey.Apartment))
            {
                survey.MealOpted = string.Empty;
                responseData.UserExists = false;
                responseData.ApartmentExists = true;
                mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/SurveyCompletedEmailNoFood.html"));
                f = dbEntities.SurveyResponses.Add(SurveyResponseModel.createEntity(survey));
                dbEntities.SaveChanges();
            }
            else if (string.IsNullOrEmpty(survey.MealOpted))
            {
                survey.MealOpted = string.Empty;
                responseData.UserExists = false;
                responseData.ApartmentExists = false;
                responseData.MaxedOut = true;
                mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/SurveyCompletedEmailMaxedout.html"));
                f = dbEntities.SurveyResponses.Add(SurveyResponseModel.createEntity(survey));
                dbEntities.SaveChanges();
            }
            else
            {
                f = dbEntities.SurveyResponses.Add(SurveyResponseModel.createEntity(survey));
                dbEntities.SaveChanges();
                responseData.MaxedOut = false;
                responseData.UserExists = false;
                responseData.ApartmentExists = false;
                responseData.SurveyResponseId = survey.SurveyResponseId;
                mailBody = File.ReadAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/Content/EmailTemplates/SurveyCompletedEmail.html"));
            }
            SendSurveySubmittedEmail(f, GlobalSettings.GetValue(Constants.GlobalSettingsKeys.SurveyCompletedSubject, dbEntities), mailBody);

            
            return responseData;
        }

        private void SendSurveySubmittedEmail(SurveyRespons survey, string subject, string mailBody)
        {

            mailBody = mailBody.Replace("[#FullName]", string.Concat(survey.UserName));
            mailBody = mailBody.Replace("[#Mobile]", string.Concat(survey.Phone));
            mailBody = mailBody.Replace("[#Email]", string.Concat(survey.EmailId));
            mailBody = mailBody.Replace("[#MealOpted]", string.Concat(survey.MealOpted));
            mailBody = mailBody.Replace("[#Apartment]", string.Concat(survey.Apartment));
            EmailService.SendEmail(survey.EmailId, subject, mailBody);
        }

        public JObject GetSurveyInfo(int UserId)
        {
            var dbEntities = LunchDBEntity.Instance;
            dynamic responseData = new JObject();

            int option1Max = Convert.ToInt32(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.Option1Max, dbEntities));
            int option2Max = Convert.ToInt32(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.Option2Max, dbEntities));
            int option3Max = Convert.ToInt32(GlobalSettings.GetValue(Constants.GlobalSettingsKeys.Option3Max, dbEntities));
            User u = dbEntities.Users.FirstOrDefault(x => x.UserId == UserId);

            responseData.Phone = u.Mobile;
            responseData.FullName = string.Concat(u.FirstName, " ", u.LastName);
            responseData.Option1 = dbEntities.SurveyResponses.Count(x => x.MealOpted == "CHICKEN BIRIYANI") < option1Max;
            responseData.Option2 = dbEntities.SurveyResponses.Count(x => x.MealOpted == "VEG PULAV") < option2Max;
            responseData.Option3 = dbEntities.SurveyResponses.Count(x => x.MealOpted == "VEG KOTHU PARATHA") < option3Max;

            return responseData;
        }
    }
}
