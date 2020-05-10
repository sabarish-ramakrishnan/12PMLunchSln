import baseApi from "./baseApi";

class FeedbackApi {
    submitUserFeedback = (userFeedback) => {
        return baseApi.super_post('/Feedbacks/SubmitFeedback', userFeedback);
    }
    getAllUserFeedbacks = () => {
        return baseApi.get('/Feedbacks/GetAllFeedbacks');
    }
}
export default new FeedbackApi();