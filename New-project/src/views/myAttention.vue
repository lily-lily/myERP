<template>
    <div class="my_attention">
        <div class="fixed_box">
            <attentionHead :param="param" v-on:tab="tabAttention"></attentionHead>
            <div @click="jumpSearch" class="fixed">
                <longSearch :keyword="httpPraram.keyword" v-on:clearSearch="clearKeyword" :param="myShow"></longSearch>
            </div>
        </div>
       
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="todos.length!=0">
                <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list" v-show="param.show">
                        <li v-for="todo in todos" class="page-loadmore-listitem list_content_item" v-on:click="jump(todo.id)">
                            <img v-bind:src="todo.image[0]" class="list_images">
                            <div class="res_content">
                                <div class="res_content_center">
                                    <div>
                                        <img src="/static/images/bao.png" v-if="todo.especial == 1 && todo.type == 1">
                                        <img src="/static/icons/sample.png" v-if="todo.sampling == 1 && todo.type == 1"> {{todo.breedName}}
                                    </div>
                                    <p class="spec over_lenght">规格：<span>{{todo.spec}}</span></p>
                                    <p class="over_lenght">产地：<span>{{todo.location}}</span></p>
                                    <p class="time_font">发布时间：<span>{{todo.pubdate | timeFormat}}</span></p>
                                </div>
                                <div class="res_content_right">
                                    <p>{{todo.price}}元/<span>{{todo.unit}}</span></p>
                                    <button class="mint-button mint-button--primary mint-button--small">立即购买</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <ul class="page-loadmore-list_second" v-show="!param.show">
                        <li v-for="todo in todos" class="page-loadmore-listitem list_content_item" v-on:click="jumpNeed(todo.id)">
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
                                <button class="mint-button mint-button--primary mint-button--small">我要报价</button>
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
import longSearch from '../components/tools/longSearch'
import attentionHead from '../components/tools/attentionHead'
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
                myShow: {
                    myShow: true
                },
                param: {
                    name: '资源关注',
                    other_name: '求购关注',
                    show: true,
                    router: "home"
                },
                show: true,
                selected: "1",
                resourceArr: [],
                needArr: [],
                keyword: '',
                todos: [],
                topStatus: '',
                wrapperHeight: 0,
                ttwrapperHeight: 0,
                allLoaded: false,
                bottomStatus: '',
                httpPraram: {
                    keyword: '',
                    intentionType: 1,
                    page: 1,
                    pageSize: 10
                }
            }
        },
        components: {
            longSearch,
            attentionHead,
            errPage
        },
        methods: {
            jumpSearch() {
                common.$emit('setParam', 'router', 'myAttention')
                this.$router.push('search');
            },
            jump(id) {
                common.$emit('resourceDetail', id);
                common.$emit('formPopUpBack', id);
                this.$router.push('resourceDetail/' + id);
            },
            jumpNeed(id) {
                common.$emit("needToDetail", id);
                this.$router.push('needDetail/' + id);
            },
            resorceHttp(back) {
                let _self = this;

                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'attentionIntentionList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        breedName: _self.httpPraram.keyword,
                        pn: _self.httpPraram.page,
                        pSize: _self.httpPraram.pageSize,
                        intentionType: _self.httpPraram.intentionType
                    }
                };

                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.myAttention(url, body, function(suc) {
                    common.$emit('close-load');
                    if (_self.httpPraram.page == 1) {
                        _self.todos.splice(0, _self.todos.length);
                    }
                    let result = suc.data.biz_result.list;
                    console.log(result);
                    for (let i = 0; i < result.length; i++) {
                        _self.todos.push(result[i]);
                    }
                    // common.$emit('translateDate', result,_self.todos);
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
            clearKeyword() {
                let _self = this;
                this.httpPraram.page = 1;

                this.httpPraram.keyword = '';
                this.resorceHttp();
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
                        this.resorceHttp(function() {
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
                    _self.resorceHttp(function() {
                        _self.$refs.loadmore.onTopLoaded(id);
                    });

                }, 1500);
            },
            tabAttention(param) {
                let _self = this;
                console.log(param)
                if (param == true) {
                    _self.httpPraram.intentionType = 1;
                    _self.resorceHttp();
                } else if (param == false) {
                    _self.httpPraram.intentionType = 0;
                    _self.resorceHttp();
                }
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
            _self.resorceHttp();
            common.$on("informResAttention", function(id) {
                _self.httpPraram.page = 1;
                _self.resorceHttp();
            });
            common.$on('attention', function(item) { 
                _self.httpPraram.keyword = item.keyWord;
                _self.httpPraram.page = 1;
                _self.resorceHttp();
            });
        },

        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 100;
            this.$refs.wrapper.addEventListener('scroll', this.handleScroll);
        }

}
</script>
<style scoped>
.page-loadmore-listitem {
    height: 50px;
    border-bottom: solid 1px #eee;
    text-align: center;
    &:first-child {
        border-top: solid 1px #eee;
    }
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

.my_attention .bg_white {
    background: #F5F5F5;
    padding: 0 10px;

}
.my_attention .fixed{  
    margin-top: 50px;
    float:left;
    width:100%;
}
.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list {
    margin-top: -10px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list .page-loadmore-listitem {
    float: left;
    width: 100%;
    height: 9.55rem;
    margin-top: 10px;
    background: white;
    border-radius: 3px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list li .list_images {
    height: 8.1rem;
    width: 25%;
    left: 10px;
    margin: 10px 10px 10px 0;
    position: absolute;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list li div {
    float: left;
    text-align: left;
    line-height: 20px;
    font-size: 1.3rem;
    margin-bottom: 8px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center img {
    float: left;
    width: 1.2rem;
    margin-right: 4px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center>div {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 40%;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center .over_lenght {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 250px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center p {
    float: left;
    width: 100%;
    padding-right: 90px;
    line-height: 18px;
    text-align: left;
    font-size: 1.2rem;
    color: #666;
    margin-top: 0.5rem;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list li .res_content_center .spec {
    margin-top: 0.3rem;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content {
    width: 100%;
    padding-left: 30%;
    padding-top: 10px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right {
    position: absolute;
    max-width: 100px;
    height: 95px;
    margin: 0;
    right: 10px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right p {
    font-size: 1.25rem;
    margin-top: 0px;
    color: #EC6817;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .res_content_right button {
    position: absolute;
    bottom: 0px;
    background: #EC6817;
    font-size: 1.109rem;
    width: 5.97rem;
    right: 0px;
    height: 2.38rem;
    padding: 0 5px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list .res_content .time_font {
    font-size: 1rem;
    color: #999;
}

.urgent_need {}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second {
    margin-top: -10px;
    position: relative;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem {
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

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .bottom {
    float: left;
    width: 100%;
    padding: 0 10px;
    height: 4.18rem;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .bottom p {
    line-height: 4.18rem;
    float: left;
    font-size: 1.2rem;
    color: #666;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .bottom span {
    color: #EC6817;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .bottom button {
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

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center {
    float: left;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding: 0 10px 1.066rem 10px;
    position: relative;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem {
    position:
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .flag {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 1.7rem;
    height: 1.23rem;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center div {
    float: left;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .title {
    width: 100%;
    font-size: 1.365rem;
    color: #333;
    line-height: 1.365rem;
    /*margin: 10px 0;*/
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .title>div {
    margin-top: 1.06rem;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .title p {
    float: right;
    font-size: 1rem;
    color: #999;
    margin: 1.2rem 2.559rem 0 0;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .title img {
    width: 1.2rem;
    margin-right: 5px;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .detail {
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

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .detail div {
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

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .detail .last p {
    color: #666666;
}

.my_attention .bg_white .page-loadmore-wrapper .page-loadmore-list_second .page-loadmore-listitem .center .detail div p {
    flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    font-size: 1.109rem;
    color: #424242;
}
</style>
