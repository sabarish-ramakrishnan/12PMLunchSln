import AppConstants from '../constants/AppConstants';

class common {
    isAuthenticated = () => {
        //debugger;

        let userToken = this.getTokenValue(AppConstants.LOGIN_TOKEN);
        if (userToken != null && userToken.length > 0) {
            var expirationTime = new Date(this.getTokenValue(AppConstants.LOGIN_TOKEN_EXPIRY));
            if (expirationTime < new Date()) {
                //this.removeLocalTokens();
                return false;
            }
            return true;
        }
        return false;
    }

    getcurrentUserEmail = () => {
        //debugger;

        let currentUser = '';
        if (this.isAuthenticated())
            return this.getTokenValue(AppConstants.EMAIL_ID);
        return currentUser;
    }
    IsUserAdmin = () => {
        //debugger;

        let currentUser = '';
        if (this.isAuthenticated())
            return this.getTokenValue(AppConstants.USER_ROLE) === "Admin";
        return currentUser;
    }
    addDaysTodate = (dt, days) => {
        dt.setDate(dt.getDate() + days);
        return dt;
    }

    getTokenValue = (tokenKey) => {
        //debugger;
        switch (tokenKey) {
            case AppConstants.LOGIN_TOKEN_EXPIRY:
                return localStorage.getItem(AppConstants.LOGIN_TOKEN_EXPIRY);
            case AppConstants.EMAIL_ID:
                return localStorage.getItem(AppConstants.EMAIL_ID);
            case AppConstants.USER_ID:
                return localStorage.getItem(AppConstants.USER_ID);
            case AppConstants.USER_ROLE:
                return localStorage.getItem(AppConstants.USER_ROLE);
            case AppConstants.LOGIN_TOKEN:
            default:
                return localStorage.getItem(AppConstants.LOGIN_TOKEN);
        }
    }

    removeLocalTokens = () => {
        localStorage.removeItem(AppConstants.LOGIN_TOKEN);
        localStorage.removeItem(AppConstants.LOGIN_TOKEN_EXPIRY);
        localStorage.removeItem(AppConstants.USER_ID);
        localStorage.removeItem(AppConstants.USER_ROLE);
        localStorage.removeItem(AppConstants.EMAIL_ID);
    }

    displayDate = (dateString) => {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let date = new Date(dateString.split('-')[1] + "/" + dateString.split('-')[2] + "/" + dateString.split('-')[0])
        let day = days[date.getDay()].substring(0, 3);
        return day + " " + this.getFormattedDate(date, "MM/dd/yyyy");
    }
    getFormattedDate = (date, format) => {
        if (!format)
            format = 'MMddyyy';
        var year = date.getFullYear();

        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;

        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        switch (format) {
            case 'MM/dd/yyyy':
                return month + '/' + day + '/' + year;
                break;
            default:
            case 'MMddyyyy':
                return month + day + year;
                break;
        }
    }

    encodeStr = (strValue) => {
        if (!strValue || strValue === '')
            return '';
        return new Buffer(strValue).toString('base64');
    }
    decodeStr = (strValue) => {
        if (!strValue || strValue === '')
            return '';
        return Buffer.from(strValue, 'base64').toString('ascii');
    }
    isNumeric = (value) => {
        const numberRegex = /^\d+$/;
        if (value.trim() !== '' && !numberRegex.test(value)) {
            return false;
        }
        return true;
    }
    maxLengthCheck = (value, maxLength) => {
        if (value.trim() !== '' && value.length > maxLength) {
            return false;
        }
        return true;
    }
    checkValidity = (updatedFormElement, form) => {

        let isValid = true, value = updatedFormElement.value, rules = updatedFormElement.validation;
        //console.log(r)
        let validationResult = {
            valid: true,
            errorMessages: []
        };

        if (rules.required && value.trim() === '') {
            isValid = false;
            validationResult.errorMessages.push(rules.required.message);
        }
        if (rules.minLength && value !== '' && value.length < rules.minLength.len) {
            isValid = false;
            validationResult.errorMessages.push(rules.minLength.message);
        }

        if (rules.maxLength && value.length > rules.maxLength.len) {
            isValid = false;
            validationResult.errorMessages.push(rules.maxLength.message);
        }

        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (rules.isEmail && value.trim() !== '' && !emailRegex.test(value)) {

            isValid = false;
            validationResult.errorMessages.push(rules.isEmail.message);
        }
        const numberRegex = /^\d+$/;
        if (rules.isNumeric && value.trim() !== '' && !numberRegex.test(value)) {

            isValid = false;
            validationResult.errorMessages.push(rules.isNumeric.message);
        }
        //debugger;
        if (rules.compare && value !== form[rules.compare.value].value) {
            isValid = false;
            validationResult.errorMessages.push(rules.compare.message);
        }
        validationResult.valid = isValid;

        return validationResult;
    }
}
export default new common()
