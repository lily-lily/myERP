<template>
    <div class="content landscape">
        <ul class="cnt" id="slider" :style="{ width: ctWidth + 'px' }">
            <li v-for="item in param" @click="selectStatus(item)">
            <p v-bind:class="{ active: item.show }">{{item.name}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
let t;
export default {
    data() {
            return {
                data: ['全部', '完成', '取消', '待确认', '待收货', '待快递', '待付款', '已取消'],
                startPos: '',
                isScrolling: 0,
                endPos: '',
                slider: '',
                index: 0,
                wrapperWidth: 0,
                widthDis: 0,
                ctWidth: 0
            }
        },
        props: ['param'],
        methods: {
            selectStatus(item) {
                for(let i =0;i<this.param.length;i++){
                    this.param[i].show=false;
                }
                item.show=true;
                this.$emit("postData", {
                   id:item.back_id
                });
            },
            touch(event) {
                
                this.handleEvent(event);
                 
            },
            handleEvent: function(event) {

                var _self = this; //this指events对象
                if (event.type == 'touchstart') {
                    _self.start(event);
                } else if (event.type == 'touchmove') {
                    _self.move(event);
                } else if (event.type == 'touchend') {
                    _self.end(event);
                }
                
            },
            start: function(event) {
                var touch = event.targetTouches[0];
                this.startPos = {
                    x: touch.pageX,
                    y: touch.pageY,
                    time: +new Date
                };
                this.isScrolling = 0;
                this.slider.addEventListener('touchmove', this, false);
                this.slider.addEventListener('touchend', this, false);
            },

            move: function(event) {
                if (t) clearInterval(t);
                if (event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
                var touch = event.targetTouches[0];
                this.endPos = {
                    x: touch.pageX - this.startPos.x,
                    y: touch.pageY - this.startPos.y
                };
                this.isScrolling = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
                if (this.isScrolling === 0) {
                    event.preventDefault();
                    let _self = this;
                    var count = 0;
                    var minDis = 1;
                    if (Math.abs(_self.endPos.x) < 50) {
                        minDis = 1;
                    } else if (Math.abs(_self.endPos.x) < 100) {
                        minDis = 2;
                    } else {
                        minDis = 3;
                    }

                    function scrolling() {
                        let x = _self.slider.style.left.slice(0, this.slider.style.left.length - 2);
                        if (_self.endPos.x < 0) {
                            if (-1 + Number(x) > _self.widthDis) {
                                _self.slider.style.left = -minDis + Number(x) + 'px';
                                if (count == Math.abs(_self.endPos.x)) clearInterval(t);
                            } else {
                                _self.slider.style.left = _self.widthDis + 'px';
                                clearInterval(t);
                            }
                        } else {
                            if (1 + Number(x) > 0) {
                                _self.slider.style.left = '0px';
                                clearInterval(t);
                            } else {
                                _self.slider.style.left = minDis + Number(x) + 'px';
                                if (count >= Math.abs(_self.endPos.x)) clearInterval(t);
                            }
                        }
                        count += minDis;
                    }
                    t = setInterval(scrolling, 1);
                }
            },
            end: function(event) {
                this.slider.removeEventListener('touchmove', this, false);
                this.slider.removeEventListener('touchend', this, false);
            }
        },
        mounted() {
            this.slider = document.getElementById('slider');
            this.slider.addEventListener('touchstart', this.touch, false);
            this.wrapperWidth = document.documentElement.clientWidth;
            this.ctWidth = this.param.length * 70;
            this.widthDis = this.wrapperWidth - this.param.length * 70;
            console.log(this.param);
        }
}
</script>
<style scoped>
* {
    margin: 0;
    padding: 0;
}

li {
    list-style: none;
}

.landscape {
    width: 100%;
    overflow: hidden;
    height: 40px;
}

.landscape .cnt {
    position: relative;
    left: 0;
    float: left;
    background-color: #fff;
}

.landscape .cnt li {
    float: left;
    width: 70px;
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
}
.landscape .cnt li .active{
    color: #fa6705;
    border-bottom: 2px solid #fa6705;
    height: 100%;

}
</style>
