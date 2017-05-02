<template>
    <div class="need_release">
        
        <myHeader :param = "param"></myHeader>
        <!-- <mt-loadmore> -->
            <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <druginformation :obj="obj"> </druginformation>
                
                    <div class="title_name">
                       <p class="remarks_header">备注</p>
                    </div> 
                    <div class="remarks">
                        <!-- <p class="remarks_header">备注</p> -->
                        <div class="remarks_content">
                            <textarea placeholder="请填写备注信息" v-model="obj.selling_point"></textarea>
                        </div>
                    </div>
                     <div class="title_name">
                       <p class="contact_header">联系方式</p>
                    </div>
                    <div class="contact">
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
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import validation from '../validation/validation.js'
import httpService from '../common/httpService.js'
import myHeader from '../components/tools/myHeader'
import druginformation from '../components/tools/purchaseGoodInformation'
export default {
    data() {
            return {
                param:{
                    name:'求购发布',
                    router:'home'
                },
                router: 'search',
                selected: '1',
                obj: {
                    number_id:'',
                    update:false,
                    drug_name: '',
                    spec: '',
                    place: '',
                    number: '',
                    number_unit: '',
                    selling_point: '',
                    name: '',
                    phone: '',
                    duedate: '',
                    breedId: ''
                }
            }
        },
        components: {
            druginformation,
            myHeader
        },
        methods: {
            release() {
                let _self = this;
                console.log(_self.obj.number_id)
                var checkArr = [];
                let checkBreedId = validation.checkNull(_self.obj.breedId, '请先选择品种！');
                checkArr.push(checkBreedId);
                let checkBreedSpec = validation.checkNull(_self.obj.spec, '请输入规格！');
                checkArr.push(checkBreedSpec);
                let checkBreedPlace = validation.checkNull(_self.obj.place, '请输入产地！');
                checkArr.push(checkBreedPlace);
                let checkNumber = validation.checkNull(_self.obj.number, '请输入数量');
                checkArr.push(checkNumber);
                let checkDuedate = validation.checkNull(_self.obj.duedate, '请输入求购有效期');
                checkArr.push(checkDuedate);
                let checkName = validation.checkNull(_self.obj.name, '请输入姓名');
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
                    biz_method: 'editBegBuyInfo',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        customerId: common.customerId,
                        breedName: _self.obj.drug_name,
                        spec: _self.obj.spec,
                        location: _self.obj.place,
                        number: _self.obj.number,
                        description: _self.obj.selling_point,
                        customerName: _self.obj.name,
                        customerPhone: _self.obj.phone,
                        duedate: _self.obj.duedate,
                        breedId: _self.obj.breedId,
                        unit: _self.obj.number_id,
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.needRelease(url, body, function(suc) {
                    common.$emit('close-load');
                    if (suc.data.code == '1c01') {
                        common.$emit('message', suc.data.msg);
                        common.$emit('informMyPurchase', 'refurbish');
                        let id = suc.data.biz_result.intentionId;
                        common.$emit('informNeedSuccess', id);
                        _self.$router.push("needReleaseSuccess" + '/' + id);
                    } else {
                        common.$emit('message', suc.data.msg);
                    }
                }, function(err) {
                    common.$emit('close-load');
                    common.$emit('message', err.data.msg);
                })
            },
            jump(router) {
                this.$router.push(router);
            }
        },
        mounted() {
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
        }
}
</script>
<style scoped>
.whole {
    position: relative;
    background: #F1EFEF;
}

.need_release {

}
.need_release .page-loadmore-wrapper{
    margin-bottom: 0px;
    padding: 0px;
}
input[type="text"],
input[type="submit"],
input[type="reset"],
select,
textarea {
    -webkit-appearance: none;
    border-radius: 0;
}

.need_release .mint-header {
    background-color: white;
    color: #313232;
    border-bottom: 1px solid #C9C9C9;
}

.need_release .good_information,
.remarks,
.contact {
   
    /*margin-bottom: 0.8533rem;*/
    background: white;
}

.need_release .good_information {
    height: 10.24rem;
}

.need_release .contact {
   
    margin-bottom: 10px;
}

