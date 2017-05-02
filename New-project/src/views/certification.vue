<template>
  <div class="certification">
       
   <myHeader :param = "param"></myHeader>
  <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">      
             <div class="main">

                    <div class="personal_info">
                     <div class="info_header">
                         <p class="left">个人信息</p>
                         <p class="right">{{authen_title}}</p>
                     </div>
                     <div>
                         <p class="left">姓名</p>
                         <p class="right">{{obj.name}}</p>
                     </div>
                     <div>
                         <p class="left">性别</p>
                         <p class="right" v-if="obj.gender == '女'">
                            <img src="/static/images/woman.png">
                         </p>
                         <p class="right" v-if="obj.gender == '男'">
                            <img src="/static/images/man.png">
                         </p>
                     </div>
                     <div>
                         <p class="left">电话</p>
                         <p class="right">{{obj.phone}}</p>
                     </div>
                 </div>
     
      
                <div class="first_item">
                    <div v-for="(todo,index) in todos" v-bind:class="{ maxbox: index%2==0, 'otherbox': index%2==1 }">
                       <p class="title">{{todo.title}}</p>
                       <div class="photo" >
                          <imageUpload :param="imgageArr[index]" v-on:postUrl="getUrl"></imageUpload>
                       </div>
                       
                       <p  v-bind:class="{point:index == 0,'nor_point':index == 1}">{{todo.point}}</p>
                    </div>  
                </div>

                <div class="other_item">
                      <p>已通过审核照片</p>
                      <div class="pass_image"><img :src="obj.url"></div>
                </div>

             </div>
                
                 <div class="common_problem">
                    <div class="common_problem_inner">
                          <img src="/static/images/common-problem.png">
                          <p><span>认证常见问题</span></p>
                    </div>    
                 </div>
                  <div class="confirm" @click="confirm">{{authen_name}}</div>
       </div> 
  </div>
</template>

<script>
import common from '../common/common.js'
import imageUpload from '../components/tools/imageUpload'
import myHeader from '../components/tools/myHeader'
import httpService from '../common/httpService.js'

