<template>
    <div class="content telAndAttention">
        <button class="mint-button mint-button--primary mint-button--normal small_button" v-on:click="call()"> 
            <img src="/static/icons/tel.png">
            <p>电话</p>
        </button>
        <button v-if="obj.isAttention" class="mint-button mint-button--primary mint-button--normal small_button" v-on:click="myAttention(0)">
            <img src="/static/icons/follow.png">
            <p>已关注</p>
        </button>
        <button v-if="!obj.isAttention" class="mint-button mint-button--primary mint-button--normal small_button" v-on:click="myAttention(1)">
            <img src="/static/icons/unfollow.png">
            <p>未关注</p>
        </button>
    </div>
</template>
<script>
import common from '../../common/common.js'
import httpService from '../../common/httpService.js'
export default {
    data(){
        return{
            phone:common.servicePhone
        }
    },
    props: {
        obj: {}
    },
    methods: {
        call(){
             window.location.href = "tel:"+this.phone;
        },
        getCustomerPhone() {
            let _self = this;
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
        myAttention(type) {
            if (!common.customerId) {

                 let _self=this;
               
                    function loadApp() {
                        _self.$router.push('/login');
                    }
                    common.$emit('confirm', {
                        message: '请先登录',
                        title: '提示',
                        ensure: loadApp
                    });
                    return ;
            }
            let _self = this;
            common.$emit('show-load');
            let url = common.addSID(common.urlCommon + common.apiUrl.most);
            let body = {
                biz_module: 'userService',
                biz_method: 'userAttention',
                version: 1,
                time: 0,
                sign: '',
                biz_param: {
                    intentionId: _self.obj.id,
                    type: type,
                    breedName: _self.obj.breedName,
                    intentionType: _self.obj.type
                }
            };
            body.time = Date.parse(new Date()) + parseInt(common.difTime);
            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            httpService.addAddress(url, body, function(suc) {
                common.$emit('close-load');
                if (suc.data.code == '1c01') {
                    common.$emit('message', suc.data.msg);
                    common.$emit("informResAttention",_self.obj.type);
                    if (type) {
                        _self.obj.isAttention = 1;
                    } else {
                        _self.obj.isAttention = 0;
                    }
                } else {
                    common.$emit('message', suc.data.msg);
                }

            }, function(err) {
                common.$emit('close-load');
                common.$emit('message', err.data.msg);
            })
        }
    },
    created() {
        if(!common.servicePhone)this.getCustomerPhone();
    }
}
</script>
<style scoped>
.telAndAttention {
    float: left;
    width: 100%;
}

.telAndAttention .small_button {
    width: 50%;
    float: left;
    background: #EEEEEE;
    border: 1px solid #ddd;
    padding-left: 0;
    padding-right: 0;
}

.telAndAttention .small_button img {
    max-height: 13px;
}

.telAndAttention .small_button p {
    font-size: 10px;
    color: #333;
}
</style>
