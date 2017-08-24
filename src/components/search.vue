<template>
    <md-card>
        <md-card-area md-inset>
            <md-card-header >
                <div class="md-headline">Search Student</div>
            </md-card-header>
        </md-card-area>

        <md-card-content>
            <div v-if="list_error">
                There was an error getting the student list. Try signing out and back in.
                <span>{{list_error}}</span>
            </div>

            <md-input-container>
                <md-icon>search</md-icon>
                <label>Search</label>
                <md-input v-model="search" debounce="300"></md-input>
            </md-input-container>
            <md-list>
                <md-list-item v-for="student in filtered_students" :key="student.other_id">
                    <span>{{student.first_name}} {{student.last_name}} ({{student.grade}}th)</span>

                    <md-button class="md-icon-button md-list-action" @click="selectStudent(student)">
                        <md-icon>check_circle</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>
        </md-card-content>
    </md-card>
</template>
<script>
import api from "../js/api.js";
export default {
    name: "search",
    data: function() {
        return {
            search: "",
            students: null,
            list_error: null
        };
    },
    computed: {
        filtered_students: function() {
            if (this.search === "") {
                return [];
            }

            var matching = [];
            for (var i = 0; i < this.students.length; i++) {
                var s = this.students[i];
                if (
                    s.first_name.toLowerCase().includes(this.search.toLowerCase()) ||
                    s.last_name.toLowerCase().includes(this.search.toLowerCase()) ||
                    (s.first_name + " " + s.last_name).toLowerCase().includes(this.search.toLowerCase())
                ) {
                    matching.push(s);

                    // only allow ten to show at one time
                    if (matching.length === 10) {
                        return matching;
                    }
                }
            }
            return matching;
        }
    },
    methods: {
        selectStudent: function(student) {
            this.$router.push({name: "assign", params: {student: student}});
        }
    },
    beforeRouteEnter: function(to, from, next) {
        var promise = api.readStudentList();
        promise.then(function(resp) {
            next(function(vm) {
                vm.students = resp.data.students;
                vm.students.sort(function(a, b) {
                    if (a.last_name + a.first_name < b.last_name + b.first_name) {
                        return -1;
                    }
                    if (a.last_name + a.first_name > b.last_name + b.first_name) {
                        return 1;
                    }
                    return 0;
                });
            });
        }).catch(function(error) {
            var err;
            if (error.response != null) {
                if (error.response.data != null && error.response.data.description != null) {
                    err = error.response.data.description;
                } else {
                    err = error.response;
                }
            } else {
                err = error;
            }
            console.error("Error getting student list: ", err);
            next(function(vm) {
                vm.list_error = err;
            });
        });
    }
};
</script>
<style lang="stylus">
</style>
