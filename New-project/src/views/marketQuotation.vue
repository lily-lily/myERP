<template>
    <div class="market_quotation">
        <myHeader :param="param"></myHeader>
        <div class="search" @click="jump">
            <longSearch :keyword="httpPraram.keyword" v-on:clearSearch="clearKeyword" :param="myShow"></longSearch>
        </div>
        <div class="good_list">
            <div class="good_list_content">
                <div class="list_content_header">
                    <p>品名</p>
                    <p>规格</p>
                    <p>产地</p>
                    <p>价格</p>
                    <!-- <p>跌涨(元)</p> -->
                    <input type="button" value="跌涨(元)" v-show = "!percent" @click="change">
                    <input type="button" value="幅度(%)" v-show = "percent" @click="change">
                </div>
            </div>
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="todos.length!=0">
                <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="first_ul">
                        <li v-for="(todo,index) in todos" class="first_li">
                            <div class="second_level" v-on:click="firstLevel(index,todos)">
                                <p>{{todo.name}}</p>
                                <p>{{todo.spec}}</p>
                                <p>{{todo.area}}</p>
                                <p>{{todo.unitprice}}元</p>
                                <p class="last_one"><span v-show = "!percent">{{todo.weekdowns | floatType}}</span>
                                   <span v-show = "percent">{{todo.percent | percentType}}%</span>&nbsp;
                                    <img src="/static/images/up.png" v-show="todo.weekdowns > 0">
                                    <img src="/static/images/down.png" v-show="todo.weekdowns < 0">
                                </p>
                                <img src="/static/icons/to-down.png" class="to_down">
                            </div>
                            <ul class="second_level_content" v-show="todo.show">
                                <li v-for="item in todo.list">
                                    <p>{{item.name}}</p>
                                    <p>{{item.spec}}</p>
                                    <p>{{item.area}}</p>
                                    <p>{{item.unitprice}}元</p>
                                    <p class="last_one"><span v-show = "!percent">{{item.weekdowns | floatType}}</span>
                                       <span v-show = "percent">{{item.percent | percentType}}%</span>&nbsp;
                                        <img src="/static/images/up.png" v-show="item.weekdowns > 0">
                                        <img src="/static/images/down.png" v-show="item.weekdowns < 0">
                                    </p>
                                    <img src="/static/icons/to-down.png" class="to_down">
                                </li>
                            </ul>
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
import longSearch from '../components/tools/longSearch'
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
import httpService from '../common/httpService.js'
import errPage from '../components/tools/err'
import filters from '../filters/filters'
export default {
    data() {
            return {
                percent:true,
                err: {
                    err: "很抱歉，没有找到相关资源",
                    url: '/static/icons/maomao.png'
                },
                myShow: {
                    myShow: false
                },
                param: {
                    name: '市场行情'
                },
                wrapperHeight: 0,
                onOrOff: false,
                todos: [],
                todos_li: {},
                topStatus: '',
                wrapperHeight: 0,
                ttwrapperHeight: 0,
                allLoaded: false,
                bottomStatus: '',
                show: false,
                httpPraram: {
                    page: 1,
                    pageSize: 10,
                    keyword: ''
                }
            }
        },
        components: {
            myHeader,
            longSearch,
            errPage
        },
        methods: {
            getHttp(back) {
                let _self = this;
                if (_self.httpPraram.page == 1) common.$emit('show-load');
                httpService.marketQuotation(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'breedService',
                    biz_method: 'queryBreedPrice',
                    biz_param: {
                        name: _self.httpPraram.keyword,
                        pn: _self.httpPraram.page,
                        pSize: _self.httpPraram.pageSize,
                    }
                }, function(suc) {
                    common.$emit('close-load');
                    let data = suc.data.biz_result.list;
                    console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        let item = data[i];
                        item.show = false;
                        item.percent = Number(item.weekdowns / item.unitprice);
                        for (var j = 0; j < item.list.length; j++){
                            item.list[j].percent = Number(item.list[j].weekdowns / item.list[j].unitprice);
                        }
                        _self.todos.push(item);
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
            change(){
                   this.percent = !this.percent;
            },
            firstLevel(index, todos) {
                this.todos[index].show = !this.todos[index].show;
            },
            clearKeyword() {
                let _self = this;
                this.httpPraram.page = 1;
                this.todos.splice(0, _self.todos.length);
                this.httpPraram.keyword = '';
                this.getHttp();
            },
            jump() {
                common.searchType = 'breed';
                common.$emit("setParam", "router", 'marketQuotation');
                this.$router.push("search");
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
                    _self.todos.splice(0, _self.todos.length);
                    _self.getHttp(function() {
                        _self.$refs.loadmore.onTopLoaded(id);
                    });
                }, 1500);
            }
        },
        created() {
            let _self = this;
            _self.getHttp();
            common.$on('marketQuotation', function(item) {
                if (item.breedName) {
                    _self.httpPraram.keyword = item.breedName;
                } else {
                    _self.httpPraram.keyword = item.keyWord;
                }
                _self.httpPraram.page = 1;
                _self.todos.splice(0, _self.todos.length);
                _self.getHttp();
            })
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 160;
        }
}
</script>
<style scoped>
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

