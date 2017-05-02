<template>
    <div class="address_manage">
        <myHeader :param="my_header"></myHeader>
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }" v-show="todos.length!=0">
                <mt-loadmore>
                    <ul>
                        <li v-for="(todo,index) in todos" v-show="todo.show">
                            <div class="address_top" @click="jumpBack(todo)">
                                <div class="receiver">
                                    <p class="receiver_left">
                                        <span>收货人：{{todo.contactName}}</span>
                                        <!-- <span v-show="todo.reviseShow">收货人：<input type="text" :placeholder="todo.name"></span> -->
                                    </p>
                                    <p class="receiver_right">{{todo.contactPhone}}</p>
                                </div>
                                <div class="address">
                                    <p>
                                        <span>地址：{{todo.address}}</span>
                                        <!-- <span v-show="todo.reviseShow">地址：<input type="text" :placeholder="todo.address"></span> -->
                                    </p>
                                </div>
                            </div>
                            <div class="address_bottom">
                                <p class="top_p">
                                    <img :src="todo.first_img" class="first_img" v-on:click="changeColor(todos,todo,index)">
                                    <span>默认地址</span>
                                </p>
                                <div class="address_box">
                                    <p class="center_p">
                                        <img :src="todo.second_img" class="second_img">
                                        <span v-on:click="revise(todo)">修改</span>
                                    </p>
                                    <p class="bottom_p">
                                        <img :src="todo.last_img" class="last_img">
                                        <span v-on:click="delet(index)">删除</span>
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </mt-loadmore>
            </div>

        </div>
         <div class="add_address" v-on:click="addAddress">添加新地址</div>
        <errPage :param="err" v-show="todos.length==0"></errPage>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
