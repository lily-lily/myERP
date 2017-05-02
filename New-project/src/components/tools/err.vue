<template>
    <div class="err"  :style="{ height: wholeHeight + 'px' }">
        <div class="img">
              <img :src="param.url">
              <p>{{param.err}}</p>
              <div @click="jump" v-show="param.router">{{param.next_step}}</div>
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
            param:{

            }
        },
        methods:{
            jump(){
                let _self = this;
                if(_self.param.router)this.$router.push(_self.param.router);
                
            }
        }

}
</script>
<style scoped>
.err{
   width:100%;
   height:100%;

}
.err .img{
    width:200px;
    height:120px;
    margin-left: -100px;
    margin-top: -60px;
    position: absolute;
    left:50%;
    top:50%;
    
}
.err img{
    width:80px;
    height:80px;
    margin-bottom: 10px;
}
.err .img p{
    font-size: 1.1rem;
    line-height: 1.5rem;
}
.err .img div{
    padding: 5px;
    width:80px;
    font-size: 12px;
    color:white;
    background: #FA6705;
    border-radius: 4px;
    margin-left: 60px;
    margin-top:10px;
}
</style>
