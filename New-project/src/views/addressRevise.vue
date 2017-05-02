<template>
    <div class="address_revise">
        <!-- <mt-header title="修改地址">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="back()"></mt-button>
            </router-link>
        </mt-header> -->
         <myHeader :param = "my_header" ></myHeader>
         <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <ul>
            <li>
                <p>收货人</p>
                <input type="text" :placeholder="obj.name" v-model="obj.name">
            </li>
            <li>
                <p>联系电话</p>
                <input type="text" :placeholder="obj.tel" v-model="obj.tel">
            </li>
            <li @click="selectPlace">
                <p>省市区(县)</p>
                <p class="selectPlace">
                    {{ obj.addressProvince }},{{ obj.addressCity }},{{obj.addressDistrict}}
                </p>
                <img src="/static/images/right-arrow.png">
            </li>
            <li class="last">
                <textarea :placeholder="obj.detailAddr" v-model="obj.detailAddr"></textarea>
            </li>
        </ul>
        <!-- <mt-picker :slots="slots" @change="onValuesChange" v-show="active" class="place" textAlign="center"></mt-picker> -->
        <!-- <mt-picker :slots="slots" @change="onValuesChange"></mt-picker> -->
        <!-- <mt-picker :slots="slots" @change="onAddressChange" class="address_picker"></mt-picker> -->
        <div class="address_box" v-show="show">
            <mt-button type="primary" class="left-button" @click="cancel">取消</mt-button>
            <mt-button type="primary" class="right-button" @click="confirmIt">确定</mt-button>
            <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="5" class="select-box"></mt-picker>
        </div>
        <div class="confirm" v-on:click="confirm">保存</div>
         </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
import areaJson from '../common/areaData'
import myHeader from '../components/tools/myHeader'
import validation from '../validation/validation.js'

const addressArr = ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔族自治区'];


export default {
    data() {
            return {
                my_header:{
                    name:'修改地址',
                },
                show: false,
                obj: {
                    name: '',
                    tel: '',
                    addressProvince: '',
                    addressCity: '',
                    addressDistrict: '',
                    detailAddr: ''
                },
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
                }],

            }
        },
        components: {           
            myHeader
        },
        methods: {
            back() {
                window.history.go(-1);
            },
            getAddress(id) {
                let _self = this;
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userAddressService',
                    biz_method: 'queryAddressById',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        id: id
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.addressRevise(url, body, function(suc) {
                    common.$emit('close-load');
                    let result = suc.data.biz_result;
                    _self.obj.detailAddr = result.detailAddr;
                    _self.obj.name = result.contactName;
                    _self.obj.tel = result.contactPhone;
                    _self.obj.addressProvince = result.province;
                    _self.obj.addressCity = result.city;
                    _self.obj.addressDistrict = result.district;
                }, function(err) {
                    common.$emit('close-load');
                })
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
            selectPlace() {
                this.show = true;
            },
            cancel() {
                this.show = false;
            },
            confirmIt() {
                this.obj.addressProvince = this.areaParam.addressProvince;
                this.obj.addressCity = this.areaParam.addressCity;
                this.obj.addressDistrict = this.areaParam.addressDistrict;
                this.show = false;
            },
            confirm() {
                let _self = this;

                var checkArr = [];
                  let checkName = validation.checkNull(_self.obj.name, '请输入姓名！');
                  checkArr.push(checkName);
                  let checkPhone = validation.checkPhone(_self.obj.tel);
                  checkArr.push(checkPhone);
                  let checkdetailAddr = validation.checkNull(_self.obj.detailAddr, '请输入详细信息！');
                  checkArr.push(checkdetailAddr);

                  for (var i = 0; i < checkArr.length; i++) {
                            if (checkArr[i]) {
                                common.$emit('message', checkArr[i]);
                                return;
                            }
                         } 

                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'userAddressService',
                    biz_method: 'updateUserAddressInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        contactName: _self.obj.name,
                        contactPhone: _self.obj.tel,
                        province: _self.obj.addressProvince,
                        city: _self.obj.addressCity,
                        district: _self.obj.addressDistrict,
                        detailAddr: _self.obj.detailAddr,
                        id: _self.$route.params.addreId,
                        address: _self.obj.addressProvince + _self.obj.addressCity + _self.obj.addressDistrict + _self.obj.detailAddr
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.addressRevise(url, body, function(suc) {
                    common.$emit('close-load');
                    console.log(suc);
                    if (suc.data.code == '1c01') {
                        common.$emit('informAddress', 'refurbish');
                        common.$emit('edit-Address', {
                            id:_self.$route.params.addreId,
                            contactName:_self.obj.name,
                            contactPhone:_self.obj.tel,
                            address:_self.obj.addressProvince + _self.obj.addressCity + _self.obj.addressDistrict + _self.obj.detailAddr
                        });
                        window.history.go(-1);
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })


            }
        },
        mounted() {

            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        },
        created() {
            let _self = this;
            var id = _self.$route.params.addreId;
            _self.getAddress(id);
            common.$on('revise-address', function(item) {
                _self.getAddress(item);
            })

        }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.address_revise .page-loadmore-wrapper{
  margin-bottom: 0px;
}
.address_revise ul {
    padding: 0 1.5rem;
    background: white;
    width: 100%;
    color: #333333;
}

.address_revise ul li {
    height: 4.4rem;
    border-bottom: 1px solid #DADADA;
    position: relative;
}

.address_revise ul .last {
    height: 8.5rem;
    color: #666666;
    font-size: 1.2rem;
    padding: 1rem 0;
    border-bottom: none;
}

.address_revise ul .last textarea {
    width: 100%;
    height: 100%;
    border: 0;
    color: #666666;
}

.address_revise ul li p {
    position: absolute;
    left: 0;
    font-size: 1.2rem;
    color: #333333;
    line-height: 4.4rem;
}

.address_revise ul li input {
    position: absolute;
    right: 10%;
    text-align: right;
    border: none;
    outline: none;
    font-size: 1.2rem;
    height: 2.2rem;
    color: #666666;
    margin-top: 1rem;
    line-height: 2.2rem;
}

.address_revise ul li .selectPlace {
    position: absolute;
    right: 10%;
    text-align: right;
    font-size: 1.2rem;
    color: #666666;
}

.address_revise ul li img {
    position: absolute;
    right: 0;
    height: 1rem;
    top: 1.7rem;
}

.address_revise .confirm {
    width: 100%;
    height: 50px;
    background: #FA6705;
    color: white;
    text-align: center;
    line-height: 50px;
    font-size: 1.7rem;
    position: fixed;
    bottom: 0;
}


/*.address_picker{
   width:100px;
   height:4.2rem;
}*/

.address_revise .address_box {
    position: relative;
    padding-top: 4rem;
    background: white;
}

.address_revise .address_box .left-button {
    position: absolute;
    left: 10%;
    top: 1rem;
    width: 60px;
    height: 30px;
    font-size: 16px;
}

.address_revise .address_box .right-button {
    position: absolute;
    right: 10%;
    top: 1rem;
    width: 60px;
    height: 30px;
    font-size: 16px;
}

.address_revise .select-box {
    background: white;
}
</style>
