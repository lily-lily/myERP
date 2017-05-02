<template>
    <div class="purchase_detail">
        <myHeader :param = "param"></myHeader>
        <div class="center">
            <div class="title">
                <p>{{obj.drug_name}}</p>
            </div>
            <div class="detail ">
                <p>规格：<span>{{obj.spec}}</span></p>
                <p class="right">发布时间：<span>{{obj.pubdate | timeFormat}}</span></p>
            </div>
            <div class="detail">
                <p>产地：<span>{{obj.place}}</span></p>
                <p class="right">剩余：<span>{{obj.duedate | timeDays(obj.pubdate)}}天</span></p>
            </div class="detail">
            <div class="detail">
                <p>需求数量：<span>{{obj.number}}{{obj.number_unit}}</span></p>
            </div>
            <div class="detail">
                <p>备注：<span>{{obj.selling_point}}</span></p>
            </div>
            <div class="detail">
                <p>已报价：<span class="orange_font">{{obj.offer}}</span>人</p>
            </div>
            <div class="detail">
                <p>平均价格：<span class="orange_font">{{obj.offerVprice}}元/kg</span></p>
            </div>
        </div>
        <div class="flowsheet">
            <p>流程图</p>
            <img src="/static/images/progress_1.png"  v-if="obj.onSell == 1">
            <img src="/static/images/progress_4.png"  v-if="obj.onSell == 2">
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
                    name:'求购详情'
                    
                },
                obj: {
                    drug_name: '白术',
                    spec: '',
                    place: '',
                    number: '',
                    number_unit: 'kg',
                    selling_point: '',
                    offer: '',
                    duedate: '',
                    pubdate: '',
                    offerVprice: '',
                    id: '',
                    onSell:''
                },
                todos: [{
                    "name": "人参",
                    "spec": "统货",
                    "place": "东北",
                    "price": "98.9元/kg",
                    "up_price": "9元/kg",
                    "down_price": "9元/kg",
                    "phone": "15301546832",
                    "time": "12:26"
                }]
            }
        },
        components: {
            myHeader
        },
        methods: {
            getHttp(id){
                  let _self = this;
                  httpService.getIntentionDetails(common.urlCommon + common.apiUrl.most, {
                        biz_module: 'intentionService',
                        biz_method: 'queryIntentionInfo',
                        biz_param: {
                            id: id
                        }
                    }, function(suc) {
                        let result = suc.data.biz_result;
                        console.log(result);
                        /*var duedateDate = new Date(result.duedate);
                        var pubdateDate = new Date(result.pubdate);
                        var dateValue = duedateDate.getTime() - pubdateDate.getTime();
                        var days = Math.floor(dateValue / (24 * 3600 * 1000));
                        var pubdate = result.pubdate.substring(0, 10);*/
                        _self.obj.drug_name = result.breedName;
                        _self.obj.spec = result.spec;
                        _self.obj.place = result.location;
                        _self.obj.number = result.number;
                        _self.obj.number_unit = result.unit;
                        _self.obj.selling_point = result.description;
                        _self.obj.onSell = result.onSell;
                        _self.obj.name = result.customerName;
                        _self.obj.phone = result.customerPhone;
                        _self.obj.offer = result.offer;
                        _self.obj.offerVprice = result.offerVprice;
                        _self.obj.pubdate = result.pubdate;
                        _self.obj.duedate = result.duedate;
                    }, function(err) {
                        common.$emit('message', err.data.msg);
                    })
            },
            back() {
                this.$router.go(-1);
            },
        },
        created() {
            var _self = this;
            var id = _self.$route.params.rchaseId;
            _self.obj.id = id;

            _self.getHttp(id);
            common.$on("myPurToPurDetail",function (item){
                  _self.getHttp(item);
            });
            
        }

}
</script>
<style scoped>
.need_detail {}

.purchase_detail .center {
    padding: 20px;
    background: #fff;
    float: left;
    width: 100%;
}

.purchase_detail .center .title {
    float: left;
    width: 100%;
    margin-bottom: 20px;
}

.purchase_detail .center .title p {
    float: left;
    margin-left: 0px;
    font-size: 1.8rem;
    line-height: 1.7rem;
    color: #333;
}

.purchase_detail .detail {
    float: left;
    width: 100%;
    margin-bottom: 15px;
    text-align: left;
}

.purchase_detail .detail p {
    float: left;
}

.purchase_detail .detail p span {
    color: #666;
    font-size: 1.1rem;
}

.purchase_detail .detail .right {
    float: right;
}

.purchase_detail .detail p .orange_font {
    color: #EC6817;
}

.purchase_detail .flowsheet {
    padding: 1.5rem;
    background: white;
    float: left;
    margin: 1rem 0 50px 0;
}

.purchase_detail .flowsheet img {
    height: 4rem;
    width: 100%;
}

.purchase_detail .flowsheet p {
    float: left;
    margin-bottom: 2rem;
    font-size: 1.4rem;
    color: #FA6705;
}
</style>
