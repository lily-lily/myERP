<template>
    <div class="content purchase_good_information">
        <div class="good_information">
            <div class="title_name">
                <p class="good_infor_header">求购货物信息</p>
            </div>
            <div class="good_name">
                <p>求购的产品：</p>
                <div class="select" @click="jumpSearch('/search')" v-show="!obj.update">
                    <input text="text" disabled="false" placeholder="请选择你需要的药材" v-model="obj.drug_name">
                </div>
                <div class="select" v-show="obj.update">
                    <input text="text" disabled="false" placeholder="请选择你需要的药材" v-model="obj.drug_name">
                </div>
            </div>
            <div class="good_number">
                <p>求购的规格：</p>
                <div v-show="obj.drug_name" class="div_content">
                    <div v-show="breedSpec.length" @click="showAction('spec')">
                        <input type="text" v-model="obj.spec" disabled="false" />
                        <p class="my-p">
                            <img src="/static/images/right.png">
                        </p>
                    </div>
                    <input text="text" disabled="false" v-model="obj.spec" class="alert_input  right_input" v-show="!breedSpec.length">
                </div>
                <div v-show="!obj.drug_name" class="select div_content">
                    <input text="text" disabled="false" placeholder="请选择你需要的药材" class="alert_input">
                </div>
                <!-- <img src="/static/images/right.png" class="right_image" v-show="breedLocation.length"> -->
            </div>
            <div class="good_number">
                <p>求购的产地：</p>
                <div v-show="obj.drug_name" class="div_content">
                    <div v-show="breedLocation.length" @click="showAction('place')">
                        <input type="text" v-model="obj.place" disabled="false" />
                        <p class="my-p">
                            <img src="/static/images/right.png">
                        </p>
                    </div>
                    <input text="text" disabled="false" v-model="obj.place" class="alert_input  right_input" v-show="!breedLocation.length">
                </div>
                <div v-show="!obj.drug_name" class="select div_content">
                    <input text="text" disabled="false" placeholder="请选择你需要的药材" class="alert_input">
                </div>
                <!-- <img src="/static/images/right.png" class="right_image" v-show="breedLocation.length"> -->
            </div>
            <div class="good_number">
                <p>求购的数量：</p>
                <div class="div_content">
                    <input type="number" placeholder="请输入" v-model="obj.number" class="last_input" />
                    <p @click="showAction('unit')" class="right">
                        {{obj.number_unit}}
                    </p>
                </div>
            </div>
            <div class="good_number">
                <p>求购有效期：</p>
                <div class="div_content">
                    <input type="number" placeholder="请输入有效天数" v-model="obj.duedate" class="last_input" />
                    <p class="right">天</p>
                </div>
            </div>
        </div>
        <mt-popup v-model="sheetVisible" position="center" class="mint-popup-1" style="width:60%">
            <div v-for="item in actions">
                <div style="color: #656b79;background-color: #f6f8fa;box-shadow: 0 0 1px #b8bbbf;padding:10px 0" @click="setObj(item.key,item.name,item.id_key,item.id)">{{item.name}}</div>
            </div>
        </mt-popup>
    </div>
