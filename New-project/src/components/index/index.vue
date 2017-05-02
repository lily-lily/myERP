<template>
    <div>
        <!-- <mt-header>
            <router-link to="" slot="left"> -->
            <div class="my_header">
                <img src="/static/images/my-logo.png" class="logo">
                <div class="search_div" v-on:click="fromIndex">
                    请输入您想要的货物资源
                    <img src="/static/icons/search.png">
                </div>
            </div>
                
          <!--   </router-link>
        </mt-header> -->
        <div class="my_whole">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" >
                <mt-loadmore>
                    <!--   <div class="content" > -->
                    <div class="swipe_height">
                        <mt-swipe :auto="4000" :prevent="false">
                            <mt-swipe-item v-for="item in imgArray">
                                <img v-bind:src="item.activityImg">
                            </mt-swipe-item>
                        </mt-swipe>
                    </div>
                    <div class="entrance">
                        <a v-for="item in categoryArr" @click="jump(item.router)">
                            <div>
                                <img v-bind:src="item.image">
                                <p>{{item.name}}</p>
                            </div>
                        </a>
                    </div>
                    <div class="supply_demond">
                        <div class="supply_demond_path" v-for="item in supplyDemandArray" @click="loginJump(item.router)">
                            <p>
                                {{item.name}}
                                <img :src="item.image">
                            </p>
                        </div>
                    </div>
                    <div class="real_news" @click="jump('transaction')">
                        <div class="news_logo">
                            <img src="../../../static/images/news.png">
                        </div>
                        <div class="news_content">
                            <ul id="scrollText">
                                <li v-for="todo in transaction">
                                    <div>{{todo.breedName+' '+todo.breedSpec+' '+todo.number+todo.unit+' '+todo.location+' '}}{{todo.successTime | successTimeFormat}}</div>
                                </li>
                                <li v-if="transaction[0]">
                                    <div>{{transaction[0].breedName+' '+transaction[0].breedSpec+' '+transaction[0].number+transaction[0].unit+' '+transaction[0].location+' '}}{{transaction[0].successTime | successTimeFormat}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="bg_white">
                        <p class="index_title">药材指导价</p>
                        <div class="more_content">
                            <router-link to="marketQuotation">
                                <p>更多</p><img src="/static/images/right.png">
                            </router-link>
                        </div>
                        <mt-swipe :auto="4000" :showIndicators="false" :prevent="false">
                            <mt-swipe-item v-for="(todo,index) in drugGuidePrice" v-if="index%2==0">
                                <div class="drug_price_box" @click="jump('marketQuotation')">
                                    <div class="drug_price_swipe">
                                        <div class="drug_price_swipe_left">
                                            <p class="price_swiper_name">{{todo.name}}</p>
                                            <div class="price_swiper_div">
                                                <span>规格:<span>{{todo.spec}}</span></span>
                                                <span class="price_swiper_right_span">{{todo.unitprice}}元</span>
                                            </div>
                                            <div class="price_swiper_div price_swiper_place_div">
                                                <span>产地:<span>{{todo.area}}</span></span>
                                                <span class="price_swiper_right_span">
                                                        <img src="/static/images/down.png" v-if="todo.weekdowns < 0">
                                                        <img src="/static/images/up.png" v-if="todo.weekdowns > 0">&nbsp;
                                                        {{todo.weekdowns | floatType}}%
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class=" drug_price_swipe " v-if="drugGuidePrice[index+1]">
                                        <div class="drug_price_swipe_right">
                                            <p class="price_swiper_name">{{drugGuidePrice[index+1].name}}</p>
                                            <div class="price_swiper_div">
                                                <span>规格:
                                                        <span>{{drugGuidePrice[index+1].spec}}</span>
                                                </span>
                                                <span class="price_swiper_right_span">
                                                        {{drugGuidePrice[index+1].unitprice}}元</span>
                                            </div>
                                            <div class="price_swiper_div price_swiper_place_div">
                                                <span>产地:<span>{{drugGuidePrice[index+1].area}}</span></span>
                                                <span class="price_swiper_right_span">
                                                        <img src="/static/images/down.png" v-if="drugGuidePrice[index+1].weekdowns < 0">
                                                        <img src="/static/images/up.png" v-if="drugGuidePrice[index+1].weekdowns > 0">&nbsp;
                                                        {{drugGuidePrice[index+1].weekdowns}}%
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </mt-swipe-item>
                        </mt-swipe>
                    </div>
                    <div class="bg_white">
                        <div>
                            <p class="index_title">推荐资源</p>
                            <router-link to="/lowPriceRes">
                                <div class="more_content">
                                    <p>更多</p><img src="/static/images/right.png">
                                </div>
                            </router-link>
                        </div>
                        <div class="list_content">
                            <div class="mint-cell cell_class">
                                <div class="mint-cell-wrapper cell_class" v-for="todo in supplyList">
                                    <div class="list_image">
                                        <img src="/static/images/bao.png" class="first_image" v-if="todo.especial == 1 && todo.type == 1">
                                        <img src="/static/icons/sample.png" v-if="todo.sampling == 1 && todo.type == 1">
                                    </div>
                                    <div class="list_myimage">{{todo.breedName}}</div>
                                    <!-- <div class="list_font">{{todo.spec}}</div> -->
                                    <div class="list_font">{{todo.location}}</div>
                                    <div class="list_font">{{todo.price}}元/{{todo.unit}}</div>
                                    <div class="list_button">
                                        <button :type="nativeType" class="mint-button mint-button--primary mint-button--large button_list" @click="jumpRes('resourceDetail/',todo.id)">
                                            <span v-show = "todo.isMy == 0">我要购买</span>
                                            <span v-show = "todo.isMy == 1">查看详情</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg_white">
                        <div>
                            <p class="index_title">紧急求购</p>
                            <router-link to="/urgentNeed">
                                <div class="more_content">
                                    <p>更多</p><img src="/static/images/right.png">
                                </div>
                            </router-link>
                        </div>
                        <div class="list_content">
                            <div class="mint-cell cell_class">
                                <div class="mint-cell-wrapper cell_class" v-for="todo in begBuyList">
                                    <div class="list_image">
                                        <img src="/static/icons/impatient.png" class="first_image" v-if="todo.especial == 1 && todo.type == 0">
                                        <img src="/static/icons/sample.png" v-if="todo.sampling == 1 && todo.type == 0">
                                    </div>
                                    <div class="list_myimage">{{todo.breedName}}</div>
                                    <!-- <div class="list_font">{{todo.spec}}</div> -->
                                    <div class="list_font">{{todo.location}}</div>
                                    <div class="list_font">剩余{{todo.duedate | timeDays(todo.pubdate)}}天</div>
                                    <div class="list_button">
                                        <button :type="nativeType" class="mint-button mint-button--primary mint-button--large button_list" @click="jumpNeed('needDetail/',todo.id)">
                                            <span v-show = "todo.isMy == 0">我要报价</span>
                                            <span v-show = "todo.isMy == 1">查看详情</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--     </div> -->
                </mt-loadmore>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'
import httpService from '../../common/httpService.js'
import longSearch from '../../components/tools/longSearch'
import filters from '../../filters/filters'
export default {
    data() {
            return {
                scrollTop: 0,
                wrapperHeight: '',
                selected: 'tab-container1',
                imgArray: [
                ],
                imgArr: [],
                todos: [{
                    "name": "人参",
                    "spec": "统货",
                    "place": "东北",
                    "price": "98.9元/kg",
                    "up_price": "9元/kg",
                    "down_price": "9元/kg",
                    "phone": "15301546832",
                    "time": "12:26"
                }],
                drugGuidePrice: [],
                transaction: [],
                supplyList: [],
                begBuyList: [],
                drugParam: {
                    show: false
                },
                scroll_length: '',
                categoryArr: [{
                    name: '低价资源',
                    router: 'lowPriceRes',
                    image: '/static/images/lowPrice.png'
                }, {
                    name: '紧急求购',
                    router: 'urgentNeed',
                    image: '/static/images/urgentSupply.png'
                }, {
                    name: '市场行情',
                    router: 'marketQuotation',
                    image: '/static/images/market.png'
                }, {
                    name: '药材百科',
                    router: 'drugResTable/my',
                    image: '/static/images/drugType.png'
                }],
                supplyDemandArray: [{
                    name: '我要供应',
                    router: 'supplyRelease',
                    image: '/static/images/my-supply.png'
                }, {
                    name: '我要采购',
                    router: 'needRelease',
                    image: '/static/images/my-purchase.png'
                }],
                perfect:{
                    name:'',
                    bizMain:''
                }
            }
        },
        methods: {
            getInfo() {
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
                console.log(common.difTime);
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.queryUserInfo(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == "1c01"){
                        _self.perfect.name = suc.data.biz_result.fullname;
                        _self.perfect.bizMain = suc.data.biz_result.bizMain;
                        
                    }else{
                        console.log('cuowusasdada')
                    }
                    
                    
                }, function(err) {
                    common.$emit('close-load');
                })
            },
            getImgArr() {
                let _self = this;
                httpService.commonPost(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'activityService',
                    biz_method: 'queryActivityList',
                    biz_param: {}
                }, function(suc) {
                    let result = suc.data.biz_result.list;
                    console.log(result);
                    _self.imgArray = result;
                }, function(err) {
                    common.$emit('message', err.data.msg);
                })
            },
            drugGuidePrice() {
                let _self = this;
                httpService.realTimeTurnover(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'breedService',
                    biz_method: 'breedPriceGuide',
                    biz_param: {
                        pn: 1,
                        pSize: 10
                    }
                }, function(suc) {
                    let result = suc.data.biz_result.list;
                    console.log(result)
                    _self.drugGuidePrice = result;
                }, function(err) {
                    common.$emit('message', err.data.msg);
                })

            },
            resourceHttp() {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'reconnendList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        pn: 1,
                        pSize: 10
                    }
                };
                if (common.customerId) {
                    url = common.addSID(common.urlCommon + common.apiUrl.most);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(common.difTime);
                    body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                } 
                httpService.begBuyList(url, body, function(suc) {
                    common.$emit('close-load');
                    let result = suc.data.biz_result;
                    let begBuyList = result.begBuyList.slice(0, 6);
                    let supplyList = result.supplyList.slice(0, 6);
                    _self.begBuyList = begBuyList;
                    _self.supplyList = supplyList;
                    common.$emit('post-revise-address', _self.obj);
                }, function(err) {
                    common.$emit('close-load');
                })
            },
            transaction() {
                let _self = this;
                httpService.realTimeTurnover(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'tradeNewService',
                    biz_method: 'currentTradeList',
                    biz_param: {
                        pn: 1,
                        pSize: 10
                    }
                }, function(suc) {
                    let result = suc.data.biz_result.list;
                    _self.scroll_length = result.length + 1;
                    _self.transaction = result;
                }, function(err) {
                    common.$emit('message', err.data.msg);
                })
            },
            jump: function(router) {
                let _self = this;
                /*switch (router){
                    case 'lowPriceRes':
                        common.$emit('listOflowPrice',1);
                        _self.$router.push(router);
                        break;
                    case 'urgentNeed':
                        common.$emit('listOfUrgent',1);
                        _self.$router.push(router);
                        break;  
                    default:
                        _self.$router.push(router);
                        break;
                }*/
                _self.$router.push(router);
            },
            fromIndex() {
                common.searchType = 'keyword';
                common.$emit('setParam', 'router', 'index');
                this.$router.push("/search");
            },
            loginJump(router) {
                let _self = this; 
                if (!common.customerId) {
                    function loadApp() {
                        _self.$router.push('/login');
                    }
                    common.$emit('confirm', {
                        message: '请先登录',
                        title: '提示',
                        ensure: loadApp
                    });
                    return;
                }else if(_self.perfect.name == '' || _self.perfect.bizMain == ''){
                    function perfect() {
                        
                        //common.$emit('backInfo',1);
                        _self.$router.push('/perfectInfo');
                    }
                    common.$emit('confirm', {
                        message: '请先完善信息',
                        title: '提示',
                        ensure: perfect
                    });
                    return;
                }
               
                this.$router.push(router);
            },
            jumpRes(router, id) {
                common.$emit('resourceDetail', id);
                this.$router.push(router + id);
            },
            jumpNeed(router, id) {
                common.$emit('needToDetail', id);
                this.$router.push(router + id);
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
        created() {
            let _self = this;
            this.resourceHttp();
            this.transaction();
            this.drugGuidePrice();
            this.getImgArr();
            _self.getInfo();
            common.$on('getInfo',function(item){
               _self.getInfo();
               _self.resourceHttp();
            })

        },
        computed: {
            drugArray: function() {
                let arr = [];
                for (let i = 0; i++; i < this.todos.length) {
                    if (i % 2 == 0) {
                        arr.push(this.todos[i]);
                    }
                }
                return arr;
            }
        },
        mounted() {
            this.$refs.wrapper.addEventListener('scroll', this.handleScroll);
            let _self = this;
            this.$nextTick(function() {
                _self.wrapperHeight = document.documentElement.clientHeight - _self.$refs.wrapper.getBoundingClientRect().top - 73;
            })
            function startmarquee(lh, speed, delay) {
                var count = 1;
                var t;
                var o = document.getElementById("scrollText");
                var top = 0;
                o.style.marginTop = 0;

                function start() {
                    t = setInterval(scrolling, speed);
                }

                function scrolling() {
                    if (top % lh != 0 || top == 0) {
                        if (count == _self.scroll_length) {
                            o.style.marginTop = 0;
                            clearInterval(t);
                            setTimeout(start, delay);
                            count = 1;
                            top = 0;
                        } else {
                            o.style.marginTop = parseInt(o.style.marginTop) - 1 + "px";
                            top++;
                        }
                    } else {
                        top = 0;
                        count++;
                        clearInterval(t);
                        setTimeout(start, delay);
                    }
                }
                setTimeout(start, delay);
            }
            startmarquee(50, 20, 1500);
        }
}
</script>
<style scoped>
.my_header {
    background-color: #FA6705;
    border: none;
    color: #fff;
    height:60px;
}

