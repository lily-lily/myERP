<template>
    <div class="content need_detail">
        <myHeader :param="param"></myHeader>
        <div>
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <div class="center">
                        <div class="title">
                            <p>{{obj.breedName}}</p>
                        </div>
                        <div class="detail">
                            <p>规格：<span>{{obj.spec}}</span></p>
                            <p class="right">发布时间：<span>{{obj.pubdate | timeFormat}}</span></p>
                        </div>
                        <div class="detail">
                            <p>产地：<span>{{obj.location}}</span></p>
                            <p class="right">剩余：<span>{{obj.duedate | timeDays(obj.pubdate)}}天</span></p>
                        </div class="detail">
                        <div class="detail">
                            <p>需求数量：<span>{{obj.number}}{{obj.unit}}</span></p>
                        </div>
                        <div class="detail">
                            <p>已报价：<span class="orange_font">{{obj.offer}}</span>人</p>
                        </div>
                        <div class="detail">
                            <p>平均价格：<span class="orange_font">{{obj.offerVprice}}元/kg</span></p>
                        </div>
                        <div class="detail">
                            <p>备注：<span>{{obj.description}}</span></p>
                        </div>
                    </div>
                </mt-loadmore>
            </div>
            <div class="fix_bottom" v-show="obj.isMy == 0">
                <div class="attention">
                    <telAndAttention :obj='obj'></telAndAttention>
                </div>
                <button class="mint-button mint-button--primary mint-button--normal orange_button" @click="loadApp()">立即报价</button>
            </div>
            <div class="fix_bottom" v-show="obj.isMy == 1">
                <button class="mint-button mint-button--primary mint-button--normal tel" v-on:click="call()"> 
                    <img src="/static/icons/tel.png">
                    <p>电话</p>
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
import filters from '../filters/filters'
import telAndAttention from '../components/tools/telAndAttention'
import popUpBigImg from '../components/tools/popUpBigImg'
export default {
    data() {
            return {
                phone:common.servicePhone,
                my_param: {
                    url: '',
                },
                wrapperHeight: '',
                id: '',
                obj: {},
                param: {
                    name: '需求详情'
                },
            }
        },
        components: {
            telAndAttention,
            myHeader,
            popUpBigImg
        },
        methods: {
            loadApp() {
                function loadApp() {
                    window.location.href = common.appUrl;
                }
                common.$emit('confirm', {
                    message: '要报价请下载App',
                    title: '提示',
                    ensure: loadApp
                });
            },
            getHttp(id) {
                let _self = this;
                common.$emit('show-load');
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'queryIntentionInfo',
                    biz_param: {
                        id: id
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
                    let result = suc.data.biz_result;
                    let shareData = common.shareParam;
                    if (suc.data.code == '1c01') {
                        _self.obj = result;
                        shareData.title = "【紧急求购】" + result.breedName + "-上【药材买卖网】你报价我就要了！";
                        shareData.desc = result.breedName + ',规格:' + result.spec + ',需要' + result.number + result.unit + '要求：' + result.description + '。--买卖药材就上药材买卖网！';
                        shareData.link = window.location.href;
                        common.share(shareData);
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
            call(){
             window.location.href = "tel:"+this.phone;
            },
            getCustomerPhone() {
                let _self = this;
                this.$http.get(common.urlCommon + common.apiUrl.getDate).then((response) => {
                    if (response.data.code == '1c01') {
                        console.log(response.data);
                        common.servicePhone=response.data.biz_result.serviceMobile;
                        _self.phone=response.data.biz_result.serviceMobile;
                    }
                }, (err) => {
                    common.$emit('message', err.data.msg);
                });
            }
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        created() {
            let _self = this;
            if(!common.servicePhone)this.getCustomerPhone();
            let id = _self.$route.params.needId;
            _self.id = id;
            _self.getHttp(id);
            common.$on("needToDetail", function(item) {
                _self.getHttp(item);
            });
        }


}
</script>
<style scoped>
.need_detail .page-loadmore-wrapper {
    margin-bottom: 0px;
}

.need_detail .fix_bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 2;
}

.need_detail .fix_bottom .attention {
    float: left;
    width: 34%;
}

.need_detail .fix_bottom .orange_button {
    background: #EC6817;
    width: 66%;
    float: left;
}

.need_detail .center {
    padding: 20px;
    position: relative;
    background: #fff;
    float: left;
    width: 100%;
}

.need_detail .center .title {
    float: left;
    width: 100%;
    margin-bottom: 20px;
}

.need_detail .center .title img {
    float: left;
    max-height: 40px;
    height: 1.7rem;
}

.need_detail .center .title p {
    float: left;
    /* margin-left: 10px;*/
    font-size: 1.8rem;
    line-height: 1.7rem;
    color: #333;
}

.need_detail .detail {
    float: left;
    width: 100%;
    margin-bottom: 15px;
    text-align: left;
}

.need_detail .detail p {
    float: left;
}

.need_detail .detail p span {
    color: #666;
    font-size: 1.1rem;
}

.need_detail .detail .right {
    float: right;
}

.need_detail .detail p .orange_font {
    color: #EC6817;
}
.need_detail .tel {
    width: 100%;
    float: left;
    background: #EEEEEE;
    border: 1px solid #ddd;
    padding-left: 0;
    padding-right: 0;
}

.need_detail .tel img {
    max-height: 13px;
}

.need_detail .tel p {
    font-size: 10px;
    color: #333;
}
</style>
