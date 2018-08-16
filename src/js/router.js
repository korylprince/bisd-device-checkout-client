import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

import AppSignin from "../components/signin.vue"
import AppSearch from "../components/search.vue"
import AppCheckout from "../components/checkout.vue"

const router = new VueRouter({
    routes: [
        {name: "signin", path: "/signin", component: AppSignin},
        {name: "search", path: "/search", component: AppSearch},
        {name: "checkout", path: "/students/:other_id", component: AppCheckout, props: true},
        {path: "*", redirect: {name: "search"}}
    ]
})

export default router
