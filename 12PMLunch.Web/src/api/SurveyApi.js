import baseApi from "./baseApi";

class SurveyApi {
    submitUsersurvey = (userFeedback) => {
        return baseApi.super_post('/Survey/SubmitSurvey', userFeedback);
    }
    getSurveyInfo = (reqObject) => {
        return baseApi.super_get('/Survey/GetSurveyInfo', reqObject);
    }
}
export default new SurveyApi();