<template>
  <div class="good_detail">
        <!-- <mt-header title="商品详情">
            <router-link to="/myResource" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header> -->
      <myHeader :param = "param"  v-show="!my_param.show"></myHeader>

  <div  v-show="!my_param.show">
    <mt-loadmore>
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
             <div class="swipe_height">
                  <mt-swipe :auto="param.time"  :show-indicators="false">        
                    <mt-swipe-item v-for="(item,index) in param.imgArray">
                      <div  @click="popUp(index,param.imgArray)">
                          <img :src="item">
                          <div class="index"><span>{{index + 1}}</span>/{{param.imgArray.length}}</div>
                      </div>           
                    </mt-swipe-item>   
                  </mt-swipe>
              </div>
              <div class="release_time">
                  <p>发布时间：<span>{{obj.pubdate}}</span></p>
              </div>
              <div class="drug_info">
                  <div class="first_level">
                      <img src="/static/images/bao.png">
                      <p>{{obj.drug_name}}</p>
                      <p class="price"><span>{{obj.price}}</span>元/kg</p>
                  </div>
                 <div class="box">
                      <div class="second_level">
                          <p class="the_left">产地：<span>{{obj.place}}</span></p>
                          <p class="the_right">规格：<span>{{obj.spec}}</span></p>
                      </div>

                      <div class="third_level">
                          <p class="the_left">库存：<span>{{obj.number}}</span>{{obj.number_unit}}</p>
                          <p class="the_right">起订量：<span>{{obj.moq}}</span>kg</p>
                      </div>
                      
                      <div class="fourth_level">
                          <p class="the_left">样品：<span>{{obj.sampling}}</span></p> 
                      </div>
                 </div>
                  <div class="fifth_level">
                      <p class="left">卖点：</p>
                      <p class="right"><span>{{obj.selling_point}}</span></p>
                  </div>
              </div>
              <div class="flowsheet">
                  <p>流程图</p>
                  <img src="/static/images/progress_1.png"  v-if="obj.onSell == 1">
                  <img src="/static/images/progress_4.png"  v-if="obj.onSell == 2">
              </div> 

       </div> 
     </mt-loadmore> 
    </div> 

     <popUpBigImg  :param="my_param" v-show="my_param.show"></popUpBigImg>
  </div>
</template>

