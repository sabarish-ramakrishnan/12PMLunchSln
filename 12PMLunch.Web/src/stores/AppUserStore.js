import AppConstants from '../constants/AppConstants';
import AppDispatcher from '../dispatcher/AppDispatcher'
import { EventEmitter } from 'events';


var CHANGE_EVENT = 'change';
let _users = [];
let _currentUser = {
    EmailId: '',
    LoginToken: '',
    LoginTokenExpiry: '',
    UserId: 0,
    UserRole: ''
}

class AppUserStore extends EventEmitter {
    constructor() {
        super();
        this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this))
    }

    addChangeListener(cb) {
        this.on(CHANGE_EVENT, cb);
    }
    removeChangeListener(cb) {
        this.removeListener(CHANGE_EVENT, cb);
    }

    getAllUsers() {
        return _users;
    }
    getCurrentUser() {
        return _currentUser;
    }


    dispatcherCallback(action) {
        // Switches over the action's type when an action is dispatched.
        switch (action.actionType) {

            // case AppConstants.INITIALIZE:
            //     _users = action.initialData.allUsers
            //     //console.log(_weeklyMenu);
            //     this.emit(CHANGE_EVENT);
            //     break;
            case AppConstants.SUBMIT_USER:
                _users.push(action.user);
                this.emit(CHANGE_EVENT);
                break;
            case AppConstants.AUTHENTICATE_USER:
                _currentUser.EmailId = action.user.EmailId;
                _currentUser.LoginToken = action.user.LoginToken;
                _currentUser.LoginTokenExpiry = action.user.LoginTokenExpiry;
                _currentUser.UserId = action.user.UserId;
                _currentUser.UserRole = action.user.UserRole;
                this.emit(CHANGE_EVENT);
                break;
            default:
                break;
        }
        return true;
    }

}

export default new AppUserStore();