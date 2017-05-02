<template>
    <div class=" order_total">
        <div class="title">
            <span v-if="order.from">{{orderName}}</span>
            <span v-if="!order.from">{{name}}</span>
        </div>
        <div class="detail">
            <p class="p_left"><span v-if="!order.from">{{title[0]}}</span><span v-if="order">{{orderTitle[0]}}</span></p>
            <p class="p_right">￥{{order.price}}</span></p>
        </div>
        <div class="detail">
            <p class="p_left"><span v-if="!order.from">{{title[1]}}</span><span v-if="order.from">{{orderTitle[1]}}</span></p>
            <p class="p_right">{{Number(order.value)}}</p>
        </div>
        <div class="detail">
            <p class="p_left"><span v-if="!order.from">{{title[2]}}</span><span v-if="order.from">{{orderTitle[2]}}</span></p>
            <p class="p_right">￥<span >{{Number(order.price * order.value)}}</span></p>
        </div>
        <div class="detail">
            <p class="p_left">{{title[3]}}</p>
            <p class="p_right">{{data[3]}}</p>
        </div>
        <div class="count">
            <p>合计</p>
            <p class="p_right">￥<span >{{Number(order.price * order.value)}}</span></p>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'

export default {
    data() {
            return {
                name: '样品订单：',
                data: ['20', '1份', '88', '待确定'],
                count: '98',
                title: ['样品单价', '样品数量', '商品总价', '运输价格'],
                orderTitle: ['商品单价', '购买数量', '商品总价', '运输价格'],
                orderName: '大货订单：'
            }
        },
        props: {
            order: {

            }
        },

        methods: {

        }
}
</script>
<style scoped>
.order_total {
    float: left;
    width: 100%;
}

.order_total .title {
    float: left;
    width: 100%;
    text-align: left;
    color: #FA6705;
    font-size: 1.2rem;
    margin: 1rem 0;
}

.order_total .detail {
    float: left;
    width: 100%;
}

.order_total .detail p {
    float: left;
    font-size: 1.2rem;
    color: #666;
    margin-top: 1rem;
}

.order_total .detail .p_right {
    float: right;
}

.order_total .count {
    float: left;
    width: 100%;
    margin: 2.5rem 0 4.5rem 0;
}

.order_total .count p {
    float: left;
    color: #FA6705;
    font-size: 1.2rem;
}

.order_total .count .p_right {
    float: right;
}
</style>
