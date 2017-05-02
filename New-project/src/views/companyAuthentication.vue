<template>
  <div class="company_authentication">               
               <div class="box">
                   <myHeader :param = "headerName"></myHeader>  
                   <div class="select"><myTab :param = "myShow" ></myTab></div>
               </div> 
    <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }"> 
       <mt-loadmore> 
          <div class="content">
               
                    <div class="first_item" v-show="myShow.show">
                        <div v-for="(todo,index) in todos" v-bind:class="{ maxbox: index%2==0, 'otherbox': index%2==1 }">
                           <p class="title">{{todo.title}}</p>
                           <div class="photo">
                               <imageUpload :param="personImgArr[index]" v-on:postUrl="getUrl"></imageUpload>
                           </div>
                           <p class="point">{{todo.point}}</p>
                        </div>                       
                   </div>
               
                    <div class="second_item" v-show="!myShow.show">
                        <div v-for="(todo,index) in datas" v-bind:class="{ maxbox: index%2==0, 'otherbox': index%2==1 }">
                           <p class="title">{{todo.title}}</p>
                           <div class="photo">
                             <imageUpload :param="companyArr[index]" v-on:postUrl="getUrl"></imageUpload>
                           </div>
                           <p class="point">{{todo.point}}</p>
                        </div>                    
                    </div>          
          </div>  
                    
             <div class="common_problem">
                
                <div class="common_problem_inner">
                      <img src="/static/images/common-problem.png">
                      <p><span>认证常见问题</span></p>
                </div>      
             </div>
             
         </mt-loadmore>   
          <div class="confirm" @click="confirm">{{authen_name}}</div>   
    </div>
   
  </div>
</template>