import errPage from '../components/tools/err'
export default {
    data() {
            return {
                scrollTop: 0,
                err: {
                    err: "很抱歉，没有设置地址",
                    url: '/static/icons/maomao.png',
                },
                wrapperHeight: '',
                my_header: {
                    name: '地址管理',
                },
                id: '',
                index: '',
                todos: [],
                obj: {}
            }
        },
        created() {
            let _self = this;
            _self.listHttp();
            common.$on("informAddress", function(id) {
                _self.listHttp();
            })
        },
        components: {
            myHeader,
            errPage
        },
        methods: {
            back() {
                history.go(-1);
            },
            jumpBack(todo) {
                let _self = this;
                
                if(common.pageParam.router == 'orderConfirm'){
                    common.$emit('backAddress', todo);
                    history.go(-1);
                }
                
            },
            listHttp() {
                //本页面列表刷新接口
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userAddressService',
                    biz_method: 'queryUserAddressList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {}
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.addressManage(url, body, function(suc) {
                    common.$emit('close-load');
                    let listArr = suc.data.biz_result.list;
                    if (suc.data.code == "1c01") {
                        for (var item in listArr) {
                            listArr[item].show = true;
                            listArr[item].reviseShow = false;
                            listArr[item].first_img = '/static/images/default_nor.png';
                            listArr[item].second_img = '/static/images/modify.png';
                            listArr[item].last_img = '/static/images/delet.png';
                            listArr[item].router = 'addressRevise';
                            if (listArr[item].type == 1) {
                                listArr[item].first_img = '/static/images/default.png';
                            }
                        }
                        _self.todos = listArr
                    } else {
                        if (suc.data.msg) {
                            common.$emit('message', suc.data.msg);
                        }
                    }
                }, function(err) {
                    common.$emit('close-load');
                    if (err.data.msg) common.$emit('message', err.data.msg);
                })
            },
            delet: function(index) {
                let _self = this;
                /*common.$emit('confirm',{
                    message:'确认删除？',
                    title:'提示',
                    ensure:_self.beforeDelet(index)
                })*/
                  function beforeDelet(){
                        let todo = _self.todos[index];
                        common.$emit('show-load');
                        let url = common.addSID(common.urlCommon + common.apiUrl.most);
                        let body = {
                            biz_module: 'userAddressService',
                            biz_method: 'deleteUserAddress',
                            version: 1,
                            time: 0,
                            sign: '',
                            biz_param: {
                                id: todo.id
                            }
                        };
                        body.time = Date.parse(new Date()) + parseInt(common.difTime);
                        body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                        httpService.addressManage(url, body, function(suc) {
                            common.$emit('close-load');
                            if (suc.data.code == '1c01') {
                                _self.todos.splice(index, 1);
                                common.$emit('clearAddress', todo);
                                
                            } else {
                                common.$emit('message', suc.data.msg);
                            }
                        }, function(err) {
                            common.$emit('close-load');
                            common.$emit('message', err.data.msg);
                        })
                    }

                       common.$emit("confirm", {
                            message: '确认删除？',
                            title: '提示',
                            ensure: beforeDelet
                       });

            },
            changeColor: function(todos, todo, index) {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userAddressService',
                    biz_method: 'setDefaultAddress',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        id: todo.id
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.addressManage(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == '1c01') {
                        common.$emit('message', suc.data.msg);
                        _self.id = suc.data.biz_result.id;
                        for (var item in todos) {
                            todos[item].first_img = '/static/images/default_nor.png';
                            todos[index].first_img = '/static/images/default.png';
                        }
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            addAddress: function() {
                this.$router.push('addAddress');
            },
            revise: function(item) {
                let _self = this;
                //跳转到修改地址
                common.$emit('setParam', 'addressId', item.id);
                common.$emit('revise-address', item.id);
                _self.$router.push('/addressRevise' + '/' + item.id);
            },
            handleScroll() {
                this.scrollTop = this.$refs.wrapper.scrollTop;
            },
            getScrollTop() {
                this.$refs.wrapper.scrollTop = this.scrollTop;
            }
        },
        watch: {
            '$route': 'getScrollTop'
        },
        mounted() {

            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
            this.$refs.wrapper.addEventListener('scroll', this.handleScroll);
        }


}
</script>
<style scoped>
.address_manage .bg_white {
    background-color: #F0F0F0;
}

.address_manage ul {
    margin-bottom: 100px;
}

.address_manage ul li {
    background: white;
    margin-top: 1rem;
}

.address_manage .page-loadmore-wrapper {
    margin-bottom: 0;
}

.address_manage ul li {
    position: relative;
}

.address_manage ul li .address_top {
    padding: 2.5rem 1.5rem 2rem 1.5rem;
    height: 8.5rem;
}

.address_manage ul li .address_top .receiver_left {
    float: left;
}

.address_manage ul li .address_top .receiver_right {
    float: right;
}

.address_manage ul li .address_top p {
    font-size: 1.2rem;
    line-height: 1.2rem;
    color: #333333;
}

.address_manage ul li .address_top p span {
    padding: 0;
    line-height: 1.2rem;
    height: 1.2rem;
    top: 0;
}

.address_manage ul li .address_top p span input {
    border: none;
    outline: none;
    color: #666666;
    padding: 0;
    margin: 0;
    height: 1.2rem;
    line-height: 1.2rem;
    margin-top: -0.1rem;
}

.address_manage ul li .address_top .address {
    position: absolute;
    top: 5rem;
}

.address_manage ul li .address_bottom {
    border-top: 1px solid #DCDCDC;
    height: 3.7rem;
    position: relative;
    line-height: 3.7rem;
}

.address_manage ul li .address_bottom img {
    height: 1.75rem;
}

.address_manage ul li .address_bottom .first_img {
    position: absolute;
    left: 1.5rem;
    top: 0.8rem;
}

.address_manage ul li .address_bottom .second_img {
    position: absolute;
    right: 11.9rem;
    top: 0.8rem;
}

.address_manage ul li .address_bottom .last_img {
    position: absolute;
    right: 4.4rem;
    top: 0.8rem;
}

.address_manage ul li .address_bottom .top_p {
    float: left;
    margin: 0 0 0 3.5rem;
}

.address_manage ul li .address_bottom .address_box {
    float: right;
    height: 3.7rem;
    width: 13.55rem;
}

.address_manage ul li .address_bottom .center_p {
    float: left;
    margin: 0 0 0 1.75rem;
}

.address_manage ul li .address_bottom .bottom_p {
    float: right;
    margin: 0 1.9rem 0 0;
}

.address_manage .add_address {
    width: 100%;
    background: #FA6705;
    font-size: 1.7rem;
    color: white;
    line-height: 50px;
    position: absolute;
    bottom: 0;
}
</style>
