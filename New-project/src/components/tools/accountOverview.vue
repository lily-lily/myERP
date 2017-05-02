<template>
    <div class="account_overview">
        <div class="header">
            
               <img :src="param.url" v-show="param.url">
               <img src="/static/images/my-header.png" v-show="!param.url">
            
            <p>{{param.name}}</p>
            <p class="company-name">{{param.company}}</p>
            <div>
                <p class="left">我的储值 <span>{{param.normalMoney}}</span></p>
                <p class="right">我的积分 <span>{{param.score}}</span></p>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'
export default {
    data() {
            return {}
        },
        props: {
            param: {
                url: '',
                company: '',
                normalMoney: '',
                score: '',
                name: ''
            }
        },
        methods:{
            jump(){
                this.$router.push('/login');
            }
        },
        created() {
          
        }

}
</script>
<style scoped>
.account_overview .header {
    height: 16.6rem;
    width: 100%;
    background: url(/static/images/bg.png) no-repeat;
    background-size: 100% 100%;
    margin: 0;
    padding: 0;
}

.account_overview .header img {
    margin-top: 2.815rem;
    margin-bottom: 0.8rem;
    width: 5.119rem;
    height: 5.119rem;
    border-radius: 50%;
    overflow: hidden;
}

.account_overview .header>p {
    font-size: 1.279rem;
    line-height: 1.279rem;
    color: #333333;
}

.account_overview .header .company-name {
    font-size: 1.023rem;
    line-height: 1.023rem;
    margin-top: 0.8rem;
}

.account_overview .header>div {
    margin-top: 1.5rem;
    font-size: 1.023rem;
    height: 1.2rem;
    padding: 0 15%;
}

.account_overview .header>div .left {
    float: left;
    width: 50%;
    border-right: 1px solid white;
    text-align: left;
}

.account_overview .header>div .right {
    float: right;
}

.account_overview .header>div .left span,
.account_overview .header>div .right span {
    color: #FA6705;
}
</style>
