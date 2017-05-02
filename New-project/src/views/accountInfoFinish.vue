<template>
    <div class="account_overview_finish">
        <myHeader :param="my_header" v-on:myUpData="upData"></myHeader>
        <mt-loadmore>
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <div class="header_photo_box">
                    <p class="header_word">头像<span>(点击更改头像)</span></p>
                    <div class="header_photo">
                        <imageUpload :param="param" v-on:postUrl="getUrl"></imageUpload>
                    </div>
                </div>
                <div class="basic_data">
                    <p class="basic_data_title">基础信息</p>
                    <ul>
                        <li>
                            <p class="name name_smart_size">姓名</p>
                            <p class="name_content">
                                <input type="text" :placeholder="arr.name" v-model="arr.name" maxlength="6">
                            </p>
                        </li>
                        <li @click="open('picker')">
                            <p class="name name_smart_size">生日</p>
                            <p class="name_content">
                                {{arr.birthday}}
                            </p>
                            <mt-button size="large" class="button"></mt-button>
                        </li>
                        <li>
                            <p class="name name_smart_size">性别</p>
                            <div>
                                <p class="name_content">
                                    <select class="sex-select" v-model="arr.gender">
                                        <option>男</option>
                                        <option>女</option>
                                    </select>
                                </p>
                            </div>
                        </li>
                        <li>
                            <p class="name name_big_size">电话</p>
                            <p class="name_content">
                                <input type="text" :placeholder="arr.phone" v-model="arr.phone">
                            </p>
                        </li>
                        <li @click="jumpPersonal">
                            <p class="name name_big_size">个人认证</p>
                            <p class="name_content" v-if="arr.ucomment == 0">未认证</p>
                            <p class="name_content" v-if="arr.ucomment == 1">待审核</p>
                            <p class="name_content" v-if="arr.ucomment == 2">已认证</p>
                            <p class="name_content" v-if="arr.ucomment == 3">未通过</p>
                            <img src="/static/images/right-arrow.png" class="right-arrow">
                        </li>
                    </ul>
                </div>
                <div class="company_data">
                    <p class="company_data_title">企业信息</p>
                    <ul class="my_box">
                        <li>
                            <p class="name  name_smart_size">公司</p>
                            <p class="name_content">
                                <input type="text" :placeholder="arr.company" v-model="arr.company" maxlength="16">
                            </p>
                        </li>
                        <li>
                            <p class="name  name_smart_size">公司简称</p>
                            <p class="name_content">
                                <input type="text" :placeholder="arr.companyShort" v-model='arr.companyShort' maxlength="10">
                            </p>
                        </li>
                        <li>
                            <p class="name  name_smart_size">职位</p>
                            <p class="name_content">
                                <select class="sex-select" v-model="arr.companyJob">
                                    <option>业务员</option>
                                    <option>采购人员</option>
                                    <option>销售人员</option>
                                    <option>客服</option>
                                </select>
                            </p>
                        </li>
                        <li>
                            <p class="name  name_big_size">主营品类</p>
                            <p class="name_content">
                                <input type="text" :placeholder="arr.bizMain" v-model="arr.bizMain" maxlength="16">
                            </p>
                        </li>
                        <li>
                            <p class="name  name_big_size">开票信息</p>
                            <p class="name_content">
                                <!-- <input type="text" :placeholder="arr.invoice" v-model="arr.invoice" maxlength="16"> -->
                                <select class="sex-select" v-model="arr.invoice">
                                    <option>增值税发票</option>
                                    <option>普通发票</option>
                                </select>
                            </p>
                        </li>
                        <li @click="jumpCompany">
                            <p class="name  name_big_size">企业认证</p>
                            <p class="name_content" v-if="arr.ccomment == 0">未认证</p>
                            <p class="name_content" v-if="arr.ccomment == 1">待审核</p>
                            <p class="name_content" v-if="arr.ccomment == 2">已认证</p>
                            <p class="name_content" v-if="arr.ccomment == 3">未通过</p>
                            <img src="/static/images/right-arrow.png" class="right-arrow">
                        </li>
                    </ul>
                </div>
            </div>
        </mt-loadmore>
        <mt-datetime-picker ref="picker" type="date" v-model="pickerValue" :startDate="start " :endDate="end" @confirm="handleConfirm">
        </mt-datetime-picker>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
import imageUpload from '../components/tools/imageUpload'
import validation from '../validation/validation.js'

