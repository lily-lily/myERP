<template>
    <div class="content release_good_information">
        <div class="good_information">
            <div class="title_name">
                <p class="good_infor_header">货物基本信息</p>
            </div>
            <div class="good_name">
                <p>产品：</p>
                <div class="select" @click="jumpSearch('/search')" v-show="!obj.update">
                    <input text="text" disabled="false" placeholder="请选择你的药材" v-model="obj.drug_name">
                </div>
                <div class="select" v-show="obj.update">
                    <input text="text" disabled="false" v-model="obj.drug_name">
                </div>
            </div>
            <div class="good_number">
                <p>规格：</p>
                <div v-show="obj.drug_name" class="content_div">
                    <div v-show="breedSpec.length" @click="showAction('spec')">
                        <input type="text" v-model="obj.spec" disabled="false" class="goods-info" />
                        <p class="my-p">
                            <img src="/static/images/right.png">
                        </p>
                    </div>
                    <input text="text" disabled="false" v-model="obj.spec" class="alert_input right_input" v-show="!breedSpec.length">
                </div>
                <div v-show="!obj.drug_name" class="select content_div">
                    <input text="text" disabled="false" placeholder="请选择你的药材" class="alert_input">
                </div>
            </div>
            <div class="good_number">
                <p>产地：</p>
                <div v-show="obj.drug_name" class="content_div">
                    <div v-show="breedLocation.length" @click="showAction('place')">
                        <input type="text" v-model="obj.place" disabled="false" class="goods-info" />
                        <p class="my-p">
                            <img src="/static/images/right.png">
                        </p>
                    </div>
                    <input text="text" disabled="false" v-model="obj.place" class="alert_input right_input" v-show="!breedLocation.length">
                </div>
                <div v-show="!obj.drug_name" class="select content_div">
                    <input text="text" disabled="false" placeholder="请选择你的药材" class="alert_input">
                </div>
            </div>
        </div>
        <p class="good_delivery_header">货物交收信息</p>
        <div class="good_information">
            <div class="good_number">
                <p>数量：</p>
                <div class="content_div">
                    <input type="number" placeholder="请输入" v-model="obj.number" class="last_input" />
                    <p @click="showAction('unit')">
                        {{obj.number_unit}}
                    </p>
                </div>
            </div>
            <div class="good_number">
                <p>销售价格：</p>
                <div class="content_div">
                    <input type="number" placeholder="请输入" v-model="obj.sales_price" class="last_input" />
                    <p>元/份</p>
                </div>
            </div>
            <div class="good_number">
                <p>交货地：</p>
                <div @click="show=true" class="select-address content_div">
                    {{ obj.address }}
                </div>
            </div>
        </div>
        <p class="good_sample_header">样品信息</p>
        <div class="good_information">
            <div class="good_number">
                <p>是否提供样品：</p>
                <div class="sample_button content_div">
                    <!-- <button v-on:click="judgeValue(1)" v-bind:class=" obj.sampling ? 'button_active':''">是</button>
                    <button v-on:click="judgeValue(0)" v-bind:class=" obj.sampling ? '':'button_active'">否</button>  -->
                    <div class="left_button" v-on:click="judgeValue(1)">
                        <img src="/static/images/no-select.png" v-show="!obj.sampling">
                        <img src="/static/images/over-select.png" v-show="obj.sampling">
                        <p>是</p>
                    </div>
                    <div class="right_button" v-on:click="judgeValue(0)">
                        <img src="/static/images/no-select.png" v-show="obj.sampling">
                        <img src="/static/images/over-select.png" v-show="!obj.sampling">
                        <p>否</p>
                    </div>
                </div>
            </div>
            <div class="good_number" v-show="obj.sampling">
                <p>样品重量：</p>
                <div class="content_div">
                    <input type="number" placeholder="请输入" v-model="obj.weight" class="last_input" />
                    <p @click="showAction('sample_unit')">
                        {{obj.sample_unit}}
                        <!-- sampleUnit -->
                    </p>
                </div>
            </div>
            <div class="good_number" v-show="obj.sampling">
                <p>样品价格：</p>
                <div class="content_div">
                    <input type="number" placeholder="请输入" v-model="obj.price" class="last_input" />
                    <p>元</p>
                </div>
            </div>
        </div>
        <mt-popup v-model="sheetVisible" position="center" class="mint-popup-1" style="width:60%">
            <div v-for="item in actions">
                <div style="color: #656b79;background-color: #f6f8fa;box-shadow: 0 0 1px #b8bbbf;padding:10px 0" @click="setObj(item.key,item.name,item.id_key,item.id)">{{item.name}}</div>
            </div>
        </mt-popup>
        <div class="address_outbox">
            <div class="address_box" v-show="show">
                <mt-button type="primary" class="left-button" @click="show=false">取消</mt-button>
                <mt-button type="primary" class="right-button" @click="confirmIt">确定</mt-button>
                <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5" class="select-box"></mt-picker>
            </div>
        </div>
    </div>
