import baseApi from './baseApi'


class UserApi {
    submitUser = (user) => {
        return baseApi.super_post('/users/AddUser', user);
    }
    updateUser = (user) => {
        return baseApi.super_post('/users/UpdateUser', user);
    }
    getAllUsers = () => {
        let url = '/users/getallusers';
        return baseApi.get(url);
    }
    getUserByEmail = (reqObj) => {
        let url = '/users/getUserByEmail';
        return baseApi.super_get(url, reqObj);
    }
    authenticateUser = (user) => {
        // let url = '/users/AuthenticateUser?EmailId=' + user.EmailId + '&Password=' + user.Password;
        // return baseApi.get(url);

        let url = '/users/AuthenticateUser';
        return baseApi.super_post(url, user);
    }
    verifyUser = (user) => {
        return baseApi.super_post('/users/VerifyUser', user);
    }
    updateUserPassword = (user) => {
        return baseApi.super_post('/users/UpdateUserPassword', user);
    }
    forgotPassword = (user) => {
        return baseApi.super_post('/users/ForgotPassword', user);
    }
    passwordResetConfirm = (user) => {
        return baseApi.super_post('/users/PasswordReset', user);
    }
}
export default new UserApi();