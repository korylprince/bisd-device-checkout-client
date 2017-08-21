/*global API_BASE*/

import axios from "axios";

import auth from "./auth.js";

export default {
    handlePromise: function(promise) {
        promise.catch(function(error) {
            if (error.response && error.response.status === 401) {
                auth.clear();
            }
        });
    },
    authenticate: function(username, password) {
        var promise = axios.post(API_BASE + "/auth", {"username": username, "password": password}, auth.config());
        return promise;
    },
    readStudentList: function() {
        var promise = axios.get(API_BASE + "/students", auth.config());
        this.handlePromise(promise);
        return promise;
    },
    checkoutDevice: function(bagTag, userID) {
        var promise = axios.post(API_BASE + "/devices/" + bagTag + "/checkout", {user_id: userID}, auth.config());
        this.handlePromise(promise);
        return promise;
    }
};
