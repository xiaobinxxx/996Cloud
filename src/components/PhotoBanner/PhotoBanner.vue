<template>
  <div class="photo-banner" v-if="isPhoto">
    <div class="photo-slide" :style="`transform:translateX(-${slideNum}%)`">
      <div class="slide" v-for="(item,index) in PhotoList"
           @touchstart="Phototouchstart()"
           @touchmove="Phototouchmove()"
           @touchend="Phototouchend()"
           :key="index">
        <img :src="`${Global.host}${item.url}`" :alt="item.name" :style="(slideIndex-1)===index?`transform: rotate(${PhotoRotate}deg) scale(${PhotoScale});`:``">
        <div class="name">{{item.name}}</div>
      </div>
    </div>
    <div class="control">
      <div class="cut">
        <div class="next-left" @click="onNextLeft"></div>
        <div class="pagination">{{slideIndex}}/{{PhotoList.length}}</div>
        <div class="next-right" @click="onNextRight"></div>
      </div>
      <div class="operate">
        <div class="ate" @click="onPhotoRotate">
          <span class="iconfont icon-xuanzhuan"></span>
        </div>
        <div class="ate" @click="onPhotoScale(1)">
          <span class="iconfont icon-fangda"></span>
        </div>
        <div class="ate" @click="onPhotoScale(2)">
          <span class="iconfont icon-suoxiao"></span>
        </div>
      </div>
      <div class="extend">
        <div class="ex" @click="onPhotoDwonLoad">
          <span class="iconfont icon-download"></span>
        </div>
        <div class="ex" @click="isPhoto = false;">
          <span class="iconfont icon-close"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PhotoBanner",
    data(){
      return {
        // 滑动数值
        slideNum: 0,
        // 滑动索引
        slideIndex: 1,
        // 照片旋转
        PhotoRotate: 0,
        // 照片放大缩小
        PhotoScale: 1,
        isPhoto: false,
        // 触摸
        startX: 0,
        startY: 0,
        direction: 0,
      }
    },
    props:{
      PhotoList:{
        type: Array,
      }
    },
    methods:{
      show(index){
        console.log(index);
        this.slideIndex = index;
        this.slideNum = (index*100-100);
        this.isPhoto = true;
      },
      /**
       * 左点击
       */
      onNextLeft(){
        this.PhotoScale = 1;
        this.PhotoRotate = 0;
        if(this.slideNum != 0){
          this.slideNum -= 100;
          this.slideIndex--;
        }
      },
      /**
       * 右点击
       */
      onNextRight(){
        this.PhotoScale = 1;
        this.PhotoRotate = 0;
        if(this.slideNum < (this.PhotoList.length*100-100)){
          this.slideNum += 100;
          this.slideIndex++;
        }
      },
      /**
       * 照片旋转点击
       */
      onPhotoRotate(){
        this.PhotoRotate += 90;
      },
      /**
       * 照片放大缩小
       */
      onPhotoScale(type){
        if(type === 1){
          if(this.PhotoScale >= 5){
            return;
          }
          this.PhotoScale += 0.2;
        }else {
          if(this.PhotoScale <= 0.5){
            return;
          }
          this.PhotoScale -= 0.2;
        }

      },
      /**
       * 照片下载
       */
      onPhotoDwonLoad(){
        var a = document.createElement('a');
        var event = new MouseEvent('click');
        a.download = this.PhotoList[this.slideIndex-1].name;
        a.href = this.PhotoList[this.slideIndex-1].url;
        a.dispatchEvent(event);
      },
      /**
       * 触摸开始
       */
      Phototouchstart(){
        event.preventDefault(); //阻止默认事件（长按的时候出现复制）

        this.startX = event.changedTouches[0].pageX;
        this.startY = event.changedTouches[0].pageY
      },
      /**
       * 触摸滑动
       */
      Phototouchmove(){
        event.preventDefault();
        var moveEndX = event.changedTouches[0].pageX;
        var moveEndY = event.changedTouches[0].pageY;
        var X = moveEndX - this.startX;
        var Y = moveEndY - this.startY;
        if (Math.abs(X) > Math.abs(Y) && X > 0) {
          if(Math.abs(this.slideNum)=== 0){
            return;
          }
          this.direction = 1;
        } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
          if((100*this.PhotoList.length-100) === Math.abs(this.slideNum)){
            console.log('到底了');
            return;
          }
          this.direction = 2;
          console.log('right')
        } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
          // console.log('down')
        } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
          // console.log('top')
        } else {
          // alert('just touch')
        }
      },
      /**
       * 触摸结束
       */
      Phototouchend(){
        document.removeEventListener('touchmove',event.preventDefault, false);
        console.log(this.direction);
        if(this.direction === 1){
          this.slideNum -= 100;
          this.slideIndex--;
        }else if (this.direction === 2){
          this.slideNum += 100;
          this.slideIndex++;
        }
        this.direction = -1;
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "PhotoBanner.styl"
</style>
