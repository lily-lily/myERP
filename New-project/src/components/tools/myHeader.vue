<template>
    <div class="my-header">
        <div class="header_content">
            <div class="go-back" @click="jumpBack()">
                <img src="/static/images/go-back.png">
            </div>
            <div class="title-name">
                <p>{{param.name}}</p>
            </div>
            <p v-show="param.show" @click="jumpRevise">编辑</p>
            <p v-show="param.t_show" @click="jumpRevise">完成</p>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'

export default {
    data() {
            return {
            }
        },
        props: {
            param: {
            }
        },
        methods: {
            jumpBack() {
                let _self = this;
                if(this.param.goBack){
                        _self.$router.push('/home');  
                }else{
                    if(window.history.length==1){
                        _self.$router.push('/home');
                    }else{
                         if(_self.param.goSecond){
                              /* common.$emit('getInfo',1);                      
                               window.history.go(-2);    */  
                                 common.$emit('getInfo',1);
                                 _self.$router.push('/home');             
                         }else{
                             window.history.go(-1);
                         }
                         
                    }
                    
                }
               
            },
            jumpRevise() {
                let _self = this;
                
                if (_self.param.t_show == true) {
                    _self.$emit('myUpData', 'genxin');

                } else if (_self.param.tt == true) {
                    common.$emit("informAccountFinish", "refurbish");
                    _self.$router.push(_self.param.reviseRouter);
                } else {
                    common.$emit("res-id", this.param.item);
                    _self.$router.push(_self.param.reviseRouter); //跳转到修改资源
                }
            }
        }
}
</script>
<style scoped>
.my-header {
    width: 100%;
    height: 50px;
    background: #EC6817;
}

.my-header .header_content{
    background: #EC6817;
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    z-index: 2000;
}

.my-header .title-name {
    width: 60%;
    height: 50px;
    float: left;
    font-size: 1.7rem;
    line-height: 50px;
    color: white;
}

.my-header .go-back {
    float: left;
    width: 20%;
    padding-right: 5%;
    height: 50px;
    z-index: 20000;
    background: #EC6817;
}

.my-header .go-back img {
    margin-top: 15px;
    height: 20px;
}

.my-header .header_content>p {
    position: absolute;
    right: 0;
    font-size: 14px;
    top: 0;
    padding: 16px 1.5rem;
    color: white;

}

.my-header .active {
    color: #FA6705;
}
</style>
