<template>
    <md-card>
        <md-card-header>
            <div class="md-title">Search</div>
        </md-card-header>

        <md-card-content>

            <md-field>
                <md-icon>search</md-icon>
                <label>Search Name</label>
                <md-input ref="search" v-model="search" @keypress.enter="select_student"></md-input>
            </md-field>

            <md-list>

                <md-list-item v-for="student in searched_students" :key="student.other_id">
                    <span class="md-list-item-text">{{student.first_name}} {{student.last_name}} (Grade {{student.grade}})</span>

                    <md-button class="md-icon-button md-list-action" :to="{name: 'checkout', params: {other_id: student.other_id}}">
                        <md-icon class="md-primary">check_circle</md-icon>
                    </md-button>
                </md-list-item>

            </md-list>

        </md-card-content>
    </md-card>
</template>

<script>
import {mapState, mapGetters} from "vuex"
import store from "../js/store.js"
import AuthorizedMixin from "./authorized-mixin.js"
export default {
    name: "app-search",
    mixins: [AuthorizedMixin],
    data() {
        return {
            search: ""
        }
    },
    computed: {
        ...mapState(["students"]),
        ...mapGetters(["is_loading"]),
        searched_students() {
            if (this.search == "" || this.students == null || this.students.length == 0) { return [] }

            var students = []
            for (var i = 0; i < this.students.length; i++) {
                if ((this.students[i].first_name + this.students[i].last_name).toLowerCase().match(this.search.toLowerCase())) {
                    students.push(this.students[i])
                }
                if (students.length >= 10) {
                    return students
                }
            }
            return students
        }
    },
    methods: {
        select_student() {
            if (this.searched_students.length === 1) {
                this.$router.push({name: "checkout", params: {other_id: this.searched_students[0].other_id}})
            }
        }
    },
    beforeCreate() {
        store.dispatch("get_students")
    },
    created() {
        this.$nextTick(() => {
            this.$refs.search.$el.focus()
        })
    }
}
</script>

<style lang="stylus" scoped>
.md-field > .md-icon:after
    height: auto
</style>
