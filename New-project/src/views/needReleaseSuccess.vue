<template>
    <div class="need_release_success">
        <myHeader :param="param"></myHeader>
        <div class="bg_white">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <div class="source_information">
                        <resourceInformation :information='information'></resourceInformation>
                    </div>
                    <div class="source_information">
                        <div class="bg_white">
                            <div class="title">
                                <p class="index_title">备注</p>
                            </div>
                            <div class="more_content">
                                <p>{{obj.description}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="source_information">
                        <contactType :information='person'></contactType>
                    </div>
                    <div class="source_information">
                        <auditProgress :auditProgress='auditProgress'></auditProgress>
                    </div>
                </mt-loadmore>
            </div>
            <div class="bottom">
                <button class="mint-button mint-button--primary mint-button--large" @click="back()">继续放布</button>
                <button class="mint-button mint-button--primary mint-button--large" @click="jump()">查看匹配供应信息</button>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import resourceInformation from '../components/tools/resourceInformation'
import contactType from '../components/tools/contactType'
import auditProgress from '../components/tools/auditProgress'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
export default {
    data() {
            return {
                param: {
                    name: '发布成功'
                },
                wrapperHeight: '',
                todos: {},
                information: {
                    name: "人参",
                    spec: "统货",
                    place: "东北",
                    price: "98.9",
                    sendPlace: "上海",
                    number: "100",
                    unit: "kg",
                    name: "",
                    phone: ""
                },
                obj: {
                    description: 'hahhahah'
                },
                person: {
                    name: '杨帆',
                    phone: '15123485654'
                },
                auditProgress: '1'
            }
        },
        methods: {
            getHttp(id) {
                let _self = this;
                httpService.getIntentionDetails(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'intentionService',
                    biz_method: 'queryIntentionInfo',
                    biz_param: {
                        id: id
                    }
                }, function(suc) {
                    if (suc.data.code == '1c01') {
                        let result = suc.data.biz_result;
                        _self.person.name = result.customerName;
                        _self.person.phone = result.customerPhone;
                        _self.information.price = result.price;
                        _self.information.name = result.breedName;
                        _self.information.spec = result.spec;
                        _self.information.place = result.location;
                        _self.information.number = result.number;
                        _self.information.unit = result.unit;
                        _self.obj.description = result.description;
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('message', err.data.msg);
                })
            },
            jump(){
                let _self=this;
                common.$emit("setParam", 'lowPrice', {keyWord:_self.information.name});
                common.$emit('lowPriceRes', {keyWord:_self.information.name});
                this.$router.push('/lowPriceRes');
            },
            back() {
                window.history.go(-1);
            }
        },
        components: {
            resourceInformation,
            contactType,
            auditProgress,
            myHeader
        },
        created() {
            var _self = this;
            var str = _self.$route.fullPath;
            var id = str.substring(20, str.length);
            console.log(id)
            _self.obj.id = id;
            _self.getHttp(id);
            common.$on('informNeedSuccess', function(item) {
                _self.getHttp(item);
            });
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
        },
}
</script>
<style scoped>
.whole {
    position: relative;
    background: #F1EFEF;
}

.need_release_success {
    position: relative;
    background: #F1EFEF;
    margin-bottom: 60px;
    float: left;
    width: 100%;
}

.need_release_success .source_information {
    margin-top: 0.8rem;
    float: left;
    width: 100%;
}

.need_release_success .source_information .bg_white {
    padding: 0.8rem 0;
}

.need_release_success .source_information .bg_white .title {
    float: left;
    width: 100%;
}

.need_release_success .source_information .bg_white .index_title {
    font-size: 1.6rem;
    color: #FA6705;
    border-left: 2px solid #FA6705;
    padding: 0 0.8rem;
    margin: 0.8rem 0 0 0;
    text-align: left;
    float: left;
    width: 100%;
}

.need_release_success .source_information .bg_white .more_content {
    font-size: 1.1rem;
    float: left;
    width: 100%;
    padding: 0.8rem 0.8rem;
    text-align: left;
    white-space: normal;
    word-break: break-all;
    text-indent: 2.2rem;
}

.need_release_success .bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
}

.need_release_success .bottom button {
    float: left;
    width: 50%;
    background-color: #EC6817;
    font-size: 1.2rem;
}
</style>