</template>
<script>
import areaJson from '../../common/areaData'
import common from '../../common/common.js'
import httpService from '../../common/httpService.js'

const addressArr = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔族自治区'];
export default {
    data() {
            return {
                show: false,
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
                pickerValue: '1',
                areaParam: {
                    addressProvince: '北京市',
                    addressCity: '北京市',
                    addressDistrict: '东城区'
                },
                addressSlots: [{
                    flex: 1,
                    values: addressArr,
                    className: 'slot1',
                    textAlign: 'center'
                }, {
                    divider: true,
                    content: '-',
                    className: 'slot2'
                }, {
                    flex: 1,
                    values: ['北京市'],
                    className: 'slot3',
                    textAlign: 'center'
                }, {
                    divider: true,
                    content: '-',
                    className: 'slot4'
                }, {
                    flex: 1,
                    values: ['东城区', '西城区', '朝阳区', '丰台区', '石景山区', '海淀区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
                    className: 'slot5',
                    textAlign: 'center'
                }]
            }
        },
        props: {
            obj: {}
        },
        methods: {
            judgeValue(param) {
                this.obj.sampling = param;

            },
            confirmIt() {
                this.obj.addressProvince = this.areaParam.addressProvince;
                this.obj.addressCity = this.areaParam.addressCity;
                this.obj.addressDistrict = this.areaParam.addressDistrict;
                this.obj.address = this.obj.addressProvince + '' + this.obj.addressCity + '' + this.obj.addressDistrict;
                this.show = false;
            },
            onAddressChange(picker, values) {
                let cityArr = [];
                let districtArr = [];
                let provinceId;
                let cityId = '';
                if (this.obj.addressProvince != values[0]) {
                    for (var i = 0; i < areaJson.province.length; i++) {
                        if (values[0] == areaJson.province[i].value) {
                            provinceId = areaJson.province[i].id;
                        }
                    }
                    for (var i = 0; i < areaJson.city.length; i++) {
                        if (areaJson.city[i].parentId == provinceId) {
                            if (!cityId) cityId = areaJson.city[i].id;
                            cityArr.push(areaJson.city[i].value);
                        }
                    }
                } else if (this.obj.addressCity != values[1]) {
                    for (var i = 0; i < areaJson.city.length; i++) {
                        if (areaJson.city[i].value == values[1]) {
                            cityId = areaJson.city[i].id;
                        }
                    }

                }
                if (cityId) {
                    for (var i = 0; i < areaJson.county.length; i++) {
                        if (areaJson.county[i].parentId == cityId) {
                            districtArr.push(areaJson.county[i].value);
                        }
                    }
                }
                if (cityArr.length > 0) picker.setSlotValues(1, cityArr);
                if (districtArr.length > 0) picker.setSlotValues(2, districtArr);
                this.areaParam.addressProvince = values[0];
                this.areaParam.addressCity = values[1];
                this.areaParam.addressDistrict = values[2];


            },
            jumpSearch(router) {
                common.searchType = 'breed';
                common.$emit("setParam", "router", "supplyRelease");
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
                        if (!_self.obj.number_unit){
                            _self.obj.number_unit = _self.unit[0].name; 
                            _self.obj.number_id = _self.unit[0].id;   
                        }else{
                            for(var i = 0; i < _self.unit.length; i++){
                                if(_self.obj.number_unit == _self.unit[i].name){
                                    _self.obj.number_id =  _self.unit[i].id;
                                }
                            }
                        }
                        if (!_self.obj.sample_unit){
                            _self.obj.sample_unit = _self.unit[0].name;
                            _self.obj.sample_id = _self.unit[0].id;
                        }else{
                            for(var i = 0; i < _self.unit.length; i++){
                                if(_self.obj.sample_unit == _self.unit[i].name){
                                    _self.obj.sample_id =  _self.unit[i].id;
                                }
                            }
                        }
                            
                        /*if (!_self.obj.number_id)_self.obj.number_id = _self.unit[0].id;
                        if (!_self.obj.sample_id)_self.obj.sample_id = _self.unit[0].id;*/
                        
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            setObj(key, value, id_key, id) {
                console.log(id)
                this.obj[key] = value;
                this.obj[id_key] = id;
                
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
                } else if (param == "sample_unit") {
                    for (var i = 0; i < _self.unit.length; i++) {
                        _self.actions.push({
                            name: _self.unit[i].name,    
                            key: 'sample_unit',
                            id:_self.unit[i].id,
                            id_key:'sample_id'
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
                console.log(this.actions);
            }
        },
        created() {
            let _self = this;
            this.getUnit();
            common.$on("supplyRelease", function(item) {
                if (item.breedName) {
                    _self.getBreedInformation(item.breedName);
                    _self.obj.drug_name = item.breedName;
                    _self.obj.breedId = item.breedId;
                }else{
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

.release_good_information {}

.release_good_information .good_information {
    /*padding: 1.28rem;*/
    margin-bottom: 0rem;
    background: white;
}

.release_good_information .title_name {
    background: #F1F0F0;
    width: 100%;
}

.release_good_information .good_infor_header {
    background: url('/static/images/information.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.release_good_information .good_infor_header,
.good_delivery_header,
.good_sample_header {
    font-size: 1.2rem;
    color: #FA6705;
    text-align: left;
    padding-left: 1.536rem;
    line-height: 3.7rem;
    height: 3.58rem;
    margin-left: 1.28rem;
}

.release_good_information .good_number .select-address {
    font-size: 1.19rem;
    color: #666666;
    line-height: 3.5rem;
    overflow: hidden;
}

.release_good_information .good_name,
.good_spec,
.good_place,
.good_number {
    height: 3.5rem;
    border-bottom: 1px solid #D2D2D2;
    /* margin-top: 0.8533rem;*/
}

.release_good_information .good_number div p img {
    /*width: 100%;
    height: 100%;*/
    /*padding: 10px;*/
    float: left;
}

.release_good_information .good_place select {
    background: url('/static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.067rem 1.067rem;
    text-align: center;
}

.release_good_information .good_spec select {
    background: url('/static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.067rem 1.067rem;
    text-align: center;
}

.release_good_information .good_name p,
.good_spec p,
.good_place p,
.good_number p {
    float: left;
    line-height: 3.2rem;
    font-size: 1.19rem;
    color: #333333;
    margin-left: 1.28rem;
}

.release_good_information .good_name div,
.good_spec div,
.good_place div,
.good_number div {
    float: right;
    position: relative;
}

.release_good_information .good_number .number_unit {
    width: 100%;
    height: 100%;
    outline: none;
    border: 0;
    float: left;
    text-align: center;
    padding-left: 10px;
}

.release_good_information .good_name div .select,
.good_spec div select,
.good_place div select {
    font-size: 1.19rem;
    height: 3.3rem;
    width: 14.847rem;
    text-align: center;
    outline: none;
    line-height: 3.5rem;
    /*border: 1px solid #D2D2D2;*/
}

.release_good_information .select input {
    font-size: 1.19rem;
    height: 3.3rem;
    width: 14.847rem;
    text-align: right;
    outline: none;
    /*border: 1px solid #D2D2D2;*/
    margin-right: 1.28rem;
    line-height: 3.5rem;
    border: none;
    background: white;
}

.release_good_information .alert_input {
    width: 100% !important;
    background-color: #fff;
    /*height: 3.5rem;
    line-height: 3.5rem;*/
    padding-right: 1.28rem !important;
}

.release_good_information .good_number div .last_input {
    padding-right: 20px;
}

.release_good_information .good_name div .select input {
    text-align: center;
    outline: none;
    border: none;
    height: 100%;
    width: 100%;
    background: white;
}

.release_good_information .good_number .content_div {
    height: 3.5rem;
    width: 14.847rem;
}

.release_good_information .good_number div input {
    outline: none;
    font-size: 1.19rem;
    height: 3.3rem;
    width: 60%;
    text-align: right;
    float: left;
    outline: none;
    border: 0;
    padding-right: 2px;
    background-color: #fff;
}

.release_good_information .good_number div p {
    height: 3.4rem;
    width: 40%;
    border-left: 1px solid #D2D2D2;
    position: absolute;
    right: 0;
}

.release_good_information .good_number div .goods-info {
    width: 70%;
}

.release_good_information .good_number div .my-p {
    border-left: 0;
    height: 3.5rem;
    width: 3.5rem;
    position: absolute;
    right: 0;
    width: 30%;
}

.release_good_information .good_number div .my-p img {
    height: 1.0rem;
    /*position: absolute;*/
    margin-left: 1.3rem;
    margin-top: 1.1rem;
}

.release_good_information .good_delivery_header {
    background: url('/static/images/deliveryInformation.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.release_good_information .good_sample_header {
    background: url('/static/images/sample.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.release_good_information .good_number button {
    height: 100%;
    width: 6.5rem;
    background: white;
    border: 1px solid #D2D2D2;
    outline: none;
}

.release_good_information .good_number .sample_button {
    border: none;
    width: 8rem;
    margin-right: 1.28rem;
}

.release_good_information .good_number .sample_button img {
    width: 1rem;
    margin-top: 1.1rem;
}

.release_good_information .good_number .sample_button .left_button p,
.release_good_information .good_number .sample_button .right_button p {
    border: none;
    float: left;
    line-height: 3.5rem;
}

.release_good_information .good_number .sample_button .left_button img,
.release_good_information .good_number .sample_button .right_button img {
    float: left;
}

.release_good_information .good_number .sample_button .left_button {
    float: left;
    width: 40%;
}

.release_good_information .good_number .sample_button .right_button {
    float: right;
    width: 40%;
}


/*.release_good_information .good_number .sample_button .button_active {
    background: #FA6705;
}*/

.release_good_information .address_outbox {
    position: fixed;
    background: white;
    width: 100%;
    z-index: 999;
    bottom: 0;
}

.release_good_information .address_box {
    position: relative;
    background: white;
    padding-top: 4rem;
}

.release_good_information .address_box .left-button {
    position: absolute;
    left: 10%;
    top: 1rem;
    width: 60px;
    height: 30px;
    font-size: 16px;
}

.release_good_information .address_box .right-button {
    position: absolute;
    right: 10%;
    top: 1rem;
    width: 60px;
    height: 30px;
    font-size: 16px;
}

.release_good_information .right_input {
    padding-right: 2.28rem;
}
</style>
