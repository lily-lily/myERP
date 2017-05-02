<template>
    <div class="find_password">
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
                            <input type="password" class='top_text' v-model="param.code" placeholder="请输入验证码">
                            <div v-bind:class="{ my_code: !buttonDisabled, 'my_code_nor': buttonDisabled }">
                                <p>
                                    <input :value="code" type="button" :disabled='buttonDisabled' v-on:click="getCode">
                                </p>
                            </div>
                        </li>
                        <li>
                            <p><img src="/static/icons/my-password.png"></p>
                            <input type="password" class='top_text' v-model="param.passWord" placeholder="请输入新密码">
                        </li>
                        <li v-on:click="confirm" class="confirm">
                            下一步
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
                buttonDisabled: false,
                wrapperHeight: '',
                myHeader: {
                    name: '找回密码'
                },
                code: '获取验证码',
                param: {
                    phone: '',
                    code: '',
                    passWord: ''
                }
            }
        },
        components: {
            myHeader
        },
        methods: {
            getCode() {
                let _self = this;
                let checkPhone = validation.checkPhone(_self.param.phone);
                if (checkPhone) {
                    //common.$emit('message', checkPhone);
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
                }
                common.$emit('show-load');
                httpService.register(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'userSmsService',
                    biz_method: 'getRePwdCode',
                    biz_param: {
                        mobile: _self.param.phone
                    }
                }, function(response) {
                    common.$emit('close-load');
                    if (response.data.code == '1c01') {} else {
                        common.$emit('message', response.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            confirm() {
                let _self = this;
                let checkArr = [];
                let checkPhone = validation.checkPhone(_self.param.phone);
                checkArr.push(checkPhone);
                let checkpassWord = validation.checkNull(_self.param.passWord, '请输入新密码！');
                checkArr.push(checkpassWord);
                for (var i = 0; i < checkArr.length; i++) {
                    if (checkArr[i]) {
                        common.$emit('message', checkArr[i]);
                        return;
                    }
                }
                common.$emit('show-load');
                httpService.findPassWord(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'userSmsService',
                    biz_method: 'findUserPassword',
                    biz_param: {
                        phone: _self.param.phone,
                        code: _self.param.code,
                        newPassword: _self.param.passWord
                    }
                }, function(response) {
                    common.$emit('close-load');
                    if (response.data.code == '1c01') {
                        common.$emit('message', response.data.msg);
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
.find_password .bg_white {
    background-color: #F0F0F0;
}

.find_password .bg_white .fill_in {
    padding: 0 15px;
    float: left;
    width: 100%;
}

.find_password .bg_white .fill_in li {
    background: white;
    float: left;
    width: 100%;
    margin-top: 1.5rem;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
}

.find_password .bg_white .fill_in li p {
    float: left;
    height: 4rem;
}

.find_password .bg_white .fill_in li p img {
    height: 2rem;
    margin: 1rem 0 0 0.8rem;
}

.find_password .bg_white .fill_in li input {
    float: left;
    margin-top: 1rem;
    height: 2rem;
    line-height: 2rem;
    border: none;
    outline: none;
    margin-left: 25px;
    width: 125px;
}

.find_password .bg_white .fill_in .confirm {
    background: #FA6705;
    color: white;
    height: 4rem;
    line-height: 4rem;
    text-align: center;
}

.find_password .bg_white .fill_in .my_code {
    float: right;
    right: 0;
    width: 35%;
    color: #FA6705;
    padding: 1rem 10px;
    height: 4rem;
    text-align: center;
    line-height: 2rem;
    text-align: center;
}

.find_password .bg_white .fill_in .my_code>p {
    border-left: 1px solid #333333;
    height: 2rem;
    text-align: center;
    width: 100%;
}

.find_password .bg_white .fill_in .my_code>p input {
    height: 100%;
    width: 100%;
    padding: 0;
    margin-left: 10px;
    line-height: 2rem;
    background: white;
    margin-top: 0;
}

.find_password .bg_white .fill_in .my_code_nor {
    float: right;
    right: 0;
    width: 33%;
    color: #CECEBF;
    padding: 1rem 10px;
    height: 4rem;
    text-align: center;
    line-height: 2rem;
}

.find_password .bg_white .fill_in .my_code_nor input {
    height: 100%;
    width: 100%;
    padding: 0;
    margin-left: 10px;
    line-height: 2rem;
    background: white;
    margin-top: 0;
}

.find_password .bg_white .fill_in .my_code_nor>p {
    border-left: 1px solid #333333;
    height: 2rem;
    width: 100%;
}


/*.find_password .fill_in {
    padding: 0 4.6%;
    margin-top: 1rem;
    background: white;
}

.find_password .fill_in li {
    height: 5rem;
    font-size: 1.2rem;
    color: #333333;
    border-bottom: 1px solid #E0E0E0;
    line-height: 2rem;
    padding: 1.5rem 0;
}

.find_password .fill_in li input {
    outline: none;
    border: 0;
    height: 2rem;
    float: left;
    padding-left: 0.5rem;
    width: 47%;
}

.find_password .fill_in li p {
    width: 22%;
    text-align: right;
    float: left;
}

.find_password .fill_in li div {
    border-left: 1px solid #E0E0E0;
    width: 70px;
    float: right;
    font-size: 1.4rem;
}

.find_password .fill_in li .get_code {
    width: 31%;
    border: 1px solid #BFBFBF;
    height: 2.3rem;
    border-radius: 5px;
    background: #F5F5F5;
    padding: 0;
    float: right;
    line-height: 2.3rem;
    text-align: center;
}

.find_password .fill_in li .get_code_nor {
    width: 100px;
    border: 1px solid #BFBFBF;
    height: 2.3rem;
    border-radius: 5px;
    background: #F5F5F5;
    padding: 0;
    float: right;
    line-height: 2.3rem;
    text-align: center;
    color: #CECEBF;
}

.find_password .confirm {
    width: 90%;
    height: 3.5rem;
    margin-left: 5%;
    background: #FA6705;
    color: white;
    line-height: 3.5rem;
    text-align: center;
    border-radius: 1.75rem;
    margin-top: 5.5rem;
}*/
</style>
