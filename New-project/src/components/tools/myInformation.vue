<template>
    <div class="my_information">
        <div class="information">
            <ul>
                <li v-for="todo in todos" @click="jump(todo.router)">
                    <img :src="todo.url">
                    <p>{{todo.name}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'
export default {
    data() {
            return {
                todos: [{
                    url: '/static/images/custom-service.png',
                    name: '专属客服',
                    router: 'detailsPage',
                }, {
                    url: '/static/images/address-manage.png',
                    name: '地址管理',
                    router: 'addressManage'
                }, {
                    url: '/static/images/my-account.png',
                    name: '我的账户',
                    router: 'accountInfo'
                }, ],
                phone:common.servicePhone

            }
        },
        props: {
            param: {
                default: null
            }
        },
        created() {
           // console.log(this.param);
            if(!common.servicePhone)this.getCustomerPhone();
        },
        methods: {
             getCustomerPhone() {
                let _self = this;
                console.log(common.urlCommon + common.apiUrl.getDate);
                this.$http.get(common.urlCommon + common.apiUrl.getDate).then((response) => {
                    if (response.data.code == '1c01') {
                        console.log(response.data);
                        common.servicePhone=response.data.biz_result.serviceMobile;
                        _self.phone=response.data.biz_result.serviceMobile;
                    }
                }, (err) => {
                    common.$emit('message', err.data.msg);
                });
            },
            call(){
                window.location.href = "tel:"+this.phone;
            },
            jump(router) {
                let _self = this;
                if (router == 'detailsPage') {
                        if(_self.param.employee <= 100000){
                            common.$emit("confirm", {
                            message: '未设置专属客户，去设置？',
                            title: '提示',
                            ensure: _self.call
                        });
                    }else if(_self.param.employee > 100000){
                            _self.$router.push('/detailsPage');
                    }else{
                            common.$emit("confirm", {
                            message: '未设置专属客户，拨号去设置？',
                            title: '提示',
                            ensure: _self.call
                        });

                    }
                    
                } else {
                    switch (router) {
                        case 'addressManage':
                            console.log('ssssss');
                            common.$emit("informAddress", 1);
                            break;
                        case 'accountInfo':
                            common.$emit("informAccountinfo", 1)
                            break;
                        default:
                            break;
                    }
                    if (!common.customerId) {
                        function loadApp() {
                            common.$emit('setParam','backRouter','/home');
                            
                            _self.$router.push('/login');
                        }
                        common.$emit('confirm', {
                            message: '请先登录',
                            title: '提示',
                            ensure: loadApp
                        });
                        return;
                    }
                    this.$router.push(router);
                }
            }
        }
}
</script>
<style scoped>
.my_information .information {
    padding: 0.64rem 0;
    height: 5.54rem;
    background: white;
    margin-bottom: 0.8rem;
}

.my_information .information ul {
    display: flex;
    flex-direction: row;
    height: 4.2665rem;
}

.my_information .information ul li {
    flex: 1;
    border-right: 1px solid #e6e6e6;
}

.my_information .information ul li img {
    width: 1.7066rem;
    height: 1.7066rem;
    margin-top: 5px;
}

.my_information .information ul li .my-img {
    width: 1.96rem;
    height: 1.365rem;
}

.my_information .information ul li.last {
    border: none;
}

.my_information .information ul li p {
    font-size: 1.19rem;
}
</style>
