<template>
    <div class="content progress">
        <div class="bg_white">
            <div class="title">
                <p class="index_title">发布进度</p>
            </div>
            <div class="more_content">
                <img src="/static/images/progress_1.png" v-if="auditProgress==1">
                <img src="/static/images/progress_2.png" v-if="auditProgress==2">
                <img src="/static/images/progress_3.png" v-if="auditProgress==3">
                <img src="/static/images/progress_4.png" v-if="auditProgress==4">
            </div>
           
        </div>
    </div>
</template>
<script>
export default {
    data() {
            return {}
        },
        props: {
            auditProgress: ''
        },
        created() {

        }
}
</script>
<style scoped>
.progress {
    float: left;
    width: 100%;
}

.progress .bg_white {
    padding: 0.8rem 0;
}

.progress .bg_white .title {
    float: left;
    width: 100%;
}

.progress .bg_white .index_title {
    font-size: 1.6rem;
    color: #FA6705;
    border-left: 2px solid #FA6705;
    padding: 0 0.8rem;
    margin: 0.8rem 0 0 0;
    text-align: left;
    float: left;
    width: 100%;
}

.progress .bg_white .more_content {
    font-size: 1.1rem;
    float: left;
    width: 100%;
    padding: 0 0.8rem;
    padding-bottom: 1rem;
}

.progress .bg_white .more_content img{
    max-width: 100%;
    margin-top: 0.8rem;
}


</style>
