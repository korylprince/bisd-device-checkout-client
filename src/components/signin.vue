<template>
    <md-card class="signin">
        <md-card-area md-inset>
            <md-card-header >
                <div class="md-headline">Sign in</div>
            </md-card-header>
        </md-card-area>

        <md-card-content>
            <form novalidate @keyup.enter="authenticate(username, password)">

                <md-input-container>
                    <label>Username</label>
                    <md-input type="username" v-model="username" required></md-input>
                </md-input-container>

                <md-input-container>
                    <label>Password</label>
                    <md-input type="password" v-model="password" required></md-input>
                </md-input-container>

            </form>
            <div class="signin-error" v-if="error_text != null">{{error_text}}</div>
        </md-card-content>

        <md-card-actions>
            <md-button class="md-raised md-primary" @click="authenticate(username, password)" :disabled="username == null || username === '' || password == null || password === ''">Sign in</md-button>
        </md-card-actions>
    </md-card>

</template>

<script>
import api from "../js/api.js";
import auth from "../js/auth.js";
export default {
    name: "signin",
    data: function() {
        return {
            username: null,
            password: null,
            error_text: null
        };
    },
    methods: {
        authenticate: function(username, password) {
            this.error_text = null;

            if (!username || !password) {
                this.error_text = "You must enter a username or password";
                return;
            }

            var promise = api.authenticate(username, password);

            promise.then((response) => {
                auth.update(response.data.session_key, response.data.user);
            }).catch((error) => {
                if (error.response && error.response.status === 401) {
                    this.error_text = "Bad username or password";
                } else {
                    this.error_text = "Unknown error occurred";
                    console.error(error);
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.signin
    max-width: 600px
    margin: 100px auto auto auto

    .signin-error
        color: red
</style>
