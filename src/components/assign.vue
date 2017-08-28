<template>
    <md-card>
        <md-card-area md-inset>
            <md-card-header >
                <div class="md-headline">Assign Device</div>
                <div class="md-subheading" v-if="student">{{student.first_name}} {{student.last_name}} ({{student.grade}}th Grade)</div>
            </md-card-header>
        </md-card-area>

        <md-card-content>
            <md-input-container>
                <label>Bag Tag</label>
                <md-input v-model="bag_tag"></md-input>
            </md-input-container>
            <md-card-actions>
                <md-button class="md-accent" @click="back()">Go Back</md-button>
                <md-button class="md-primary" @click="checkout(bag_tag, student)" :disabled="!(/^\d\d\d\d$/.test(bag_tag))">Assign</md-button>
            </md-card-actions>
            <div v-if="error">
                There was an error assigning the device.
                <span>{{error}}</span>
            </div>
        </md-card-content>

        <md-dialog ref="dialog">
            <md-dialog-title>Student has Charge</md-dialog-title>

            <md-dialog-content>Student {{student.first_name}} {{student.last_name}} ({{student.grade}}th Grade) has unpaid charges. Do you still want to assign them Bag Tag {{bag_tag}}?</md-dialog-content>

            <md-dialog-actions>
                <md-button class="md-primary" @click="back()">Go Back</md-button>
                <md-button class="md-accent" @click="checkout(bag_tag, student, true)">Assign</md-button>
            </md-dialog-actions>
        </md-dialog>

    </md-card>
</template>
<script>
import api from "../js/api.js";
import bus from "../js/bus.js";
export default {
    name: "search",
    data: function() {
        return {
            bag_tag: "",
            error: null
        };
    },
    computed: {
        student: function() {
            return this.$route.params.student;
        }
    },
    methods: {
        back: function() {
            this.$router.push({name: "search"});
        },
        checkout: function(bag_tag, student, red_bag) {
            this.$refs.dialog.close();

            this.error = null;

            var promise = api.checkoutDevice(this.bag_tag, this.student.other_id, red_bag);
            promise.then(() => {
                bus.$emit("saved");
                this.back();
            }).catch((error) => {
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

                console.error("Error checking out device: ", err);
                if (err.includes("unpaid charges")) {
                    this.$refs.dialog.open();
                } else {
                    this.error = err;
                }
            });
        }
    },
    created: function() {
        if (this.student == null) {
            this.back();
        }
    }
};
</script>
<style lang="stylus">
</style>
