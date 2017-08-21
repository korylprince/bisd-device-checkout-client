<template>
    <md-snackbar ref="snackbar" md-position="bottom center">
        Changes Saved
    </md-snackbar>
</template>
<script>
import bus from "../js/bus.js";
export default {
    name: "snackbar",
    created: function() {
        bus.$on("saved", () => {
            this.$refs.snackbar.open();
        });
    }
};
</script>
