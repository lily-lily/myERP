<template>
    <div class="mine">
        <accountOverview :param="param"></accountOverview>
        <myInformation :param="information"></myInformation>
        <div class="all_order">
            <p>全部订单</p>
            <div @click="jumpOrder(-1)">
                <p>查看全部订单</p>
                <img src="/static/images/right-arrow.png">
            </div>
        </div>
        <div class="entrance">
            <div v-for="(todo,index) in entrance" @click="jumpOrder(index)">
                <img :src="todo.img_src" class="entrance_img">
                <p>{{todo.name}}</p>
            </div>
        </div>
        <div class="my_list">
            <ul>
                <li v-bind:class="[index%3==1 ? disClass : '', listPart,norLast]" v-for="(todo,index) in my_list" @click="jump(todo.router)">
                    <img :src="todo.img_src" class="my_list_part_img">
                    <p>{{todo.name}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'
import httpService from '../../common/httpService.js'
import imageUpload from '../../components/tools/imageUpload'
import accountOverview from '../../components/tools/accountOverview'
import myInformation from '../../components/tools/myInformation'
export default {
    data() {
            return {
                listPart: 'my_list_part',
                norLast: 'my_list_part_norlast',
                disClass: 'my_list_part_disClass',
                url: '',
                param: {
                    url: '',
                    company: '',
                    normalMoney:0,
                    score: 0,
                    name: ''
                },
                information: {

                },
                entrance: [{
                    name: '待确认',
                    router: 'myOrder',
                    img_src: '/static/images/All-orders.png'
                }, {
                    name: '待付款',
                    router: '',
                    img_src: '/static/images/Pending-payment.png'
                }, {
                    name: '待发货',
                    router: '',
                    img_src: '/static/icons/out-goods.png'
                }, {
                    name: '待收货',
                    router: '',
                    img_src: '/static/icons/receipt.png'
                }],
                my_list: [{
                    name: '我的资源',
                    router: 'myResource',
                    img_src: '/static/icons/My-resources.png'
                },{
                    name: '我的采购',
                    router: 'myPurchase',
                    img_src: '/static/icons/My-purchase.png'
                },{
                    name: '我的报价',
                    img_src: '/static/icons/My-offer.png',
                    router: 'app'
                },{
                    name: '我的关注',
                    router: 'myAttention',
                    img_src: '/static/icons/My-concern.png'
                },{ //         
                    name: '我的药款',
                    img_src: '/static/icons/I-Yaokuan.png',
                    router: 'app'
                },{
                    name: '更多',
                    router: 'mySet',
                    img_src: '/static/icons/Set-up.png'
                }]
            }
        },
        components: {
            imageUpload,
            accountOverview,
            myInformation
        },
        methods: {
            jumpOrder(index) {
                let _self = this;
                if (!common.customerId) {
                    function loadApp() {
                        common.$emit('setParam','backRouter','/home');
                        
                        _self.$router.push('/login');
                    }
                    common.$emit('confirm', {
                        message: '请先登录',
                        title: '提示',
                        ensure: loadApp
                    });
                    return;
                }
                var index = index + 1;
                common.$emit('setParam', 'orderStatus', index);
                common.$emit('mineToOrder', index);
                _self.$router.push('myOrder');
            },
            salesmanData() {
                let _self = this;
                common.$emit('show-load');
                let otherurl = common.addSID(common.urlCommon + common.apiUrl.most);
                let otherbody = {
                    biz_module: 'userService',
                    biz_method: 'queryEmployeeInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {}
                };
                otherbody.time = Date.parse(new Date()) + parseInt(common.difTime);
                otherbody.sign = common.getSign('biz_module=' + otherbody.biz_module + '&biz_method=' + otherbody.biz_method + '&time=' + otherbody.time);
                httpService.queryEmployeeInfo(otherurl, otherbody, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code = "1c01") {
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            getHttp() {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userService',
                    biz_method: 'queryUserInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {}
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.queryUserInfo(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code = "1c01") {
                        _self.information=suc.data.biz_result;
                        console.log(_self.information);
                        _self.param.name = suc.data.biz_result.fullname;
                        _self.param.company = suc.data.biz_result.company;
                        _self.param.normalMoney = suc.data.biz_result.normalMoney;
                        _self.param.score = suc.data.biz_result.score;
                        _self.param.url = suc.data.biz_result.avatar;
                        _self.url = suc.data.biz_result.avatar;
                        _self.information.employee = suc.data.biz_result.employee;
                         common.customerId = suc.data.biz_result.customerId;
                        window.localStorage.ID = suc.data.biz_result.customerId;

                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            loadApp() {
                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yaocaimaimai.yaocaimaimai';
            },
            jump: function(router) {
                if (router == "app") {
                    common.$emit("confirm", {
                        message: '请下载App后，在App内查看',
                        title: '提示',
                        ensure: this.loadApp
                    });
                } else {
                    switch (router) {
                        case 'myResource':
                            common.$emit("informMyRes", 1);
                            break;
                        case 'myPurchase':
                            common.$emit("informMyPurchase", 1);
                            break;
                        case 'myAttention':
                            common.$emit("informResAttention", 1);
                            break;
                        default:
                            break;
                    }
                    let _self = this;
                    if (!common.customerId&&router!='mySet') {
                        function loadApp() {
                            common.$emit('setParam','backRouter','/home');

                            _self.$router.push('/login');
                        }
                        common.$emit('confirm', {
                            message: '请先登录',
                            title: '提示',
                            ensure: loadApp
                        });
                        return;
                    }else{
                       this.$router.push(router); 
                    }
                    
                }

            }
        },
        created() {
            
            let _self = this;
            if (common.SID) _self.getHttp();
            if (common.SID) _self.salesmanData();
            common.$on("toMine", function(obj) {
                _self.getHttp();
            });
            common.$on("clear_Information", function() { //来自资源页面的提示刷新
                console.log('dfdfdfdfdfdf');
                _self.param = {
                    url: '',
                    company: '',
                    normalMoney: 0,
                    score: 0,
                    name: ''
                };
                console.log( _self.param);

            });
            
        }
}
</script>
<style scoped>
.mint-tab-container-item {
    background-color: #f0f0f0;
}

.mine {
    background: #F0F0F0;
}
/*.mine .pointOut{
    width:100%;
    height:15rem;
    background:red;
    position: absolute;
    bottom: -50px;
}*/
.mine .entrance {
    display: flex;
    flex-direction: row;
    height: 6.06rem;
    background: white;
    width: 100%;
    margin: 0;
}

.mine .all_order {
    height: 3.6rem;
    line-height: 3.6rem;
    background: white;
    border-bottom: 1px solid #E0E0DF;
    margin: 0;
}

.mine .all_order>p {
    float: left;
    font-size: 1.3rem;
    color: #333333;
    margin-left: 4%;
}

.mine .all_order>div {
    float: right;
    font-size: 1.3rem;
    color: #999999;
    margin-right: 4%;
}

.mine .all_order>div>p {
    float: left;
    margin-right: 0.5rem;
}

.mine .all_order>div img {
    float: right;
    width: 1.024rem;
    height: 1.024rem;
    margin-top: 1.288rem;
}

.mine .entrance div {
    flex: 1;
    box-sizing: border-box;
    height: 6.06rem;
    position: relative;
}

.mine .information_center div {
    flex: 1;
}

.mine .company {
    flex: 1;
}

.mine .information_right {
    display: flex;
    flex-direction: column;
    text-align: left;
    flex: 6;
}

.mine .money {
    flex: 1;
}

.mine .integration {
    flex: 1;
}

#mine_name {
    font-size: 1.365rem;
    color: #FB761E;
    float: left;
}

.mine .sex img {
    height: 1.024rem;
    margin-left: 3%;
    margin-top: 0.1705rem;
    float: left;
}

.mine .right-arrow {
    width: 1.024rem;
    height: 1.024rem;
    margin-top: 1.308rem;
}

.mine .header_bottom {
    width: 85%;
    height: 1.27995rem;
    line-height: 1.27995rem;
    display: flex;
    flex-direction: row;
    font-size: 1.024rem;
    float: right;
    margin-right: 6%;
    margin-top: 1.96rem;
}

.mine .my_service {
    flex: 47;
    text-align: left;
}

.mine .his_name {
    flex: 26;
    text-align: left;
}

.mine .details {
    flex: 27;
    text-align: right;
}

.mine .entrance {
    display: flex;
    flex-direction: row;
    height: 6.06rem;
    margin-top: 0.8533rem;
    background: white;
    margin: 0;
}

.mine .entrance div {
    flex: 1;
    box-sizing: border-box;
    height: 6.06rem;
    position: relative;
}

.mine .entrance div p {
    font-size: 1.109rem;
    color: #333333;
    margin-top: 4rem;
}

.mine .my_list {
    width: 100%;
    float: left;
    margin-top: 0.8533rem;
}

.mine .my_list ul {
    width: 100%;
    float: left;
    margin-bottom: 0.213rem;
}

.mine .my_list ul li {
    float: left;
    width: 32.5%;
    box-sizing: border-box;
    padding-top: 5.46rem;
    position: relative;
    padding-bottom: 1rem;
    margin-bottom: 5px;
}

.mine .my_list ul li p {
    font-size: 1.024rem;
    color: #333333;
}

.mine .entrance_img {
    position: absolute;
    width: 2.048rem;
    height: 2.048rem;
    margin-left: -1.024rem;
    left: 50%;
    top: 1.5rem;
}

.mine .my_list_part {
    background: white;
}

.mine .my_list_part_img {
    position: absolute;
    width: 2.5599rem;
    height: 2.5599rem;
    margin-left: -1.28rem;
    left: 50%;
    top: 2.133rem;
}

.mine .my_list_part_disClass {
    margin: 0 1.25%;
}

.mine .header_top_right-arrow {
    position: absolute;
    width: 1.024rem;
    height: 1.024rem;
    right: 0;
    top: 2.688rem;
}
</style>
