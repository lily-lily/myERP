<template>
    <div class="provenance">
        <mt-header title="产地选择" class="header">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="back()"></mt-button>
            </router-link>
            <mt-button slot="right" @click="save()">确定</mt-button>
        </mt-header>
        <!-- <div class="select_box">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">国内</mt-tab-item>
                <mt-tab-item id="2">国外</mt-tab-item>
            </mt-navbar>
        </div> -->
        <div class="history_box" v-show="selectArr.length>0">
            <div class="history">
                <div v-for="(item,index) in selectArr">
                    <p>{{item.name}}</p>
                    <img src="../../static/images/false.png" @click="delItem(index)">
                </div>
            </div>
        </div>
        <mt-index-list>
            <div class="list" v-for="todo in list">
                <mt-index-section :index="todo.key" class="index_name">
                    <a @click="selectPlace(item)" v-for="item in todo.value">
                        <mt-cell :title="item.name"></mt-cell>
                    </a>
                </mt-index-section>
            </div>
            <!-- <div class="list" v-for="todo in outer_list" v-if="selected==2">
                <mt-index-section :index="todo.index" class="index_name">
                    <a @click="selectPlace(item)" v-for="item in todo.place_list">
                        <mt-cell :title="item.place"></mt-cell>
                    </a>
                </mt-index-section>
            </div> -->
        </mt-index-list>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
export default {
    data() {
            return {
                selected: '1',
                list: [],
                home_list: [{
                    key: 'A',
                    value: [{
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }]
                }, {
                    key: 'B',
                    value: [{
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }]
                }, {
                    key: 'C',
                    value: [{
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }]
                }, {
                    key: 'D',
                    value: [{
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }, {
                        name: '湖北'
                    }]
                }],
                outer_list: [{
                    key: 'A',
                    value: [{
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }]
                }, {
                    key: 'B',
                    value: [{
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }]
                }, {
                    key: 'C',
                    value: [{
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }]
                }, {
                    key: 'D',
                    value: [{
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }, {
                        name: '巴西'
                    }]
                }],
                selectArr: []
            }
        },

        methods: {
            selectPlace: function(item) {
                let count = 1;
                for (let i = 0; i < this.selectArr.length; i++) {
                    if (this.selectArr[i].name == item.name) {
                        count = 0;
                    }
                }
                if (count) this.selectArr.push(item);
            },
            delItem: function(id) {
                this.selectArr.splice(id, 1);
            },
            back: function() {
                this.$router.go(-1);
            },
            save: function() {
                let areaArr=[];

                for(var i=0;i<this.selectArr.length;i++){
                        areaArr.push(this.selectArr[i].name);
                }

                switch (this.$route.params.from) {
                    case 'need':
                        common.$emit('need-sort',areaArr);
                        break;
                    case 'resource':
                        common.$emit('resource-sort',areaArr);
                        break;
                    case 'lowRes':
                        common.$emit('lowRes-sort',areaArr);
                        break;
                    case 'urgentNeed':
                        common.$emit('urgentNeed-sort',areaArr);
                        break;
                    default:
                        break;

                }
                this.$router.go(-1);
            }
        },

        created() {
            let _self = this;
            common.$emit('show-load');
            httpService.specifiedPlace(common.urlCommon + common.apiUrl.most, {
                biz_module: 'breedService',
                biz_method: 'queryBreedLocalList',
                biz_param: {
                    breedId: 0,
                }
            }, function(suc) {
                common.$emit('close-load');
                let result = suc.data.biz_result.list;
                _self.list = result;
                console.log(result);
            }, function(err) {
                common.$emit('close-load');
                common.$emit('message', err.data.msg);
            })
        }
}
</script>
<style scoped>
.whole {
    position: relative;
    background: #F1EFEF;
}

.provenance {}

.provenance .index_name {
    text-align: left;
}

.provenance .header {
    background-color: #FA6705;
    color: #313232;
    border-bottom: 1px solid #C9C9C9;
    color: white;
    font-size: 1.408rem;
}

.provenance .select_box {
    width: 100%;
    background-color: white;
    padding: 1rem;
}

.provenance .mint-navbar {
    width: 70%;
    margin-left: 15%;
}

.provenance .mint-navbar .mint-tab-item {
    padding: 1.2rem 0;
    line-height: 0 !important;
    border: 1px solid #FA6705;
}

.provenance .mint-navbar .mint-tab-item.is-selected {
    background-color: #FA6705;
    color: white;
    margin: 0;
}

.provenance .select_box {
    border-bottom: 1px solid #DFDFDF;
    font-size: 2.5rem;
}

.provenance .history_box {
    float: left;
    width: 100%;
    background: white;
}

.provenance .history_box .history {
    width: 100%;
    padding: 0 10px 10px 10px;
    background: white;
    float: left;
    border-bottom: 1px solid #DFDFDF;
}

.provenance .history_box .history div {
    padding: 0.44rem;
    border: 1px solid #FA6705;
    float: left;
    margin-right: 0.8533rem;
    font-size: 1.024rem;
    height: 2.22rem;
    margin-top: 10px;
}

.provenance .history_box .history div p {
    float: left;
}

.provenance .history_box .history div img {
    width: 1.024rem;
    height: 1.024rem;
    float: right;
    margin-left: 0.8533rem;
}
</style>
