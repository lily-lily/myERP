<template>
    <div class="my_set">
        <myHeader :param="my_header"></myHeader>
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <ul class="mylist">
                        <li v-for="(todo,index) in todos" @click="jump(todo)">
                            <img :src="todo.first_img" class="herder">
                            <p>{{todo.left_word}}</p>
                            <p class="last_word">{{todo.right_word}}</p>
                            <img :src="todo.second_img" class="arrow">
                        </li>
                    </ul>
                </mt-loadmore>
            </div>
            <div class="quit" @click="quit">退出当前账号</div>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
export default {
    data() {
            return {
                wrapperHeight: '',
                my_header: {
                    name: '我的设置',
                    router: 'home'
                },
                todos: [{
                    first_img: '/static/images/password-modification.png',
                    left_word: '修改密码',
                    router: 'revisePassWordConfirm',
                    second_img: '/static/images/right-arrow.png'
                }, {
                    first_img: '/static/images/address_administration.png',
                    left_word: '地址管理',
                    router: 'addressManage',
                    second_img: '/static/images/right-arrow.png'
                }, {
                    first_img: '/static/images/about.png',
                    left_word: '关于我们',
                    router: 'aboutus/us',
                    second_img: '/static/images/right-arrow.png'
                }, {
                    first_img: '/static/images/ider.png',
                    left_word: '意见反馈',
                    router: 'feedBack',
                    second_img: '/static/images/right-arrow.png'
                }, {
                    first_img: '/static/images/customer-service.png',
                    left_word: '联系客服',
                    right_word: common.servicePhone,
                    func: function() {
                        window.location.href = "tel:" + common.servicePhone;
                    }
                }, {
                    first_img: '/static/images/current-version.png',
                    left_word: '当前版本',
                    right_word: 'V 1.0'
                }]

            }
        },
        components: {
            myHeader
        },
        methods: {
            quit() {
                common.customerId = '';
                common.KEY = '';
                common.SID = '';
                common.difTime = '';
                window.localStorage.ID = '';
                window.localStorage.KEY = '';
                window.localStorage.SID = '';
                window.localStorage.difTime = '';
                common.$emit('clear_Information');
                common.$emit('setParam','backRouter','mySet');
                common.$emit('informBackMyself','mySet');
                this.$router.replace('/login');
            },
            getCustomerPhone() {
                let _self = this;
                this.$http.get(common.urlCommon + common.apiUrl.getDate).then((response) => {
                    if (response.data.code == '1c01') {
                        console.log(response.data);
                        common.servicePhone = response.data.biz_result.serviceMobile;
                        _self.todos[4].right_word = response.data.biz_result.serviceMobile;
                    }
                }, (err) => {
                    common.$emit('message', err.data.msg);
                });
            },
            jump: function(item) {
                console.log(item)
                if (item.func) {
                    item.func();
                } else {
                    if (item.router == 'addressManage') {
                        common.$emit("informAddress", 1);
                    }
                    this.$router.push(item.router);
                }
            }
        },
        created() {
            if (!common.servicePhone) this.getCustomerPhone();
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top ;
        }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.page-loadmore-wrapper {
    overflow-x: hidden;
}
.my_set .bg_white {
    background-color: #F0F0F0;

}
.my_set .mylist {
    padding: 0 4.7%;
    background: white;
}

.my_set .mylist li {
    min-height: 4.4rem;
    border-bottom: 1px solid #DADADA;
    position: relative;
}

.my_set .mylist li .herder {
    float: left;
    height: 1.5rem;
    margin-top: 1.3rem;
}

.my_set .mylist li .arrow {
    position: absolute;
    height: 1rem;
    right: 0;
    top: 1.7rem;
}

.my_set .mylist li p {
    float: left;
    line-height: 4.2rem;
    margin-left: 1.2rem;
    color: #333333;
}

.my_set .mylist li .word_right {
    float: right;
    margin-right: 1.5rem;
    color: #666666;
}

.my_set .mylist li .word_right span {
    color: #FA6705;
}

.my_set .mylist li .last_word {
    float: right;
    line-height: 4.2rem;
    /*margin-left: 1.2rem;*/
    color: #666666;
}

.my_set .quit {
    width: 100%;
    background: #FA6705;
    font-size: 1.7rem;
    color: white;
    line-height: 50px;
    position: fixed;
    bottom: 0;
}
</style>
