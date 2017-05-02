<template>
    <div class="details_page">
        <myHeader :param="myHeader"></myHeader>

        <div class="bg_white">

            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <ul class="info_list">
                        <li v-for="(todo,index) in todos" v-if="index == 0" class="header_phone">
                            <div>
                                <imageUpload :param="param" v-on:postUrl="getUrl"></imageUpload>
                            </div>
                            <p class="name_content">{{todo.content}}</p>
                        </li>
                        <li v-for="(todo,index) in todos" v-if="index > 0">
                            <img :src="todo.img_src">
                            <p class="name">{{todo.name}}</p>
                            <p class="name_content"  @click="call(index)">{{todo.content}}</p>
                        </li>
                    </ul>
                    <div class="advantage" v-for="item in data">
                        <img :src="item.img_src">
                        <p>{{item.name}}</p>
                        <div>
                            {{item.content}}
                        </div>
                    </div>
                </mt-loadmore>
            </div>

        </div>

    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
import imageUpload from '../components/tools/imageUpload'
export default {
    data() {
            return {
                wrapperHeight: '',
                myHeader: {
                    name: '详情',


                },
                param: {
                    name: 'intention',
                    index: 0,
                    url:'/static/icons/big_head.png'
                },
                msg: 'Welcome to Your Vue.js App',
                todos: [{
                    img_src: '/static/images/girl.png',

                    content: '丽丽'
                }, {
                    img_src: '/static/images/sex.png',
                    name: '性别',
                    content: '女'
                }, {
                    img_src: '/static/images/phone-number.png',
                    name: '手机号',
                    content: '15974184216'
                }, {
                    img_src: '/static/images/office-telephone.png',
                    name: '办公室电话',
                    content: '0212-4550884'
                }, {
                    img_src: '/static/images/qq.png',
                    name: 'QQ',
                    content: '1109714809'
                }, {
                    img_src: '/static/images/wechat.png',
                    name: '微信',
                    content: 'bb1109714809'
                }],

                data: [{
                    img_src: '/static/images/be-good-at.png',
                    name: '擅长领域',
                    content: '擅长领域擅长领域擅长领域擅长领域擅长领域擅长领域擅长领域擅长领域擅长领域擅长领域擅长领域擅长领域'
                }]

            }
        },
        methods: {
            getUrl(param) {
                console.log('dddddd');
                console.log(param);
            },
            call(index){
                if(index == 2){
                    window.location.href = "tel:" + this.todos[2].content;
                }
                 
            },
            getHttp(){
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userService',
                    biz_method: 'queryEmployeeInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {

                    }
                };

                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.queryEmployeeInfo(url, body, function(suc) {
                    common.$emit('close-load');
                    console.log(suc.data.biz_result);
                    let sex = suc.data.biz_result.gender;
                    if(sex == 0){
                        sex = '女'
                    }else{
                        sex = '男'
                    }
                    _self.todos[0].content = suc.data.biz_result.name;
                    _self.todos[1].content = sex;
                    _self.todos[2].content = suc.data.biz_result.mobile;
                    _self.todos[3].content = suc.data.biz_result.extno;
                    _self.todos[4].content = suc.data.biz_result.qq;
                    _self.todos[5].content = suc.data.biz_result.wechat;
                    _self.data[0].content = suc.data.biz_result.goodfield
                }, function(err) {
                    common.$emit('close-load');
                })
            }
        },
        components: {
            imageUpload,
            myHeader
        },
        
        created() {
            let _self = this;
            _self.getHttp();

        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }


}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.details_page .info_list {
    padding: 0 1.5rem;
    background: white;
    margin: 1rem 0;
}

.details_page .info_list li {
    height: 4.4rem;
    border-bottom: 1px solid #DCDCDC;
    position: relative;
    font-size: 1.2rem;
    line-height: 4.4rem;
}

.details_page .info_list .header_phone {
    height: 8.5rem;
    line-height: 8.5rem;
    position: relative;
    padding: 1rem 0 0 0;
}

.details_page .info_list .header_phone div {
    width: 6.5rem;
    height: 6.5rem;
    position: absolute;
    left: 0;
    border-radius: 50%;
    z-index: 200000;
    overflow: hidden;
}

.details_page .info_list .header_phone .name_content {
    line-height: 6.5rem;
}

.details_page .info_list li img {
    height: 1.5rem;
    position: absolute;
    left: 0;
    top: 1.3rem;
}

.details_page .info_list li .name {
    color: #333333;
    position: absolute;
    left: 3rem;
}

.details_page .info_list li .name_content {
    color: #666666;
    float: right;
}

.details_page .advantage {
    padding: 1.5rem;
    background: white;
    position: relative;
    min-height: 11rem;
    margin-bottom: 100px;
}

.details_page .advantage img {
    height: 1.5rem;
    position: absolute;
    left: 1.5rem;
    top: 1.55rem;
}

.details_page .advantage p {
    float: left;
    margin-left: 3rem;
    color: #333333;
    font-size: 1.2rem;
}

.details_page .advantage div {
    float: left;
    margin: 1.5rem 0 0 3rem;
    text-align: left;
    font-size: 1rem;
    color: #666666;
    line-height: 1.5rem;
}
</style>
