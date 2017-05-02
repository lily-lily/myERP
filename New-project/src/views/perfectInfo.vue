<template>
    <div class="perfect_info">
        <myHeader :param="my_header" v-on:myUpData = "jump"></myHeader>
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
           <mt-loadmore>
                  <div  class="head">
                       <p>头像(点击设置头像)</p>
                       <div  class="head_img">
                           <imageUpload :param="param" v-on:postUrl="getUrl"></imageUpload>
                       </div>
                  </div>
                  <ul>
                     <li>
                        <p>姓名</p>
                        <img src="/static/icons/xinghao.png" class="stamp">
                        <input type="text" placeholder="请输入姓名" v-model="obj.name" maxlength="6">
                     </li>
                     <li  @click="open('picker')">
                        <p>生日</p>  
                        <img src="/static/images/right-arrow.png" class="right_arrow">         
                        <p class="birthday">{{obj.birthday}}</p>           
                     </li>
                     <li>
                         <p>性别</p>
                         <select v-model="obj.sex">
                             <option>男</option>
                             <option>女</option>
                         </select>  
                     </li>
                     <li>
                        <p>公司名称</p>     
                        <input type="text" placeholder="请输入公司名称" v-model="obj.company" maxlength="16">
                     </li>
                     <li>
                        <p>主营品类</p>
                        <img src="/static/icons/xinghao.png" class="stamp">
                        <input type="text" placeholder="请输入主营品类" v-model="obj.bizMain" maxlength="16">
                     </li>
                  </ul>
           </mt-loadmore>
        </div>

        <mt-datetime-picker ref="picker" type="date" v-model="pickerValue" :startDate="start " :endDate="end" @confirm="handleConfirm">
        </mt-datetime-picker>
    </div>
</template>
<script>
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
import imageUpload from '../components/tools/imageUpload'
import validation from '../validation/validation.js'
import httpService from '../common/httpService.js'
export default {
    data() {
            return {
                param: {
                    name: 'intention',
                    index: 0,
                    url:'/static/icons/big_head.png',

                },
                obj:{
                    name:'',
                    birthday:'请选择',
                    sex:'男',
                    company:'',
                    bizMain:'',
                    url:''
                },
                router:'',
                phone:'',
                password:'',
                wrapperHeight:'',
                pickerValue: '',
                show:true,
                my_header: {
                    name: '完善信息',
                    t_show:true,
                    goSecond:true
                    
                }
            }
        },
        components: {
            myHeader,
            imageUpload
        },
        methods: {
            jump(){
                let _self = this;
                _self.confirmUpData();       
            },
             getTimeStamp(str) {
                str = str.replace(/-/g, '/');
                var date = new Date(str);
                return date.getTime();
            },
            confirmUpData() {
                let _self = this;
                let checkArr = [];
                let checkName = validation.checkNameTrue(_self.obj.name);
                checkArr.push(checkName);
                let checkBizMain = validation.checkNull(_self.obj.bizMain,'主营品类不能为空！');
                checkArr.push(checkBizMain);
                for(let i = 0; i < checkArr.length; i++){
                     if(checkArr[i]){
                        common.$emit('message',checkArr[i]);
                        return;
                     }
                }
                let birthday = _self.getTimeStamp(_self.obj.birthday)/1000;
                //console.log(_self.obj.name,_self.obj.bizMain)
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userService',
                    biz_method: 'updateUserInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        fullname: _self.obj.name,
                        birthday: birthday,
                        company: _self.obj.company,      
                        bizMain: _self.obj.bizMain,
                        avatar: _self.obj.url   
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.queryUserInfo(url, body, function(suc) {
                    common.$emit('close-load');
                    console.log(suc)
                    if (suc.data.code == "1c01") {
                        common.$emit("toMine", _self.obj);              
                        /*if(common.pageParam.router == 'forPerfectInfo'){
                                window.history.go(-1);
                            }else{
                                window.history.go(-2);        
                            }*/
                            common.$emit('getInfo',1);//首页的完善信息提醒
                            _self.$router.push('/home');
                            //window.history.go(-2); 
                        //console.log(common.pageParam.backRouter)
                    } else {
                        //common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    //common.$emit('message', err.data.msg);
                })
            },
            getUrl(param) {
                this.obj.url = param.url; 
            },
            open(picker) {
                this.$refs[picker].open();
            },
            handleConfirm(value) {
                this.obj.birthday = this.formatTime(value, 'yyyy-MM-dd');
            },
            formatTime(time, format) {
                var t = new Date(time);
                var tf = function(i) {
                    return (i < 10 ? '0' : '') + i
                };
                return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                    switch (a) {
                        case 'yyyy':
                            return tf(t.getFullYear());
                            break;
                        case 'MM':
                            return tf(t.getMonth() + 1);
                            break;
                        case 'mm':
                            return tf(t.getMinutes());
                            break;
                        case 'dd':
                            return tf(t.getDate());
                            break;
                        case 'HH':
                            return tf(t.getHours());
                            break;
                        case 'ss':
                            return tf(t.getSeconds());
                            break;
                    }
                })
            }
        },
        created() {
            let _self = this;
           _self.start = new Date("1900-01-10");
           _self.end = new Date("2017-01-10");
           
           common.$on('nextRegister',function(item){
                    _self.obj.url = '';
                    _self.obj.company = '';
                    _self.obj.name = '';
                    _self.param.url = '/static/icons/big_head.png';
                    _self.obj.bizMain = '';
                   })
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>
input[type="text"],
input[type="submit"],
input[type="reset"],
select,
textarea {
    -webkit-appearance: none;
    border-radius: 0;
}

.perfect_info .head{
     width: 100%;
     padding:0 15px;
     background-color: white; 
     float:left;
     padding: 1.5rem;
     margin-top: 1rem;
}
.perfect_info .head .head_img{
     float:right;
     width:6rem;
     height:6rem;
     border-radius: 50%;
     overflow: hidden;
}
.perfect_info .head p{
    float:left;
    margin-top:2rem;
    font-size: 1.2rem;
    line-height: 2rem;
}
.perfect_info  ul li{
    background-color: white;
    border-top: 1px solid #E5E5E5;
    float:left;
    width:100%;
    padding:1rem 15px;
}
.perfect_info  ul li p{
    float:left;
    font-size: 1.2rem;
    line-height: 2rem;
}
.perfect_info  ul li .stamp{
    float:left;
    width:0.5rem;
    margin-top: 0.55rem;
    margin-left: 5px;
}
.perfect_info  ul li input{
    float:right;
    border:none;
    height:2rem;
    line-height: 2rem;
    text-align: right;
    font-size: 1.2rem;
}
.perfect_info  ul li select{
    float:right;
    border:none;
    height:2rem;
    line-height: 2rem;
    text-align: right;
    padding-right:2rem;
    background: url(/static/images/right-arrow.png) no-repeat right center;
    background-size: 0.7rem 1.2rem;
    font-size: 1.2rem;
    margin-top: 0.3rem;
}
.perfect_info  ul li .birthday{
    float:right;
    font-size: 1.2rem;
    line-height: 2rem;
}
.perfect_info  ul li .right_arrow{
    float:right;
    margin-left: 1rem;
    height:1.2rem;
    margin-top: 0.3rem;
}
</style>
