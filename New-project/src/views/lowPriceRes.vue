<template>
    <div class="low_price">
        <headFix :param="headParam" v-on:postClear="clearKeyword"></headFix>
        <sort v-on:postId="getId" :sortRouter="sortRouter" :paramArr="sortArr"></sort>
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="todos.length!=0">
                <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list">
                        <li v-for="(todo,index) in todos" class="page-loadmore-listitem list_content_item" @click="jumpDetail(todo.id)">
                            <img v-bind:src="todo.image[0]" class="list_images">
                            <div class="res_content">
                                <div class="res_content_center">
                                    <div>
                                        <img src="/static/images/bao.png" v-if="todo.especial == 1 && todo.type == 1">
                                        <img src="/static/icons/sample.png" v-if="todo.sampling == 1 && todo.type == 1"> {{todo.breedName}}
                                    </div>
                                    <p class="spec over_lenght">规格：<span>{{todo.spec}}</span></p>
                                    <p class="over_lenght">产地：<span>{{todo.location}}</span></p>
                                    <p class="time_font">发布时间:<span>{{todo.pubdate | timeFormat}}</span></p>
                                </div>
                                <div class="res_content_right">
                                    <p>{{todo.price}}元/<span>{{todo.unit}}</span></p>
                                    <button class="mint-button mint-button--primary mint-button--small" v-show="todo.isMy == 0">立即购买</button>
                                    <button class="mint-button mint-button--primary mint-button--small" v-show="todo.isMy == 1">查看详情</button>
                                </div>
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
import sort from '../components/tools/sort'
import validation from '../validation/validation.js'
import httpService from '../common/httpService.js'
import headFix from '../components/tools/head'
import errPage from '../components/tools/err'
import filters from '../filters/filters'
export default {
    data() {
            return {
                scrollTop: 0,
                err: {
                    err: "很抱歉，没有找到相关资源",
                    url: '/static/icons/maomao.png',
                    next_step: '去发布',
                    router: '/supplyRelease'
                },
                sortRouter: 'lowRes',
                sortArr: [{
                    name: '上架时间',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '上架时间',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '由新到旧',
                        asc: 'low',
                        show: false,
                        time: 2,
                        key: 'time'
                    }, {
                        name: '由旧到新',
                        asc: 'top',
                        show: false,
                        time: 1,
                        key: 'time'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        time: 0,
                        key: 'time'
                    }]
                }, {
                    name: '价格排序',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '价格排序',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '由低到高',
                        asc: 'low',
                        show: false,
                        price: 1,
                        key: 'price'
                    }, {
                        name: '由高到低',
                        asc: 'top',
                        show: false,
                        price: 2,
                        key: 'price'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        price: 0,
                        key: 'price'
                    }]
                }, {
                    name: '可否样品',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '可否样品',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '可提供',
                        asc: 'low',
                        show: false,
                        sample: 1,
                        key: 'sample'
                    }, {
                        name: '不可提供',
                        asc: 'top',
                        show: false,
                        sample: 0,
                        key: 'sample'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        sample: '',
                        key: 'sample'
                    }]
                }, {
                    name: '产地',
                    asc: 'location',
                    url: '/static/icons/screen.png',
                    class: 'sort_content_detail',
                }],
                back_key: '0',
                keyword: '',
                todos: [],
                obj: {},
                topStatus: '',
                wrapperHeight: 0,
                allLoaded: false,
                bottomStatus: '',
                show: '',
                httpPraram: {
                    time: 0,
                    price: 0,
                    sample: '',
                    location: [],
                    keyword: '',
                    page: 1,
                    pageSize: 10
                },
                headParam: {
                    title: '低价资源',
                    keyword: '',
                    router: 'lowPriceRes'
                }
            }
        },
        components: {
            sort,
            headFix,
            errPage
        },
        methods: {
            getHttp(back) {
                if (this.httpPraram.page == 1) {
                    this.allLoaded = false;
                }
                let _self = this;
                if (_self.httpPraram.page == 1) common.$emit('show-load');
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'querySupplyList',
                    biz_param: {
                        keyWord: _self.httpPraram.keyword,
                        sort: {
                            "shelve_time": _self.httpPraram.time,
                            "price": _self.httpPraram.price
                        },
                        sampling: _self.httpPraram.sample,
                        pn: _self.httpPraram.page,
                        pSize: _self.httpPraram.pageSize,
                        location: _self.httpPraram.location
                    }
                }
                if (common.customerId) {
                    url = common.addSID(common.urlCommon + common.apiUrl.most);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(common.difTime);
                    body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                } 
                httpService.myAttention(url, body, function(suc) {
                    common.$emit('close-load');
                    if (_self.httpPraram.page == 1) {
                        _self.todos.splice(0, _self.todos.length);
                    }
                    let result = suc.data.biz_result.list;
                    if (suc.data.code == '1c01') {
                        for (var i = 0; i < result.length; i++) {
                            _self.todos.push(result[i]);
                        }
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                    if (result.length < _self.httpPraram.pageSize) {
                        _self.allLoaded = true;
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
            getId(param) {
                let _self = this;
                _self.httpPraram.page = 1;
                _self.httpPraram[param.key] = param[param.key];
                _self.getHttp();
            },
            clearKeyword() {
                this.httpPraram.page = 1;
                this.httpPraram.keyword = '';
                this.getHttp();
            },
            jumpDetail(id) {
                common.$emit('resourceDetail', id);

                this.$router.push('resourceDetail/' + id);
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom(id) {
                let _self = this;
                setTimeout(() => {
                    if (this.todos.length < this.httpPraram.page * this.httpPraram.pageSize) {
                        this.allLoaded = true;
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
            jump(router) {
                this.$router.push(router);
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
            _self.headParam.keyword = common.pageParam.lowPrice.keyWord;
            _self.httpPraram.keyword = common.pageParam.lowPrice.keyWord;
            _self.getHttp();
            common.$on('lowPriceRes', function(item) {
                _self.headParam.keyword = item.keyWord;
                _self.httpPraram.keyword = item.keyWord;
                _self.httpPraram.page = 1;
                _self.getHttp();
            })
            common.$on('lowRes-sort', function(item) {
                _self.httpPraram.location = item;
                _self.sortArr[3].name = item[0];
                _self.sortArr[3].class = "sort_content_detail_select";
                _self.sortArr[3].url = "/static/icons/screen_selected.png";
                if (item.length > 1) {
                    _self.sortArr[3].name += '...';
                } else if (item.length == 0) {
                    _self.sortArr[3].name = '产地';
                    _self.sortArr[3].class = "sort_content_detail";
                    _self.sortArr[3].url = "/static/icons/screen.png";
                }
                _self.httpPraram.page = 1;
                _self.getHttp();
            });
            /*common.$on('listOflowPrice',function(item){
                _self.getHttp();
            })*/
            common.$on('getInfo',function(item){
               console.log('我有接受到')
                _self.getHttp();
               console.log('接受到之后')
            })
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 90;
            this.$refs.wrapper.addEventListener('scroll', this.handleScroll);
        }
}
</script>
<style scoped>
.page-loadmore-wrapper {
    margin-top: -1px;
    overflow: scroll;
    padding-bottom: 10px;
    width: 100%;
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
.low_price{
    overflow: hidden;
}
.low_price .title-name {
    position: absolute;
    left: 15%;
    width: 70%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    background: #EC6817;
    font-size: 1.7rem;
    line-height: 50px;
    color: white;
}

.low_price .go-back {
    position: absolute;
    width: 15%;
    padding-right: 5%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    background: #EC6817;
}

.low_price .go-back img {
    margin-top: 15px;
    height: 20px;
}

.low_price {
    background: #F5F5F5;
}

.low_price .bg_white {
    background: #F5F5F5;
    padding: 0 10px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem {
    float: left;
    width: 100%;
    height: 9.6rem;
    margin-top: 10px;
    background: white;
    border-radius: 3px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_images {
    height: 8.1rem;
    width: 25%;
    left: 10px;
    margin: 10px 10px 10px 0;
    position: absolute;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list li div {
    float: left;
    text-align: left;
    line-height: 20px;
    font-size: 1.3rem;
    margin-bottom: 8px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center img {
    float: left;
    width: 1.2rem;
    margin-right: 4px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center>div {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 40%;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center .over_lenght {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center p {
    float: left;
    width: 100%;
    padding-right: 90px;
    line-height: 1.2rem;
    text-align: left;
    font-size: 1.2rem;
    color: #666;
    margin-top: 0.8rem;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center .spec {
    margin-top: 0.3rem;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content {
    width: 100%;
    padding-left: 30%;
    padding-top: 10px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right {
    position: absolute;
    max-width: 100px;
    height: 8.1rem;
    margin: 0;
    right: 10px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right p {
    font-size: 1.25rem;
    margin-top: 0px;
    margin-right: 2px;
    color: #EC6817;
    text-align: right;
    white-space: nowrap;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right button {
    position: absolute;
    bottom: 0px;
    background: #EC6817;
    font-size: 1.109rem;
    width: 5.97rem;
    right: 0px;
    height: 2.38rem;
    padding: 0 5px;
}

.low_price .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .time_font {
    font-size: 1rem;
    color: #999;
}
</style>
