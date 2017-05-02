<template>
     <div  class="attention-header">
        <div class="main_content">
           <div class="go-back" @click="jumpBack()">
              <img src="/static/images/go-back.png">
            </div>         
            <div  class="title-name">
                 <p v-show="param.show">{{param.name}}</p>
                 <p v-show="!param.show">{{param.other_name}}</p>           
            </div>
           <div class="right_text" @click="change" v-show="param.show">{{param.other_name}}</div>
           <div class="right_text" @click="change" v-show="!param.show">{{param.name}}</div>

        </div>          
     </div>
</template>
<script>

import common from '../../common/common.js'
export default {
    data() {
            return {
                show:true
            }
        },
        props: {
            param:{

            }
        },
        methods:{
            jumpBack(){
                this.$router.push(this.param.router);
            },
            change(){
                this.param.show = !this.param.show;
                this.$emit("tab",this.param.show)
            }
        }
}
</script>
<style scoped>
.attention-header{
    width:100%;
    height:50px;
    border-bottom: 1px solid #ccc;
    position: fixed;
    z-index: 2000000;
}
.attention-header .main_content{
    position: relative;
}
.attention-header .right_text{   
    font-size: 1.2rem;
    padding-left: 1.5rem;
    background: url(/static/images/tab-no.png) no-repeat left center;
    background-size: 1.2rem;
    position: absolute;
    right:1.85rem;
    top:0;
    line-height: 50px;
    color:white;
}
.attention-header .title-name{ 
    width:100%;
    height:50px; 
    background: #EC6817;
    font-size: 1.7rem;
    line-height: 50px;
    color:white;
}
.attention-header .go-back{
    position: absolute;
    width:15%;
    padding-right:5%;
    height:50px;
    z-index: 20000;
    background:#EC6817;
}
.attention-header .go-back  img{
    margin-top: 15px;
    height:20px;
}
</style>
