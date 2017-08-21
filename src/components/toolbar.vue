<template>
    <md-toolbar>
        <h2 class="md-title" style="flex: 1"><router-link class="banner" to="search" tag="span">BISD Chromebook Check-Out</router-link></h2>

        <div class="name" v-if="name">{{name}}</div>

        <md-menu v-if="name">
             <md-button class="md-icon-button" md-menu-trigger>
                 <md-icon>more_vert</md-icon>
             </md-button>

            <md-menu-content>
                <md-menu-item @click="signout()">Sign Out</md-menu-item>
            </md-menu-content>
        </md-menu>
    </md-toolbar>
</template>
<script>
import auth from "../js/auth.js";
export default {
    name: "toolbar",
    computed: {
        name: function() {
            if (auth.user) {
                return auth.user.display_name;
            }
            return null;
        }
    },
    methods: {
        signout: function() {
            auth.clear();
        }
    }
};
</script>
<style lang="stylus">
.banner:hover
    font-weight: bold
</style>
