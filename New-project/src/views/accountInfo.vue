<template>
    <div class="account_overview">
        <myHeader :param="my_header"></myHeader>
        <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
            <mt-loadmore>
                <div class="header_photo_box">
                    <p class="header_word">头像<span>(点击更改头像)</span></p>
                    <div class="photo-div">
                        <headerPhoto :param="param"></headerPhoto>
                    </div>
                </div>
                <div class="basic_data">
                    <p class="basic_data_title">基础信息</p>
                    <ul>
                        <li v-for="(item,index) in personalDataArr" v-if="index !== 4">
                            <p class="name  name_big_size" v-if="index > 2">{{item.name}}</p>
                            <p class="name  name_smart_size" v-if="index <= 2">{{item.name}}</p>
                            <p class="name_content" v-if="index !== 2">{{item.content}}</p>
                            <p class="name_content" v-if="index == 2 && item.content == '女'"><img src="/static/images/woman.png"></p>
                            <p class="name_content" v-if="index == 2 && item.content == '男'"><img src="/static/images/man.png"></p>
                        </li>
                        <li v-for="(item,index) in personalDataArr" v-if="index == 4" id="personal_authentication" @click="jumpPersonal">
                            <p class="name  name_big_size">{{item.name}}</p>
                            <p class="name_content" v-if="item.content == 0">未认证</p>
                            <p class="name_content" v-if="item.content == 1">待审核</p>
                            <p class="name_content" v-if="item.content == 2">已认证</p>
                            <p class="name_content" v-if="item.content == 3">未通过</p>
                        </li>
                    </ul>
                </div>
                <div class="company_data">
                    <p class="company_data_title">企业信息</p>
                    <ul>
                        <li v-for="(item,index) in companyDataArr" v-if="index !== 5">
                            <p class="name  name_smart_size" v-if="index <= 2">{{item.name}}</p>
                            <p class="name  name_big_size" v-if="index > 2">{{item.name}}</p>
                            <p class="name_content">{{item.content}}</p>
                        </li>
                        <li v-for="(item,index) in companyDataArr" v-if="index == 5" id="company_authentication" @click="jumpCompany">
                            <p class="name  name_big_size">{{item.name}}</p>
                            <p class="name_content" v-if="item.content == 0">未认证</p>
                            <p class="name_content" v-if="item.content == 1">待审核</p>
                            <p class="name_content" v-if="item.content == 2">已认证</p>
                            <p class="name_content" v-if="item.content == 3">未通过</p>
                        </li>
                    </ul>
                </div>
            </mt-loadmore>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import validation from '../validation/validation.js'
