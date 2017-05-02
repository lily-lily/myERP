import Vue from 'vue'
import CryptoJS from "crypto-js"
import crypto from "crypto"
import { Indicator, Toast, MessageBox, DatetimePicker } from 'mint-ui'
import wx from 'weixin-js-sdk'
let shareUrl=window.location.href.split('#')[0];

//百度统计代码
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?77f09e26962559dd888e83b1dcf882a0";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

let common = new Vue({
    data: {
        shareUrl:shareUrl,
        customerId: window.localStorage.ID,
        show: true,
        urlCommon: '/front',
        KEY: window.localStorage.KEY,
        SID: window.localStorage.SID,
        difTime: window.localStorage.difTime,
        searchType:'keyword',
        servicePhone: '',
        appUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yaocaimaimai.yaocaimaimai',
        apiUrl: {
            list: '/static/data/list.json',
            market_list: '/static/data/market_list.json',
            drug_table_list: '/static/data/drug_table_list.json',
            drug_information_list: '/static/data/drug_information_list.json',
            login: '/account/login.do',
            code_login: '/account/verifiLogin.do',
            getDate: '/system/date.do',
            most: '/handle/control.do'
        },
        pageParam: {
            router: '',
            lowPrice: '',
            Urgentneed: '',
            myAttention: '',
            supplyRelease: '',
            reviseResource: '',
            addressId: '',
            postAddressObj: '',
            resourceId: '',
            Needrelease: '',
            backAddress: '',
            orderStatus: 0,
            myParam:'',
            backRouter:''
        },
        shareParam: {
            imgUrl: 'http://apps.yaocaimaimai.com/htm5/static/icons/err.png',
            title: "买卖药材就上药材买卖网！",
            desc: '药材买卖网（yaocaimaimai.com）隶属于上海冕冠电子商务有限公司，是由知名VC、天使投资人投资千万人民币，旨在打造全球最大的药材交易平台!',
            link: 'http://apps.yaocaimaimai.com/htm5/#/home'
        }
    },
    methods: {
        share(data) {
            let _self = this;
            if (!data) {
                _self.shareParam = {
                    imgUrl: 'http://apps.yaocaimaimai.com/htm5/static/icons/err.png',
                    title: "买卖药材就上药材买卖网！",
                    desc: '药材买卖网（yaocaimaimai.com）隶属于上海冕冠电子商务有限公司，是由知名VC、天使投资人投资千万人民币，旨在打造全球最大的药材交易平台!',
                    link: 'http://apps.yaocaimaimai.com/htm5/#/home'
                };
            }else{
                _self.shareParam = {
                    imgUrl: data.imgUrl,
                    title: data.title,
                    desc: data.desc,
                    link: data.link
                }; 
            }

            wx.onMenuShareTimeline({
                imgUrl: _self.shareParam.imgUrl,
                title: _self.shareParam.title,
                desc: _self.shareParam.desc,
                link: _self.shareParam.link,
                success: function() {

                },
                cancel: function() {

                }
            });
            wx.onMenuShareAppMessage({
                imgUrl: _self.shareParam.imgUrl,
                title: _self.shareParam.title,
                desc: _self.shareParam.desc,
                link: _self.shareParam.link,
                success: function() {

                },
                cancel: function() {

                }
            });
        },
        shareCreate(data) {
            let _self = this;
            console.log(data);
            wx.config({ //微信配置
                debug: false,
                appId: data.appId,
                nonceStr: data.nonceStr,
                signature: data.signature,
                timestamp: parseInt(data.timestamp),
                jsapi_ticket: data.jsapiTicket,
                url: data.url,
                jsApiList: data.apiList
            });
            wx.ready(function() {
                wx.onMenuShareTimeline({ //分享到朋友圈                           
                    imgUrl: _self.shareParam.imgUrl, // 分享图标
                    title: _self.shareParam.title, // 分享标题
                    desc: _self.shareParam.desc, // 分享描述  
                    link: _self.shareParam.link, // 分享链接                      
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
                wx.onMenuShareAppMessage({ //分享到朋友圈
                    imgUrl: _self.shareParam.imgUrl, // 分享图标
                    title: _self.shareParam.title, // 分享标题
                    desc: _self.shareParam.desc, // 分享描述  
                    link: _self.shareParam.link, // 分享链接                      
                    success: function() {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        },
        getWeixinSign(url) {
            let _self = this;
            _self.$http.post(_self.urlCommon + _self.apiUrl.most, {
                biz_module: 'weiXinService',
                biz_method: 'getWeiXinJsSdk',
                biz_param: {
                    url: url
                }
            }).then((res) => {
                if(res.data.biz_result)_self.shareCreate(res.data.biz_result);
            }, (err) => {
                console.log(err);
            });
        },
        addSID(url) {
            if (this.SID && this.SID != undefined) {
                return url + ';jsessionid=' + this.SID;
            } else {
                return url;
            }
        },
        getDate() {
            let _self = this;
            this.$http.get(this.urlCommon + this.apiUrl.getDate).then((response) => {
                if (response.data.code == '1c01') {
                    var timestamp = Date.parse(new Date());
                    window.localStorage.difTime = response.data.biz_result.time - timestamp;
                    _self.difTime = window.localStorage.difTime;
                    common.$emit('toMine');
                }
            }, (err) => {
                common.$emit('message', err.data.msg);
            });
        },
        getSign(str) {
            let _self = this;
            if (!_self.KEY) {
                _self.KEY = 'test';
            }
            if (!str) {
                str = 'test';
            }
            let signStr = CryptoJS.HmacSHA1(str, _self.KEY).toString(CryptoJS.enc.Base64);
            console.log(signStr);
            return signStr;
        }

    }
})

common.$on('show-load', () => {
    Indicator.open('Loading...');

})

common.$on('close-load', () => {
    Indicator.close();
})

common.$on('success', () => {
    Toast({
        message: '操作成功',
        iconClass: 'icon icon-success'
    });
})


common.$on('message', message => {
    if (!message) {
        return;
    }
    Toast({
        message: message,
        duration: 2000
    });
})


common.$on('touch', )

common.$on('confirm', (obj) => {
    MessageBox.confirm(obj.message, obj.title).then(action => {
        obj.ensure();
    }, action => {

    })
})



common.$on('setParam', (key, value) => {
    common.pageParam[key] = value;
})

module.exports = common;