.my_whole {
    width: 100%;
    overflow: hidden;
}

.search_div {
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    height: 30px;
    position: absolute;
    top: 15px;
    left: 62px;
    right: 15px;
    color: #999;
    line-height: 30px;
    text-indent: 1rem;
    font-size: 14px;
    text-align: left;
}


.my_header .logo {
    height: 30px;
    float: left;
    margin-top: 12px;
    margin-left: 10px;
}

.search_div img {
    float: left;
    max-height: 20px;
    margin-top: 5px;
    margin-left: 15%;
}

.swipe_height {
    height: 15rem;
}

.swipe_height img {
    width: 100%;
    min-height: 15rem;
}

.entrance {
    background: white;
    position: relative;
    height: 9rem;
    margin: 10px 0;
    max-height: 90px;
}

.entrance div {
    width: 25%;
    float: left;
    padding: 5px;
}

.entrance div img {
    max-width: 50px;
}

.entrance div p {
    margin-top: 5px;
    color: #333;
    font-size: 1.1rem
}

.supply_demond {
    display: flex;
    flex-direction: row;
    background: white;
    height: 5.1rem;
    position: relative;
}

.supply_demond div {
    width: 50%;
}

.supply_demond div:first-child {
    border-right: 1px solid #ddd;
}

.supply_demond p {
    flex: 1;
    text-align: left;
    line-height: 5.1rem;
    box-sizing: border-box;
    padding-left: 0.8rem;
    color: #FA6705;
    font-weight: 500;
    font-size: 1.3rem;
    float: left;
    width: 100%;
    padding-left: 40%;
    height: 100%;
    position: relative;
}

