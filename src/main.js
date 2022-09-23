import "vue-material/dist/vue-material.css"
import "./style/theme.scss"
import "./style/app.styl"

import Vue from "vue"
import VueMaterial from "vue-material"
import VeeValidate from "vee-validate"

Vue.use(VueMaterial)
Vue.use(VeeValidate)

import router from "./js/router.js"
import store from "./js/store.js"

// signin/signout actions
store.watch(
    (state, getters) => getters.signed_in,
    signed_in => {
        if (!signed_in) {
            router.push({name: "signin"})
        } else {
            store.dispatch("next_route", router)
            store.dispatch("next_dispatch")
            store.dispatch("get_students")
        }
    }
)

// fetch data if signed in at load
if (store.getters.signed_in) {
    store.dispatch("get_students")
}

import AppMain from "./components/app.vue"

var App = new (Vue.extend(AppMain))({
    el: "#app",
    router,
    store,
})

export default App