import myHeader from '../components/tools/myHeader'
import httpService from '../common/httpService.js'
import headerPhoto from '../components/tools/headerPhoto'
export default {
    data() {
            return {
                my_header: {
                    name: '账户信息',
                    router: "home",
                    show: true,
                    tt: true,
                    reviseRouter: 'accountInfoFinish',
                    word: '编辑'
                },
                param: {
                    url: '',
                },
                personalDataArr: [{
                    name: '姓名',
                    content: '杨帆帆'
                }, {
                    name: '生日',
                    content: '1993.10.23'
                }, {
                    name: '性别',
                    content: ''
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
                }],
                obj: {
                    name: '',
                    phone: '',
                    gender: '',

                },
                arr: {
                    name: '',
                    company: '',
                    url: ''
                },
                url: '/static/images/my-header.png'


            }
        },
        created() {
            let _self = this;
            _self.getHttp();
            common.$on("informAccountinfo", function(item) {
                _self.getHttp();
            })
        },
        components: {
            headerPhoto,
            myHeader
        },
        methods: {
            jumpPersonal() {
                common.$emit("certification", "refurbish");
                this.$router.push("certification");
            },
            jumpCompany() {
                common.$emit("companyAuthentication", "refurbish");
                this.$router.push("companyAuthentication");
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
                console.log(common.difTime);
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.queryUserInfo(url, body, function(suc) {
                    common.$emit('close-load');
                    console.log(suc);
                    let birthday = suc.data.biz_result.birthday;
                    birthday = (birthday + 24 * 60 * 60) * 1000;
                    birthday = JSON.stringify(new Date(birthday));
                    birthday = birthday.substring(1, 11);
                    _self.personalDataArr[0].content = suc.data.biz_result.fullname;
                    _self.personalDataArr[1].content = birthday;
                    _self.personalDataArr[2].content = suc.data.biz_result.gender;
                    _self.personalDataArr[3].content = suc.data.biz_result.phone;
                    _self.personalDataArr[4].content = suc.data.biz_result.utype;
                    _self.companyDataArr[0].content = suc.data.biz_result.company;
                    _self.companyDataArr[1].content = suc.data.biz_result.companyShort;
                    _self.companyDataArr[2].content = suc.data.biz_result.companyJob;
                    _self.companyDataArr[3].content = suc.data.biz_result.bizMain;
                    _self.companyDataArr[4].content = suc.data.biz_result.invoice;
                    _self.companyDataArr[5].content = suc.data.biz_result.ctype;
                    _self.param.url = suc.data.biz_result.avatar;
                    common.$emit("toMine", _self.arr);
                }, function(err) {
                    common.$emit('close-load');
                })
            },
            upData: function(router) {

            }
        },
        mounted() {

            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }


}
</script>

<style scoped>

.account_overview .header {
    color: #313232;
}

.account_overview .header_photo_box {
    height: 7.253rem;
    width: 100%;
    padding: 0 4%;
    margin-top: 0.8533rem;
    text-align: left;
    background: white;
    line-height: 7.253rem;
    background: white url(/static/images/right-arrow.png) 96% center no-repeat;
    background-size: 0.6826rem 1.024rem;
}

.account_overview .header_word {
    font-size: 1.024rem;
    color: #666666;
    float: left;
}

.account_overview .header_word span {
    color: #999999;
}



.account_overview .photo-div {
    overflow: hidden;
    background: #fff;
    float: right;
    margin-top: 1.0666rem;
    margin-right: 6%;
    width: 5.1198rem;
    height: 5.1198rem;
    border-radius: 50%;
}
.header-photo img{
    width: 5.1198rem;
    height: 5.1198rem;
}
.account_overview .basic_data,
.company_data {
    width: 100%;
    text-align: left;
}

.account_overview .company_data {
    margin-bottom: 2.5599rem;
}

.account_overview .basic_data_title,
.company_data_title {
    height: 2.99rem;
    border-top: 1px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5;
    padding: 0 75% 0 4%;
    line-height: 2.99rem;
    text-align: left;
}

.account_overview .company_data ul {
    /*padding-bottom: 50px;
  border:1px solid red;*/
}

.account_overview .basic_data ul li,
.company_data ul li {
    padding: 0 8.8% 0 4%;
    min-height: 4.267rem;
    line-height: 4.15rem;
    border-bottom: 1px solid #E5E5E5;
    background: white;
}

.account_overview .name {
    float: left;
    color: #666666;
}

.account_overview .name_content {
    float: right;
    height: 4.267rem;
    color: #999999;
}

.account_overview .name_big_size {
    font-size: 1.195rem;
}

.account_overview .name_smart_size {
    font-size: 1.024rem;
}

.account_overview .name_content img {
    height: 1.536rem;
    margin-top: 1.2rem;
}

.account_overview .name_content {
    font-size: 1.024rem;
}

.account_overview #personal_authentication {
    background: white url(/static/images/right-arrow.png) 96% center no-repeat;
    background-size: 0.6826rem 1.024rem;
}

.account_overview #company_authentication {
    background: white url(/static/images/right-arrow.png) 96% center no-repeat;
    background-size: 0.6826rem 1.024rem;
}
</style>
