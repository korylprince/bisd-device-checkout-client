import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import auth from "./auth.js";

import assign from "../components/assign.vue";
import search from "../components/search.vue";
import signin from "../components/signin.vue";

const router = new VueRouter({
    routes: [
        {name: "assign", path: "/assign", component: assign},
        {name: "search", path: "/search", component: search},
        {name: "signin", path: "/signin", component: signin},
        {path: "*", redirect: {name: "search"}}
    ]
});

auth.$watch("session_key", function(val) {
    if (val) {
        router.push({name: "search"});
    } else {
        router.push({name: "signin"});
    }
});

router.beforeEach(function(to, from, next) {
    if (auth.session_key == null && to.name !== "signin") {
        next({name: "signin"});
    } else if (auth.session_key != null && to.name === "signin") {
        next({name: "search"});
    } else {
        next();
    }
});

export default router;
