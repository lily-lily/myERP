<template>
    <div class="content mypurchase_sort">
        <div class="sort_content">
            <div v-bind:class="item.class" v-for="(item,index) in paramArr" @click="showTable(item,index)">
                {{item.name}}<img v-bind:src="item.url">
            </div>
            <div class="sort_cell" v-show="selectShow">
                <a v-for="item in selectArr" @click="getAsc(item)">
                    <mt-cell>
                        <p class="cell_p">{{item.name}}</p>
                        <img class="cell_image" src="/static/icons/selected.png" style="max-height:10px" v-show="item.show">
                    </mt-cell>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
            return {
                selectShow: false,
                selectArr: [],
                selectIndex: 0
            }
        },
         props: {
            sortRouter:{
                type: String,
                default: '/home'
            },
            paramArr:[Array]
        },
        methods: {
            showTable: function(item, index) {
                if (item.asc == 'location') {
                    this.$router.push('provenanceSelection');
                } else {
                    this.selectShow = !this.selectShow;
                    this.selectIndex = index;
                    this.selectArr = item.sortArr;
                }
            },
            getAsc: function(item) {
                console.log(item);
                if (!item.asc) {
                    this.paramArr[this.selectIndex].name = this.paramArr[this.selectIndex].saveName;
                    this.paramArr[this.selectIndex].url = '/static/icons/drop_down.png';
                    this.paramArr[this.selectIndex].class = 'sort_content_detail';
                } else {
                    this.paramArr[this.selectIndex].class = 'sort_content_detail_select';
                    this.paramArr[this.selectIndex].name = item.name;
                    if (item.asc == 'low') {
                        this.paramArr[this.selectIndex].url = '/static/icons/drop_down_selected.png';
                    } else if (item.asc == 'top') {
                        this.paramArr[this.selectIndex].url = '/static/icons/take_back.png';
                    }
                }
                this.selectShow = false;
                let _self = this;
                _self.$emit("postId", item); 
            }
        },
        created() {
            this.selectArr = this.paramArr[0].sortArr;
        }
}
</script>
<style scoped>
.mypurchase_sort {
    float: left;
    width: 100%;
}

.mypurchase_sort .sort_content {
    width: 100%;
    float: left;
    border-bottom: 1px solid #ddd;
    background: white;
   
}

.mypurchase_sort .sort_content .sort_content_detail {
    float: left;
    width: 25%;
    min-height: 40px;
    line-height: 40px;
    color: #666;
    font-size: 1.1rem;
}

.mypurchase_sort .sort_content .sort_content_detail_select {
    float: left;
    width: 25%;
    min-height: 40px;
    line-height: 40px;
    color: #EC6817;
    font-size: 1.1rem;
}

.mypurchase_sort .sort_content .sort_content_detail_select img {
    max-height: 9px;
    margin-left: 5px;
    margin-top: 5px;
}

.mypurchase_sort .sort_content .sort_content_detail img {
    max-height: 9px;
    margin-left: 5px;
    margin-top: 5px;
}

.mypurchase_sort .sort_content .sort_cell {
    width: 100%;
    float: left;
    position: absolute;
    z-index: 2;
    margin-top: 40px;
}

.mypurchase_sort .sort_content .sort_cell .cell_p {
    position: absolute;
    left: 10px;
    font-size: 1.1rem;
}

.mypurchase_sort .sort_content .sort_cell .cell_img {
    max-height: 15px;
    float: right;
}
</style>
