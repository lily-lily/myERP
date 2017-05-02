<template>
    <div class="my_order_detail">
        <!--  <myHeader :param="my_header"></myHeader> -->
        <mt-header :title="todo.my_title" :fixed="show">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="back()"></mt-button>
            </router-link>
        </mt-header>

        <div class="buy-img" v-if="todo.type == 0"></div>
        <div class="sale-img" v-if="todo.type == 1"></div>
        <div class="word_info">
            <div class="info_left">

                <p>下单时间：<span>{{todo.ctime}}</span></p>
                <p>订单号：<span>{{todo.no}}</span></p>
                <p>收件人：<span>{{todo.consignee}}</span>&nbsp;|&nbsp;<span>{{todo.consigneePhone}}</span></p>
                <p class="last_p">收货地址：<span>{{todo.consigneeAddr}}</span></p>
            </div>
            <p class="info_right">
                {{todo.orderStatus | orderStatus}}
            </p>
        </div>
        <div class="drug_info">
            <div class="drug_info_top">
                <img :src="todo.image">
                <div class="info_top_center">
                    <p class="drug_name">{{todo.breedName}}</p>
                    <p class="drug_spec">规格：{{todo.spec}}</p>
                    <p>产地：{{todo.location}}</p>
                </div>
                <div class="info_top_bottom">
                    <p class="drug_money">{{todo.price}}<span>元/kg</span></p>
                    <p>数量：<span>{{todo.number}}</span></p>
                </div>
            </div>
            <div class="drug_info_bottom">
                <div class="good_sum_price">
                    <p>商品总价</p>
                    <p class="price">￥{{todo.amount}}</p>
                </div>
                <div class="transport_price">
                    <p>运输价格</p>
                    <p class="price">￥{{todo.incidentals}}</p>
                </div>
                <div class="sum_price">
                    <p>合计</p>
                    <p class="price">￥{{Number(todo.amount) + Number(todo.incidentals)}}</p>
                </div>
            </div>
        </div>
        <div class="footer">
            <p @click="call()">联系我们</p>
            <p class="pay-money" v-if="todo.orderStatus == 20&&todo.type == 0" @click="prompt('支付')">立即付款</p>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
export default {
    data() {
            let _self = this;
            return {
                show:true,
                todo: {
                    my_title: '采购订单'
                },
                no: '',
                phone: common.servicePhone,
                my_header: {
                    name: '采购订单',
                }
            }
        },
        components: {
            myHeader
        },
        created() {
            let _self = this;
            _self.getHttp(_self.$route.params.OrdeId);
            common.$on('post-no', function(id) {
                _self.getHttp(id);
            })
            if (!common.servicePhone) this.getCustomerPhone();
        },
        methods: {
            prompt(text) {
                function loadApp(){
                    window.location.href = common.appUrl;
                }
               common.$emit('confirm', {
                    message:text+'请下载App',
                    title:'提示',
                    ensure:loadApp
                });
            },
            back() {
              window.history.go(-1);
            },
            call() {
                window.location.href = "tel:" + this.phone;
            },
            getCustomerPhone() {
                let _self = this;
                this.$http.get(common.urlCommon + common.apiUrl.getDate).then((response) => {
                    if (response.data.code == '1c01') {
                        common.servicePhone = response.data.biz_result.serviceMobile;
                        _self.phone = response.data.biz_result.serviceMobile;
                    }
                }, (err) => {
                    common.$emit('message', err.data.msg);
                });
            },
            getHttp(id) {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'orderService',
                    biz_method: 'queryOrderInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        id: id
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.myResource(url, body, function(suc) {
                    common.$emit('close-load');
                    let listObj = suc.data.biz_result;
                    if (listObj.type == 0) {
                        listObj.my_title = '采购订单';
                        _self.my_header.name = '采购订单';
                    } else if (listObj.type == 1) {
                       listObj.my_title = '销售订单';
                        _self.my_header.name = '销售订单';
                    }
                    _self.todo = listObj;
                }, function(err) {
                    common.$emit('close-load');
                })
            }
        }
}
</script>
<style scoped>
.my_order_detail {
    background: #F5F5F5;
}

