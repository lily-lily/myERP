<template>
    <div class="header-photo">
        <img :src="param.url" v-show="param.url">
        <img src="/static/images/my-header.png" v-show="!param.url">
    </div>
</template>
<script>
export default {
    data() {
            return {}
        },
        props: {
            param: {

            }
        },
        created() {

        },

}
</script>
<style scoped>
.header-photo img {
    width: 100%;
    height:5.1198rem;
    /*height:5.1198rem;*/
    /*border-radius: 50%; */
}
</style>
