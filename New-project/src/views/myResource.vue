<template>
    <div class="my_resource">
        <div>
             <myHeader :param="param"></myHeader>
             <myPurchaseSort v-on:postId="getId" :sort="sortRouter" :paramArr="sortArr"></myPurchaseSort>
        </div>
       
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="todos.length!=0">
                <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list">
                        <li v-for="(todo,index) in todos" class="page-loadmore-listitem list_content_item" v-on:click.stop="jumpDetail(todo.id)">
                            <div class="list_header">
                                <div>
                                    <p class="time_font">发布时间：<span>{{todo.pubdate | timeFormat}}</span></p>
                                    <p class="audit_state">{{todo.onSell | shellStatus}}</p>
                                </div>
                            </div>
                            <img v-bind:src="todo.image[0]" class="list_images">
                            <div class="res_content">
                                <div class="res_content_center">
                                    <div>
                                        <img src="/static/images/bao.png" v-if="todo.especial == 1 && todo.type == 1">
                                        <img src="/static/icons/sample.png" v-if="todo.sampling == 1 && todo.type == 1"> {{todo.breedName}}
                                    </div>
                                    <p>规格：<span>{{todo.spec}}</span></p>
                                    <p>产地：<span>{{todo.location}}</span></p>
                                    <!-- <p class="time_font">发布时间：<span>{{todo.time}}</span></p> -->
                                </div>
                                <div class="res_content_right">
                                    <p>{{todo.number}}<span>{{todo.unit}}</span></p>
                                    <div class="button_box">
                                        <button class="mint-button mint-button--primary mint-button--small" v-on:click.stop="jump(todo.id,index)">编辑</button>
                                        <button class="mint-button mint-button--primary mint-button--small" v-on:click.stop="delet(todo.id)">删除</button>
                                    </div>
                                    
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
import searchInput from '../components/tools/inputSearch'
import myHeader from '../components/tools/myHeader'
import myPurchaseSort from '../components/tools/myPurchaseSort'
import validation from '../validation/validation.js'
import httpService from '../common/httpService.js'
import filters from '../filters/filters'
import errPage from '../components/tools/err'
export default {
    data() {
            return {
                scrollTop: 0,
                err: {
                    err: "很抱歉，没有找到相关资源",
                    url: '/static/icons/maomao.png',

                },
                sortRouter: 'home',
                param: {
                    name: '我的资源',
                    router: "home"
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
                    name: '剩余时间',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '剩余时间',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '由短到长',
                        asc: 'low',
                        show: false,
                        duedate: 2,
                        key: 'duedate'
                    }, {
                        name: '由长到短',
                        asc: 'top',
                        show: false,
                        duedate: 1,
                        key: 'duedate'
                    }, {
                        name: '全部',
                        asc: '',
                        show: false,
                        duedate: '',
                        key: 'duedate'
                    }]
                }, {
                    name: '可否供样',
                    asc: 'top',
                    url: '/static/icons/drop_down.png',
                    saveName: '可否样品',
                    class: 'sort_content_detail',
                    sortArr: [{
                        name: '可供样',
                        asc: 'low',
                        show: false,
                        sample: 1,
                        key: 'sample'
                    }, {
                        name: '不可供样',
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
                        testing: '',
                        key: 'testing'
                    }]
                }],
                todos: [],
                obj: {},
                index: '',
                topStatus: '',
                wrapperHeight: '',
                allLoaded: false,
                bottomStatus: '',
                httpPraram: {
                    pubdate: 0,
                    duedate: 0,
                    sample: '',
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
                    biz_method: 'mySupplyIntentionList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        sort: {
                            "pubdate": _self.httpPraram.pubdate,
                            "duedate": _self.httpPraram.duedate
                        },
                        onSell: _self.httpPraram.testing,
                        sampling: _self.httpPraram.sample,
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
                    if (suc.data.code == '1c01') {
                        if (result.length < _self.httpPraram.pageSize) {
                            _self.allLoaded = true;
                        }
                        for (var i = 0; i < result.length; i++) {
                            _self.todos.push(result[i]);
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
            getId(param) {
                let _self = this;
                _self.httpPraram.page = 1;
                _self.httpPraram[param.key] = param[param.key];
                _self.getHttp();
            },
            jumpDetail(id) {
                common.$emit("inform-goodDetail", id);
                this.$router.push("goodDetail/" + id);
            },
            jump: function(id, index) {
                this.index = index;
                common.$emit("res-id", id);
                common.$emit('setParam', 'resourceId', id);
                this.$router.push('reviseResource/' + id);
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
            jumpBack(router) {
                this.$router.push(router)
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
            this.getHttp();
            common.$on('reviseResource', function(obj) {
                    _self.httpPraram.page = 1;
                    _self.getHttp();
                })
                //发布成功通知刷新
            common.$on("informMyRes", function(id) {
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

.low_price {}

.my_resource .title {
    font-size: 1.7rem;
}
.my_resource .bg_white{
    background: #F5F5F5;
}
.my_resource .bg_white .page-loadmore-wrapper .mint-loadmore {
    background: #F5F5F5;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem {
    float: left;
    min-height: 12rem;
    border: 0;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li {
    background: white;
    margin: 1rem 1rem 0 1rem;
    border-radius: 4px;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_images {
    height: 6.5rem;
    width: 19.375%;
    left: 10px;
    margin: 4.55rem 10px 0px 0.85rem;
    position: absolute;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header {
    width: 100%;
    /*height: 2.8rem;*/
    border-bottom: 1px solid #C6C6C5;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header>div {
    padding: 0;
    width: 100%;
    height: 100%;
    padding: 1rem 0.85rem;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header .time_font {
    font-size: 1rem;
    color: #9C9C9C;
    float: left;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_header .audit_state {
    font-size: 1rem;
    color: #FA6705;
    float: right;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li div {
    float: left;
    text-align: left;
    line-height: 20px;
    font-size: 1.3rem;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center img {
    float: left;
    /*max-height: 1.6rem;*/
    width: 1.5rem;
    margin-right: 0.5rem;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center div {
    font-size: 1.4rem;
    margin-bottom: 1rem;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center p {
    float: left;
    width: 100%;
    padding-right: 90px;
    line-height: 18px;
    text-align: left;
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content {
    width: 100%;
    padding-left: 27%;
    padding-top: 10px;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right {
    position: absolute;
    max-width: 80px;
    min-height: 6.5rem;
    margin: 0;
    right: 1.85rem;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right p {
    font-size: 1.4rem;
    margin-top: 0px;
    color: #EC6817;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right p span {
    font-size: 1rem;
}

.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right .button_box {
    position: absolute;
    float: right;
    bottom: 0px;
    font-size: 10px;
    min-width: 150px;
    right: 0px;   
    z-index: 100000;
    font-size: 1.1rem;
}
.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right .button_box button{
    float:right;
    margin-left: 5px;
    max-height: 3rem;
    padding: 0 5px;
    color: black;
    border: 1px solid #BDBDBD;
    border-radius: 5px;
    background: white;
}
.my_resource .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .time_font {
    font-size: 1.1rem;
    color: #999;
}
</style>