.supply_demond p img {
    position: absolute;
    left: 25%;
    width: 1.919rem;
    top: 1.5905rem;
}


/*.supply_demond img {
    float: left;
    max-width: 80px;
    width: 3rem;
    margin: 1rem 0 1rem 3rem;
}*/

.real_news {
    position: relative;
    height: 50px;
    margin: 1rem 0;
    background-color: #fff;
    overflow: hidden;
}

.real_news .news_logo {
    text-align: center;
    width: 4.3rem;
    border-right: 1px solid #ddd;
    overflow: hidden;
    float: left;
}

.real_news .news_logo img {
    width: 2.8rem;
    margin: 0.8rem;
}

.real_news .news_content {
    margin-left: 0.3rem;
    float: left;
    width: 82%;
}

.real_news .news_content ul li {
    line-height: 50px;
    font-size: 1.2rem;
    height: 50px;
    overflow: hidden;
}

.real_news .news_content ul li div {
    word-wrap: break-word;
    white-space: normal;
}

.real_news .news_content ul li p {
    margin-left: 0.2rem;
}

.bg_white .index_title {
    font-size: 1.6rem;
    color: #333;
    border-left: 2px solid #FA6705;
    padding: 0 0.8rem;
    margin: 0.8rem 0;
    text-align: left;
    float: left;
}

