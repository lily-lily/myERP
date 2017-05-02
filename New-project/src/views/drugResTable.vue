<template>
    <div class="drug_table">
        <iosHead :param="param"></iosHead>
        <div class="search">
            <input type="text" placeholder="输入你想要的货物资源" v-model="keyword">
            <img src="/static/images/search.png" class="search_image">
        </div>
        <mt-loadmore>
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <div v-show="!keyword">
                    <div class="hot_drug">
                        <p>热门药材</p>
                    </div>
                    <div class="drug_show">
                        <a @click="jumpDetail(obj.name)">
                            <img :src="obj.icon">
                            <div class="drug_introduce">
                                <p class="drug_name" id="drug_name">{{obj.name}}</p>
                                <p class="drug_chinese_name" id="drug_chinese_name">英文名：{{obj.eName}}</p>
                                <p class="drug_english_name" id="drug_english_name">拉丁：{{obj.lName}}</p>
                            </div>
                        </a>
                    </div>
                    <div class="hot_search_drug">
                        <p>热搜药材</p>
                        <div class="hot_drugs">
                            <p v-for="(todo,index) in todos" @click="jumpDetail(todo.keyWord)">{{todo.keyWord}}</p>
                        </div>
                    </div>
                </div>
                <div v-show="keyword">
                    <div class="search_result">
                        <ul class="page-loadmore-list">
                            <li v-for="todo in datas" class="page-loadmore-listitem list_content_item" @click="jumpDetail(todo.breedName)">
                                <div>
                                    <img src="/static/icons/search.png">
                                    <p>{{todo.keyWord}}({{todo.breedName}})</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </mt-loadmore>
    </div>
