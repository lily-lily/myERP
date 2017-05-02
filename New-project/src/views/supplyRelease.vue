<template>
    <div class="supply_release">
        
        <myHeader :param = "param"></myHeader>
       
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
               <!-- <mt-loadmore> -->
                <releaseGrugInformation :obj="obj"></releaseGrugInformation>
                
                    <div class="title_name">
                       <p class="good_photo_header">上传货物图片</p>
                    </div> 
                    <div class="good_information">
                        <div class="upload_image" v-for="item in imageArr">
                            <div><imageUpload :param="item" v-on:postUrl="getUrl"></imageUpload></div>
                            <p class="img-name">{{item.title}}</p>
                        </div>
                    </div>
                    <div class="remarks">  
                        <div class="title_name">
                           <p class="remarks_header">备注</p>
                        </div>                      
                        <div class="remarks_content">
                            <textarea placeholder="请根据实际情况填写药材资源卖点" v-model="obj.selling_point"></textarea>
                        </div>
                    </div>
                     
                    <div class="contact">  
                         <div class="title_name">
                          <p class="contact_header">联系方式</p>
                         </div>                      
                        <div class="contact_name">
                            <P>姓名：</P>
                            <div>
                                <input type="text" placeholder="请输入您的姓名" v-model="obj.name">
                            </div>
                        </div>
                        <div class="contact_phone">
                            <P>手机：</P>
                            <div>
                                <input type="text" placeholder="请输入您的手机号" v-model="obj.phone">
                            </div>
                        </div>
                    </div>
                    <div class="confirm" @click="release()">确认发布</div>
               
           <!-- </mt-loadmore> -->
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import validation from '../validation/validation.js'
import myHeader from '../components/tools/myHeader'
import imageUpload from '../components/tools/imageUpload'
import releaseGrugInformation from '../components/tools/releaseGrugInformation'
import httpService from '../common/httpService.js'

