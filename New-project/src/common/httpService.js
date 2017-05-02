import Vue from 'vue'


let httpService = new Vue({
    methods: {
        login(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (response) => {
                err(response);
            });
        },

        register(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (response) => {
                err(response);
            });
        },
        findPassWord(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (response) => {
                err(response);
            });
        },
        revisePassWord(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (response) => {
                err(response);
            });
        },

        queryUserInfo(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        begBuyList(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        queryEmployeeInfo(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        myAttention(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        myResource(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        lowPriceRes(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        urgentNeed(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        addressManage(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        addressRevise(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        addAddress(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        supplyRelease(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        getIntentionDetails(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        needRelease(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        myPurchase(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        intentResOrder(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        realTimeTurnover(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        searchWord(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        hotSearch(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        marketQuotation(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        drugResTable(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        myOrder(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        specifiedPlace(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        commonPost(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response);
            }, (res) => {
                err(res);
            });
        },
        put(url) {

        },
        del(url) {

        },
        getQiniuToken(url, body, suc, err) {
            this.$http.post(url, body).then((response) => {
                suc(response.data);
            }, (res) => {
                err(res);
            });

        }
    }
})



module.exports = httpService;
