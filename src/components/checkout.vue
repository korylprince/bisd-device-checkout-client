<template>
    <form novalidate @submit.prevent="do_checkout_device(other_id, bag_tag)">
        <md-card>
            <md-card-header>
                <div class="md-title">Checkout: <span v-if="student">{{student.first_name}} {{student.last_name}} (Grade {{student.grade}})</span></div>
            </md-card-header>

            <md-card-content>

                <md-empty-state
                    v-if="status && status['type'] === 'black_bag'"
                    md-icon="computer"
                    md-label="Black Bag">
                </md-empty-state>

                <md-empty-state
                    class="red-icon"
                    v-if="status && status['type'] === 'red_bag'"
                    md-icon="computer"
                    md-label="Red Bag"
                    :md-description="status.reason">
                </md-empty-state>

                <md-empty-state
                    class="red-icon"
                    v-if="status && status['type'] === 'none'"
                    md-icon="close"
                    md-label="No Chromebook"
                    :md-description="status.reason">
                </md-empty-state>

                <div v-if="status && status.links && status.links.length > 0">
                    <span v-if="status.link_type === 'charge'">Charges:</span>
                    <span v-if="status.link_type === 'device'">Devices:</span>
                    <a style="padding: 10px" v-for="(link, index) in status.links" :key="link" :href="link" target="_blank">
                        <span v-if="status.link_type === 'charge'">Charge</span>
                        <span v-if="status.link_type === 'device'">Device</span>
                        {{index + 1}}</a>
                </div>

                <md-field :class="{'md-invalid': errors.has('bag tag')}"
                    v-if="status && status['type'] !== 'none'">
                    <label>Bag Tag</label>
                    <md-input ref="bag_tag" type="number" v-model="bag_tag" name="bag_tag" v-validate="'required|digits:4'"></md-input>
                    <span class="md-error">{{errors.first('bag tag')}}</span>
                </md-field>

            </md-card-content>

            <md-card-actions>
                <md-button class="md-accent" :to="{name: 'search'}">Back</md-button>
                <md-button type="submit" class="md-primary"
                    :disabled="is_loading || bag_tag === '' || errors.any()">
                    <span v-show="!is_loading">Check Out</span>
                    <md-progress-spinner
                        class="app-spinner"
                        v-if="is_loading"
                        md-mode="indeterminate"
                        :md-diameter="20"
                        :md-stroke="2"
                        ></md-progress-spinner>
                </md-button>

            </md-card-actions>
        </md-card>

        <md-dialog-alert
            :md-active.sync="error_active"
            :md-content="error_text"
            md-title="Unable to check-out device"
            md-confirm-text="OK" />
    </form>
</template>

<script>
import {mapState, mapGetters, mapActions} from "vuex"
import AuthorizedMixin from "./authorized-mixin.js"
export default {
    name: "app-student",
    mixins: [AuthorizedMixin],
    props: {
        other_id: String
    },
    data() {
        return {
            bag_tag: "",
            status: null,
            error_active: false,
            error_text: ""
        }
    },
    computed: {
        ...mapState(["students", "student_status"]),
        ...mapGetters(["is_loading"]),
        student() {
            return this.students[this.students.findIndex(student => student.other_id === this.other_id)]
        }
    },
    watch: {
        $route() {
            this.load()
        }
    },
    methods: {
        ...mapActions(["get_student_status", "checkout_device"]),
        async load() {
            this.status = await this.get_student_status(this.other_id)
            window.setTimeout(() => {
                if (this.$refs.bag_tag) {
                    this.$refs.bag_tag.$el.focus()
                }
            }, 500)
        },
        async do_checkout_device(other_id, bag_tag) {
            if (bag_tag.match(/^\d{4}$/) == null || (this.status && this.status["type"] === "none")) { return }

            try {
                await this.checkout_device({other_id, bag_tag})
            } catch (err) {
                this.error_text = err.message
                this.error_active = true
                return
            }

            this.$router.push({name: "search"})
        }
    },
    created() {
        this.load()
    }
}
</script>

<style lang="stylus">
.red-icon .md-icon
        color: red !important
</style>