.bg_white .more_content {
    float: right;
    font-size: 1.1rem;
    margin-right: 0.8rem;
}

.bg_white .more_content p {
    float: left;
    margin-top: 1.1rem;
}

.bg_white .more_content img {
    margin: 1.1rem 0 0 0.5rem;
    width: 0.7rem;
}

.bg_white .mint-swipe {
    height: 8rem;
    width: 100%;
}

.bg_white .drug_price_box {
    width: 100%;
    float: left;
}

.bg_white .drug_price_box .drug_price_swipe {
    width: 50%;
    float: left;
}

.bg_white .drug_price_box .drug_price_swipe_right {
    /*background-color: #FFF0D7;*/
    background-color: #F1F1F1;
    margin: 0.8rem 0.8rem 0.8rem 0.4rem;
    border-radius: 10px;
}

.bg_white .drug_price_box .drug_price_swipe .drug_price_swipe_left {
    margin: 0.8rem 0.4rem 0.8rem 0.8rem;
    /*background-color: #EDFAD8;*/
    background-color: #F1F1F1;
    border-radius: 10px;
}

.bg_white .drug_price_box .drug_price_swipe div .price_swiper_name {
    text-align: left;
    color: #333;
    padding: 0.5rem;
    font-size: 1.3rem;
}

