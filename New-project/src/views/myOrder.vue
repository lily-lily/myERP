<template>
    <div class="my_order">
        <div>
             <attentionHead :param="param" v-on:tab="tabOrder"></attentionHead>
            <div  class="fixed">
                 <landscapeScroll :param="data" v-on:postData="changeOrderStatus"></landscapeScroll>
            </div>
        </div>   
        <div class="bg_white ">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="todos.length!=0">
                <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list">
                        <li v-for="todo in todos" class="page-loadmore-listitem" @click="jump(todo.id)">
                            <div class="list_header">
                                <div>
                                    <p class="time_font"><span>{{todo.ctime | timeFormat}}</span>
                                        <!--  <span style="margin-left:10px">订单编号：{{todo.no}}</span> -->
                                    </p>
                                    <p class="audit_state">{{todo.orderStatus | orderStatus}}</p>
                                </div>
                            </div>
                            <img v-bind:src="todo.image" class="list_images">
                            <div class="res_content">
                                <div class="res_content_center">
                                    <div>{{todo.breedName }}</div>
                                    <p>规格：<span>{{todo.spec}}</span></p>
                                    <p>产地：<span>{{todo.location}}</span></p>
                                </div>
                                <div class="res_content_right">
                                    <p>{{todo.price}}<span>元/{{todo.unit}}</span></p>
                                </div>
                                <p class="num">数量：<span>{{todo.number}}</span></p>
                            </div>
                            <div class="sum">
                                <div class="sum_top">
                                    <p class="sum_left">(含运费￥{{todo.incidentals}})</p>
                                    <p>合计：￥<span>{{Number(todo.price) * Number(todo.number)}}</span>.00</p>
                                </div>
                                <p class="sum_bottom">
                                    <button v-if="'cancel' ==judgeOrderStatus(todo.orderStatus) " @click.stop="cancelOrder(todo.id,todo.no,todo.type)">取消订单</button>
                                    <button v-if="'success' ==judgeOrderStatus(todo.orderStatus)&&httpPraram.type==0" @click.stop="prompt('查看物流')">查看物流</button>
                                    <button v-if="'send' ==judgeOrderStatus(todo.orderStatus)&&httpPraram.type==0" @click.stop="prompt('查看物流')">查看物流</button>
                                    <button v-if="'send' ==judgeOrderStatus(todo.orderStatus)&&httpPraram.type==0" @click.stop="prompt('确认收货')">确认收货</button>
                                    <button v-if="'waitsend' ==judgeOrderStatus(todo.orderStatus)&&httpPraram.type==0" @click.stop="prompt('催促发货')">催促发货</button>
                                    <button v-if="'pay' ==judgeOrderStatus(todo.orderStatus)&&httpPraram.type==0" @click.stop="prompt('支付')">立即支付</button>
                                </p>
                            </div>
                        </li>
                    </ul>
                    <div slot="top" class="mint-loadmore-top">
                        <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
                        <span v-show="topStatus === 'loading'"><mt-spinner type="snake"></mt-spinner></span>
                    </div>
                    <div slot="bottom" class="mint-loadmore-bottom">
                        <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
                        <span v-show="bottomStatus === 'loading'"><mt-spinner type="snake"></mt-spinner></span>
                    </div>
                </mt-loadmore>
            </div>
        </div>
        <errPage :param="err" v-show="todos.length==0"></errPage>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import landscapeScroll from '../components/tools/landscapeScroll'
