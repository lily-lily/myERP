<template>
    <div class="city_address">
        <mt-header title="选择地区">
            <router-link to="/selectPlace" slot="left">
                <mt-button icon="back" ></mt-button>
            </router-link>
        </mt-header>
        <ul>
           

           <li v-for="todo in todos">
              <p>{{todo.place}}</p>
                
              <img src="/static/images/right-arrow.png" @click="selectPlace(todo.router)">
           </li>
          
        </ul>

 

    </div>
</template>
<script>
import common from '../common/common.js'

export default {
    data() {
            return {
                 todos:[{
                     place:"合肥",
                     router:"areaName"
                 },{
                     place:"武汉",
                     router:"areaName"
                 },{
                     place:"南京",
                     router:"areaName"
                 },{
                     place:"大连",
                     router:"areaName"
                 },{
                     place:"六安",
                     router:"areaName"
                 },{
                     place:"淮南",
                     router:"areaName"
                 },{
                     place:"杭州",
                     router:"areaName"
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
.city_address ul{
   background:white;
   width:100%;
   color:#333333;
}
.city_address ul li{
   padding: 0 1.5rem;
   height:4.4rem;
   border-bottom:1px solid #DADADA;
   position: relative;
}

.city_address ul li p{
   position: absolute;
   left:1.5rem;
   font-size: 1.2rem;
   color:#333333;
   line-height: 4.4rem;
}


.city_address ul li img{
   position: absolute;
   right:1.5rem;
   height:1rem;
   top:1.7rem;
}
</style>