<script>
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
import myTab from '../components/tools/tab'
import imageUpload from '../components/tools/imageUpload'
import httpService from '../common/httpService.js'
export default {
    data() {
            return {
                authen_name:'申请认证',
                myShow:{
                    show:true,
                    left:true,
                    right:false,
                    left_name:'传统三证',
                    right_name:'三证合一'
                },
                headerName:{
                     name:'企业认证'
                },
                selected:"1",
                isActive: true,
                hasError: false,
                param:{
                    name:'sdfsdf'
                },
                obj:{
                    authenType:''
                },
                personImgArr:[
                      {
                        name: 'intention',
                        index:0,
                        url: ''  
                      },{
                        name: 'intention',
                        index:1,
                        url: ''  
                      },{
                        name: 'intention',
                        index:2,
                        url: ''  
                      },{
                        name: 'intention',
                        index:3,
                        url: ''  
                      },{
                        name: 'intention',
                        index:4,
                        url: ''  
                      },{
                        name: 'intention',
                        index:5,
                        url: ''  
                      }],
                companyArr:[
                      {
                        name: 'intention',
                        index:6,
                        url: ''  
                      },{
                        name: 'intention',
                        index:7,
                        url: ''  
                      },{
                        name: 'intention',
                        index:8,
                        url: ''  
                      },{
                        name: 'intention',
                        index:9,
                        url: ''  
                      }],      
                todos:[{
                    title:'工商营业执照',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'组织机构代码证',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'税务登记证',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'银行开户许可证',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'GSM资质证书',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'GPM资质证书',
                    point:'请使用原件拍照或扫描'
                }],

                datas:[{
                    title:'三证合一',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'银行开户许可证',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'GSM资质证书',
                    point:'请使用原件拍照或扫描'
                },{
                    title:'GPM资质证书',
                    point:'请使用原件拍照或扫描'
                }],
                leftArr:['','','','','',''],
                rightArr:['','','','']
            }
        },
        components: {
            imageUpload,
            myHeader,
            myTab
        },
        methods: {
            inquiry(){
                let _self = this;
                common.$emit('show-load');
                let url=common.addSID(common.urlCommon+common.apiUrl.most);
                let body={biz_module:'userService',biz_method:'queryUserAuthenList',version:1,time:0,sign:'',biz_param:{
                    type:1
                }};
                console.log(common.difTime);
                body.time=Date.parse(new Date())+parseInt(common.difTime);
                body.sign=common.getSign('biz_module='+body.biz_module+'&biz_method='+body.biz_method+'&time='+body.time);
                httpService.queryUserInfo(url,body,function(suc){
                   common.$emit('close-load');
                   if(suc.data.code == '1c01'){
                        _self.obj.authenType = suc.data.biz_result.authenType;
                        if(suc.data.biz_result.authenType == 1){
                              _self.authen_name = '审核中';
                              
                        }else if(suc.data.biz_result.authenType == 2){
                              _self.authen_name = '已通过';
                              
                        }else if(suc.data.biz_result.authenType == 3){
                             _self.authen_name = '未通过';
                             
                        }
                        
                   }else{
                       common.$emit('message',suc.data.msg)
                   }                     
                },function(err){
                  common.$emit('close-load');
                  common.$emit('message',err.data.msg)
                })
            },
            confirm(){
                let _self = this;

                if(_self.myShow.left){

                    if(_self.obj.authenType !== 0){
                         _self.referTo(_self.obj.authenType);
                    }else{

                         for(var i = 0; i < 4; i++){
                            if (_self.leftArr[i] == '') {
                              common.$emit('message','请至少上传前四张照片');
                              console.log(_self.leftArr)
                              return;
                            }
                         }
                         _self.authentication(_self.leftArr);            
                    }     

                }
               

                if(_self.myShow.right){
                    if(_self.obj.authenType !== 0){
                         _self.referTo(_self.obj.authenType);

                    }else{
                         for(var i = 0; i < 2; i++){
                            if (_self.rightArr[i] == '') {
                              common.$emit('message','请至少上传前两张张照片');
                              return;
                            }
                         }
                         _self.authentication(_self.rightArr);
                    }   
                }
                
            },
            getUrl(param){
                let _self = this;
                if(param.index == 0){
                     _self.leftArr[0] = param.url;
                }else if(param.index == 1){
                     _self.leftArr[1] = param.url;
                }else if(param.index == 2){
                     _self.leftArr[2] = param.url;
                }else if(param.index == 3){
                     _self.leftArr[3] = param.url;
                }else if(param.index == 4){
                     _self.leftArr[4] = param.url;
                }else if(param.index == 5){
                     _self.leftArr[5] = param.url;
                }else if(param.index == 6){
                     _self.rightArr[0] = param.url;
                }else if(param.index == 7){
                     _self.rightArr[1] = param.url;
                }else if(param.index == 8){
                     _self.rightArr[2] = param.url;
                }else if(param.index == 9){
                     _self.rightArr[3] = param.url;
                }
                
            },
            referTo(authenType){
                  let _self = this;
                  switch (authenType) {
                          case 1:
                              common.$emit("message", '已申请认证，正在审核中');
                              break;
                          case 2:
                              common.$emit("message", '已通过认证');
                              break;
                          case 3:
                              common.$emit("message", '未通过认证');
                              break;    
                          default:
                              break;    
                      }           
            },
            authentication(arr){
                  let _self = this;
                  common.$emit('show-load');
                  let url=common.addSID(common.urlCommon+common.apiUrl.most);
                  let body={biz_module:'userService',biz_method:'submitAuthen',version:1,time:0,sign:'',biz_param:{
                         type:1,                     
                         authenImage:arr
                  }};
                  console.log(common.difTime);
                  body.time=Date.parse(new Date())+parseInt(common.difTime);
                  body.sign=common.getSign('biz_module='+body.biz_module+'&biz_method='+body.biz_method+'&time='+body.time);
                  httpService.queryUserInfo(url,body,function(suc){
                     common.$emit('close-load');
                     if(suc.data.code == '1c01'){
                           _self.inquiry();
                          common.$emit("informAccountinfo",1);
                          common.$emit("informAccountFinish",1);
                     }
                         common.$emit('message', suc.data.msg); 
                         //console.log(suc.data.msg)  
                    
                     
                                    
                  },function(err){
                    common.$emit('close-load');
                  })
            }
            
        },
        created() {
            let _self = this;
            _self.inquiry();
            common.$on("companyAuthentication",function (item){
                 _self.inquiry();
            })

        },
        
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.company_authentication{
  position: relative;
  
}
.company_authentication .box{

}
.company_authentication .page-loadmore-wrapper {
    margin-top: -1px;
    overflow: scroll;
    /*padding-bottom: 10px;*/
    width: 100%;
    margin-bottom: 0px;
}
.company_authentication .select{
    background: white;
}
.company_authentication #select_box{
    border-bottom: 1px solid #DFDFDF;
    background-color: white;
    padding: 1rem;
    position: relative;
    min-height:65px;
}
.company_authentication .mint-navbar {
    width: 70%;
    margin-left: 15%;
    position: fixed;
    top:60px;
    z-index: 100000;
}
.company_authentication .mint-navbar .mint-tab-item {
    padding: 1.2rem 0;
    line-height: 0 !important;
    border: 1px solid #FA6705;
}
.company_authentication .mint-navbar .mint-tab-item.is-selected {
    background-color: #FA6705;
    color: white;
    margin: 0;
}
.company_authentication .word{
    font-size: 2.5rem;
    color:#FA6705;
}
.company_authentication .first_item{
    padding: 1.5rem;
    background:white;
    min-height: 53rem;
    margin-top: 1rem;
}
.company_authentication .second_item{
    padding: 1.5rem;
    background:white;
    min-height: 37rem;
    margin-top: 1rem;
}
.company_authentication .first_item .maxbox,.company_authentication .second_item .maxbox{
    width:50%;
    height:14rem;
    float:left;
    padding-right: 7%;
    text-align: left;
    margin-bottom: 3rem;
}
.company_authentication .first_item .otherbox,.company_authentication .second_item .otherbox{
    width:50%;
    height:14rem;
    float:left;
    padding-left: 7%;
    text-align: left;
    margin-bottom: 3rem;
}


