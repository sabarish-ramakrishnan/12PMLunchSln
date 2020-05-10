using _12PMLunch.API.DAL;
using _12PMLunch.API.Models;
using _12PMLunch.API.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace _12PMLunch.API.Controllers
{
    [AllowAnonymous]
    public class FeedbacksController : ApiController
    {
        // GET: api/Feedback
        public IEnumerable<FeedbackModel> GetAllFeedbacks(int top = 0)
        {
            IEnumerable<FeedbackModel> allFeedbacks = LunchDBEntity.Instance.Feedbacks.ToList()
                .Select(x => new FeedbackModel(x));
            if (top > 0 && allFeedbacks != null && allFeedbacks.Count() > top)
                return allFeedbacks.Take(top);
            return allFeedbacks;
        }

        // GET: api/Feedback/5
        public FeedbackModel GetFeedbackById(int id)
        {
            DAL.Feedback feedback = LunchDBEntity.Instance.Feedbacks.ToList()
               .FirstOrDefault(x => x.Id == id);
            if (feedback == null)
                return null;
            return new FeedbackModel(feedback);
        }

        // POST: api/Feedback
        [HttpPost]
        public FeedbackModel SubmitFeedback([FromBody]FeedbackModel x)
        {
            var dbEntities = LunchDBEntity.Instance;
            Feedback f = dbEntities.Feedbacks.Add(FeedbackModel.createFeedbackEntity(x));
            dbEntities.SaveChanges();
            return new FeedbackModel(f);
        }

        [HttpPost]
        public void SendEmail(int id)
        {
            EmailService.SendEmail("sabarishr@hotmail.com", "test", "test");
        }
    }
}
