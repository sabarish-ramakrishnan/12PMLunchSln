using _12PMLunch.API.DAL;

namespace _12PMLunch.API.Models
{
    public class SurveyQuestionResponseModel
    {
        //private SurveyQuestionRespons x;
        public SurveyQuestionResponseModel()
        {

        }
        public SurveyQuestionResponseModel(SurveyQuestionRespons x)
        {
            this.Id = x.Id;
            this.SurveyResponseId = x.SurveyResponseId;
            this.QuestionUniqueId = x.QuestionUniqueId;
            this.Question = x.Question;
            this.Response = x.Response;
            this.ResponseComments = x.ResponseComments;
        }

        public int Id { get; set; }
        public int SurveyResponseId { get; set; }
        public string QuestionUniqueId { get; set; }
        public string Question { get; set; }
        public string Response { get; set; }
        public string ResponseComments { get; set; }

        public static SurveyQuestionRespons createEntity(SurveyQuestionResponseModel x)
        {
            SurveyQuestionRespons resp = new SurveyQuestionRespons();

            resp.Id = x.Id;
            resp.SurveyResponseId = x.SurveyResponseId;
            resp.QuestionUniqueId = x.QuestionUniqueId;
            resp.Question = x.Question;
            resp.Response = x.Response;
            resp.ResponseComments = x.ResponseComments;

            return resp;
        }
    }
}