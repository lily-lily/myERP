<template>
    <div class="order_confirm">
        <myHeader :param = "myhead"></myHeader>
         <mt-loadmore>
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
           
                <div @click="jumpAddress">
                    <orderAddress :param="person"></orderAddress>
                </div>
                <div class="content">
                    <orderItem :param="param" ></orderItem>
                    <div class="total">
                        <orderTotal :order="param"></orderTotal>
                    </div>
                </div>
         </mt-loadmore>   
         <div class="fix_bottom" v-on:click="confirm">
                    提交订单
         </div>

         </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
import orderAddress from '../components/tools/orderAddress'
import orderItem from '../components/tools/orderItem'
import orderTotal from '../components/tools/orderTotal'
import httpService from '../common/httpService.js'
export default {
    data() {
            return {
                data: "",
                myhead:{
                     name:'立即购买'
                },
                param: {
                  image:[]
                },
                person: {}
            }
        },
        created() {
            let _self = this;
            var id = _self.$route.params.sourceId;
            _self.getAddress();
            _self.gethttp(id);
             common.$on('clearAddress', function(item) {
                if(item.id==_self.person.id){
                     _self.person={};
                }
            });
            common.$on('orderConfirm', function(item) {
                _self.getAddress();
                _self.gethttp(item);
            });
            common.$on('backAddress', function(todo) {
                 _self.person = todo;
                 console.log(todo.id)
            })
        },
        components: {
            myHeader,
            orderAddress,
            orderItem,
            orderTotal
        },
        methods: {
            gethttp(id) {
                let _self = this;
                httpService.myAttention(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'intentionService',
                    biz_method: 'queryIntentionInfo',
                    biz_param: {
                        id: id
                    }
                }, function(suc) {
                    
                    let result = suc.data.biz_result;
                    result.value=1;
                    if(!result.image.length){
                      result.image.push('/static/images/default_image.png');
                    }
                    result.from="order";
                    if(suc.data.code == '1c01'){
                        _self.param = result;         
                    }else{
                        common.$emit('message', suc.data.msg);
                    }
                    
                }, function(err) {
                    common.$emit('message', err.data.msg);
                })
            },
            getAddress() {
                let _self = this;
                common.$emit('show-load');
                let otherurl = common.addSID(common.urlCommon + common.apiUrl.most);
                let otherbody = {
                    biz_module: 'userAddressService',
                    biz_method: 'queryDefaultAddress',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                    }
                };
                otherbody.time = Date.parse(new Date()) + parseInt(common.difTime);
                otherbody.sign = common.getSign('biz_module=' + otherbody.biz_module + '&biz_method=' + otherbody.biz_method + '&time=' + otherbody.time);
                httpService.addressManage(otherurl, otherbody, function(suc) {
                    common.$emit('close-load');
                    let result = suc.data.biz_result;
                    if (suc.data.code == "1c01") {
                        _self.id = result.id;
                        _self.person = result;
                        console.log(result)
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            back() {
                this.$router.go(-1);
            },
            jumpAddress() {
                common.$emit('setParam','router','orderConfirm');
                this.$router.push("/addressManage");
            },
            confirm() {
                let _self = this;
                var id = _self.$route.params.sourceId;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'submitIntentionOrder',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        sourceId: id,
                        number: _self.param.value,
                        sample: _self.param.sampling,
                        addressId: _self.person.id
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.intentResOrder(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == '1c01') {
                        common.$emit("mineToOrder", 0);
                        _self.$router.push("/myOrder")
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            }
        },
         mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>
.order_confirm {
    float: left;
    width: 100%;
    position: relative;

}
.order_confirm .page-loadmore-wrapper{
   /* margin-top: 1px;
    overflow: scroll;
    padding-bottom: 10px;
    width: 100%;
    border:1px solid red;*/
    margin-bottom: 0px;
}
.order_confirm .content {
    background: #fff;
    margin-top: 10px;
    float: left;
    width: 100%;
    padding: 10px;

}

.order_confirm .content .total {
    margin-top: 1rem;
    float: left;
    width: 100%;
    margin-bottom: 40px;
}

.order_confirm .fix_bottom {
    position: absolute;
    bottom: 0px;
    width: 100%;
    left: 0;
    height: 50px;
    color: #FFF;
    font-size: 1.7rem;
    background: #FA6705;
    line-height: 50px;
   
}

.order_confirm .page-loadmore-wrapper {
    overflow: scroll;
   /* padding-bottom: 10px;*/
    width: 100%;
    
}

</style>
