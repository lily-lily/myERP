<template>
    <div class="transaction">
        <myHeader :param = "param" ></myHeader>
        <div class="bg_white">
            <div class="list_head">
                <div class="list_font">品种</div>
                <div class="list_font">规格</div>
                <div class="list_font">数量</div>
                <div class="list_font">产地</div>
                <div class="list_font">成交时间</div>
            </div>
           
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                 <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
                    <ul class="page-loadmore-list">
                        <li v-for="todo in todos" class="page-loadmore-listitem list_content_item">
                            <div class="list_font">{{todo.breedName}}</div>
                            <div class="list_font">{{todo.breedSpec}}</div>
                            <div class="list_font">{{todo.number}}{{todo.unit}}</div>
                            <div class="list_font">{{todo.location}}</div>
                            <div class="list_font">{{todo.successTime | successTimeFormat}}</div>
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
    </div>
</template>
<script>
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
import httpService from '../common/httpService.js'
import filters from '../filters/filters'
export default {
    data() {
            return {
                param:{
                    name:'实时成交'
                },
                todos: [],
                topStatus: '',
                wrapperHeight: 0,
                allLoaded: false,
                bottomStatus: '',
                httpPraram: {
                    page: 1,
                    pageSize: 10
                },
            }
        },
        methods: {
            getHttp(back){
                let _self = this;
                 if(_self.httpPraram.page==1)common.$emit('show-load');
                 httpService.realTimeTurnover(common.urlCommon + common.apiUrl.most, {
                        biz_module:'tradeNewService',
                        biz_method:'currentTradeList',
                            biz_param: {
                                pn:_self.httpPraram.page,
                                pSize:_self.httpPraram.pageSize
                            }
                        }, function(suc) {
                            common.$emit('close-load');
                            if(suc.data.code == '1c01'){
                                let result = suc.data.biz_result.list;
                                for(var i = 0; i < result.length; i++){
                                    _self.todos.push(result[i]);
                                }
                            }else{
                                common.$emit('message', suc.data.msg);
                            }
                            if(back){
                                        back();
                                    }
                        }, function(err) {
                            common.$emit('close-load');
                            common.$emit('message', err.data.msg);
                            if(back){
                                        back();
                                    }
                        })
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
        components: {
                myHeader
            },
        created() {
            let _self = this;
            
            _self.getHttp();

        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
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

.transaction {}

.transaction_title {
    text-align: center;
    color: #FA6705;
    font-size: 1.1rem;
    height: 60px;
    line-height: 60px;
}

.transaction .bg_white .list_head {
    border-bottom: 1px solid #ddd;
    min-height: 40px;
    line-height: 40px;
    font-size: 1.3rem;
    color: #333;
    font-weight: 400;
}

.transaction .bg_white .list_head .list_font {
    width: 20%;
    float: left;
}

.transaction .bg_white  .list_font {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex:1;
    -webkit-box-flex:1;
    -webkit-flex:1;
    -ms-flex:1;
}

.transaction .bg_white  .list_content_item {
    font-size: 1.1rem;
    color: #666;
    display:flex;
    display:-webkit-box;
    display:-webkit-flex;
    display:-ms-flexbox;
    flex-direction:row;
    -webkit-box-orient: horizontal;
    -webkit-flex-direction:row;
    -ms-flex-direction: row;
}
</style>
