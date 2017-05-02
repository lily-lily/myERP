<template>
    <div class="login">
        <myHeader :param="my_header"></myHeader>
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <img src="/static/images/logo-login.png" class="my-logo">
                    <myTab :param="myShow"></myTab>
                    <div class="password" v-show="myShow.show">
                        <div class="account-number">
                            <input type="text" placeholder="请输入用户名/手机号/邮箱" v-model="param.phone">
                        </div>
                        <div class="pass-word">
                            <input type="password" placeholder="请输入密码" v-model="param.password">
                        </div>
                    </div>
                    <div class="password" v-show="!myShow.show">
                        <div class="phone">
                            <p class="tel">+86</p>
                            <input type="text" placeholder="请输入手机号" v-model="param.phone">
                        </div>
                        <div class="pass-name">
                            <input type="text" placeholder="请输入验证码" v-model="param.code">
                            <p v-bind:class="{ my_code: !buttonDisabled, 'my_code_nor': buttonDisabled }">
                                <input v-on:click="confirmLogin()" :value='code' type="button" :disabled="buttonDisabled" class="pass_code">
                            </p>
                        </div>
                    </div>
                    <div class="prompt" id="prompt">
                        <router-link to="findPassWord">
                            <p class="left">忘记密码</p>
                        </router-link>
                        <!-- <router-link to="register"> -->
                        <div @click="jump('register')">
                           <p class="right">立即注册</p>
                        </div>
                            
                        <!-- </router-link> -->
                    </div>
                    <div class="confirm" @click="login()">登陆</div>
                </mt-loadmore>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import myTab from '../components/tools/tab'
import validation from '../validation/validation.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
export default {
    data() {
            return {
                wrapperHeight: '',
                my_header: {
                    name: '登陆',
                    router:''
                },
                myShow: {
                    show: true,
                    left_name: '密码登陆',
                    right_name: '短信登陆'
                },
                selected: 'identiCode',
                identify_code: '',
                code: '获取验证码',
                buttonDisabled: false,
                param: {
                    phone: '',
                    code: '',
                    imageCode: '',
                    password: ''
                }
            }
        },
        created() {
            let _self = this;
            this.getCode();
        },
        components: {
            myTab,
            myHeader
        },
        methods: {
            jump(router){
                   /*common.$emit('inforRegister',1)*/
                   this.$router.push(router);
            },
            passWordLogin() {
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
                        window.history.go(-1);

                    } else {
                        common.$emit('message', response.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            codeLogin() {
                let _self = this;
                common.$emit('show-load');
                httpService.login(common.urlCommon + common.apiUrl.code_login, {
                    biz_param: {
                        phone: _self.param.phone,
                        code: _self.param.code
                    }
                }, function(response) {
                    common.$emit('close-load');
                    if (response.data.code == '1c01') {
                        window.localStorage.KEY = response.data.biz_result.KEY;
                        window.localStorage.SID = response.data.biz_result.SID;
                        common.KEY = window.localStorage.KEY;
                        common.SID = window.localStorage.SID;
                        common.getDate();
                        /*_self.$router.push('/home');*/
                       // _self.$router.replace(common.pageParam.backRouter);
                       
                       window.history.go(-1);
                    } else {
                        common.$emit('message', response.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            getCode: function() {
                let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLNOPQRSTUVWXYZ0123456789';
                let res = '';
                for (var i = 0; i < 4; i++) {
                    var index = parseInt(Math.random() * 61);
                    res += str[index];
                }
                this.identify_code = res;
            },
            confirmLogin: function() {
                let _self = this;
                let checkPhone = validation.checkPhone(_self.param.phone);
                if (checkPhone) {
                    common.$emit('message', checkPhone);
                } else {
                    _self.buttonDisabled = true;
                    var wait = 60;
                    var time = setInterval(function() {
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
                        biz_method: 'getLoginCode',
                        biz_param: {
                            mobile: _self.param.phone
                        }
                    }, function(response) {
                        common.$emit('message', response.data.msg);
                    }, function(err) {
                        common.$emit('message', err.data.msg);
                    })
                }

            },
            login() {
                var checkArr = [];
                let _self = this;

                let checkPhone = validation.checkPhone(_self.param.phone);
                checkArr.push(checkPhone);
                if (_self.myShow.show == true) {
                    let checkPassword = validation.checkNull(_self.param.password, '请输入密码！');
                    checkArr.push(checkPassword);
                }
                for (var i = 0; i < checkArr.length; i++) {
                    if (checkArr[i]) {
                        common.$emit('message', checkArr[i]);
                        return;
                    }
                }
                if (_self.myShow.show == false) {
                    _self.codeLogin();
                } else if (_self.myShow.show == true) {
                    _self.passWordLogin();
                }
            }
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>
.login {
    background: url("/static/images/background-img.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    /*height:1000px;*/
    height: 100%;
}

.page-loadmore-wrapper {
    overflow-x: hidden;
}

.login .my-logo {
    width: 66.5%;
    margin-top: 10.6%;
    margin-bottom: 10.6%;
}

.login .password div {
    width: 86%;
    margin-left: 7%;
    padding: 0.8rem 0;
    border: 1px solid #313232;
    margin-top: 1.8rem;
    border-radius: 3px;
}

.login .password input {
    outline: none;
    border: none;
    background-color: transparent;
    text-align: left;
    width: 70%;
}

.login .account-number {
    background: url("/static/icons/my-phone.png") no-repeat 1.25rem center;
    background-size: 20px;
}

.login .account-number {
    background: url("/static/icons/my-phone.png") no-repeat 1.25rem center;
    background-size: 15px;
}

.login .pass-word {
    background: url("/static/icons/my-password.png") no-repeat 1.25rem center;
    background-size: 17px;
}

.login #prompt {
    width: 86%;
    padding: 1.5rem;
    border: 0;
    margin: 0 0 2.7rem 7%;
}

.login .prompt .left {
    float: left;
}

.login .prompt .right {
    float: right;
}

.login .password .phone .tel {
    float: left;
    border-right: 1px solid #333333;
    height: 100%;
    padding: 0 1rem;
}

.login .password .pass-name .pass_code {
    width: 80%;
    text-align: center;
    padding-left: 0;
}

.login .password .pass-name .my_code {
    float: right;
    width: 40%;
    border-left: 1px solid #333333;
    color: #FA6705;
}

.login .password .pass-name .my_code_nor {
    float: right;
    width: 40%;
    border-left: 1px solid #333333;
    color: #CECEBF;
    text-align: center;
}

.login .password .pass-name input {
    width: 60%;
    padding-left: 1rem;
}

.login .confirm {
    width: 86%;
    font-size: 1.8rem;
    background: #FA6804;
    padding: 1rem 0;
    color: white;
    border-radius: 3px;
    margin-left: 7%;
}
</style>
