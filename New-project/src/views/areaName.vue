<template>
    <div class="area_address">
        <mt-header title="选择地区">
            <router-link to="/cityName" slot="left">
                <mt-button icon="back" ></mt-button>
            </router-link>
        </mt-header>
        <ul>
           

           <li v-for="todo in todos">
              <p>{{todo.place}}</p>
                
              
           </li>
          
        </ul>

  <!-- <mt-picker :slots="slots" @change="onValuesChange" v-show="active" class="place" textAlign="center"></mt-picker> -->
<!-- <mt-picker :slots="slots" @change="onValuesChange"></mt-picker> -->

    </div>
</template>
<script>
import common from '../common/common.js'

export default {
    data() {
            return {
                 todos:[{
                     place:"松江区",
                     
                 },{
                     place:"徐汇区",
                     
                 },{
                     place:"黄浦区",
                     
                 },{
                     place:"奉贤区",
                     
                 },{
                     place:"青浦区",
                     
                 },{
                     place:"宝山区",
                     
                 },{
                     place:"普陀区",
                     
                 }]
                
            }
        },
    methods: {
         
        selectPlace(router){
            this.$router.push(router);
        }
    }
       
        
    }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.area_address ul{
   background:white;
   width:100%;
   color:#333333;
}
.area_address ul li{
   padding: 0 1.5rem;
   height:4.4rem;
   border-bottom:1px solid #DADADA;
   position: relative;
}

.area_address ul li p{
   position: absolute;
   left:1.5rem;
   font-size: 1.2rem;
   color:#333333;
   line-height: 4.4rem;
}


.area_address ul li img{
   position: absolute;
   right:1.5rem;
   height:1rem;
   top:1.7rem;
}
</style>
