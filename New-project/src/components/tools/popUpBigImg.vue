<template>
    <div class="pop_up" :style="{ height: param.whole_height + 'px' }"  v-on:click="backDetail()">    
            <mt-swipe :auto="0" :prevent="false" :show-indicators="false"> 
                <mt-swipe-item v-for="(item,index) in param.url">
                <div>
                    <img v-bind:src="item">      
                </div>                                                    
                </mt-swipe-item>
            </mt-swipe>      
    </div>
</template>
<script>
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
            backDetail(index,imgArr){           
                 this.param.show = !this.param.show;
            }         
        },
        created() {
            
        },
        computed:{

        }      
}
</script>
<style scoped>
.pop_up{
    width:100%;
    position: relative;
    overflow: hidden;
    background: black;
}
.pop_up>div{
    overflow: hidden;
    width:100%;
}
.pop_up img{
    width:100%;
    margin:auto;
    position: absolute;
    top:0;
    left:0;
    bottom: 0;
    right:0;
    z-index: 999;
}
.pop_up  .swipe_height{
    width:100%;
    height:100%;
}
</style>