export default {
    data() {
            return {
                 authen_name:'申请认证',
                 authen_title:'未审核',
                 param:{
                    name:'实名认证',
                    
                },
                obj:{
                    gender:'',
                    phone:'',
                    name:'',
                    url:'',
                    authenType:''
                    
                },
                todos:[{
                    title:'身份证正面',
                    point:'请使用原件拍照扫描'
                },{
                    title:'身份证反面',
                    point:'请使用原件拍照扫描'
                }],
                
                imgageArr:[
                      {
                        name: 'intention',
                        index:0,
                        url: ''  
                      },{
                        name: 'intention',
                        index:1,
                        url: ''  
                      }],
                left_url:'',
                right_url:'',
                arr:['','']
                
            }
        },
        components: {
            imageUpload,
            myHeader
        },
        methods: {
            getHttp(){//获取用户信息的接口
                 let _self = this;
                  common.$emit('show-load');
                  let url=common.addSID(common.urlCommon+common.apiUrl.most);
                  let body={biz_module:'userService',biz_method:'queryUserInfo',version:1,time:0,sign:'',biz_param:{}};
                  console.log(common.difTime);
                  body.time=Date.parse(new Date())+parseInt(common.difTime);
                  body.sign=common.getSign('biz_module='+body.biz_module+'&biz_method='+body.biz_method+'&time='+body.time);
                  httpService.queryUserInfo(url,body,function(suc){
                     common.$emit('close-load');
                     //console.log(suc.data.biz_result.gender);
                    _self.obj.name = suc.data.biz_result.name;
                    _self.obj.gender = suc.data.biz_result.gender;
                    _self.obj.phone = suc.data.biz_result.phone;                   
                  },function(err){
                    common.$emit('close-load');
                  })
            },
            inquiry(){//查询用户认证列表接口
                let _self = this;
                common.$emit('show-load');
                let url=common.addSID(common.urlCommon+common.apiUrl.most);
                let body={biz_module:'userService',biz_method:'queryUserAuthenList',version:1,time:0,sign:'',biz_param:{
                    type:0
                }};
                console.log(common.difTime);
                body.time=Date.parse(new Date())+parseInt(common.difTime);
                body.sign=common.getSign('biz_module='+body.biz_module+'&biz_method='+body.biz_method+'&time='+body.time);
                httpService.queryUserInfo(url,body,function(suc){
                   common.$emit('close-load');
                   if(suc.data.code == '1c01'){
                        _self.obj.url = suc.data.biz_result.list[0];//将通过的照片显示出来；
                        _self.obj.authenType = suc.data.biz_result.authenType;
                        if(suc.data.biz_result.authenType == 1){ //通过获取的authenType值判断应该表述的状态
                              _self.authen_name = '审核中';
                              _self.authen_title = "正在审核";
                        }else if(suc.data.biz_result.authenType == 2){
                              _self.authen_name = '已通过';
                              _self.authen_title = "已通过审核";
                        }else if(suc.data.biz_result.authenType == 3){
                             _self.authen_name = '未通过';
                             _self.authen_title = "未通过审核";
                        }
                   }else{
                       common.$emit('message',suc.data.msg)
                   }                     
                },function(err){
                  common.$emit('close-load');
                  common.$emit('message',err.data.msg)
                })
            },
            getUrl(param){//上传图片的url放入return中储存起来
                let _self = this;
                if(param.index == 0){
                     _self.arr[0] = param.url;
                }else if(param.index == 1){
                     _self.arr[1] = param.url;
                }   
            },
            referTo(){//用户认证提交接口
                  let _self = this;
                  common.$emit('show-load');
                  let url=common.addSID(common.urlCommon+common.apiUrl.most);
                  let body={biz_module:'userService',biz_method:'submitAuthen',version:1,time:0,sign:'',biz_param:{
                         type:0,                     
                         authenImage:_self.arr
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
                     console.log(suc);                  
                  },function(err){
                    common.$emit('close-load');
                  })

            },
            confirm(){
                  let _self = this;
                  if(_self.obj.authenType != 0){
                      switch (_self.obj.authenType) {
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
                  }else{
                      for(var i = 0; i < _self.arr.length; i++){
                          if (_self.arr[i] == '') {//要求用户上传两张照片
                            common.$emit('message','请上传身份证照片');
                            return;
                          }
                       }

                       _self.referTo();

                       
                  }                    
            }
        },
        
        created() {
          let _self = this;
          _self.getHttp();
          _self.inquiry();//页面刷新的时候调用1.用户信息接口，2.查询用户列表接口
            common.$on("certification",function (item){
                  _self.inquiry(); //从账户信息完成页过来的通知，调用查询用户列表接口
            })
           /* common.$on("post-my-info", function (obj){
                console.log(obj.name)
                _self.obj.name = obj.name;
                _self.obj.phone = obj.phone;
                _self.obj.gender = obj.gender;
            })*/
        },
        mounted() {

            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.certification .first_item{
    padding: 1.5rem 0;
    border-top: 1px solid #BFBFBF;
    border-bottom: 1px solid #BFBFBF;
    min-height: 18.9rem;
    margin: 1rem 0 0 0;
}
.certification .other_item .pass_image{
    
}
.certification .other_item p{
    text-align: left;
    font-size: 1.2rem;
    color:#333232;
    margin: 1.5rem 0 0 0;
    line-height: 1.2rem;
    
}
.certification .other_item  div{
    width:68.75%;
    height:13rem;
    background:#E1DDDA;
    margin:1.5rem 0 0 15.625%;
}
.certification .other_item  div img{
   width:100%;
   height:100%;
}
.certification .main{
    padding:0 1.5rem;
    height:51rem;
    background:white;
}
.certification .main .personal_info>div{
    position: relative;
    height:1.2rem;
    line-height: 1.2rem;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    color:#313232;
}

.certification .main .personal_info img{
    height:1.5rem;
}
.certification .main .personal_info .info_header{
    padding: 1.5rem 0 2rem 0;
}
.certification .main .personal_info .info_header .left{
    font-size: 1.4rem;
}
.certification .main .personal_info .info_header .right{
    color:#FA6705;
}
.certification .main .personal_info .left{
    position: absolute;
    left:0;
}
.certification .main .personal_info .right{
    position: absolute;
    right:0;
}
.certification .first_item .maxbox{
    width:50%;
    height:14rem;
    float:left;
    padding-right: 7%;
    text-align: left;
    margin-bottom: 3rem;
}
.certification .first_item .otherbox{
    width:50%;
    height:14rem;
    float:left;
    text-align: left;
    padding-left: 7%;
    /*border:1px solid red;*/
    margin-bottom: 3rem;
    
}

.certification .first_item>div .title{
    font-size: 1.2rem;
    color:#333232;
    margin-bottom: 1.5rem;
}
.certification .first_item>div .photo{
    height:11rem;
    width:100%;
    background:#fff;
    overflow: hidden;
} 

.certification .first_item>div .point{
    font-size: 1rem;
    margin-top:1rem;
    text-align: center;
    width:100%;
    color:#999999;
}
.certification .first_item>div .nor_point{
    font-size: 1rem;
    margin-top:1rem;
    text-align: center;
    width:100%;
    /*color:#FF0000;*/
    color:#999999;
}
.certification .common_problem{
    height:8.2rem;
    width:100%;
    position: relative;
}
.certification .common_problem .common_problem_inner{
    width:8.6rem;
    height:1.4rem;
    margin-left: -4.3rem;
    position: absolute;
    left: 50%;
    top:2.2rem;
}
.certification .common_problem .common_problem_inner img{
    width: 1.4rem;
    float:left;
    margin-right:1rem;
}
.certification .common_problem .common_problem_inner p{
    font-size: 1rem;
    line-height: 1.4rem;
    height:1.4rem;
    /*border:1px solid red;*/
    float:left;
    color:#FA6705;
}
.certification .confirm{
    width:100%;
    height:50px;
    background:#FA6705;
    color:white;
    line-height: 50px;
    text-align: center;
    /*margin-top:7.5rem;*/
}
</style>
