<template>
    <div class=" address_confirm">
        <div class="left_district">
            <div class="content">
                <div class="left_content"><img src="/static/icons/consignee.png">收货人：</div>
                <div><span>{{param.contactName}}</span>{{param.contactPhone}}</div>
            </div>
            <div class="content address">
                <div class="left_content"><img src="/static/icons/receipt_address.png">收货地址：</div>
                <div class="address_detail">{{param.address}}</div>
            </div>
        </div>
        <img src="/static/images/right.png" class="right_arrow">
    </div>
</template>
<script>
import common from '../../common/common.js'
import httpService from '../../common/httpService.js'
export default {
    props: {
        param: {}
    },
    created() {
        let _self = this;
        common.$on('backAddress', function(todo) {
            _self.param.id = todo.id;
            _self.param.address = todo.address;
            _self.param.contactPhone = todo.contactPhone;
            _self.param.contactName = todo.contactName;
        })

        common.$on('edit-Address', function(todo) {
            if (_self.param.id == todo.id) {
                _self.param.address = todo.address;
                _self.param.contactPhone = todo.contactPhone;
                _self.param.contactName = todo.contactName;
            }

        })
    },
    methods: {}
}
</script>
<style scoped>
.address_confirm {
    background: #fff;
    float: left;
    width: 100%;
    padding: 10px;
    position: relative;
}

.address_confirm .left_district {
    float: left;
    width: 100%;
    padding-right: 20px;
}

.address_confirm .left_district .content {
    float: left;
    width: 100%;
    font-size: 14px;
    line-height: 23px;
    color: #333;
}

.address_confirm .left_district .content span {
    border-right: 1px solid #666;
    padding-right: 3px;
    margin-right: 3px;
}

.address_confirm .left_district .address {
    margin-top: 5px;
}

.address_confirm .left_district .content .left_content {
    float: left;
    text-align: right;
    min-width: 90px;
}

.address_confirm .left_district .content div {
    text-align: left;
}

.address_confirm .left_district .content img {
    float: left;
    max-height: 20px;
}

.address_confirm .right_arrow {
    position: absolute;
    right: 10px;
    max-height: 20px;
    margin-top: 15px;
}

.address_confirm .left_district .address .address_detail {
    padding-left: 90px;
}
</style>
