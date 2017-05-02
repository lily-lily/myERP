<template>
    <div class="resource_detail">
        <myHeader :param="param" v-show="!my_param.show"></myHeader>
        <div v-show="!my_param.show">
                    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                        <mt-loadmore>
                            <div class="swipe_height" v-if="obj.image">
                                  <mt-swipe :auto="4000"  :show-indicators="false">        
                                    <mt-swipe-item v-for="(item,index) in obj.image">
                                      <div  @click="popUp(index,obj.image)">
                                          <img :src="item">
                                          <div class="index"><span>{{index + 1}}</span>/{{obj.image.length}}</div>
                                      </div>           
                                    </mt-swipe-item>   
                                  </mt-swipe>
                            </div>
                            <div class="top">
                                <p>发布时间：<span>{{obj.pubdate | timeFormat}}</span></p>
                                <img src="/static/icons/xique.gif" v-show="imageShow">
                                <img src="/static/icons/xique.png" v-show="!imageShow">
                            </div>
                            <div class="center">
                                <div class="title">
                                    <img src="/static/icons/impatient.png">
                                    <p>{{obj.breedName}}</p>
                                    <p class="price_right"><span>{{obj.price}}</span>元/{{obj.unit}}</p>
                                </div>
                                <div class="detail ">
                                    <p>产地：<span>{{obj.location}}</span></p>
                                    <p class="right">规格：<span>{{obj.spec}}</span></p>
                                </div>
                                <div class="detail">
                                    <p>库存：<span>{{obj.number}}{{obj.unit}}</span></p>
                                    <p class="right">起订量：<span>{{obj.moq}}{{obj.unit}}</span></p>
                                </div class="detail">
                                <div class="detail">
                                    <p>卖点：<span>{{obj.description}}</span></p>
                                </div>
                            </div>
                          </mt-loadmore>  
                    </div>
            
           </div>
        <div class="fix_bottom"  v-show="!my_param.show && obj.isMy == 0">
            <div class="attention">
                <telAndAttention :obj='obj'></telAndAttention>
            </div>         
                <button class="mint-button mint-button--primary mint-button--normal disabled_button" disabled="true" v-if="!obj.sampling">无样品</button>
                <button class="mint-button mint-button--primary mint-button--normal orange_button" v-if="obj.sampling" @click="jumpBuy(obj.id)">购买样品</button>
                <button class="mint-button mint-button--primary mint-button--normal orange_button" @click="jump(obj.id)">立即购买</button>
        </div>
        <div class="fix_bottom"  v-show="!my_param.show && obj.isMy == 1">
            <button class="mint-button mint-button--primary mint-button--normal tel" v-on:click="call()"> 
                <img src="/static/icons/tel.png">
                <p>电话</p>
            </button>
        </div>
    <popUpBigImg :param="my_param" v-show="my_param.show"></popUpBigImg>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