export default {

    data() {
            return {
                start: '',
                end: '',
                sex: '',
                my_header: {
                    name: '账户信息',
                    router: "home",
                    t_show: true,
                    reviseRouter: 'accountInfoFinish',
                    word: '完成'
                },
                param: {
                    name: 'intention',
                    index: 0,
                    header_url: '',
                    url:'/static/images/my-header.png'
                },
                birthday: '',
                pickerValue: '',
                arr: {
                    name: '',
                    birthday: '请选择',
                    gender: '男',
                    phone: '',
                    ucomment: '',
                    company: '',
                    companyShort: '',
                    companyJob: '业务员',
                    bizMain: '',
                    invoice: '增值税发票',
                    ccomment: '',
                    url: ''
                },

                personalDataArr: [{
                    name: '姓名',
                    content: '杨帆帆'
                }, {
                    name: '生日',
                    content: '1993.10.23'
                }, {
                    name: '性别',
                    img_src: '/static/images/woman.png'
                }, {
                    name: '电话',
                    content: '15971484216'
                }, {
                    name: '个人认证',
                    content: '已认证'
                }],

                companyDataArr: [{
                    name: '公司',
                    content: '上海冕冠电子商务有限公司'
                }, {
                    name: '公司简称',
                    content: '上海冕冠'
                }, {
                    name: '职位',
                    content: '采购人员'
                }, {
                    name: '主营品类',
                    content: '枸杞、龙胆、白术'
                }, {
                    name: '开票信息',
                    content: '枸杞、龙胆、白术'
                }, {
                    name: '企业认证',
                    content: '已认证'
                }]
            }
        },
        components: {
            imageUpload,
            myHeader
        },
        created() {
            let _self = this;
            _self.getHttp();
            _self.start = new Date("1900-01-10");
            _self.end = new Date("2017-01-10");
            let type = '';
            let ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) {
                type = 'ios';
            }
            if (type == 'ios') {
                _self.start = new Date("1900/01/10");
                _self.end = new Date("2017/01/10");
            }
            common.$on("informAccountFinish", function(item) {
                _self.getHttp();
            });
        },

        methods: {
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
            },
            getTimeStamp(str) {
                str = str.replace(/-/g, '/');
                var date = new Date(str);
                return date.getTime();
            },
            handleConfirm(value) {
                this.arr.birthday = this.formatTime(value, 'yyyy-MM-dd');
            },
            jumpPersonal() {
                common.$emit("certification", "refurbish");
                this.$router.push("certification");
            },
            jumpCompany() {
                common.$emit("companyAuthentication", "refurbish");
                this.$router.push("companyAuthentication");
            },
            jump(router) {
                this.$router.push(router);
            },

            getUrl(param) {
                this.arr.url = param.url;
                this.param.header_url = false;
            },
            open(picker) {
                this.$refs[picker].open();
            },
            getHttp() {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userService',
                    biz_method: 'queryUserInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {}
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.queryUserInfo(url, body, function(suc) {
                    common.$emit('close-load');
                    let birthday = suc.data.biz_result.birthday;
                    birthday = (birthday + 24 * 60 * 60) * 1000;
                    birthday = JSON.stringify(new Date(birthday));
                    birthday = birthday.substring(1, 11);
                    _self.arr.name = suc.data.biz_result.fullname;
                    _self.arr.birthday = birthday;
                    _self.arr.gender = suc.data.biz_result.gender;
                    _self.arr.phone = suc.data.biz_result.phone;
                    _self.arr.ucomment = suc.data.biz_result.utype;
                    _self.arr.company = suc.data.biz_result.company;
                    _self.arr.companyShort = suc.data.biz_result.companyShort;
                    _self.arr.companyJob = suc.data.biz_result.companyJob;
                    _self.arr.bizMain = suc.data.biz_result.bizMain;
                    _self.arr.invoice = suc.data.biz_result.invoice;
                    _self.arr.ccomment = suc.data.biz_result.ctype;
                    _self.param.header_url = suc.data.biz_result.avatar;
                    console.log(_self.param.url)
                }, function(err) {
                    common.$emit('close-load');
                })
            },

            upData() {
                let _self = this;
                let checkArr = [];
                let checkPhone = validation.checkPhoneTrue(_self.arr.phone);
                checkArr.push(checkPhone);
                let checkName = validation.checkNameTrue(_self.arr.name);
                checkArr.push(checkName);
                let checkBizMain = validation.checkNull(_self.arr.bizMain,'主营品类不能为空！');
                checkArr.push(checkBizMain);
                for(let i = 0; i < checkArr.length; i++){
                    if(checkArr[i]){
                         common.$emit('message',checkArr[i]);
                         return
                    } 
                }
                common.$emit("confirm", {
                    message: '确定修改账户信息',
                    title: '提示',
                    ensure: _self.confirmUpData
                });

            },
            confirmUpData() {
                let _self = this;
                let birthday = _self.getTimeStamp(_self.arr.birthday)/1000;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userService',
                    biz_method: 'updateUserInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        gender: _self.arr.gender,
                        fullname: _self.arr.name,
                        phone: _self.arr.phone,
                        birthday: birthday,
                        company: _self.arr.company,
                        companyShort: _self.arr.companyShort,
                        bizMain: _self.arr.bizMain,
                        avatar: _self.arr.url,
                        companyJob: _self.arr.companyJob,
                        invoice: _self.arr.invoice,
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.queryUserInfo(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == "1c01") {
                        common.$emit("informAccountinfo", "refurbish");

                        window.history.go(-1);
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', suc.data.msg);
                })
            }
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

