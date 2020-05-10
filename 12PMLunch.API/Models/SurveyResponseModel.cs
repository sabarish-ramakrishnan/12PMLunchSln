using _12PMLunch.API.DAL;
using System;
using System.Collections.Generic;
using System.Linq;

namespace _12PMLunch.API.Models
{
    public class SurveyResponseModel
    {
        public SurveyResponseModel()
        {

        }
        public SurveyResponseModel(SurveyRespons sr)
        {
            this.SurveyResponseId = sr.SurveyResponseId;
            this.SurveyUniqueId = sr.SurveyUniqueId;
            this.UserId = sr.UserId;
            this.UserName = sr.UserName;
            this.EmailId = sr.EmailId;
            this.Phone = sr.Phone;
            this.Apartment = sr.Apartment;
            this.MealOpted = sr.MealOpted;
            this.Comments = sr.Comments;
            this.SubmittedDate = sr.SubmittedDate;

            if (sr.SurveyQuestionResponses != null && sr.SurveyQuestionResponses.Count() > 0)
            {
                this.SurveyQuestionResponses = sr.SurveyQuestionResponses.Select(x => new SurveyQuestionResponseModel(x));
            }
        }
        public int SurveyResponseId { get; set; }
        public string SurveyUniqueId { get; set; }
        public Nullable<int> UserId { get; set; }
        public string UserName { get; set; }
        public string EmailId { get; set; }
        public string Phone { get; set; }
        public string Apartment { get; set; }
        public string MealOpted { get; set; }
        public string Comments { get; set; }
        public System.DateTime SubmittedDate { get; set; }

        public IEnumerable<SurveyQuestionResponseModel> SurveyQuestionResponses { get; set; }

        public static SurveyRespons createEntity(SurveyResponseModel sr)
        {
            SurveyRespons resp = new SurveyRespons();

            resp.SurveyResponseId = sr.SurveyResponseId;
            resp.SurveyUniqueId = sr.SurveyUniqueId;
            resp.UserId = sr.UserId;
            resp.UserName = sr.UserName;
            resp.EmailId = sr.EmailId;
            resp.Phone = sr.Phone;
            resp.Apartment = sr.Apartment;
            resp.MealOpted = sr.MealOpted;
            resp.Comments = sr.Comments;
            if (sr.SubmittedDate.Date == DateTime.MinValue.Date)
                sr.SubmittedDate = DateTime.Now;
            resp.SubmittedDate = sr.SubmittedDate;

            foreach (var qres in sr.SurveyQuestionResponses)
            {
                resp.SurveyQuestionResponses.Add(SurveyQuestionResponseModel.createEntity(qres));
            }

            return resp;
        }
    }
}