</template>
<script>
import common from '../../common/common.js'
import httpService from '../../common/httpService.js'
export default {
    data() {
            return {
                breedLocation: [],
                breedSpec: [],
                sheetVisible: false,
                actions: [],
                unit: [{
                    id: 1,
                    name: 'g'
                }, {
                    id: 2,
                    name: 'kg'
                }],
            }
        },
        props: {
            obj: {}
        },
        methods: {
            jumpSearch(router) {
                common.searchType = 'breed';
                common.$emit("setParam", "router", "needRelease");
                this.$router.push(router);
            },
            getBreedInformation(name) {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'breedService',
                    biz_method: 'queryLocalSpecList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        name: name
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.commonPost(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == '1c01') {
                        _self.obj.spec = '';
                        _self.obj.place = '';
                        _self.breedLocation = suc.data.biz_result.localList;
                        _self.breedSpec = suc.data.biz_result.specList;
                        if (_self.breedSpec.length > 0) _self.obj.spec = _self.breedSpec[0].name;
                        if (_self.breedLocation.length > 0) _self.obj.place = _self.breedLocation[0].name;
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            getUnit() {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'enumService',
                    biz_method: 'queryEnumList',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        type: 'MU'
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.commonPost(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == '1c01') {
                        _self.unit = suc.data.biz_result.list;
                        if (!_self.obj.number_unit) {
                            _self.obj.number_unit = _self.unit[0].name;
                            _self.obj.number_id = _self.unit[0].id;
                        }else{
                            for(var i = 0; i < _self.unit.length; i++){
                                if(_self.obj.number_unit == _self.unit[i].name){
                                    _self.obj.number_id =  _self.unit[i].id;
                                }
                            }
                        }
                        
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            setObj(key, value, id_key, id) {
                this.obj[key] = value;
                this.obj[id_key] = id;
                console.log(id)
                this.sheetVisible = false;
            },
            showAction(param) {
                this.sheetVisible = true;
                this.actions = [];
                let _self = this;
                if (param == "spec") {
                    for (var i = 0; i < _self.breedSpec.length; i++) {
                        _self.actions.push({
                            name: _self.breedSpec[i].name,
                            key: 'spec'
                        });
                    }
                } else if (param == "unit") {

                    for (var i = 0; i < _self.unit.length; i++) {
                        _self.actions.push({
                            name: _self.unit[i].name,
                            key: 'number_unit',
                            id:_self.unit[i].id,
                            id_key:'number_id'
                        });
                    }
                } else {
                    for (var i = 0; i < _self.breedLocation.length; i++) {
                        _self.actions.push({
                            name: _self.breedLocation[i].name,
                            key: 'place'
                        });
                    }
                }
            }
        },
        created() {
            let _self = this;
            this.getUnit();
            common.$on("Needrelease", function(item) {
                if (item.breedName) {
                    _self.getBreedInformation(item.breedName);
                    _self.obj.drug_name = item.breedName;
                    _self.obj.breedId = item.breedId;
                } else {
                    _self.getBreedInformation(item.keyWord);
                    _self.obj.drug_name = item.keyWord;
                    _self.obj.breedId = item.id;
                }
            });
        }
}
</script>
<style scoped>
input[type="text"],
input[type="submit"],
input[type="reset"],
select,
textarea {
    -webkit-appearance: none;
    border-radius: 0;
}

.purchase_good_information {}

.purchase_good_information .good_information,
.remarks,
.contact {
    /*padding: 1.28rem;*/
    margin-bottom: 0rem;
    background: white;
}

.purchase_good_information .contact {
    height: 12.8rem;
    margin-bottom: 10px;
}

.purchase_good_information .title_name {
    background: #F1F0F0;
    width: 100%;
}

.purchase_good_information .good_infor_header {
    background: url('/static/images/information.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.purchase_good_information input {
    outline: none;
    border: 0;
}

.purchase_good_information .good_infor_header,
.remarks_header,
.contact_header {
    font-size: 1.2rem;
    color: #FA6705;
    text-align: left;
    padding-left: 1.536rem;
    line-height: 3.75rem;
    height: 3.58rem;
    margin-left: 1.28rem;
}

.purchase_good_information .remarks .remarks_header {
    background: url('/static/images/remarks.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.purchase_good_information .contact .contact_header {
    background: url('/static/images/contact.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.purchase_good_information .good_name,
.good_spec,
.good_place,
.good_number,
.contact_name,
.contact_phone {
    height: 3.5rem;
    /*margin-top: 0.8533rem;*/
    border-bottom: 1px solid #D2D2D2;
}

.purchase_good_information .good_number div p img {
    /*width: 100%;
    height: 100%;*/
    /*padding: 10px;*/
    float: left;
}

.purchase_good_information .good_name>p {
    font-size: 1.19rem;
}

.purchase_good_information .good_number select {
    background-color: #fff;
    text-align: center;
}

.purchase_good_information .good_number select option {
    background-color: #fff;
    text-align: center;
}

.purchase_good_information .good_name p,
.good_spec p,
.good_place p,
.good_number p {
    float: left;
    line-height: 3.3rem;
    font-size: 1.19rem;
    color: #333333;
}

.purchase_good_information .good_name>p,
.good_spec>p,
.good_place>p,
.good_number>p {
    margin-left: 1.28rem;
}

.purchase_good_information .good_name div,
.good_spec div,
.good_place div,
.good_number div {
    float: right;
    position: relative;
}

.purchase_good_information .good_number .number_unit {
    width: 100%;
    height: 100%;
    outline: none;
    border: 0;
    float: left;
    text-align: center;
}

.purchase_good_information .good_name div .select,
.good_spec div select,
.good_place div select {
    font-size: 1.19rem;
    height: 2.9rem;
    width: 14.847rem;
    text-align: center;
    outline: none;
}

.purchase_good_information .select input {
    font-size: 1.19rem;
    height: 3.3rem;
    width: 14.847rem;
    text-align: right;
    outline: none;
    /*border: 1px solid #D2D2D2;*/
    background: white;
    margin-right: 1.28rem;
}

.purchase_good_information .good_number {
    position: relative;
    line-height: 3.5rem;
}

.purchase_good_information .alert_input {
    width: 100% !important;
    background-color: #fff;
    padding-right: 1.28rem !important;
}

.purchase_good_information .right_image {
    width: 0.64rem;
    position: absolute;
    right: 1.28rem;
    top: 0.8rem;
}

.purchase_good_information .right_input {
    padding-right: 2.28rem;
}

.purchase_good_information .good_name div .select input {
    text-align: center;
    outline: none;
    border: 0;
    height: 100%;
    width: 100%;
    background: white;
}

.purchase_good_information .good_number .div_content {
    height: 3.5rem;
    width: 14.847rem;
}

.purchase_good_information .good_number div input {
    outline: none;
    font-size: 1.19rem;
    height: 3.3rem;
    width: 70%;
    text-align: right;
    float: left;
    outline: none;
    border: 0;
    padding-right: 2px;
    background-color: #fff;
}

.purchase_good_information .good_number div p {
    height: 3.4rem;
    width: 30%;
    border-left: 1px solid #D2D2D2;
    position: relative;
}

.purchase_good_information .good_number div .my-p {
    border-left: 0;
}

.purchase_good_information .good_number div .last_input {
    width: 60%;
    padding-right: 7px;
}

.purchase_good_information .good_number div .right {
    width: 40%;
}

.purchase_good_information .good_number div .my-p img {
    height: 1.0rem;
    position: absolute;
    left: 1.3rem;
    top: 1.1rem;
}
</style>