.market_quotation {}

.market_quotation .first_li {
    position: relative;
}

.market_quotation .first_li .to_down {
    width: 1rem;
    position: absolute;
    margin-left: -0.5rem;
    left: 50%;
    bottom: 3px;
}

.market_quotation .first_li .to_up {
    width: 1rem;
    position: absolute;
    margin-left: -0.5rem;
    left: 50%;
    bottom: 3px;
}

.market_quotation .search .long_search .search_div .search_content {
    background-color: #fff;
}

.market_quotation .mint-header {
    background-color: white;
    color: #313232;
}

.market_quotation .search {
    height: 60px;
    background: #F2F2F2;
    position: relative;
}

.market_quotation .search input {
    width: 80%;
    height: 30px;
    border-radius: 1.28rem;
    border: 0;
    outline: none;
    padding-left: 25%;
    background: #fff;
    border: 1px solid #ddd;
    margin-top: 15px;
    text-align: left;
}

.market_quotation .search .search_image {
    max-width: 24px;
    width: 18px;
    height: 18px;
    position: absolute;
    left: 25%;
    top: 21px;
}

.market_quotation .good_list {
    width: 100%;
    position: relative;
    padding: 0;
    background: white;
}

.market_quotation .good_list .good_list_header {
    width: 100%;
    margin: 1.7066rem auto;
    font-size: 1.10929rem;
    color: #FA6705;
}

.market_quotation .good_list .good_list_content {
    width: 100%;
    background: white;
}

.market_quotation .good_list .good_list_content .first_ul {
    border-bottom: 1px solid #CCCCCC;
}

.market_quotation .list_content_header {
    word-break: break-all;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    height: 50px;
    line-height: 50px;
}

.market_quotation .list_content_header p {
    flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    font-size: 1.11rem;
}

.market_quotation .list_content_header input {
    margin-right: 0.8rem;
    outline: none;
    border: 0;
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    background: #FA6705;
    color: white;
    border-radius: 4px;
    margin-top: 10px;
    flex:0.7;
    -webkit-box-flex: 0.7;
    -webkit-flex: 0.7;
    -ms-flex: 0.7;
}

.market_quotation .second_level {
    width: 100%;
    word-break: break-all;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    height: 4.267rem;
    border-top: 1px solid #CCCCCC;
    padding-right: 0.8rem;
    position: relative;
}

.market_quotation .second_level p {
    flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    font-size: 1.02396rem;
    color: #666666;
    line-height: 4.267rem;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.market_quotation .second_level .last_one{
    flex: 0.7;
    -webkit-box-flex: 0.7;
    -webkit-flex: 0.7;
    -ms-flex: 0.7;
}
.market_quotation .second_level_content {
    border-top: 1px solid #DFDFDF;
    background: #fff;
}

.market_quotation .second_level_content li {
    font-size: 1.024rem;
    color: #666666;
    line-height: 4.267rem;
    display: flex;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    background: #F2F2F2;
    border-bottom: 1px solid white;
}

.market_quotation .second_level_content li p {
    flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    -ms-flex: 1;
    font-size: 1.024rem;
    color: #666666;
    line-height: 4.267rem;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.market_quotation .second_level_content li .last_one{
    flex: 0.8;
    -webkit-box-flex: 0.8;
    -webkit-flex: 0.8;
    -ms-flex: 0.8;
}
.market_quotation .second_level_content li p img {
    height: 1.024rem;
}
.market_quotation .second_level p img{
    height: 1.024rem;

}
</style>