<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
import popUpBigImg from '../components/tools/popUpBigImg'
export default {
    data() {
            return {
                my_param:{
                    url:'',
                    show:false,
                    imgArray: [],
                    whole_height:''
                },
                param:{
                    name:'商品详情',
                    show:true,
                    reviseRouter:'',
                    time:4000,
                    item:''
                    
                },
                
               arrLength:'',
                obj:{
                    drug_name:'白术',
                    spec:'',
                    place:'',
                    number:'',
                    number_unit:'kg',
                    selling_point:'',
                    offer:'',
                    duedate:'',
                    pubdate:'',
                    moq:'',
                    sampling:'',
                    price:'',
                    id:'',
                    onSell:''
                },
                number:0,
                swiperOption: {
                    name: 'currentSwiper',
                    autoplay: 3000,
                    setWrapperSize: true,
                    debugger: true,
                    loop: true,
                    autoplayDisableOnInteraction: false,
                    onTransitionStart: function(swiper) {
                        _self.number = parseInt(swiper.realIndex) + 1;
                    }
                }

            }
        },
        components: {
            myHeader,
            popUpBigImg
        },
        methods:{
             popUp(index,imgArr){
                 let _self = this;
            
                 _self.my_param.url = imgArr; 
                 this.my_param.show = !this.my_param.show;
                 this.my_param.whole_height = document.documentElement.clientHeight;
                   
            },
             getHttp(id){
                     let _self = this;
                     //common.$emit('show-load');
                     httpService.getIntentionDetails(common.urlCommon + common.apiUrl.most, {
                        biz_module:'intentionService',
                        biz_method:'queryIntentionInfo',
              
                            biz_param: {
                                id:id
                            }
                        }, function(suc) {
                            
                            
                            console.log(suc.data.biz_result);
                            let result = suc.data.biz_result;
                            console.log(result.sampling);
                            if(result.sampling == 1){
                               result.sampling = '提供'
                            }
                            if(result.sampling == 0){
                               result.sampling = '不提供'
                            }
                            _self.obj.drug_name = result.breedName;
                            _self.obj.spec = result.spec;
                            _self.obj.place = result.location;
                            _self.obj.number = result.number;
                            _self.obj.number_unit = result.unit;
                            _self.obj.selling_point = result.description;
                            _self.obj.sampling = result.sampling;
                            _self.obj.offer = result.offer;
                            _self.obj.pubdate = result.pubdate;
                            _self.obj.moq = result.moq;
                            _self.obj.price = result.price;
                            _self.obj.onSell = result.onSell;
                            let imageArr = result.image;
                            /*for(var item in imageArr){
                                 console.log(imageArr[item]);
                                 _self.imgArray[item].url = imageArr[item];
                            }*/
                            /*for(var i = 0; i < imageArr.length; i ++){
                                  _self.imgArray.push(imageArr[i]);

                            }*/
                            _self.param.imgArray = result.image;
                            _self.arrLength = imageArr.length;
                        }, function(err) {
                            
                            common.$emit('message', err.data.msg);
                        })
             }
        },
        created(){
            var _self = this;
            /*var str = _self.$route.fullPath;
            var id = str.substring(12,str.length);*/
            var id = _self.$route.params.odId;
            _self.param.reviseRouter = '/reviseResource/' + id;
            _self.param.item = id;
            //console.log('/reviseRevise/' + id)
            _self.obj.id = id;
            //console.log(id)
            _self.getHttp(id);

            common.$on("inform-goodDetail",function (item){
                  _self.getHttp(item);
                   _self.param.reviseRouter = '/reviseResource/' + item;
                   _self.param.item = item;
                   _self.my_param.show = false;
            });
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>

.good_detail .swipe_height{
  height:18.8rem;
  position: relative;
}
.good_detail .swipe_height img {
    width: 100%;
    height:18.8rem;
    position: absolute;
    left:0;
}
.good_detail .swipe_height .index{
   width:4rem;
   height:1.6rem;
   background: black;
   z-index: 9000000000;
   position: absolute;
   right: 2rem;
   opacity: 0.5;
   border-radius: 0.8rem;
   bottom: 1.5rem;
   color:white;
   line-height: 1.6rem;
   text-align: center;
   font-size: 1.4rem;
   
}
.good_detail .swipe_height .index span{
   color:#FA6705;
}
.good_detail .release_time{
   height:4rem;
   font-size: 1rem;
   color:#333333;
   line-height: 4rem;
   background:white;
   text-align: left;
   padding:0 0 0 1.5rem;
   margin-bottom: 1rem;
}
.good_detail .release_time span{
   color:#666666;
}
.good_detail .drug_info{
  padding: 0 1.5rem;
  background-color: white;
  min-height: 19rem;
  position: relative;
}
.good_detail .drug_info .first_level{
  position: relative;
}
.good_detail .drug_info img{
  width: 1.5rem;
  height:1.5rem;
  position: absolute;
  left:0;
  top:1.5rem;
}
.good_detail .drug_info .first_level p{
  font-size: 1.4rem;
  line-height: 1.4rem;
  color:#333333;
  position: absolute;
  top:1.5rem;
  left:2.5rem;

}
.good_detail .drug_info .first_level .price{
  font-size: 1.6rem;
  color:#FA6705;
  position: absolute;
  right:0;
  text-align: right;
}
.good_detail .drug_info .second_level,.good_detail .drug_info .third_level,.good_detail .drug_info .fourth_level{
  height:1rem;
  line-height: 1rem;
  margin-top: 1.5rem;
  font-size: 1rem;
  color:#333333;
}
.good_detail .drug_info .second_level span,.good_detail .drug_info .third_level span,.good_detail .drug_info .fourth_level span{
  color:#666666;
}
.good_detail .drug_info .the_left{
  float: left;
}
.good_detail .drug_info .the_right{
  float:right;
}
.good_detail .drug_info .box{
  padding-top: 3.9rem;
  margin-bottom: 1.5rem;
}
.good_detail .drug_info .fifth_level p{
  
  text-align: left;
  font-size: 1rem;
  line-height: 1.5rem;
}
.good_detail .drug_info .fifth_level p span{
  color:#666666;
}
.good_detail .drug_info .fifth_level .left{
  float:left;
}
.good_detail .drug_info .fifth_level .right{
  
  margin-left: 3rem;
}
.good_detail  .flowsheet{
  padding: 1.5rem;
  background:white;
  
  margin: 1rem 0 50px 0;
}
.good_detail  .flowsheet img{
  height:4rem;
  width:100%;
}
.good_detail  .flowsheet p{
  float:left;
  margin-bottom: 1rem;
  font-size:1.4rem;
  color:#FA6705; 
}
</style>
