<template>
    <div class="page-tabbar">
        <div class="page-wrap">
            <mt-tab-container class="page-tabbar-container" v-model="selected">
                <mt-tab-container-item id="index">
                    <index></index>
                </mt-tab-container-item>
                <mt-tab-container-item id="resource">
                    <resource></resource>
                </mt-tab-container-item>
                <mt-tab-container-item id="purchase">
                    <need></need>
                </mt-tab-container-item>
                <mt-tab-container-item id="mine">
                    <mine></mine>
                </mt-tab-container-item>
            </mt-tab-container>
        </div>
        <mt-tabbar v-model="selected">
            <mt-tab-item id="index">
                <img slot="icon" src="/static/icons/index_selected.png" v-if="selected=='index'">
                <img slot="icon" src="/static/icons/index.png" v-else> 首页
            </mt-tab-item>
            <mt-tab-item id="resource">
                <img slot="icon" src="/static/icons/resource_selected.png" v-if="selected=='resource'">
                <img slot="icon" src="/static/icons/resource.png" v-else> 资源
            </mt-tab-item>
            <mt-tab-item id="purchase">
                <img slot="icon" src="/static/icons/buy_selected.png" v-if="selected=='purchase'">
                <img slot="icon" src="/static/icons/buy.png" v-else> 求购
            </mt-tab-item>
            <mt-tab-item id="mine">
                <img slot="icon" src="/static/icons/mine_selected.png" v-if="selected=='mine'">
                <img slot="icon" src="/static/icons/mine.png" v-else> 我的
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>
<script>
import index from '../components/index/index'
import resource from '../components/index/resource'
import need from '../components/index/need'
import mine from '../components/index/mine'
export default {
    data() {
            return {
                selected: 'index'
            }
        },
        components: {
            index,
            resource,
            need,
            mine
        }

}
</script>
<style scoped>
.page-tabbar {
    overflow: hidden;
    height: 100vh;
}
.page-wrap {
    overflow: auto;
    height: 100%;
    padding-bottom: 60px;
}
.mint-tabbar > .mint-tab-item.is-selected {
    color: #FA6750;
}
</style>
