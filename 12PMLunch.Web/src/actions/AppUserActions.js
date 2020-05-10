import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import UserApi from '../api/UserApi';
import toastr from 'toastr';


class AppUserActions {

    Init() {
        AppDispatcher.dispatch({
            actionType: AppConstants.INITIALIZE,
            initialData: {
                allUsers: UserApi.getAllUsers()
            }
        });
    }

    submitUser(newUser) {
        UserApi.submitUser(newUser)
            .then(function (response) {
                return response.json()
            }).then(function (data) {
                newUser.UserId = data.UserId;
                AppDispatcher.dispatch({
                    actionType: AppConstants.SUBMIT_USER,
                    user: newUser
                });
                toastr.success('Signup successful. You will receive an email shortly.');

            }).catch((err) => {
                console.log(err);
            });
    }

    authenticateUser(newUser) {
        //let IsAuthenticated = false;
        UserApi.authenticateUser(newUser)
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                //debugger;
                console.log('Request succeeded with JSON response', responseData);
                if (responseData && responseData.EmailVerified.toString().toUpperCase() === 'TRUE') {
                    console.log('Logged in');
                    //add to state
                    AppDispatcher.dispatch({
                        actionType: AppConstants.AUTHENTICATE_USER,
                        user: responseData
                    });
                    //alert('test');
                    //debugger;
                    localStorage.setItem('token', responseData.LoginToken);
                    //this.history.push('/orders');

                }
                else if (responseData && responseData.EmailVerified.toString().toUpperCase() === 'FALSE') {
                    alert('Email not verfied');
                }
                else {
                    alert('User not found');
                    //this.history.push('/Signup');
                }
            })
            .catch(err => {
                //debugger;
                console.log("fetch error" + err);
            });

    }

};

export default new AppUserActions();