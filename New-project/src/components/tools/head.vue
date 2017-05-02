<template>
    <div class="head">
        <div class="head_content">
            <div class="go-back" @click="back()">
                <img src="/static/images/go-back.png">
            </div>
            <div class="title-name" v-show="!param.keyword">
                <p>{{param.title}}</p>
            </div>
            <div class="title_right" v-show="!param.keyword" @click="jumpSearch()">
                <img src="/static/icons/clarity-search.png">
            </div>
            <div class="title-name" v-show="param.keyword" >
                <div class="text" @click="jumpSearch()">
                    <input type="text" disabled="true" v-model="param.keyword">
                     <div class="clear" @click.stop.prevent="clearWord()">
                        <img src="/static/images/false.png" class="search_image">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import httpService from '../../common/httpService.js'
import common from '../../common/common.js'
export default {
    data() {
            return {
                value: ''
            }
        },
        props: {
            param: {
                title: '头部'
            }
        },
        methods: {
            back() {
                window.history.go(-1);
            },
            clearWord() {
                this.param.keyword='';
                this.$emit("postClear"); 
            },
            jumpSearch(){
                common.searchType='keyword';
                common.$emit('setParam', 'router', this.param.router)
                this.$router.push('search');
            }
        }
}
</script>
<style scoped>
.head {
    width: 100%;
    height: 50px;
    background: #EC6817;
}

.head .head_content {
    position: absolute;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ccc;
}

.head .title-name {
    float: left;
    width: 70%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    font-size: 1.7rem;
    line-height: 50px;
    color: white;
}

.head .go-back {
    float: left;
    width: 15%;
    padding-right: 5%;
    height: 50px;
    border-bottom: 1px solid #ccc;
}

.head .go-back img {
    margin-top: 15px;
    height: 20px;
}

.head .title_right {
    float: left;
    width: 15%;
    height:50px;
    
}

.head .title_right img {
    width: 24px;
    margin: 13px 0;
}

.head .title-name .text {
    float: left;
    width: 100%;
    background-color:#fff;
    height: 30px;
    margin: 10px 0; 
    border-radius: 30px;

}

.head .title-name .text .clear {
    float: right;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
}

.head .title-name .text input{
    float: left;
    max-width: 70%;
    height: 30px;
    background-color:#fff;
    border: none; 
    color: #999;
    margin-left: 15px;
    font-size: 15px;
    line-height: 30px;

}
</style>
