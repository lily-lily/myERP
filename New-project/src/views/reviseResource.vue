<template>
    <div class="revise_resource">
        <myHeader :param="param"></myHeader>
        <div class="">
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore>
                    <releaseGrugInformation :obj="obj"></releaseGrugInformation>
                    <div class="title_name">
                        <p class="good_photo_header">上传货物图片</p>
                    </div>
                    <div class="good_information">
                        <div class="upload_image" v-for="item in imgageArr">
                            <div>
                                <imageUpload :param="item" v-on:postUrl="getUrl"></imageUpload>
                            </div>
                        </div>
                    </div>
                    <div class="remarks">
                        <div class="title_name">
                            <p class="remarks_header">备注</p>
                        </div>
                        <div class="remarks_content">
                            <textarea :placeholder="obj.selling_point" v-model="obj.selling_point"></textarea>
                        </div>
                    </div>
                    <div class="contact">
                        <div class="title_name">
                            <p class="contact_header">联系方式</p>
                        </div>
                        <div class="contact_name">
                            <P>姓名：</P>
                            <div>
                                <input type="text" :placeholder="obj.name" v-model="obj.name">
                            </div>
                        </div>
                        <div class="contact_phone">
                            <P>手机：</P>
                            <div>
                                <input type="text" :placeholder="obj.phone" v-model="obj.phone">
                            </div>
                        </div>
                    </div>
                </mt-loadmore>
                <div class="confirm" @click="release()">确认修改</div>
            </div>
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import validation from '../validation/validation.js'
import imageUpload from '../components/tools/imageUpload'
import myHeader from '../components/tools/myHeader'
import httpService from '../common/httpService.js'
import releaseGrugInformation from '../components/tools/releaseGrugInformation'

