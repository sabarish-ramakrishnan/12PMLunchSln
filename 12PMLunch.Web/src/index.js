import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import common from './common/common'
import AppMenuActions from './actions/AppMenuActions';
import AppOrderActions from './actions/AppOrderActions';

//Initialize the values for the application
AppMenuActions.getTopMenus();
// let reqObject = {
//     currentUser: common.getcurrentUserEmail()
// }

//if (common.isAuthenticated())
    //AppOrderActions.getAllOrders(reqObject);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();