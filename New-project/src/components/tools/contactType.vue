<template>
    <div class="content contact_information">
        <div class="bg_white">
            <div class="title">
                <p class="index_title">联系方式</p>
            </div>
            <div class="more_content">
                <p>姓名：{{information.name}}</p>
            </div>
            <div class="more_content last_content">
                <p>联系方式：{{information.phone}}</p>
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
            information: {}
        },
        created() {

        }
}
</script>
<style scoped>
.contact_information {
    float: left;
    width: 100%;
}

.contact_information .bg_white {
    padding: 0.8rem 0;
}

.contact_information .bg_white .title {
    float: left;
    width: 100%;
}

.contact_information .bg_white .index_title {
    font-size: 1.6rem;
    color: #FA6705;
    border-left: 2px solid #FA6705;
    padding: 0 0.8rem;
    margin: 0.8rem 0 0 0;
    text-align: left;
    float: left;
    width: 100%;
}

.contact_information .bg_white .more_content {
    font-size: 1.1rem;
    float: left;
    width: 100%;
    padding: 0 0.8rem;
}
.contact_information .bg_white .last_content{
    padding-bottom: 1rem;
}
.contact_information .bg_white .more_content p {
    float: left;
    margin-top: 1.1rem;
    color: #333;
}
</style>
