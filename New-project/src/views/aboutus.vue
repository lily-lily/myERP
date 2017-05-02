<template>
    <div class="aboutus">
        <myHeader :param="my_header" v-if="show"></myHeader>
        <div class="bg_white">
          <!--   <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                <mt-loadmore> -->
                    <div >
                        <p>药材买卖网（yaocaimaimai.com）”隶属于上海冕冠电子商务有限公司，是由知名VC、天使投资人投资千万人民币，旨在打造全球最大的药材交易平台，创始人曾在互联网上市公司“上海钢联”（股票代码300226）带领全国各地地推团队近300人，有丰富的行业积累和管理经验；曾在美金架构创投公司（找钢网）担任高管，短短3年时间，现在估值10亿美金；十年互联网从业经验，2015年6月从心出发，带领一群有梦想有激情的创业团队一起做一件颠覆整个行业的事。</p>
                        <p>2015电商风起云涌，但真正能存活下来的不多，商业模式大同小异，但真正能杀出来的寥寥无几，仅凭一个想法、一个创意、一个思维是不行的，我们需要的是像游戏中打boss一样，各路英豪群聚，互相配合并相互补位才能赢得最后的胜利，一同感受创业梦想实现的那一刻光辉，一起分享上市敲锤的那一刻喜悦！</p>
                        <p>如果你是强者，有创业的梦想却缺乏一个舞台；</p>
                        <p>如果你是智者，有跳跃的思维却缺乏一个空间；</p>
                        <p>如果你是勇士，有斗志昂扬的执行力却缺乏一个引路人；</p>
                        <p>------这里，舞台、空间、方向全部都给你，只等你来，只为等你！ 给我一个一起奋斗成长的3年，还你一个精彩无限的30年！</p>
                        <p>药材买卖网（yaocaimaimai.com）”隶属于上海冕冠电子商务有限公司，是由知名VC、天使投资人投资千万人民币，旨在打造全球最大的药材交易平台，创始人曾在互联网上市公司“上海钢联”（股票代码300226）带领全国各地地推团队近300人，有丰富的行业积累和管理经验；曾在美金架构创投公司（找钢网）担任高管，短短3年时间，现在估值10亿美金；十年互联网从业经验，2015年6月从心出发，带领一群有梦想有激情的创业团队一起做一件颠覆整个行业的事。</p>
                        <p>2015电商风起云涌，但真正能存活下来的不多，商业模式大同小异，但真正能杀出来的寥寥无几，仅凭一个想法、一个创意、一个思维是不行的，我们需要的是像游戏中打boss一样，各路英豪群聚，互相配合并相互补位才能赢得最后的胜利，一同感受创业梦想实现的那一刻光辉，一起分享上市敲锤的那一刻喜悦！</p>
                        <p>如果你是强者，有创业的梦想却缺乏一个舞台；</p>
                        <p>如果你是智者，有跳跃的思维却缺乏一个空间；</p>
                        <p>如果你是勇士，有斗志昂扬的执行力却缺乏一个引路人；</p>
                        <p>------这里，舞台、空间、方向全部都给你，只等你来，只为等你！ 给我一个一起奋斗成长的3年，还你一个精彩无限的30年！</p>
                    </div>
             <!--    </mt-loadmore>
            </div> -->
        </div>
    </div>
</template>
<script>
import common from '../common/common.js'
import myHeader from '../components/tools/myHeader'
export default {
    data() {
            return {
                wrapperHeight:'',
                show:true,
                my_header: {
                    name: '关于我们',
                }
            }
        },
        components: {
            myHeader
        },
        methods: {

        },
        created() {
             let from = this.$route.params.from;
           if(from=='ios') {
              this.show=false; 
           }
        },
        mounted() {
            // this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top ;
        }
}
</script>
<style scoped>
.aboutus {}

.aboutus .bg_white{
    background-color: #fff; 
}

.aboutus p {
    text-indent: 32px;
    margin: 10px;
    font-size: 16px;
    white-space: normal;
}
</style>
