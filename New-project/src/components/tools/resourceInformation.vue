<template>
    <div class="content resource_information">
        <div class="bg_white">
            <div class="title">
                <p class="index_title">您的资源信息</p>
            </div>
            <div class="more_content">
                <p>品名：{{information.name}}</p>
                <p class="right_p">规格：{{information.spec}}</p>
            </div>
            <div class="more_content">
                <p>产地：{{information.place}}</p>
                <p class="right_p">药材数量：{{information.number}}{{information.unit}}</p>
            </div>
            <div class="more_content last_content" v-if="information.sendPlace">
                <p>发货地：{{information.sendPlace}}</p>
                <p class="right_p">销售价格：{{information.price}}元/kg</p>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
            return {

            }
        },
        props: {
            information: {}
        },
        created() {

        }
}
</script>
<style scoped>
.resource_information {
    float: left;
    width: 100%;
}

.resource_information .bg_white{
    padding: 0.8rem 0;
}
.resource_information .bg_white .title{
    float: left;
    width: 100%;
}

.resource_information .bg_white .index_title {
    font-size: 1.6rem;
    color: #FA6705;
    border-left: 2px solid #FA6705;
    padding: 0 0.8rem;
    margin: 0.8rem 0 0 0;
    text-align: left;
    float: left;
    width: 100%;
}

.resource_information .bg_white .more_content {
    font-size: 1.1rem;
    float: left;
    width: 100%;
    padding:0 0.8rem ; 
}
.resource_information .bg_white .last_content{
    padding-bottom: 1rem;
}
.resource_information .bg_white .more_content p {
    float: left;
    margin-top: 1.1rem;
    color: #333;
}

.resource_information .bg_white .more_content .right_p {
    float: right;
}
</style>