.page-loadmore-wrapper {
    margin-top: -1px;
    overflow: scroll;
    padding-bottom: 10px;
    width: 100%;
}

.account_overview_finish .my_box {}

.account_overview_finish .header {
    color: #313232;
}

.account_overview_finish #right {
    color: #EC6817;
}

.account_overview_finish .birthday {
    width: 100px;
    height: 100px;
    background: red;
}

.account_overview_finish .header_photo_box {
    min-height: 7.253rem;
    width: 100%;
    padding: 0 4%;
    margin-top: 0.8533rem;
    text-align: left;
    background: white;
    line-height: 7.253rem;
    background: white url(/static/images/right-arrow.png) 96% center no-repeat;
    background-size: 0.6826rem 1.024rem;
    position: relative;
}

.account_overview_finish .header_word {
    font-size: 1.024rem;
    color: #666666;
    float: left;
}

.account_overview_finish .header_word span {
    color: #999999;
}

.account_overview_finish .header_photo_box .header_photo {
    width: 5.1198rem;
    height: 5.1198rem;
    border-radius: 50%;
    background: #fff;
    right: 10%;
    margin-top: 1.0666rem;
    overflow: hidden;
    position: absolute;
    z-index: 20000000;
}

.account_overview_finish .basic_data,
.company_data {
    width: 100%;
    text-align: left;
}

.account_overview_finish .company_data {
    margin-bottom: 2.5599rem;
}

.account_overview_finish .basic_data_title,
.company_data_title {
    height: 2.99rem;
    border-top: 1px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5;
    padding: 0 75% 0 4%;
    line-height: 2.99rem;
}

.account_overview_finish .basic_data ul li,
.company_data ul li {
    padding: 0 8.8% 0 4%;
    height: 4.267rem;
    line-height: 4.15rem;
    border-bottom: 1px solid #E5E5E5;
    background: white;
    position: relative;
}

.account_overview_finish .name_content input {
    height: 2.5rem;
    text-align: right;
    outline: none;
    border: 0;
    line-height: 2.5rem;
    background: white;
}

.account_overview_finish .name {
    float: left;
    color: #666666;
}

.account_overview_finish .name_content {
    float: right;
    height: 4.267rem;
    color: #999999;
}

.account_overview_finish .name_content img {
    height: 1.536rem;
    margin-top: 1.36rem;
}

.account_overview_finish .name_content {
    font-size: 1.024rem;
}

.account_overview_finish .name_big_size {
    font-size: 1.195rem;
}

.account_overview_finish .name_smart_size {
    font-size: 1.024rem;
}

.account_overview_finish .right-arrow {
    position: absolute;
    right: 4%;
    top: 1.6215rem;
    width: 0.6826rem;
    height: 1.024rem;
}

.account_overview_finish .button {
    position: absolute;
    right: 4%;
    background: url(/static/images/down-arrow.png ) no-repeat right center;
    background-size: 1.024rem 0.6826rem;
    width: 1.024rem;
    height: 100%;
    box-shadow: none;
}

.account_overview_finish .down-arrow {
    position: absolute;
    right: 4%;
    top: 1.79rem;
    height: 0.6826rem;
    width: 1.024rem;
}

.account_overview_finish .sex-select {
    border: none;
    height: 4.1rem;
    line-height: 4.26rem;
    position: absolute;
    right: 4%;
    padding-right: 20px;
    background: url(/static/images/down-arrow.png ) no-repeat right center;
    background-size: 1.024rem 0.6826rem;
}
</style>