export default {
    data() {
            return {
                param:{
                    name:'资源发布',
                    router:'home'
                },
                img_src: '/static/images/3.jpg',
                drug: '请输入你的药材',
                obj: {
                    sample_id:'',
                    number_id:'',
                    sampling:1,
                    update:false,
                    drug_name: '',
                    spec: '',
                    place: '',
                    number: '',
                    number_unit: '',
                    sample_unit:'',
                    sales_price: '',
                    weight: '',
                    price: '',
                    selling_point: '',
                    name: '',
                    phone: '',
                    duedate: '30',
                    addressProvince: '北京市',
                    addressCity: '北京市',
                    addressDistrict: '东城区',
                    breedId: '',
                    address:'北京市 北京市 东城区'
                },
                imgArr: ['', '', '', '', '','',''],
                selected: '1',
                todos: {},
                imageArr: [{
                    title: '大货照',
                    name: 'intention',
                    index: 0,
                    url: '/static/images/upload-image.png'
                }, {
                    title: '样品照',
                    name: 'intention',
                    index: 1,
                    url: '/static/images/upload-image.png'
                }, {
                    title: '细节照',
                    name: 'intention',
                    index: 2,
                    url: '/static/images/upload-image.png'
                }, {
                    title: '细节照',
                    name: 'intention',
                    index: 3,
                    url: '/static/images/upload-image.png'
                }, {
                    title: '细节照',
                    name: 'intention',
                    index: 4,
                    url: '/static/images/upload-image.png'
                },{
                    title: '细节照',
                    name: 'intention',
                    index: 5,
                    url: '/static/images/upload-image.png'
                },{
                    title: '细节照',
                    name: 'intention',
                    index: 6,
                    url: '/static/images/upload-image.png'
                }]
            }
        },
        methods: {

            release() {

                let _self = this;
                console.log(_self.obj.sample_id);
                var checkArr = [];
                let checkBreedId = validation.checkNull(_self.obj.breedId, '请先选择品种');
                checkArr.push(checkBreedId);
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
                for (let i = 0; i < _self.imgArr.length; i++) { //_self.imgArr.length
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
                let checkName = validation.checkNull(_self.obj.name,'请输入姓名');
                checkArr.push(checkName);
                let checkPhone = validation.checkPhone(_self.obj.phone,'请输入电话');
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
                    biz_method: 'editSupplyInfo',
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
                        editImage: _self.imgArr,
                        sampleNumber: _self.obj.weight,
                        sampleAmount: _self.obj.price,
                        duedate: _self.obj.duedate,
                        breedId: _self.obj.breedId,
                        unit: _self.obj.number_id,
                        sampleUnit:_self.obj.sample_id
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.supplyRelease(url, body, function(suc) {
                    common.$emit('close-load');
                    console.log(suc);
                    if (suc.data.code == '1c01') {
                        common.$emit('message', suc.data.msg);
                        common.$emit('informMyRes', 'refurbish');
                        let id = suc.data.biz_result.intentionId;
                        common.$emit('informSupplySuccess', suc.data.biz_result.id);
                        _self.$router.push("supplyReleaseSuccess" + '/' + id);
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            getUrl(param) {
                this.imgArr[param.index] = param.url;
            }

        },
        components: {
            imageUpload,
            releaseGrugInformation,
            myHeader
        },
        created() {},
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

.supply_release .page-loadmore-wrapper{
    margin-bottom: 0px;
}
.supply_release .mint-header {
    background-color: white;
    color: #313232;
    border-bottom: 1px solid #C9C9C9;
}

.supply_release .good_information{
    padding: 1.28rem;
    /*margin-bottom: 0.8533rem;*/
    background: white;
    float: left;
    width: 100%;
}
.supply_release .remarks,
.contact{
    background: white;
    float: left;
    width: 100%;
}
.supply_release .contact {
    
    margin-bottom: 10px;
}

.supply_release .title_name .good_photo_header {
    background: url('/static/images/upload.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
    line-height:3.75rem; 
    height:3.58rem;
    margin-left: 1.28rem;
}
.supply_release .title_name .remarks_header{
    background: url('/static/images/remarks.png') no-repeat 0 center;
    background-size:1.11rem 1.11rem;  
    line-height:3.75rem; 
    height:3.58rem;
    margin-left: 1.28rem;
}

.supply_release .title_name .contact_header{
    background:url('../../static/images/contact.png') no-repeat 0 center;
    background-size:1.11rem 1.11rem;
    line-height:3.75rem; 
    height:3.58rem;
    margin-left: 1.28rem;
}
.supply_release .title_name{
    width:100%;
    background: #F1F0F0;
}
.supply_release .good_photo_header,
.remarks_header,
.contact_header {
    font-size: 1.2rem;
    color: #FA6705;
    text-align: left;
    padding-left: 1.536rem;
}

.supply_release .good_name,
.good_spec,
.good_place,
.good_number,
.contact_name,
.contact_phone {
    height: 3.5rem;
    /*margin-top: 0.8533rem;*/
}

.supply_release .good_number .number_unit {
    width: 100%;
    height: 100%;
    outline: none;
    border: 0;
    float: left;
    text-align: center;
    padding-left: 10px;
}

.supply_release .good_place select {
    background: url('/static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.067rem 1.067rem;
    text-align: center;
}

.supply_release .good_spec select {
    background: url('/static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.067rem 1.067rem;
    text-align: center;
}

.supply_release .good_name p,
.good_spec p,
.good_place p,
.good_number p {
    float: left;
    line-height: 3.5rem;
    font-size: 1.19rem;
    color: #333333;
}

/*.supply_release .contact_name p,
.contact_phone p {
    margin-right: 2.47rem;
}*/

.supply_release .good_name div,
.good_spec div,
.good_place div,
.good_number div {
    float: right;
    position: relative;
}

.supply_release .good_name div .select,
.good_spec div select,
.good_place div select{
    font-size: 1.19rem;
    height: 3.3rem;
    width: 14.847rem;
    text-align: center;
    outline: none;
    border:none;
    /*border: 1px solid #D2D2D2;*/
}

.supply_release .good_name div .select input {
    text-align: center;
    outline: none;
    border: 0;
    height: 100%;
    width: 100%;
    background: white;
}

.supply_release .good_name div .select p {
    height: 2.9rem;
    width: 14.847rem;
    text-align: center;
    font-size: 1.024rem;
    color: #999999;
}

.supply_release .good_number div {
    height: 2.9rem;
    width: 14.847rem;
    border: 1px solid #D2D2D2;
}

.supply_release .good_number div input {
    outline: none;
    font-size: 1.024rem;
    height: 2.73rem;
    width: 11.178rem;
    text-align: center;
    float: left;
    outline: none;
    border: 0;
}

.supply_release .good_number div p {
    height: 2.73rem;
    width: 3.2rem;
    border-left: 1px solid #D2D2D2;
}

.supply_release .remarks_content textarea {
    height: 7.68rem;
    width: 92%;
    margin-top: 1.279rem;
    padding: 1.279rem;
    border: 1px solid #D2D2D2;
}
.supply_release .remarks_content{
    padding-bottom: 1.279rem;
}
.supply_release .confirm {
    width: 100%;
    height: 50px;
    background: #FA6705;
    font-size: 1.536rem;
    color: white;
    line-height: 50px;
    float: left;
}

.supply_release .good_information .upload_image {
    width: 18%;
    height:7rem;
    float: left;
    margin: 1rem 2% 0 0;
}
.supply_release .good_information .upload_image>div{
    height:5rem;
    overflow: hidden;
}
.supply_release .good_information .upload_image .img-name {
    font-size: 1rem;
    color: #333333;
    padding-top: 1rem;
}


.supply_release .contact_name,
.supply_release .contact_phone{
    margin-top: 0px;
    border-bottom: 1px solid #D2D2D2;
    position: relative;
}
.supply_release .contact_name div,
.supply_release .contact_phone div{
    position: absolute;
    right:1.28rem;
}
.supply_release .contact_name input,
.supply_release .contact_phone input{
    text-align: right;
    border:none;
    height:2rem;
    margin-top: 0.75rem;
    line-height: 2rem;
    font-size: 1.19rem;
}
.supply_release .contact_name p,
.contact_phone p{
    position: absolute;
    left:1.28rem;
    line-height: 3.5rem;
    font-size: 1.19rem;
}
</style>