.bg_white .drug_price_box .drug_price_swipe div .price_swiper_div {
    margin: 0;
    padding: 0 0.5rem;
    text-align: left;
    font-size: 1.1rem;
}

.bg_white .drug_price_box .drug_price_swipe div .price_swiper_div img {
    max-height: 1rem;
}

.bg_white .drug_price_box .drug_price_swipe div .price_swiper_place_div {
    padding: 0.3rem 0.5rem 0.5rem 0.5rem;
    font-size: 1.1rem;
}

.bg_white .drug_price_box .drug_price_swipe div .price_swiper_div .price_swiper_right_span {
    float: right;
}

.bg_white .cell_class {
    float: left;
    width: 100%;
    min-height: 40px;
    padding: 0;
}

.bg_white .supply-list {
    height: 40px;
    overflow: hidden;
    word-break: keep-all;
    -ms-text-overflow: ellipsis;
}

.bg_white .list_content {
    padding: 0 0.8rem;
    float: left;
    width: 100%;
}

.bg_white .list_content .button_list {
    max-height: 28px;
    font-size: 1.1rem;
    color: #fff;
    background-color: #EC6817;
}

.bg_white .list_content .cell_class .list_font {
    font-size: 1.1rem;
    text-align: center;
    width: 30%;
    height: 30px;
    line-height: 30px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.bg_white .list_content .cell_class .list_myimage {
    width: 20%;
    font-size: 1.1rem;
    height: 30px;
    line-height: 30px;
    text-align: center;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.bg_white .list_content .cell_class .list_image {
    font-size: 1.1rem;
    text-align: center;
    width: 10%;
    margin-left: 2px;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.bg_white .list_content .cell_class .list_button {
    width: 25%;
}

.bg_white .list_content .cell_class .list_image img {
    float: left;
    max-width: 49%;
}

.bg_white .list_content .cell_class .list_image .first_image {
    margin-right: 2%;
}
</style>