</template>
<script>
import common from '../common/common.js'
import iosHead from '../components/tools/iosHead'
import httpService from '../common/httpService.js'
export default {
    data() {
            return {
                param: {
                    name: '药材百科',
                    router: 'home',
                    appBack: true,
                    type: 'my'
                },
                type: '',
                headHeight: '',
                keyword: '',
                showHead: true,
                todos: [],
                datas: [],
                title: 'test',
                obj: {},
                detail_obj: {},
            }
        },
        created() {
            let _self = this;
            _self.hotKeySearch();
            _self.hotDrug();
            let from = _self.$route.params.from;
            console.log(from);
            if (from == 'ios') {
                _self.param.type = 'ios';
                _self.param.appBack = true;
            } else if (from == 'android') {
                _self.param.type = 'android';
                _self.param.appBack = true;
            } else {
                _self.param.appBack = false;
            }
        },
        components: {
            iosHead
        },
        watch: {
            keyword: function(newValue, oldValue) {
                 let _self = this;
                if(!_self.keyword){
                    return;
                }
               
                window.clearTimeout(this.time);
                this.time = setTimeout(() => {
                    common.$emit('show-load');
                    httpService.searchWord(common.urlCommon + common.apiUrl.most, {
                        biz_module: 'searchKeywordService',
                        biz_method: 'querySearchKeywordBreed',
                        biz_param: {
                            keyWord: _self.keyword,
                            pn: 1,
                            pSize: 20
                        }
                    }, function(suc) {
                        common.$emit('close-load');
                        let result = suc.data.biz_result.list;
                        if (suc.data.code == '1c01') {
                            _self.datas = result;
                        } else {
                            common.$emit('message', suc.data.msg);
                        }
                    }, function(err) {
                        common.$emit('close-load');
                        common.$emit('message', err.data.msg);
                    })
                }, 0)
            }
        },
        methods: {
            hotDrug() {
                let _self = this;
                httpService.hotSearch(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'breedService',
                    biz_method: 'hotDrugPropertiesInfo',
                    biz_param: {
                        pn: 1,
                        pSize: 20
                    }
                }, function(suc) {
                    let result = suc.data.biz_result.list[0];
                    if (suc.data.code == '1c01') {
                        _self.obj = result;
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('message', err.data.msg);
                })
            },
            hotKeySearch() {
                let _self = this;
                httpService.hotSearch(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'searchKeywordService',
                    biz_method: 'queryHotKeyword',
                    biz_param: {
                        pn: 1,
                        pSize: 20
                    }
                }, function(suc) {
                    let result = suc.data.biz_result.list;
                    if (suc.data.code == '1c01') {
                        _self.todos = result;
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('message', err.data.msg);
                })
            },
            jumpIosSearch: function() {
                window.jumpSearch();
            },
            getValue: function(param) {
                this.title = param;
            },
            jumpBack: function() {
                window.back();
            },
            jumpDetail(id) {
                common.$emit("informdrugDetail", id); //通知药性表详情刷新
                this.$router.push('/drugResTableDetail/' + this.param.type + '/' + id);
            }
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
            let _self = this;
            setTimeout(function() {
                window.back = function() {
                    try {
                        if (_self.type == 'ios') {
                            window.webkit.messageHandlers.AppModel.postMessage({
                                body: 'iosResult'
                            });
                        } else {
                            window.Android.back();
                        }
                    } catch (e) {
                        window.history.go(-1);
                    }
                }
                window.jumpSearch = function() {
                    try {
                        if (_self.type == 'ios') {
                            window.webkit.messageHandlers.AppModel.postMessage({
                                body: 'ios'
                            });
                        } else {
                            window.Android.jumpSearch();
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                window.getValue = function(param) {
                    _self.getValue(param);
                }
                var iframe = document.createElement('iframe')
                iframe.style.visibility = 'hidden'
                iframe.style.width = '1px'
                iframe.style.height = '1px'
                iframe.onload = function() {
                    setTimeout(function() {
                        document.body.removeChild(iframe)
                    }, 0)
                }
                document.body.appendChild(iframe)
            }, 0)
        }
}
</script>
<style scoped>
.drug_table {
    position: relative;
}

.drug_table .search {
    height: 60px;
    background: white;
    position: relative;
}

.drug_table .search input {
    width: 80%;
    height: 30px;
    border-radius: 1.28rem;
    border: 0;
    outline: none;
    padding-left: 5%;
    background: #F2F2F2;
    margin-top: 15px;
}

.drug_table .search_image {
    width: 2rem;
    height: 2rem;
    position: absolute;
    right: 13%;
    top: 18px;
}

.drug_table .hot_drug {
    width: 100%;
    height: 4rem;
}

.drug_table .hot_search_drug {
    width: 100%;
    height: 4rem;
}

.drug_table .hot_drug p,
.hot_search_drug p {
    font-size: 1.19462rem;
    height: 4rem;
    line-height: 4rem;
    text-align: left;
    margin-left: 1.27995rem;
}

.drug_table .drug_show {
    width: 100%;
    height: 13.6528rem;
    padding: 1.27995rem;
    background: white;
    position: relative;
}

.drug_table .drug_show img {
    width: 38%;
    height: 11.0929rem;
    float: left;
}

.drug_table .drug_introduce {
    width: 60%;
    height: 11.0929rem;
    float: left;
    text-align: left;
    padding: 0.64rem 0rem 0.64rem 1.27995rem;
}

.drug_table .drug_introduce p {
    font-size: 1.10929rem;
}

.drug_table #drug_name {
    color: #313232;
    margin-bottom: 1.2799rem;
    font-size: 1.3rem;
}

.drug_table #drug_chinese_name {
    font-size: 1.2rem;
    color: #666666;
    margin-top: 0.42665rem;
    word-break: break-all;
    line-height: 1.35rem;
    margin-bottom: 2rem;
}

.drug_table #drug_english_name {
    font-size: 1.2rem;
    color: #666666;
    margin-top: 0.42665rem;
    word-break: break-all;
    line-height: 1.35rem;
}

.drug_table .hot_drugs {
    width: 100%;
    padding: 1.27995rem 0 1.27995rem 0;
    background: white;
    float: left;
}

.drug_table .hot_drugs p {
    text-align: center;
    float: left;
    border: 1px solid #E7E7E7;
    height: 2.99rem;
    line-height: 2.99rem;
    padding: 0rem 1.27995rem;
    margin-bottom: 1.27995rem;
    font-size: 1.10929rem;
}

.drug_table .search_result {
    /*margin-top: 40px;*/
    background-color: #fff;
}

.drug_table .search_result ul li {
    min-height: 40px;
    border-bottom: 1px solid #ccc;
    margin: 0 15px;
}

.drug_table .search_result ul li div {
    font-size: 1.3rem;
    line-height: 40px;
    text-align: left;
    float: left;
    color: #666;
}

.drug_table .search_result ul li div img {
    max-height: 20px;
    margin-top: 10px;
    float: left;
}

.drug_table .search_result ul li div p {
    float: left;
    margin-left: 15px;
}


/*.short_hot{
  width:10rem;
  height:5.9731rem;
  border:1px solid #E7E7E7;
  float:left;
  margin-bottom: 2.5599rem;
  
}
.long_hot{
  width:15.5rem;
  height:5.9731rem;
  border:1px solid #E7E7E7;
  float:left;
  margin-bottom: 2.5599rem;

}*/
</style>