.my_order_detail .buy-img {
    background: url(/static/images/buy-order.png) no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 14rem;
    margin-bottom: 1rem;
    margin-top: 50px;
}

.my_order_detail .sale-img {
    background: url(/static/images/sale-order.png) no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 14rem;
    margin-bottom: 1rem;
    margin-top: 50px;
}

.my_order_detail .word_info {
    padding: 1.5rem;
    height: 10rem;
    background: white;
}

.my_order_detail .word_info .info_left {
    float: left;
}

.my_order_detail .word_info .info_right {
    position: absolute;
    right: 10px;
    color: #FA6705;
    font-size: 1.3rem;
}

.my_order_detail .word_info .info_left p {
    font-size: 1rem;
    margin-bottom: 1rem;
    text-align: left;
    line-height: 1rem;
}

.my_order_detail .word_info .info_left .last_p {
    margin-bottom: 0;
}

.my_order_detail .drug_info {
    margin-top: 1rem;
    padding: 1.5rem;
    background: white;
}

.my_order_detail .drug_info .drug_info_top {
    height: 9.75rem;
    position: relative;
}

.my_order_detail .drug_info .drug_info_top img {
    width: 8.9rem;
    height: 8.5rem;
    position: absolute;
    left: 0;
    top: 0;
}

.my_order_detail .drug_info .drug_info_top .info_top_center {
    left: 9.9rem;
    position: absolute;
    height: 6.5rem;
    text-align: left;
    margin: 1rem 0 0 0;
}

.my_order_detail .drug_info .drug_info_top .info_top_center .drug_name {
    font-size: 1.4rem;
    color: #333333;
    padding-bottom: 2rem;
    line-height: 1.4rem;
}

.my_order_detail .drug_info .drug_info_top .info_top_center p {
    font-size: 1rem;
    color: #666666;
    line-height: 1rem;
}

.my_order_detail .drug_info .drug_info_top {
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #DEDEDE;
}

.my_order_detail .drug_info .drug_info_top .info_top_center .drug_spec {
    margin-bottom: 1rem;
}

.my_order_detail .drug_info .drug_info_top .info_top_bottom {
    position: absolute;
    height: 6.5rem;
    text-align: left;
    margin: 1rem 0 0 0;
    right: 0;
    text-align: right;
}

.my_order_detail .drug_info .drug_info_top .info_top_bottom .drug_money {
    font-size: 1.4rem;
    color: #FA6705;
    margin-bottom: 3.9rem;
    line-height: 1.4rem;
}

.my_order_detail .drug_info .drug_info_top .info_top_bottom .drug_money span {
    font-size: 1.2rem;
}

.my_order_detail .drug_info .drug_info_top .info_top_bottom p {
    font-size: 1rem;
    color: #666666;
    line-height: 1rem;
}

.my_order_detail .drug_info .drug_info_bottom {
    margin-top: 2rem;
    font-size: 1rem;
    color: #666666;
}

.my_order_detail .drug_info .drug_info_bottom .good_sum_price {
    margin-bottom: 1rem;
}

.my_order_detail .drug_info .drug_info_bottom .good_sum_price,
.my_order_detail .drug_info .drug_info_bottom .transport_price {
    height: 1rem;
    line-height: 1rem;
}

.my_order_detail .drug_info .drug_info_bottom>div .price {
    float: right;
}

.my_order_detail .drug_info .drug_info_bottom>div p {
    float: left;
}

.my_order_detail .drug_info .drug_info_bottom .sum_price {
    font-size: 1.2rem;
    color: #FA6705;
    line-height: 1.2rem;
    margin-top: 1.5rem;
    height: 1.2rem;
}

.my_order_detail .footer {
    float: right;
    margin-top: 1rem;
    margin-bottom: 30px;
}

.my_order_detail .footer p {
    font-size: 1.2rem;
    border: 1px solid #DFDFD0;
    float: left;
    margin-right: 1rem;
    padding: 3px 10px;
    color: #333333;
    border-radius: 1px;
}

.my_order_detail .footer .pay-money {
    color: #FA6705;
    border: 1px solid #FA6705;
}
</style>
