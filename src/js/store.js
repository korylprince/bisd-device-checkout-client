import axios from "axios"

import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import api from "./api.js"

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    state: {
        last_error: null,
        _loading_count: 0,
        username: window.localStorage.getItem("username"),
        display_name: window.localStorage.getItem("display_name"),
        session_id: window.localStorage.getItem("session_id"),
        _next_route: null,
        _next_dispatch_action: null,
        _next_dispatch_payload: null,
        _feedback: [],
        _feedback_delay: false,
        students: [],
    },
    getters: {
        is_loading(state) {
            return state._loading_count !== 0
        },
        next_route(state) {
            if (state._next_route == null) {
                return null
            }
            return {
                name: state._next_route.name,
                path: state._next_route.path,
                params: state._next_route.params,
                query: state._next_route.query,
            }
        },
        signed_in(state) {
            return state.session_id != null
        },
        show_dialog(state) {
            return state.last_error != null
        },
        $http(state) {
            return axios.create({
                headers: {Authorization: "Session id=\"" + state.session_id + "\""},
            })
        },
        current_feedback(state) {
            if (state._feedback_delay || state._feedback.length === 0) {
                return null
            }
            return state._feedback[0]
        },
    },
    mutations: {
        UPDATE_ERROR(state, error) {
            state.last_error = error
        },
        START_LOADING(state) {
            state._loading_count++
            state.last_error = null
        },
        STOP_LOADING(state) {
            state._loading_count--
        },
        UPDATE_CREDENTIALS(state, {username, display_name, session_id}) {
            state.username = username
            window.localStorage.setItem("username", username)
            state.display_name = display_name
            window.localStorage.setItem("display_name", display_name)
            state.session_id = session_id
            window.localStorage.setItem("session_id", session_id)
        },
        SIGNOUT(state) {
            state.username = null
            window.localStorage.removeItem("username")
            state.display_name = null
            window.localStorage.removeItem("display_name")
            state.session_id = null
            window.localStorage.removeItem("session_id")
        },
        UPDATE_NEXT_ROUTE(state, route) {
            state._next_route = route
        },
        UPDATE_NEXT_DISPATCH(state, {action, payload}) {
            state._next_dispatch_action = action
            state._next_dispatch_payload = payload
        },
        ADD_FEEDBACK(state, msg) {
            if (state._feedback[state._feedback.length - 1] !== msg) {
                state._feedback.push(msg)
            }
        },
        CLEAR_FEEDBACK(state) {
            // remove first element
            state._feedback.splice(0, 1)
            state._feedback_delay = true
        },
        CLEAR_FEEDBACK_DELAY(state) {
            state._feedback_delay = false
        },
        UPDATE_STUDENTS(state, students) {
            state.students = students
        },
    },
    actions: {
        async authenticate(context, {username, password}) {
            context.commit("START_LOADING")

            try {
                var response = await api.authenticate(username, password)
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && err.response.status === 401) {
                    context.commit("UPDATE_ERROR", "Wrong username or password")
                    return
                }
                context.commit(
                    "UPDATE_ERROR",
                    "Oops! Something bad happened. Contact your system administrator"
                )
                console.error({error: err})
                return
            }

            context.commit("STOP_LOADING")
            context.commit("UPDATE_CREDENTIALS", {
                username: response.data.user.username,
                display_name: response.data.user.display_name,
                session_id: response.data.session_id,
            })
        },
        async signout(context) {
            context.commit("SIGNOUT")
        },
        next_route(context, router) {
            var next = context.state._next_route
            if (next == null) {
                next = {name: "search"}
            }
            router.push(next)
            context.commit("UPDATE_NEXT_ROUTE", null)
        },
        async next_dispatch(context) {
            if (context.state._next_dispatch_action == null) {
                return
            }
            try {
                await context.dispatch(
                    context.state._next_dispatch_action,
                    context.state._next_dispatch_payload
                )
            } catch (err) {}
            context.commit("UPDATE_NEXT_DISPATCH", {action: null, payload: null})
        },
        clear_feedback(context) {
            context.commit("CLEAR_FEEDBACK")
            window.setTimeout(() => {
                context.commit("CLEAR_FEEDBACK_DELAY")
            }, 500)
        },
        async get_students(context) {
            context.commit("START_LOADING")

            try {
                var response = await api.readStudentList()
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && err.response.status === 401) {
                    context.dispatch("signout")
                    context.commit(
                        "ADD_FEEDBACK",
                        "Session expired. Please sign back in"
                    )
                    context.commit("UPDATE_NEXT_DISPATCH", {action: "get_students"})
                } else {
                    context.commit(
                        "UPDATE_ERROR",
                        "Oops! Something bad happened. Contact your system administrator"
                    )
                    console.error({err: err})
                }
                return
            }

            context.commit("STOP_LOADING")
            context.commit("UPDATE_STUDENTS", response.data)
        },
        async get_student_status(context, other_id) {
            context.commit("START_LOADING")

            try {
                var response = await api.readStudentStatus(other_id)
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && err.response.status === 401) {
                    context.dispatch("signout")
                    context.commit(
                        "ADD_FEEDBACK",
                        "Session expired. Please sign back in"
                    )
                    context.commit("UPDATE_NEXT_ROUTE", {
                        name: "checkout",
                        params: {other_id: other_id},
                    })
                    context.commit("UPDATE_NEXT_DISPATCH", {
                        action: "get_student_status",
                        payload: other_id,
                    })
                } else {
                    context.commit(
                        "UPDATE_ERROR",
                        "Oops! Something bad happened. Contact your system administrator"
                    )
                    console.error({err: err})
                }
                return null
            }

            context.commit("STOP_LOADING")
            return response.data
        },
        async checkout_device(context, {other_id, bag_tag, note}) {
            context.commit("START_LOADING")

            try {
                await api.checkoutDevice(other_id, bag_tag, note)
            } catch (err) {
                context.commit("STOP_LOADING")
                if (err.response !== null && err.response.status === 401) {
                    context.dispatch("signout")
                    context.commit(
                        "ADD_FEEDBACK",
                        "Session expired. Please sign back in to checkout device"
                    )
                    context.commit("UPDATE_NEXT_ROUTE", {name: "search"})
                    context.commit("UPDATE_NEXT_DISPATCH", {
                        action: "checkout_device",
                        payload: {other_id, bag_tag, note},
                    })
                } else if (
                    err.response !== null &&
          err.response.status === 400 &&
          err.response.data.description
                ) {
                    console.error({err: err})
                    var desc = err.response.data.description
                    if (desc.startsWith("Client Error: ")) {
                        throw Error(desc.slice(13))
                    } else {
                        throw Error(desc)
                    }
                } else {
                    context.commit(
                        "UPDATE_ERROR",
                        "Oops! Something bad happened. Contact your system administrator"
                    )
                    console.error({err: err})
                }
                return
            }

            context.commit("ADD_FEEDBACK", "Device checked out")
            context.commit("STOP_LOADING")
        },
    },
})

export default store