import attentionHead from '../components/tools/attentionHead'
import filters from '../filters/filters'
import errPage from '../components/tools/err'
export default {
    data() {
            return {
                scrollTop: 0,
                err: {
                    err: "很抱歉，没有找到相关订单",
                    url: '/static/icons/order-point.png',
                },
                param: {
                    name: '采购订单',
                    other_name: '销售订单',
                    show: true,
                    router: "home"
                },
                more: '采购订单',
                title: '销售订单',
                show: false,
                todos: [],
                topStatus: '',
                wrapperHeight: 0,
                allLoaded: false,
                bottomStatus: '',
                data: [{
                    name: '全部订单',
                    back_id: 0,
                    show: true
                }, {
                    name: '待确认',
                    back_id: 10,
                    show: false
                }, {
                    name: '待付款',
                    back_id: 20,
                    show: false
                }, {
                    name: '待发货',
                    back_id: 40,
                    show: false
                }, {
                    name: '待收货',
                    back_id: 50,
                    show: false
                }, {
                    name: '已完成',
                    back_id: 60,
                    show: false
                },{
                    name: '已取消',
                    back_id: -1,
                    show: false
                }],
                buttonStatus: [{

                }],
                httpPraram: {
                    type: 1,
                    orderstatus: 0,
                    page: 1,
                    pageSize: 10
                }
            }
        },
        methods: {
            judgeOrderStatus(val) {
                let status = ''
                switch (val) {
                    case -2:
                        status = '';
                        break;
                    case -1:
                        status = '';
                        break;
                    case 0:
                        status = 'cancel';
                        break;
                    case 10:
                        status = 'cancel';
                        break;
                    case 20:
                        status = 'pay';
                        break;
                    case 30:
                        status = 'waitsend';
                        break;
                    case 40:
                        status = 'waitsend';
                        break;
                    case 50:
                        status = 'send';
                        break;
                    case 60:
                        status = 'send';
                        break;
                    case 70:
                        status = 'success';
                        break;
                }
                return status;
            },
            changeOrderStatus(item) {
                this.httpPraram.orderstatus = item.id;
                this.httpPraram.page = 1;
                this.getHttp();
            },
            cancelOrder(id, no, type) {
                let _self = this;

                function cancelOrder() {
                    common.$emit('show-load');
                    let url = common.addSID(common.urlCommon + common.apiUrl.most);
                    let body = {
                        biz_module: 'orderService',
                        biz_method: 'cancelOrder',
                        version: 1,
                        time: 0,
                        sign: '',
                        biz_param: {
                            id: id,
                            no: no
                        }
                    };
                    body.time = Date.parse(new Date()) + parseInt(common.difTime);
                    body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                    httpService.myResource(url, body, function(suc) {
                        common.$emit('close-load');
                        if (suc.data.code == '1c01') {
                            common.$emit('message', suc.data.msg);
                            _self.todos.splice(0, _self.todos.length);
                            _self.httpPraram.page = 1;
                            _self.getHttp();
                        } else {
                            common.$emit('message', suc.data.msg);
                        }
                    }, function(err) {
                        common.$emit('close-load');
                        common.$emit('message', err.data.msg);
                    })
                }
                common.$emit('confirm', {
                    message: '确定取消订单？',
                    title: '提示',
                    ensure: cancelOrder
                });
            },
            getHttp(back) {
                let _self = this;
                if (_self.httpPraram.page == 1) common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'orderService',
                    biz_method: 'queryOrderList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        orderStatus: _self.httpPraram.orderstatus,
                        type: _self.httpPraram.type,
                        pn: _self.httpPraram.page,
                        pSize: _self.httpPraram.pageSize
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.myResource(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == '1c01') {
                        if (_self.httpPraram.page == 1) {
                            _self.todos.splice(0, _self.todos.length);
                        }
                        let listArr = suc.data.biz_result.list;

                        if (listArr.length < _self.httpPraram.pageSize) {
                            _self.allLoaded = true;
                        }
                        for (let i = 0; i < listArr.length; i++) {
                            _self.todos.push(listArr[i]);
                        }
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                    if (back) {
                        back();
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                    if (back) {
                        back();
                    }
                })
            },
            tabOrder(param) {
                let _self = this;

                if (param == true) {
                    _self.httpPraram.type = 0;
                } else {
                    _self.httpPraram.type = 1;
                }
                this.allLoaded = false;

                this.httpPraram.page = 1;
                _self.getHttp();
            },
            jump: function(id) {
                this.$router.push('myOrderDetail/' + id);
                common.$emit('post-no', id);
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom(id) {
                let _self = this;
                setTimeout(() => {
                    if (this.todos.length < this.httpPraram.page * this.httpPraram.pageSize) {
                        this.allLoaded = true;
                        _self.$refs.loadmore.onBottomLoaded(id);
                    } else {
                        this.httpPraram.page++;
                        this.getHttp(function() {
                            _self.$refs.loadmore.onBottomLoaded(id);
                        });
                    }
                }, 1500);
            },
            handleTopChange(status) {
                this.topStatus = status;
            },
            loadTop(id) {
                let _self = this;
                setTimeout(() => {
                    _self.httpPraram.page = 1;

                    _self.getHttp(function() {
                        _self.$refs.loadmore.onTopLoaded(id);
                    });
                }, 1500);
            },
            prompt(text) {
                function loadApp() {
                    window.location.href = common.appUrl;
                }
                common.$emit('confirm', {
                    message: text + '请下载App',
                    title: '提示',
                    ensure: loadApp
                });
            },
            handleScroll() {
                this.scrollTop = this.$refs.wrapper.scrollTop;
            },
            getScrollTop() {
                this.$refs.wrapper.scrollTop = this.scrollTop;
            }
        },
        watch: {
            '$route': 'getScrollTop'
        },
        filters: (filters, {

        }),
        components: {
            landscapeScroll,
            attentionHead,
            errPage
        },
        created() {
            let _self = this;
            this.httpPraram.page = 1;
            _self.httpPraram.type = 0;
            _self.httpPraram.orderstatus = _self.data[common.pageParam.orderStatus].back_id;
            for (let i = 0; i < _self.data.length; i++) {
                _self.data[i].show = false;
            }
            _self.data[common.pageParam.orderStatus].show = true;
            this.getHttp();
            common.$on('mineToOrder', function(index) {
                _self.httpPraram.orderstatus = _self.data[index].back_id;
                _self.httpPraram.type = 0;
                _self.httpPraram.page = 1;
                for (let i = 0; i < _self.data.length; i++) {
                    _self.data[i].show = false;
                }
                _self.data[index].show = true;
                _self.getHttp();
            });
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 100;
            this.$refs.wrapper.addEventListener('scroll', this.handleScroll);
        }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-loadmore-listitem {
    height: 50px;
    line-height: 50px;
    border-bottom: solid 1px #eee;
    text-align: center;
    &:first-child {
        border-top: solid 1px #eee;
    }
}

.mint-loadmore-content {
    margin-top: 10px;
}

.mint-load {
    background: #fff;
}

.mint-spinner {
    display: inline-block;
    vertical-align: middle;
}

.mint-loadmore-top span {
    display: inline-block;
    transition: .2s linear;
    vertical-align: middle;
}

.mint-loadmore-bottom span {
    display: inline-block;
    transition: .2s linear;
    vertical-align: middle;
}

.mint-swipe-items-wrap {
    float: left;
}

.my_order .mint-swipe-items-wrap .mint-swipe-item {
    float: left;
}

.my_order .mint-header-title {
    /*color:#FA6705;*/
}
.my_order .fixed{  
    margin-top: 50px;
    float:left;
    width:100%;
}

.my_order .right_text {
    color: #333333;
    font-size: 1.2rem;
    padding-left: 1.5rem;
    background: url(/static/images/tab.png) no-repeat left center;
    background-size: 1.2rem;
}

.my_order .second_nav {
    width: 100%;
}

.my_order .second_nav .mint-tab-item.is-selected {
    color: #FA6705;
}

.my_order .bg_white .page-loadmore-wrapper .mint-loadmore {
    background: #F5F5F5;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem {
    width: 100%;
    min-height: 150px;
    border: 0;
    margin-top: 10px;
    float: left;
    background-color: #fff;
    height: auto;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_images {
    height: 80px;
    max-width: 100px;
    left: 10px;
    margin: 50px 10px 10px 0;
    position: absolute;
    z-index: 20000;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header {
    width: 100%;
    height: 30px;
    position: relative;
    padding: 0 10px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header>div {
    /*border-bottom: 1px solid #C6C6C5;
    width:100%;
    height:100%;
    line-height: 40px;*/
    line-height: 40px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header .time_font {
    font-size: 1rem;
    color: #333333;
    float: left;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header .order {
    font-size: 1rem;
    color: #333333;
    float: left;
    margin-left: 1.3rem;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header .audit_state {
    font-size: 1rem;
    color: #FA6705;
    position: absolute;
    right: 10px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum {
    float: right;
    /*padding-right: 10px;*/
    width: 100%;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum .sum_top {
    width: 100%;
    border-bottom: 1px solid #E6E6E6;
    padding-right: 10px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum .sum_bottom {
    padding-right: 10px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum>div {
    /* border: 1px solid #DEDEDE;*/
    height: 3rem;
    width: 100%;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum>div p {
    float: right;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum .sum_left {}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum p {
    font-size: 1rem;
    color: #333333;
    margin-top: 0.5rem;
    margin-bottom: 0;
    text-align: right;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum p span {
    font-size: 1.2rem;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum p button {
    font-size: 1rem;
    color: black;
    background: white;
    border: 1px solid #B5B5B5;
    border-radius: 4px;
    width: 5.5rem;
    height: 2rem;
    outline: none;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .sum p .last-one {
    color: white;
    background: #FA6705;
    border: 0;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li div {
    float: left;
    text-align: left;
    line-height: 20px;
    font-size: 1.3rem;
    margin-bottom: 8px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center img {
    float: left;
    max-height: 15px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center div {
    font-size: 1.5rem;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center p {
    float: left;
    width: 100%;
    padding-right: 90px;
    line-height: 18px;
    text-align: left;
    font-size: 1rem;
    color: #666;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content {
    width: 100%;
    padding-left: 120px;
    padding-top: 20px;
    background: #F5F5F5;
    position: relative;
    padding-bottom: 10px;
    margin-bottom: 0;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right {
    position: absolute;
    max-width: 110px;
    height: 90px;
    margin: 0;
    right: 10px;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right p {
    font-size: 1.5rem;
    margin-top: 0px;
    color: #EC6817;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right p span {
    font-size: 1rem;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .num {
    position: absolute;
    bottom: 20px;
    font-size: 1rem;
    right: 10px;
    color: #666666;
}

.my_order .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .time_font {
    font-size: 1.1rem;
    color: #999;
}

.urgent_need {}
</style>
