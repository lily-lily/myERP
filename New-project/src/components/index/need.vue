<template>
    <div class="need">
        <div class="fixed">
            <div @click="jumpSearch" class="search_content">
                <longSearch :keyword="httpPraram.keyword" v-on:clearSearch="clearKeyword" :param="myShow"></longSearch>
            </div>
            <sort v-on:postId="getId" :sortRouter="sortRouter" :paramArr="sortArr"></sort>
        </div>
        <div class="bg_white" style="margin-top:100px">
               <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                <ul class="page-loadmore-list">
                    <li v-for="todo in todos" class="page-loadmore-listitem list_content_item" @click="jumpDetail(todo.id)">
                        <div class="center">
                            <img :src="todo.cFlagsPath" class="flag">
                            <div class="title">
                                <div>
                                    <img src="/static/icons/impatient.png" v-if="todo.especial == 1 && todo.type == 0">
                                    <img src="/static/icons/sample.png" v-if="todo.sampling == 1 && todo.type == 0">
                                    <span>{{todo.breedName}}</span>
                                </div>
                                <p>发布时间：{{todo.pubdate | timeFormat}}</p>
                            </div>
                            <div class="detail">
                                <div>
                                    <p>规格</p>
                                    <p>产地</p>
                                    <p>剩余</p>
                                    <p>需求数量</p>
                                </div>
                                <div class="last">
                                    <p>{{todo.spec}}</p>
                                    <p>{{todo.location}}</p>
                                    <p>{{todo.duedate | timeDays(todo.pubdate)}}<span>天</span></p>
                                    <p>{{todo.number}}<span>{{todo.unit}}</span></p>
                                </div>
                            </div>
                        </div>
                        <div class="bottom">
                            <p>已报价<span>{{todo.offer}}</span>人</p>
                            <button class="mint-button mint-button--primary mint-button--small" v-on:click.stop="jump()" v-show="todo.isMy == 0">我要报价</button>
                            <button class="mint-button mint-button--primary mint-button--small" v-show="todo.isMy == 1">查看详情</button>
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
import common from '../../common/common.js'
import longSearch from '../../components/tools/longSearch'
import sort from '../../components/tools/sort'
import errPage from '../../components/tools/err'
import httpService from '../../common/httpService.js'
import filters from '../../filters/filters'
export default {
    data() {
            return {
                scrollTop:0,
                err: {
                    err: "很抱歉，没有找到相关资源",
                    url: '/static/icons/maomao.png',
                    next_step: '去发布',
                    router: '/needRelease'
                },
                myShow: {
                    myShow: false
                },
                sortRouter: 'need',
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
                    name: '报价人数',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '报价人数',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '由少到多',
                        asc: 'low',
                        show: false,
                        offer: 1,
                        key: 'offer'
                    }, {
                        name: '由多到少',
                        asc: 'top',
                        show: false,
                        offer: 2,
                        key: 'offer'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        offer: 0,
                        key: 'offer'
                    }]
                }, {
                    name: '剩余时间',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '剩余时间',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '由短到长',
                        asc: 'low',
                        show: false,
                        duedate: 1,
                        key: 'duedate'
                    }, {
                        name: '由长到短',
                        asc: 'top',
                        show: false,
                        duedate: 2,
                        key: 'duedate'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        duedate: 0,
                        key: 'duedate'
                    }]
                }, {
                    name: '产地',
                    asc: 'location',
                    url: '/static/icons/screen.png',
                    class: 'sort_content_detail',
                }],
                todos: [],
                topStatus: '',
                wrapperHeight: 0,
                allLoaded: false,
                bottomStatus: '',
                httpPraram: {
                    time: 0,
                    offer: 0,
                    duedate: 0,
                    location: [],
                    keyword: '',
                    page: 1,
                    pageSize: 10
                }

            }
        },
        components: {
            longSearch,
            sort,
            errPage
        },
        methods: {
            getHttp(back) {
                let _self = this;
                if(_self.httpPraram.page==1)common.$emit('show-load');
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'queryBegBuyList',
                    biz_param: {
                        keyWord: _self.httpPraram.keyword,
                        sort: {
                            "shelve_time": _self.httpPraram.time,
                            "offer": _self.httpPraram.offer,
                            "duedate": _self.httpPraram.duedate
                        },
                        location: _self.httpPraram.location,
                        pn: _self.httpPraram.page,
                        pSize: _self.httpPraram.pageSize
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
                let _self = this;
                this.httpPraram.page = 1;
                this.httpPraram.keyword = '';
                this.getHttp();
            },
            jumpSearch() {
                common.searchType='keyword';
                common.$emit('setParam', 'router', 'need')
                this.$router.push('search');
            },
            jumpDetail(id) {
                common.$emit('needToDetail', id);
                this.$router.push('needDetail/' + id);
            },
            jump() {
                function loadApp() {
                    window.location.href = common.appUrl;
                }
                common.$emit('confirm', {
                    message: '要报价请下载App',
                    title: '提示',
                    ensure: loadApp
                });
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
            _self.getHttp();
            common.$on('need', function(item) {
                console.log(item);
                _self.httpPraram.keyword = item.keyWord;
                _self.httpPraram.page = 1;
                _self.getHttp();
            });
            common.$on('need-sort', function(item) {
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
            common.$on('getInfo',function(item){
               _self.getHttp();
            })
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 165;
             this.$refs.wrapper.addEventListener('scroll', this.handleScroll);
        }
}
</script>
<style scoped>
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

.need {}

.need .fixed {
    top: 0;
}

.need .fixed .search_content {
    float: left;
    width: 100%;
    background: #EC6817;
}

.need .go-back {
    position: absolute;
    width: 15%;
    padding-right: 5%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    background: #EC6817;
}

.need .bg_white {
    background: #fff;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list {
    padding: 0 10px;
    float: left;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem {
    float: left;
    width: 100%;
    min-height: 100px;
    padding: 0;
    height: auto;
    background: white;
    margin-top: 10px;
    border-radius: 3px;
    box-shadow: 0px 0px 20px #F5F5F5;
}

.need .fixed {
    position: fixed;
    width: 100%;
    z-index: 2;
    background: #fff;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .flag {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 1.7rem;
    height: 1.23rem;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .bottom {
    float: left;
    width: 100%;
    padding: 0 10px;
    height: 4.18rem;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .bottom p {
    line-height: 4.18rem;
    float: left;
    font-size: 1.2rem;
    color: #666;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .bottom span {
    color: #EC6817;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .bottom button {
    float: right;
    background: #EC6817;
    font-size: 1.2rem;
    width: 5.97rem;
    height: 2.389rem;
    padding: 0 5px;
    border: none;
    color: #fff;
    line-height: 0;
    margin-top: 0.8955rem;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center {
    float: left;
    width: 100%;
    border-bottom: 1px solid #ddd;
    position: relative;
    padding: 0 10px 1.066rem 10px;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center div {
    float: left;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .title {
    width: 100%;
    font-size: 1.365rem;
    color: #333;
    line-height: 1.365rem;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .title p {
    float: right;
    font-size: 1rem;
    color: #999;
    margin: 1.2rem 2.559rem 0 0;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .title img {
    width: 1.2rem;
    margin-right: 5px;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .title>div {
    margin-top: 1.06rem;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .detail {
    width: 100%;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .detail div {
    flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    margin-top: 1.279rem;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .detail .last p {
    color: #666666;
}

.need .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .center .detail div p {
    flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    font-size: 1.109rem;
    color: #424242;
}
</style>