.need_release .good_infor_header {
    background: url('/static/images/information.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
}

.need_release .good_infor_header,
.remarks_header,
.contact_header {
    font-size: 1.2rem;
    color: #FA6705;
    text-align: left;
    padding-left: 1.536rem;
}

.need_release .title_name  .remarks_header{
    background: url('../../static/images/remarks.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
    line-height:3.75rem; 
    height:3.58rem;
    margin-left: 1.28rem;

}
.need_release .title_name  .contact_header{
    background: url('../../static/images/contact.png') no-repeat 0 center;
    background-size: 1.11rem 1.11rem;
    line-height:3.75rem; 
    height:3.58rem;
    margin-left: 1.28rem;
}

.need_release .good_name,
.good_spec,
.good_place,
.good_number,
.contact_name,
.contact_phone {
    height: 3.5rem;
   
}
.need_release .contact_name,
.need_release .contact_phone{
    margin-top: 0px;
    border-bottom: 1px solid #D2D2D2;
    position: relative;
}
.need_release .contact_name div,
.need_release .contact_phone div{
    position: absolute;
    right:1.28rem;


}
.need_release .contact_name input,
.need_release .contact_phone input{
    text-align: right;
    border:none;
    height:2rem;
    margin-top: 0.75rem;
    line-height: 2rem;
    font-size: 1.19rem;
}
.need_release .contact_name p,
.need_release .contact_phone p{
    position: absolute;
    left:1.28rem;
    line-height: 3.5rem;
    font-size: 1.19rem;
}
.need_release .good_number div p img {
    width: 100%;
    height: 100%;
    padding: 10px;
}

.need_release .good_place select {
    background: url('/static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.1rem 1.1rem;
    text-align: center;
}

.need_release .good_spec select {
    background: url('/static/images/drop-down.png') no-repeat 13.3rem center;
    background-size: 1.1rem 1.1rem;
    text-align: center;
}

.need_release .good_name p,
.good_spec p,
.good_place p,
.good_number p,
.contact_name p,
.contact_phone p,
.contact_name div,
.contact_phone div {
    float: left;
    line-height: 3.5rem;
    font-size: 1.024rem;
    color: #333333;
}

.need_release .contact_name p,
.contact_phone p {
    margin-right: 2.47rem;
}

.need_release .good_name div,
.good_spec div,
.good_place div,
.good_number div {
    float: right;
    position: relative;
}

.need_release .good_number .number_unit {
    width: 100%;
    height: 100%;
    outline: none;
    border: 0;
    float: left;
    text-align: center;
    padding-left: 10px;
}

.need_release .good_name div .select,
.good_spec div select,
.good_place div select,
/*.contact_name div input,*/
/*.contact_phone div input */{
    font-size: 1.024rem;
    height: 3.3rem;
    width: 14.847rem;
    text-align: center;
    outline: none;
    border: 1px solid #D2D2D2;
}

.need_release .select input {
    font-size: 1.024rem;
    height: 3.3rem;
    width: 14.847rem;
    text-align: center;
    outline: none;
    border: 1px solid #D2D2D2;
}

.need_release .alert_input {
    width: 100% !important;
    background-color: #fff;
}

.need_release .good_name div .select input {
    text-align: center;
    outline: none;
    border: 0;
    height: 100%;
    width: 100%;
    background: white;
}

.need_release .good_number div {
    height: 2.9rem;
    width: 14.847rem;
    border: 1px solid #D2D2D2;
}

.need_release .good_number div input {
    outline: none;
    font-size: 1.024rem;
    height: 3.3rem;
    width: 11.178rem;
    text-align: center;
    float: left;
    outline: none;
    border: 0;
}

.need_release .good_number div p {
    height: 2.73rem;
    width: 3.5rem;
    border-left: 1px solid #D2D2D2;
}
.need_release .remarks{
    padding: 1.28rem;
}   
.need_release .remarks_content textarea {
    height: 7.68rem;
    width: 100%;
    font-size: 1.19rem;
    padding: 1.279rem;
    border: 1px solid #D2D2D2;
}

.need_release .confirm {
    width: 100%;
    height: 50px;
    background: #FA6705;
    font-size: 1.536rem;
    color: white;
    line-height: 50px;
    margin-top: 50px;
    float:left;
}
</style>
