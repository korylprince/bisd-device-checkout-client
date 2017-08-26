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
    checkoutDevice: function(bag_tag, user_id, red_bag) {
        var promise = axios.post(API_BASE + "/devices/" + bag_tag + "/checkout", {user_id: user_id, red_bag: red_bag}, auth.config());
        this.handlePromise(promise);
        return promise;
    }
};
