/*global API_BASE*/

import store from "./store.js"

const api = {
    authenticate: function(username, password) {
        return store.getters.$http.post(API_BASE + "/auth", {username, password})
    },
    readStudentList: function() {
        return store.getters.$http.get(API_BASE + "/students")
    },
    readStudentStatus: function(other_id) {
        return store.getters.$http.get(API_BASE + "/students/" + other_id + "/status")
    },
    checkoutDevice: function(other_id, bag_tag, note) {
        return store.getters.$http.post(API_BASE + "/students/" + other_id + "/devices/" + bag_tag, {note})
    }
}

export default api