export default {
    data() {
            return {
                param: {
                    name: '修改资源',
                },
                obj: {
                    sample_id:'',
                    number_id:'',
                    update: true,
                    drug_name: '',
                    spec: '',
                    place: '',
                    number: '',
                    number_unit: '',
                    sales_price: '',
                    where: '',
                    weight: '',
                    price: '',
                    selling_point: '',
                    name: '',
                    phone: '',
                    duedate: '30',
                    imgArr: ['', '', '', ''],
                    id: '',
                    address: '',
                    sampling: 1
                },
                imgArr: ['', '', '', '', '', '', ''],
                imgageArr: [{
                    name: 'intention',
                    index: 0,
                    url: '/static/images/upload-image.png'
                }, {
                    name: 'intention',
                    index: 1,
                    url: '/static/images/upload-image.png'
                }, {
                    name: 'intention',
                    index: 2,
                    url: '/static/images/upload-image.png'
                }, {
                    name: 'intention',
                    index: 3,
                    url: '/static/images/upload-image.png'
                }, {
                    name: 'intention',
                    index: 4,
                    url: '/static/images/upload-image.png'
                }, {
                    name: 'intention',
                    index: 5,
                    url: '/static/images/upload-image.png'
                }, {
                    name: 'intention',
                    index: 6,
                    url: '/static/images/upload-image.png'
                }, ]

            }
        },
        components: {
            imageUpload,
            releaseGrugInformation,
            myHeader
        },
        methods: {
            getResource(id) {
                let _self = this;
                httpService.getIntentionDetails(common.urlCommon + common.apiUrl.most, {
                    biz_module: 'intentionService',
                    biz_method: 'queryIntentionInfo',
                    biz_param: {
                        id: id
                    }
                }, function(suc) {
                    console.log(suc);
                    let result = suc.data.biz_result;
                    _self.obj.drug_name = result.breedName;
                    _self.obj.spec = result.spec;
                    _self.obj.place = result.location;
                    _self.obj.number = result.number;
                    _self.obj.number_unit = result.unit;
                    _self.obj.sales_price = result.price;
                    _self.obj.weight = result.sampleNumber;
                    _self.obj.price = result.sampleAmount;
                    _self.obj.where = result.address;
                    _self.obj.selling_point = result.description;
                    _self.obj.name = result.customerName;
                    _self.obj.phone = result.customerPhone;
                    _self.obj.address = result.address;
                    _self.obj.sampling = result.sampling;
                    _self.obj.breedId = result.breedId;

                    _self.imgageArr[0].url = result.image[0];
                    _self.imgageArr[1].url = result.image[1];
                    _self.imgageArr[2].url = result.image[2];
                    _self.imgageArr[3].url = result.image[3];
                    _self.imgageArr[4].url = result.image[4];
                    _self.imgageArr[5].url = result.image[5];
                    _self.imgageArr[6].url = result.image[6];
                    _self.imgArr = result.image;
                    if (result.image[0] != undefined) {
                        _self.obj.imgArr[0] = result.image[0];
                    }
                    if (result.image[1] != undefined) {
                        _self.obj.imgArr[1] = result.image[1];
                    }
                    if (result.image[2] != undefined) {
                        _self.obj.imgArr[2] = result.image[2];
                    }
                    if (result.image[3] != undefined) {
                        _self.obj.imgArr[3] = result.image[3];
                    }
                    if (result.image[4] != undefined) {
                        _self.obj.imgArr[4] = result.image[4];
                    }
                    if (result.image[5] != undefined) {
                        _self.obj.imgArr[5] = result.image[5];
                    }
                    if (result.image[6] != undefined) {
                        _self.obj.imgArr[6] = result.image[6];
                    }

                    // common.$emit("supplyRelease", {
                    //     id:result.breedId,
                    //     keyWord:result.breedName
                    // });
                }, function(err) {

                    common.$emit('message', err.data.msg);
                })
            },
            tabRevise() {
                let _self = this;
                var checkArr = [];
                let checkBreedSpec = validation.checkNull(_self.obj.spec, '请输入规格');
                checkArr.push(checkBreedSpec);
                let checkBreedPlace = validation.checkNull(_self.obj.place, '请输入产地');
                checkArr.push(checkBreedPlace);
                let checkNumber = validation.checkNull(_self.obj.number, '请输入数量');
                checkArr.push(checkNumber);
                let checkPrice = validation.checkNull(_self.obj.sales_price, '请输入价格');
                checkArr.push(checkPrice);
                if (_self.obj.sampling) {
                    let checkWeight = validation.checkNull(_self.obj.weight, '请输入样品重量');
                    checkArr.push(checkWeight);
                    let checkSamplePrice = validation.checkNull(_self.obj.price, '请输入样品价格');
                    checkArr.push(checkSamplePrice);
                }
                let count = '请上传图片';
                for (let i = 0; i < _self.imgArr.length; i++) {
                    if (_self.imgArr[i]) {
                        count = false;
                        break;
                    }
                }
                if (count) {
                    checkArr.push(count);
                }
                let checkDes = validation.checkNull(_self.obj.selling_point, '请输入药材资源卖点');
                checkArr.push(checkDes);
                let checkName = validation.checkNull(_self.obj.name, '请输入姓名');
                checkArr.push(checkName);
                let checkPhone = validation.checkPhone(_self.obj.phone, '请输入电话');
                checkArr.push(checkPhone);
                for (var i = 0; i < checkArr.length; i++) {
                    if (checkArr[i]) {
                        common.$emit('message', checkArr[i]);
                        return;
                    }
                }
                common.$emit('show-load');
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                let body = {
                    biz_module: 'intentionService',
                    biz_method: 'updateEditSupplyInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        customerId: common.customerId,
                        breedName: _self.obj.drug_name,
                        spec: _self.obj.spec,
                        location: _self.obj.place,
                        number: _self.obj.number,
                        price: _self.obj.sales_price,
                        address: _self.obj.address,
                        sampling: _self.obj.sampling,
                        description: _self.obj.selling_point,
                        customerName: _self.obj.name,
                        customerPhone: _self.obj.phone,
                        editImage: _self.obj.imgArr,
                        sampleNumber: _self.obj.weight,
                        sampleAmount: _self.obj.price,
                        duedate: _self.obj.duedate,
                        breedId: _self.obj.breedId,
                        unit: _self.obj.number_id,
                        sampleUnit:_self.obj.sample_id,
                        id: _self.$route.params.revId
                    }
                };

                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.supplyRelease(url, body, function(suc) {
                    common.$emit('close-load');
                    common.$emit("reviseResource", "refurbish");
                    window.history.go(-1);
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            release() {
                let _self = this;
                common.$emit('confirm', {
                    message: '确认修改信息后,将等待审核！',
                    title: '确定修改',
                    ensure: _self.tabRevise
                });
            },
            getUrl(param) {
                this.obj.imgArr[param.index] = param.url;
            }
        },
        created() {
            var _self = this;
            var id = this.$route.params.revId;
            _self.getResource(id);
            common.$on("res-id", function(item) {
                _self.getResource(item);
            })


        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>
.supply_release {}

input[type="text"],
input[type="submit"],
input[type="reset"],
select,
textarea {
    -webkit-appearance: none;
    border-radius: 0;
}

.revise_resource .bg_white {
    background: #fff;
}

.revise_resource .mint-header {
    background-color: white;
    color: #313232;
    border-bottom: 1px solid #C9C9C9;
}

.revise_resource .good_information {
    /*padding: 1.28rem;*/
    /*margin-bottom: 0.8533rem;*/
    background: white;
}

.revise_resource .remarks,
.contact {
    background: white;
    float: left;
    width: 100%;
}

.revise_resource .good_information {
    float: left;
    width: 100%;
    padding: 1.28rem;
}


/*.revise_resource .contact {
    float: left;
    width: 100%;
    margin-bottom: 10px;
}*/

.revise_resource .good_infor_header {
    background: url('../../static/images/information.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.revise_resource .good_delivery_header {
    background: url('../../static/images/deliveryInformation.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.revise_resource .good_sample_header {
    background: url('../../static/images/sample.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.revise_resource .title_name {
    width: 100%;
    background: #F1F0F0;
}

.revise_resource .title_name .good_photo_header {
    background: url('/static/images/upload.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
    line-height: 3.75rem;
    height: 3.58rem;
    margin-left: 1.28rem;
}

.revise_resource .title_name .remarks_header {
    background: url('/static/images/remarks.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
    line-height: 3.75rem;
    height: 3.58rem;
    margin-left: 1.28rem;
}

.revise_resource .title_name .contact_header {
    background: url('../../static/images/contact.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
    line-height: 3.75rem;
    height: 3.58rem;
    margin-left: 1.28rem;
}

.revise_resource .good_infor_header,
.good_delivery_header,
.good_sample_header,
.good_photo_header,
.remarks_header,
.contact_header {
    font-size: 1.2rem;
    color: #FA6705;
    text-align: left;
    padding-left: 1.536rem;
}

.revise_resource .good_information .upload_image {
    width: 18%;
    float: left;
    margin: 1rem 2% 0 0;
}

.revise_resource .good_information .upload_image>div {
    height: 5rem;
    overflow: hidden;
}

.revise_resource .good_name,
.good_spec,
.good_place,
.good_number,
.contact_name,
.contact_phone {
    height: 3.5rem;
}

.revise_resource .contact {
    margin-bottom: 10px;
}

.revise_resource .good_place select {
    background: url('../../static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.067rem 1.067rem;
    text-align: center;
}

.revise_resource .good_spec select {
    background: url('../../static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.067rem 1.067rem;
    text-align: center;
}

.revise_resource .good_name p,
.good_spec p,
.good_place p,
.good_number p {
    float: left;
    line-height: 3.5rem;
    font-size: 1.19rem;
    color: #333333;
}

.revise_resource .contact_name p,
.contact_phone p {
    margin-right: 2.47rem;
}

.revise_resource .good_name div,
.good_spec div,
.good_place div,
.good_number div {
    float: right;
    position: relative;
}

.revise_resource .good_name div .select,
.good_spec div select,
.good_place div select {
    font-size: 1.024rem;
    height: 2.9rem;
    width: 14.847rem;
    text-align: center;
    outline: none;
    border: 1px solid #D2D2D2;
}

.revise_resource .good_name div .select input {
    text-align: center;
    outline: none;
    border: 0;
    height: 100%;
    width: 100%;
    background: white;
}

.revise_resource .good_number button {
    height: 100%;
    width: 6.5rem;
    background: white;
    border: 1px solid #D2D2D2;
    outline: none;
}

.revise_resource .good_number .sample_button {
    border: none;
}

.revise_resource .good_number .sample_button .left_button {
    float: left;
}

.revise_resource .good_number .sample_button .button_active {
    float: right;
    background: #FA6705;
}

.revise_resource .good_number .sample_button .right_button {
    float: right;
}

.revise_resource .good_number .sample_button .another_button_active {
    float: left;
    background: #FA6705;
}

.revise_resource .good_number .number_unit {
    width: 100%;
    height: 100%;
    outline: none;
    border: 0;
    float: left;
    text-align: center;
    padding-left: 10px;
}

.revise_resource .good_name div .select p {
    height: 2.9rem;
    width: 14.847rem;
    text-align: center;
    font-size: 1.024rem;
    color: #999999;
}

.revise_resource .good_number div {
    height: 2.9rem;
    width: 14.847rem;
    border: 1px solid #D2D2D2;
}

.revise_resource .good_number div input {
    outline: none;
    font-size: 1.024rem;
    height: 2.73rem;
    width: 11.178rem;
    text-align: center;
    float: left;
    outline: none;
    border: 0;
}

.revise_resource .good_number div p {
    height: 2.73rem;
    width: 3.2rem;
    border-left: 1px solid #D2D2D2;
}

.revise_resource .remarks_content textarea {
    height: 7.68rem;
    width: 92%;
    margin-top: 1.279rem;
    padding: 1.279rem;
    border: 1px solid #D2D2D2;
}

.revise_resource .remarks_content {
    padding-bottom: 1.279rem;
}

.revise_resource .confirm {
    width: 100%;
    height: 4.267rem;
    background: #FA6705;
    font-size: 1.536rem;
    color: white;
    line-height: 4.267rem;
    float: left;
    width: 100%;
}

.revise_resource .address_outbox {
    position: fixed;
    bottom: 0;
    background: white;
    width: 100%;
}

.revise_resource .address_box {
    position: relative;
    background: white;
    padding-top: 4rem;
}

.revise_resource .address_box .left-button {
    position: absolute;
    left: 10%;
    top: 1rem;
    width: 60px;
    height: 30px;
    font-size: 16px;
}

.revise_resource .address_box .right-button {
    position: absolute;
    right: 10%;
    top: 1rem;
    width: 60px;
    height: 30px;
    font-size: 16px;
}

.revise_resource .good_number .select-address {
    font-size: 1.024rem;
    color: #666666;
    line-height: 2.9rem;
    overflow: hidden;
}

.revise_resource .contact_name,
.revise_resource .contact_phone {
    margin-top: 0px;
    border-bottom: 1px solid #D2D2D2;
    position: relative;
}

.revise_resource .contact_name div,
.revise_resource .contact_phone div {
    position: absolute;
    right: 1.28rem;
}

.revise_resource .contact_name input,
.revise_resource .contact_phone input {
    text-align: right;
    border: none;
    height: 3.1rem;
    line-height: 3.5rem;
    font-size: 1.19rem;
}

.revise_resource .contact_name p,
.contact_phone p {
    position: absolute;
    left: 1.28rem;
    line-height: 3.5rem;
    font-size: 1.19rem;
}
</style>
