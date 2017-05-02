<template>
    <div class="iosHead">
        <div v-bind:class="[param.type=='ios' ?  'ios_header' : 'my-header']">
            <div class="header_content">
                <div class="go-back" @click="jumpBack()">
                    <img src="/static/images/go-back.png">
                </div>
                <div class="title-name">
                    <p>{{param.name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'

export default {
    data() {
            return {
                type: ''
            }
        },
        props: {
            param: {}
        },
        methods: {
            jumpBack: function() {
                let _self=this;
                if (_self.param.appBack) {
                    try {
                        if (_self.param.type=='ios') {
                            window.webkit.messageHandlers.AppModel.postMessage({
                                body: 'iosResult'
                            });
                        } else {
                            window.Android.back();
                        }
                    } catch (e) {
                        window.history.go(-1);
                    }

                } else {
                    window.history.go(-1);
                }
            },
        },
        created() {


        },
        mounted() {
            let _self = this;
            setTimeout(function() {
                window.goback = function() {
                    try {
                        if (_self.param.appBack) {
                            window.webkit.messageHandlers.AppModel.postMessage({
                                body: 'iosResult'
                            });
                        } else {
                            window.Android.back();
                        }
                    } catch (e) {
                        window.history.go(-1);
                    }
                }
                var iframe = document.createElement('iframe')
                iframe.style.visibility = 'hidden'
                iframe.style.width = '1px'
                iframe.style.height = '1px'
                iframe.onload = function() {
                    setTimeout(function() {
                        document.body.removeChild(iframe)
                    }, 0)
                }
                document.body.appendChild(iframe)
            }, 0)
        }
}
</script>
<style scoped>
.iosHead {
    position: relative;
}

.iosHead .ios_header {
    width: 100%;
    height: 64px;
    background: #EC6817;
    overflow: hidden;
}

.iosHead .ios_header .header_content {
    background: #EC6817;
    /*position: fixed;
    top: 0;*/
    float:left;
    width: 100%;
    height: 64px;
    z-index: 2000;
    overflow: hidden;

}

.iosHead .ios_header .title-name {
    width: 70%;
    margin-top: 20px;
    height: 44px;
    float: left;
    font-size: 16px;
    line-height: 44px;
    color: white;
}

.iosHead .ios_header .go-back {
    float: left;
    width: 15%;
    padding-right: 5%;
    margin-top: 20px;
    height: 44px;
    z-index: 20000;
    background: #EC6817;
}

.iosHead .ios_header .go-back img {
    margin-top: 11px;
    height: 20px;
}

.iosHead .my-header {
    width: 100%;
    height: 50px;
    background: #EC6817;
}

.iosHead .my-header .header_content {
    background: #EC6817;
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    z-index: 2000;
    overflow: hidden;
}

.iosHead .my-header .title-name {
    width: 70%;
    height: 50px;
    float: left;
    font-size: 1.7rem;
    line-height: 50px;
    color: white;
}

.iosHead .my-header .go-back {
    float: left;
    width: 15%;
    padding-right: 5%;
    height: 50px;
    z-index: 20000;
    background: #EC6817;
}

.iosHead .my-header .go-back img {
    margin-top: 15px;
    height: 20px;
}

.iosHead .search {
    height: 60px;
    background: white;
    position: relative;
}
</style>
