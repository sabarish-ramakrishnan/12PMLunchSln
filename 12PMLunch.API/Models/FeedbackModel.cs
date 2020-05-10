using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using _12PMLunch.API.DAL;
using _12PMLunch.API.Utils;

namespace _12PMLunch.API.Models
{
    public class FeedbackModel
    {
        public FeedbackModel()
        {

        }
        public FeedbackModel(Feedback f)
        {
            this.Id = f.Id;
            this.Name = f.Name;
            this.Email = f.Email;
            this.FeedbackType = f.FeedbackType;
            this.Comments = f.Comments;
            this.Rating = f.Rating;
            this.SubmittedDate = f.SubmittedDate;
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string FeedbackType { get; set; }
        public string Comments { get; set; }
        public int Rating { get; set; }
        public System.DateTime SubmittedDate { get; set; }

        public string FeedbackTypeStr
        {
            get
            {
                return ReturnFeedbackTypeStr(this.FeedbackType.Trim());
            }
        }

        private string ReturnFeedbackTypeStr(string feedbackTypeStr)
        {
            string val;
            switch (feedbackTypeStr)
            {
                case "2":
                    val = "Delivery";
                    break;
                case "3":
                    val = "Menu";
                    break;
                case "1":
                default:
                    val = "Service";
                    break;
            }
            return val;
        }

        public static Feedback createFeedbackEntity(FeedbackModel x)
        {
            
            Feedback f = new Feedback();
            f.Id = x.Id;
            f.Name = x.Name;
            f.Email = x.Email;
            f.FeedbackType = x.FeedbackType;
            f.Comments = x.Comments;
            f.Rating = x.Rating;
            f.SubmittedDate = (x.SubmittedDate.Date == DateTime.MinValue.Date ? Common.GetCSTTime() : x.SubmittedDate);
            return f;
        }
    }
}