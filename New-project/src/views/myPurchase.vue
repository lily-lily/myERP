<template>
    <div class="content my_purchase">
        <div>
            <myHeader :param="param"></myHeader>
            <myPurchaseSort v-on:postId="getId" :sort="sortRouter" :paramArr="sortArr"></myPurchaseSort>
        </div>
        
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="todos.length!=0">
                <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list">
                        <li v-for="todo in todos" class="page-loadmore-listitem list_content_item" @click="jump(router,todo.id)">
                            <div class="header_list">
                                <p class="left_p">发布日期：{{todo.pubdate | timeFormat}}</p>
                                <p class="right_p">{{todo.onSell | shellStatus}}</p>
                            </div>
                            <div class="first_line">
                                <p class="left">{{todo.breedName}}</p>
                                <p class="right"><span>{{todo.offer}}</span>人已报价</p>
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
                                    <p>{{todo.duedate | timeDays(todo.pubdate)}}<span v-if="disTime(todo.duedate)">天</span></p>
                                    <p>{{todo.number}}<span>{{todo.unit}}</span></p>
                                </div>
                            </div>
                            <div class="button">
                                <p class="first_button" v-on:click.stop="delet(todo.id)">删除</p>
                                <p class="first_button" v-on:click.stop="jump(other_router,todo.id)">编辑</p>
                                <p class="second_button" v-on:click.stop="jumpApp()">查看报价</p>
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
import searchInput from '../components/tools/inputSearch'
import myHeader from '../components/tools/myHeader'
import myPurchaseSort from '../components/tools/myPurchaseSort'
import httpService from '../common/httpService.js'
import filters from '../filters/filters'
import errPage from '../components/tools/err'
export default {
    data() {
            return {
                scrollTop: 0,
                err: {
                    err: "很抱歉，没有找到相关资源",
                    url: '/static/icons/maomao.png'
                },
                sortRouter: 'home',
                param: {
                    name: '我的求购',
                    router: 'home'
                },
                sortArr: [{
                    name: '发布日期',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '发布日期',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '由新到旧',
                        asc: 'low',
                        show: false,
                        pubdate: 2,
                        key: 'pubdate'
                    }, {
                        name: '由旧到新',
                        asc: 'top',
                        show: false,
                        pubdate: 1,
                        key: 'pubdate'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        pubdate: 0,
                        key: 'pubdate'
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
                        duedate: 0,
                        key: 'duedate'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        duedate: '',
                        key: 'duedate'
                    }]
                }, {
                    name: '审核状态',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '审核状态',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '申请中',
                        asc: 'low',
                        show: false,
                        testing: 1,
                        key: 'testing'
                    }, {
                        name: '上架失败',
                        asc: 'low',
                        show: false,
                        testing: -2,
                        key: 'testing'
                    }, {
                        name: '下架',
                        asc: 'low',
                        show: false,
                        testing: 4,
                        key: 'testing'
                    }, {
                        name: '上架',
                        asc: 'top',
                        show: false,
                        testing: 2,
                        key: 'testing'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        testing: 0,
                        key: 'testing'
                    }]
                }],
                router: "purchaseDetail",
                other_router: "revisePurchase",
                todos: [],
                topStatus: '',
                wrapperHeight: 0,
                allLoaded: false,
                bottomStatus: '',
                httpPraram: {
                    pubdate: 0,
                    offer: 0,
                    duedate: 0,
                    testing: 0,
                    page: 1,
                    pageSize: 10
                }
            }
        },
        components: {
            searchInput,
            myPurchaseSort,
            myHeader,
            errPage
        },
        filters: (filters, {

        }),
        methods: {
            getHttp(back) {
                let _self = this;
                if (_self.httpPraram.page == 1) {
                    _self.allLoaded = false;
                }
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'myBegIntentionList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        sort: {
                            "offer": _self.httpPraram.offer,
                            "pubdate": _self.httpPraram.pubdate,
                            "duedate": _self.httpPraram.duedate
                        },
                        onSell: _self.httpPraram.testing,
                        pn: _self.httpPraram.page,
                        pSize: _self.httpPraram.pageSize
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.myResource(url, body, function(suc) {
                    common.$emit('close-load');

                    if (_self.httpPraram.page == 1) {
                        _self.todos.splice(0, _self.todos.length);
                    }
                    let result = suc.data.biz_result.list;
                    console.log(result);
                    if (suc.data.code == '1c01') {
                        for (var i = 0; i < result.length; i++) {
                            _self.todos.push(result[i]);
                        }
                        if (result.length < _self.httpPraram.pageSize) {
                            _self.allLoaded = true;
                        }
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                    if (back) {
                        back();
                    }
                }, function(err) {
                    common.$emit('close-load');
                    if (back) {
                        back();
                    }
                })
            },
            delet(id){
                let _self = this;
                function beforeDelet(){
                    common.$emit('show-load');
                    let url = common.addSID(common.urlCommon + common.apiUrl.most);
                    let body = {
                        biz_module: 'intentionService',
                        biz_method: 'deleteIntentionInfo',
                        version: 1,
                        time: 0,
                        sign: '',
                        biz_param: {
                            id:id
                        }
                    };
                    body.time = Date.parse(new Date()) + parseInt(common.difTime);
                    body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                    httpService.myResource(url, body, function(suc) {
                        common.$emit('close-load');
                        if(suc.data.code == '1c01'){
                            _self.getHttp();
                        }else{
                            common.$emit('message', suc.data.msg);
                        }
                        
                    }, function(err) {
                        common.$emit('close-load');
                        common.$emit('message', err.data.msg);
                    })
                }
                common.$emit("confirm", {
                            message: '确认删除？',
                            title: '提示',
                            ensure: beforeDelet
                });
            },
            getId(param) {
                let _self = this;
                _self.httpPraram.page = 1;
                _self.httpPraram[param.key] = param[param.key];
                _self.getHttp()
            },
            jump: function(router, id) {
                common.$emit("purchase-id", id);
                common.$emit("myPurToPurDetail", id);
                this.$router.push(router + '/' + id);
            },
            loadApp() {
                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yaocaimaimai.yaocaimaimai';
            },
            jumpApp() {
                common.$emit("confirm", {
                    message: '查看报价请下载App',
                    title: '提示',
                    ensure: this.loadApp
                });
            },
            handleBottomChange(status) {
                this.bottomStatus = status;
            },
            loadBottom(id) {
                let _self = this;
                setTimeout(() => {
                    if (_self.todos.length < _self.httpPraram.page * _self.httpPraram.pageSize) {
                        _self.allLoaded = true;
                    } else {
                        _self.httpPraram.page++;
                        _self.getHttp(function() {
                            _self.$refs.loadmore.onBottomLoaded(id);
                        });
                    }
                }, 1500);
            },
            disTime:function(duedate){
        		var now=new Date().getTime();
        		console.log(now);
        		var endDate=new Date(duedate).getTime();
        		console.log(endDate);
        		var dis=now-endDate;
        		console.log(dis);
        		if(dis<0){
        			return true;
        		}else{
        			return false;
        		}
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
            common.$on('informMyPurchase', function(item) {
                _self.httpPraram.page = 1;
                _self.getHttp();
            });
            common.$on("revisePurtoPur", function(item) {
                _self.httpPraram.page = 1;
                _self.getHttp();
            })
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 90;
            this.$refs.wrapper.addEventListener('scroll', this.handleScroll);
        }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-loadmore-listitem {
    height: 50px;
    /*line-height: 50px;*/
    border-bottom: solid 1px #eee;
    text-align: center;
    &:first-child {
        border-top: solid 1px #eee;
    }
}

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

.low_price {}

.my_purchase .bg_white {
    background: #F5F5F5;
}

.my_purchase .bg_white .page-loadmore-wrapper .mint-loadmore {
    background: #F5F5F5;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem {
    min-height: 15.8rem;
    border: 0;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li {
    background: white;
    margin: 1rem 1rem 0 1rem;
    border-radius: 4px;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .header_list {
    min-height: 3rem;
    text-align: left;
    border-bottom: 1px solid #E4E4E4;
    padding: 1rem 0.85rem;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .header_list .left_p {
    float: left;
    font-size: 1rem;
    color: #999999;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .header_list .right_p {
    float: right;
    font-size: 1rem;
    color: #FA6705;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .first_line {
    padding: 1rem 0.85rem;
    min-height: 3rem;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .first_line .left {
    float: left;
    text-align: left;
    font-size: 1.4rem;
    color: #333333;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .first_line .right {
    float: right;
    text-align: right;
    font-size: 1.2rem;
    color: #666666;
    margin-top: 0.2rem;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .first_line .right span {
    color: #FA6705;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .button {
    float: right;
    padding: 1rem 0;
    text-align: center;
    font-size: 1.1rem;
    margin-right: 0.85rem;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .button .first_button {
    width: 3.6rem;
    height: 2rem;
    line-height: 2rem;
    border: 1px solid #BFBFBF;
    border-radius: 3px;
    float: right;
    margin-left: 1rem;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list li .button .second_button {
    width: 5.5rem;
    height: 2rem;
    border: 1px solid #BFBFBF;
    line-height: 2rem;
    float: right;
    border-radius: 3px;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .detail {
    width: 100%;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 1rem;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .detail div {
    /*flex: 1;
    display: flex;
    flex-direction: row;
    margin-top: 1rem;
*/
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
    margin-top: 1rem;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .detail .last p {
    color: #666666;
}

.my_purchase .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem .detail div p {
    flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    font-size: 1.109rem;
    color: #424242;
}
</style>
