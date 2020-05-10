import common from '../common/common'
import Request from 'superagent'

//const baseUrl = 'http://localhost:9080/api';
const baseUrl = 'http://12pmlunch.com/services/api';

class baseApi {

    get = (action) => {
        //console.log(action, ' called');
        return fetch(baseUrl + action, {
            //credentials: 'include', 
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + common.encodeStr(common.getTokenValue() + ":" + common.getFormattedDate(new Date()))
            }
        })
    }

    post = (action, jsonObject) => {
        debugger;
        //console.log(action, ' called', jsonObject);
        return fetch(baseUrl + action, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + common.encodeStr(common.getTokenValue() + ":" + common.getFormattedDate(new Date()))
            },
            body: JSON.stringify(jsonObject)
        });
    }
    //using super agent
    super_get = (action, jsonObject) => {
        //debugger;
        //console.log(action, ' called');
        if (jsonObject) {
            return Request
                .get(baseUrl + action)
                .set({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + common.encodeStr(common.getTokenValue() + ":" + common.getFormattedDate(new Date()))
                })
                .query(jsonObject);
        }
        else {
            return Request
                .get(baseUrl + action)
                .set({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + common.encodeStr(common.getTokenValue() + ":" + common.getFormattedDate(new Date()))
                })
        }
    }

    super_post = (action, jsonObject) => {
        //debugger;
        //console.log(action, ' called', jsonObject);
        return Request
            .post(baseUrl + action)
            .set({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + common.encodeStr(common.getTokenValue() + ":" + common.getFormattedDate(new Date()))
            })
            .send(jsonObject);
    }
}
export default new baseApi();