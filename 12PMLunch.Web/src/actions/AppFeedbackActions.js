import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import FeedbackApi from '../api/FeedbackApi';

class AppFeedbackActions {

    Init() {
        AppDispatcher.dispatch({
            actionType: AppConstants.INITIALIZE,
            initialData: {
                allFeedbacks: FeedbackApi.getAllUserFeedbacks()
            }
        });
    }



    submitUserFeedback(userFeedback) {
        userFeedback.UserId = FeedbackApi.submitUserFeedback(userFeedback);
        console.log('new feedback', userFeedback);
        AppDispatcher.dispatch({
            actionType: AppConstants.SUBMIT_USERFEEDBACK,
            user: userFeedback
        });
    }

};

export default new AppFeedbackActions();