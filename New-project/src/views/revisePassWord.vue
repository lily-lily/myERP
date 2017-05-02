<template>
    <div class="revise_password">
        <myHeader :param="my_header"></myHeader>
        </mt-header>
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <ul class="fill_in">
                        <li>
                            <p>手机号：</p>
                            <input type="text" class='top_text' v-model="param.phone">
                        </li>
                        <li class="bottom_li">
                            <p>验证码：</p>
                            <input type="text" placeholder="请输入你的验证码" class="bottom_text" v-model="param.code">
                            <button v-on:click="confirm" id="get_code" v-bind:class="{ get_code: !buttonDisabled, 'get_code_nor': buttonDisabled }">{{code}}</button>
                        </li>
                    </ul>
                </mt-loadmore>
            </div>
            <div class="next_step" v-on:click="nextStep">下一步</div>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import validation from '../validation/validation.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
export default {
    data() {
            return {
                code: '获取验证码',
                wrapperHeight: '',
                my_header: {
                    name: '修改密码',
                    router: 'home'
                },
                param: {
                    phone: '',
                    code: ''
                }

            }
        },
        components: {
            myHeader
        },
        methods: {
            confirm: function() {
                let _self = this;
                let checkPhone = validation.checkPhone(_self.param.phone);
                if (checkPhone) {
                    common.$emit('message', checkPhone);
                } else {
                    _self.buttonDisabled = true;
                    let wait = 5;
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
            },
            nextStep: function() {
                let _self = this;
                let checkArr = [];
                let checkPhone = validation.checkPhone(_self.param.phone);
                checkArr.push(checkPhone);
                let checkCode = validation.checkCode(_self.param.code, '123456');
                checkArr.push(checkCode);
                for (var i = 0; i < checkArr.length; i++) {
                    if (checkArr[i]) {
                        common.$emit('message', checkArr[i]);
                        return
                    }
                }
                if (checkPhone == false && checkCode == false) {
                    _self.$router.push('revisePassWordConfirm');
                }
            }
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>
.revise_password .bg_white {
    background-color: #F0F0F0;
}

.revise_password .fill_in {
    background: white;
    padding: 2rem 0 5rem 4.7%;
}

.revise_password .fill_in li {
    height: 3.5rem;
}

.revise_password .fill_in p {
    float: left;
    font-size: 1.2rem;
    color: #333333;
    line-height: 3.5rem;
}

.revise_password .fill_in input {
    float: left;
    height: 3.5rem;
    border-radius: 1.75rem;
    border: 1px solid #C9C9C9;
    padding: 0 1.75rem;
}

.revise_password .fill_in .top_text {
    width: 75%;
    margin-left: 0.5rem;
}

.revise_password .fill_in .bottom_text {
    width: 45.9%;
}

.revise_password .fill_in .get_code {
    width: 30%;
    height: 3.5rem;
    border-radius: 1.75rem;
    border: 1px solid #C9C9C9;
    float: left;
    margin-left: 0.5rem;
    outline: none;
}

.revise_password .fill_in .get_code_nor {
    width: 30%;
    height: 3.5rem;
    border-radius: 1.75rem;
    border: 1px solid #C9C9C9;
    float: left;
    margin-left: 0.5rem;
    outline: none;
    color: #F0F0E1;
}

.revise_password .fill_in .bottom_li {
    margin-top: 2rem;
}

.revise_password .next_step {
    width: 78%;
    height: 3.5rem;
    background: #FA6705;
    color: white;
    font-size: 1.7rem;
    text-align: center;
    line-height: 3.5rem;
    border-radius: 1.75rem;
    margin: 7.5rem 11% 0 11%;
}
</style>