.company_authentication .first_item>div .title,.company_authentication .second_item>div .title{
    font-size: 1.2rem;
    color:#333232;
    margin-bottom: 1.5rem;
}
.company_authentication .first_item>div .photo,.company_authentication .second_item>div .photo{
    height:11rem;
    width:100%;
    background:#fff;
    overflow: hidden;
} 
.company_authentication .first_item>div .point,.company_authentication .second_item>div .point{
    font-size: 1rem;
    margin-top:1rem;
    text-align: center;
    width:100%;
    color:#999999;
}
.company_authentication .content{
    /*margin-bottom: 2.2rem;*/
}
.company_authentication .common_problem{
    /*width:8.6rem;
    height:1.4rem;
    margin-left: -4.3rem;
    position: absolute;
    left: 50%;
    text-align: center;
    margin-bottom: 5rem;*/
   
    height:8.2rem;
    width:100%;
    position: relative;
}
.company_authentication .common_problem .common_problem_inner{
    width:8.6rem;
    height:1.4rem;
    margin-left: -4.3rem;
    position: absolute;
    left: 50%;
    top:2.2rem;
}
.company_authentication .common_problem .common_problem_inner img{
    width: 1.4rem;
    float:left;
    margin-right:1rem;
}
.company_authentication .common_problem .common_problem_inner p{
    font-size: 1rem;
    line-height: 1.4rem;
    height:1.4rem;
    /*border:1px solid red;*/
    float:left;
    color:#FA6705;
}
.company_authentication .confirm{
    width:100%;
    height:50px;
    background:#FA6705;
    color:white;
    line-height: 50px;
    text-align: center;
    /*margin-top:7.5rem;*/
}

</style>