import telAndAttention from '../components/tools/telAndAttention'
import filters from '../filters/filters'
import popUpBigImg from '../components/tools/popUpBigImg'
import {
    swiper,
    swiperSlide,
    swiperPlugins
} from 'vue-awesome-swiper'
export default {
    data() {
            let _self = this;
            return {
                phone:common.servicePhone,
                my_param: {
                    url: '',
                    show: false,
                    whole_height: ''
                },
                param: {
                    name: '商品详情'
                },
                imageShow: true,
                number: 0,
                obj: {},
                id: '',
                swiperOption: {
                    name: 'currentSwiper',
                    autoplay: 3000,
                    setWrapperSize: true,
                    debugger: true,
                    loop: true,
                    autoHeight: true,
                    mousewheelControl : true,
                    autoplayDisableOnInteraction: false,
                    onTransitionStart: function(swiper) {
                        _self.number = parseInt(swiper.realIndex) + 1;
                    }
                }
            }
        },
        components: {
            swiper,
            swiperSlide,
            telAndAttention,
            myHeader,
            popUpBigImg
        },
        methods: {
            popUp(index,imgArr) {
                this.my_param.url = imgArr;
                this.my_param.show = !this.my_param.show;
                this.my_param.whole_height = document.documentElement.clientHeight;
            },
            refurbish(id) {
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
                            if (result.image&&result.image.length > 0) {
                                shareData.imgUrl = result.image[0];
                            }
                            shareData.title = "【低价资源】" + result.breedName + "-上【药材买卖网】买我你就赚了！";
                            shareData.desc = result.breedName + ',规格:' + result.spec + ',剩余' + result.number + result.unit + '卖点：' + result.description + '。--买卖药材就上药材买卖网！';
                            shareData.link = window.location.href;
                            common.share(shareData);
                        } else {
                            common.$emit('message', suc.data.msg);
                        }
                        if (_self.obj.image.length == 0) {
                            _self.obj.image.push('/static/images/default_image.png');
                        }
                    },
                    function(err) {
                        common.$emit('close-load');
                        common.$emit('message', err.data.msg);
                    })
            },
            back() {
                this.$router.go(-1);
            },
            jump(id) {
                let _self = this;
                if (!common.customerId) {
                    function loadApp() {
                        common.$emit('setParam','backRouter','resourceDetail/' + id);
                       
                        _self.$router.push('/login');
                    }
                    common.$emit('confirm', {
                        message: '请先登录',
                        title: '提示',
                        ensure: loadApp
                    });
                    return;
                }
                common.$emit('orderConfirm', id);
                this.$router.push('/orderConfirm/' + id);
            },
            jumpBuy(id) {
                let _self = this;
                if (!common.customerId) {
                    function loadApp() {
                        common.$emit('setParam','backRouter','resourceDetail/' + id);
                        
                        _self.$router.push('/login');      
                    }
                    common.$emit('confirm', {
                        message: '请先登录',
                        title: '提示',
                        ensure: loadApp
                    });
                    return;
                }
                common.$emit('sampleConfirm', id);
                this.$router.push('/sampleConfirm/' + id);
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
        created() {
            let _self = this;
            if(!common.servicePhone)this.getCustomerPhone();
            function countSecond() {
                _self.imageShow = false;
            }
            setTimeout(countSecond, 2500)

            var id = _self.$route.params.sourceId;
            _self.id = id;
            _self.refurbish(id);

            common.$on('resourceDetail', function(item) {
                _self.refurbish(item);
                _self.obj = {};
                _self.my_param.show = false;
            })
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>
.resource_detail {
    position: relative;
}

.page-loadmore-wrapper {}

.resource_detail .swipe_height {
   height:18.8rem;
   position: relative;
}
.resource_detail .swipe_height .index{
   width:4rem;
   height:1.6rem;
   background: black;
   z-index: 9000000000;
   position: fixed;
   right: 2rem;
   opacity: 0.5;
   border-radius: 0.8rem;
   bottom: 1.5rem;
   color:white;
   line-height: 1.6rem;
   text-align: center;
   font-size: 1.4rem;  
}
.resource_detail .swipe_height .index span{
   color:#FA6705;
}
.resource_detail .swipe_height .img_content {
    float: left;
    width: 100%;
    height: 100%;
}

.resource_detail .swipe_height img {
    width: 100%;
    height:18.8rem;
    margin-top: 0;
}

.resource_detail .swipe_height .swipe_number {
    position: absolute;
    right: 10px;
    z-index: 99;
    bottom: 10px;
    color: #fff;
    opacity: 0.5;
    background: #000;
    padding: 2px 12px;
    border-radius: 10px;
}

.resource_detail .swipe_height .swipe_number span {
    color: #FA6705;
    font-size: 14px;
}

.resource_detail .top {
    float: left;
    width: 100%;
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
}

.resource_detail .top p {
    float: left;
    color: #333;
    font-size: 1.1rem;
    margin-top: 10px;
}

.resource_detail .top img {
    float: right;
    height: 2rem;
    max-height: 40px;
    margin-right: 10px;
}

.resource_detail .fix_bottom {
    position: absolute;
    bottom: 0px;
    z-index: 2;
    width: 100%;
}

.resource_detail .fix_bottom .attention {
    float: left;
    width: 34%;
}

.resource_detail .fix_bottom .orange_button {
    background: #EC6817;
    width: 33%;
    float: left;
}

.resource_detail .fix_bottom .disabled_button {
    background: #EEEEEE;
    width: 33%;
    float: left;
    color: #333;
    border: 1px solid #ddd;
}

.resource_detail .center {
    padding: 20px;
    position: relative;
    background: #fff;
    float: left;
    width: 100%;
}

.resource_detail .center .title {
    float: left;
    width: 100%;
    margin-bottom: 20px;
}

.resource_detail .center .title img {
    float: left;
    max-height: 40px;
    height: 1.7rem;
}

.resource_detail .center .title p {
    float: left;
    margin-left: 10px;
    font-size: 1.4rem;
    line-height: 1.7rem;
    color: #333;
}

.resource_detail .center .title .price_right {
    float: right;
    color: #EC6817;
}

.resource_detail .center .title .price_right span {
    font-size: 1.8rem;
    font-weight: 500;
}

.resource_detail .detail {
    float: left;
    width: 100%;
    margin-bottom: 15px;
    text-align: left;
}

.resource_detail .detail p {
    float: left;
}

.resource_detail .detail p span {
    color: #666;
    font-size: 1.1rem;
}

.resource_detail .detail .right {
    float: right;
}

.resource_detail .detail p .orange_font {
    color: #EC6817;
}

.resource_detail .tel {
    width: 100%;
    float: left;
    background: #EEEEEE;
    border: 1px solid #ddd;
    padding-left: 0;
    padding-right: 0;
}

.resource_detail .tel img {
    max-height: 13px;
}

.resource_detail .tel p {
    font-size: 10px;
    color: #333;
}
</style>
