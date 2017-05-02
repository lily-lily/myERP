<template>
    <div class="register">
        <myHeader :param="myHeader"></myHeader>
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <ul class="fill_in">
                        <li>
                            <p><img src="/static/icons/my-phone.png"></p>
                            <input type="text" class='top_text' v-model="param.phone" placeholder="请输入手机号码">
                        </li>           
                         <li>
                            <p><img src="/static/icons/my-password.png"></p>
                            <input type="password" class='top_text' v-model="param.password" placeholder="请输入密码">
                        </li>
                        <li>
                            <p><img src="/static/icons/my-password.png"></p>
                            <input type="password" class='top_text' v-model="param.againPassword" placeholder="请确认密码">
                        </li>
                         <li>
                            <p><img src="/static/icons/my-password.png"></p>
                            <input type="password" class='top_text' v-model="param.code" placeholder="请输入验证码">
                            
                           <div  v-bind:class="{ my_code: !buttonDisabled, 'my_code_nor': buttonDisabled }" >
                                 <p><input  :value="code" type="button" v-on:click="confirm" :disabled = 'buttonDisabled'  ></p>
                            </div> 
                        </li>
                        <li  v-on:click="register" class="confirm">
                                注册
                        </li>
                    </ul>
                </mt-loadmore>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
import validation from '../validation/validation.js'
import httpService from '../common/httpService.js'
export default {
    data() {
            return {
                buttonDisabled:false,
                wrapperHeight: '',
                myHeader: {
                    name: '注册'
                },
                code: '获取验证码',
                buttonDisabled: false,
                param: {
                    phone: '',
                    code: '',
                    imageCode: '',
                    password: '',
                    againPassword: ''
                }
            }
        },
        components: {
            myHeader
        },
        created(){
             
        },
        methods: {
            confirm: function() {
                let _self = this;
                let checkPhone = validation.checkPhone(_self.param.phone);
                if (checkPhone) {
                    common.$emit('message', checkPhone);
                } else {
                    _self.buttonDisabled = true;
                    let wait = 60;
                    let time = setInterval(function() {
                        wait--;
                        _self.code = wait;
                        if (wait == 0) {
                            clearInterval(time);
                            _self.code = '获取验证码';
                            _self.buttonDisabled = false;
                        }
                    }, 1000);

                     httpService.register(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'userSmsService',
                    biz_method: 'getVervifyCode',
                    biz_param: {
                        mobile: _self.param.phone
                    }
                }, function(response) {
                   
                    if (response.data.code == '1c01') {
                    } else {
                        common.$emit('message', response.data.msg);
                    }
                }, function(err) {
                
                    common.$emit('message', err.data.msg);
                })
                }
              
               
            },
            login(){
                let _self = this;
                common.$emit('show-load');
                httpService.login(common.urlCommon + common.apiUrl.login, {
                    biz_param: {
                        phone: _self.param.phone,
                        password: _self.param.password
                    }
                }, function(response) {
                    common.$emit('close-load');
                    if (response.data.code == '1c01') {
                        window.localStorage.KEY = response.data.biz_result.KEY;
                        window.localStorage.SID = response.data.biz_result.SID;
                        common.KEY = window.localStorage.KEY;
                        common.SID = window.localStorage.SID;
                        common.getDate();
                        common.$emit('nextRegister',1);
                        _self.$router.replace('perfectInfo');
                    } else {
                        //common.$emit('message', response.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    //common.$emit('message', err.data.msg);
                })
            },
            register() {
                var checkArr = [];
                let _self = this;
                let checkPhone = validation.checkPhone(_self.param.phone);
                checkArr.push(checkPhone);
                let checkPassword = validation.checkNull(_self.param.password, '请输入密码！');
                checkArr.push(checkPassword);
                let checkagainPassword = validation.checkNull(_self.param.againPassword, '请确认密码！');
                checkArr.push(checkagainPassword);

                let checkCommon = validation.checkCommon(_self.param.password, _self.param.againPassword);
                checkArr.push(checkCommon);
                

                for (var i = 0; i < checkArr.length; i++) {
                    if (checkArr[i]) {
                        common.$emit('message', checkArr[i]);
                        return;
                    }
                }
                common.$emit('show-load');
                httpService.register(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'userSmsService',
                    biz_method: 'registerUser',
                    biz_param: {
                        phone: _self.param.phone,
                        code: _self.param.code,
                        password: _self.param.password,
                        rePassword: _self.param.againPassword
                    }
                }, function(response) {
                    common.$emit('close-load');
                    if (response.data.code == '1c01') {
                        common.$emit('message', response.data.msg);
                        _self.login();
                        
                    } else {
                        common.$emit('message', response.data.msg);
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
.register{

}
.register .bg_white{
   background-color: #F0F0F0;
}
.register .bg_white .fill_in{
    padding: 0 15px;
    float:left;
    width:100%;
}
.register .bg_white .fill_in li{
   background:white;
   float:left;
   width:100%;
   margin-top:1.5rem;
   border-radius: 4px;
   position: relative;
}
.register .bg_white .fill_in li p{
   float:left;
   height:40px;
   
}
.register .bg_white .fill_in li p img{
   height:2rem;
   margin:1rem 0 0 0.8rem;
}
.register .bg_white .fill_in li  input{
   float:left;
   margin-top: 10px;
   height:20px;
   line-height: 20px;
   border:none;
   outline: none;
   margin-left: 25px;
   max-width: 120px;
   font-size: 14px;
}
.register .bg_white .fill_in .confirm{
    background: #FA6705;
    color: white;
    height:4rem;
    line-height: 4rem;
    text-align: center;

}
.register .bg_white .fill_in .my_code {
    float: right;
    margin-right:10px;
    width: 33%;
    color: #FA6705;
    padding: 1rem 0;
    height:4rem;
    text-align: center;   
    line-height: 2rem;
    text-align: center;
}
.register .bg_white .fill_in .my_code>p{
    border-left: 1px solid #333333;
    height:2rem;
    text-align: center;
    width:100%;
}
.register .bg_white .fill_in .my_code>p input{
    margin-top: 0;
    height:100%;
    width:100%;
    padding: 0;
    margin-left: 10px;
    line-height: 2rem;
    background: white;

}
.register .bg_white .fill_in .my_code_nor{
    float: right;
    right:0;
    width: 33%;
    color: #CECEBF;
    padding: 1rem 10px;
    height:4rem;
    text-align: center;
    line-height: 2rem;  
} 
.register .bg_white .fill_in .my_code_nor input{
     height:100%;
     width:100%;
     padding: 0;
     margin-left: 10px;
     line-height: 2rem;
     background: white;
     margin-top: 0;
     margin-right: 10px;
}
.register .bg_white .fill_in .my_code_nor>p{
    border-left: 1px solid #333333;
    height:2rem; 
    width:100%;
}
/*.register .fill_in {
    padding: 0 4.6%;
    margin-top: 1rem;
    background: white;
    overflow: hidden;
}

.register .fill_in li {
    height: 5rem;
    font-size: 1.2rem;
    color: #333333;
    border-bottom: 1px solid #E0E0E0;
    line-height: 2rem;
    padding: 1.5rem 0;
    overflow: hidden;
}

.register .fill_in li input {
    outline: none;
    border: 0;
    height: 2rem;
    float: left;
    font-size: 1.2rem;
    padding-left: 0.5rem;
    width: 47%;
}

.register .fill_in li p {
    width: 23.5%;
    text-align: right;
    float: left;
}




.register .fill_in li .get_code {
    width: 80px;
    border: 1px solid #BFBFBF;
    height: 2.3rem;
    border-radius: 5px;
    background: #F5F5F5;
    float: right;
    line-height: 2.3rem;
    padding: 0;
}

.register .fill_in li .get_code_nor {
    width: 80px;
    border: 1px solid #BFBFBF;
    height: 2.3rem;
    border-radius: 5px;
    background: #F5F5F5;
    float: right;
    line-height: 2.3rem;
    padding: 0;
    color: #CECEBF;
}

.register .confirm_register {
    width: 90%;
    height: 3.5rem;
    margin-left: 5%;
    background: #FA6705;
    color: white;
    line-height: 3.5rem;
    text-align: center;
    border-radius: 1.75rem;
    margin-top: 9rem;
}*/
</style>
