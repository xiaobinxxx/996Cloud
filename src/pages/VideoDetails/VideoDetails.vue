<template>
  <div class="page-vidoe" @click="isTimeSeed = false">
    <!--标题名称关闭-->
    <div class="title-close" v-if="VideoList.length != 0">
      <div class="back" @click="onVidoeClose">
        <span></span>
      </div>
      <div class="title">{{VideoList[VidoeIndex].name}}</div>
<!--      <div class="close iconfont icon-close" @click.stop="onVidoeClose"></div>-->
    </div>
    <video ref="video" :src="VideoList.length===0?'':`${Global.host}${VideoList[VidoeIndex].url}`"
           @click="onVidoe">
    </video>
    <!--控件-->
    <div class="control">
      <div class="progress-bar">
        <div class="bar" :style="`width:${progress}%`"></div>
      </div>
      <div class="play-more">
        <div class="play">
          <span class="iconfont icon-bofang icon" title="播放"
                @click="onVidoePlay"
                v-show="isPlay"></span>
          <span class="iconfont icon-zanting icon" title="暂停"
                @click="onVideoPause"
                v-show="!isPlay"></span>
          <span class="iconfont icon-next icon" title="下一个"
                @click="onNext"></span>
          <span class="time"><i>{{videoCurrent}}</i>/{{videoDuration}}</span>
        </div>
        <div class="more">
          <div class="speed">
            <span title="倍速" @click.stop="onTimeSeed">{{seed}}x</span>
            <div class="speed-list" v-show="isTimeSeed">
              <div class="list" @click="onSeed('0.5')">0.5x</div>
              <div class="list" @click="onSeed('1.0')">1.0x</div>
              <div class="list" @click="onSeed('1.25')">1.25x</div>
              <div class="list" @click="onSeed('1.5')">1.5x</div>
              <div class="list" @click="onSeed('1.75')">1.75x</div>
              <div class="list" @click="onSeed('2.0')">2.0x</div>
              <div class="list" @click="onSeed('2.25')">2.25x</div>
              <div class="list" @click="onSeed('2.5')">2.5x</div>
            </div>
          </div>
          <span class="iconfont icon" :class="isFullScreen?'icon-tuquanping':'icon-quanping'" title="全屏" @click="onFullScreen"></span>
        </div>
      </div>
    </div>
    <div class="loading" v-show="isLoading">
      <span class="el-icon-loading"></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VideoDetails",
    data() {
      return {
        viedeo: '',
        isPlay: true,
        // 时长
        videoDuration: 0,
        // 播放时长
        videoCurrent: '00:00:00',
        // 播放进度百分比
        progress: '00:00:00',
        // 倍速显示状态
        isTimeSeed: false,
        seed: '1.0',
        // 全屏状态
        isFullScreen: false,
        VidoeIndex: 0,
        isLoading: false,
        VideoList: [],
      }
    },
    mounted() {
      this.VideoList = JSON.parse(decodeURIComponent(this.$route.query.VideoList));
      this.show(this.$route.query.index);
    },
    methods: {
      show(index){
        console.log(index);
        let that = this;
        this.isLoading = true;
        this.viedeo = this.$refs['video'];
        this.viedeo.addEventListener('canplay', function () {
          that.videoDuration = that.formatTime(this.duration);
          that.isLoading = false;
        });
        // 监听播放中暂停
        this.viedeo.addEventListener('waiting', function () {
          that.isLoading = true;
        });
        // 监听已经播放
        this.viedeo.addEventListener('playing', function () {
          that.isLoading = false;
        });

        this.VidoeIndex = index-1;
      },
      /**
       * 格式化时长
       */
      formatTime(t) {
        var h = parseInt(t / 3600);
        h = h < 10 ? '0' + h : h;
        var m = parseInt(t % 3600 / 60);
        m = m < 10 ? '0' + m : m;
        var s = parseInt(t % 60);
        s = s < 10 ? '0' + s : s;
        return h + ':' + m + ':' + s
      },
      /**
       * 点击播放
       */
      onVidoePlay() {
        this.isPlay = false;
      },
      /**
       * 点击暂停
       */
      onVideoPause() {
        this.isPlay = true;
      },
      /**
       * 倍速点击
       */
      onTimeSeed() {
        this.isTimeSeed = !this.isTimeSeed;
      },
      /**
       * 速度点击
       */
      onSeed(seed) {
        this.viedeo.playbackRate = seed;
        this.seed = seed;
        this.isTimeSeed = false;
      },
      /**
       * 全屏
       */
      fullScreen() {
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
        }
        return;
      },
      /**
       * 退出全屏
       */
      exitScreen() {
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        if (typeof rfs != "undefined" && rfs) {
          rfs.call(el);
        }
      },
      /**
       * 全屏点击
       */
      onFullScreen() {
        this.isFullScreen = !this.isFullScreen;
        if(this.isFullScreen){
          this.fullScreen();
        }else {
          this.exitScreen();
        }
      },
      /**
       * 视频标签点击
       */
      onVidoe(){
        this.isPlay = !this.isPlay;
      },
      /**
       * 下一个点击
       */
      onNext(){
        if((this.VidoeList.length-1) != this.VidoeIndex){
          this.VidoeIndex++;
        }
        this.isPlay = true;
        this.progress = 0;
      },
      /**
       * 点击关闭
       */
      onVidoeClose(){
        this.isPlay = true;
        this.progress = 0;
        this.$router.back();
      },
    },
    watch:{
      'isPlay':function (val) {
        let that = this;
        if(val){
          this.viedeo.pause();
        }else {
          this.viedeo.play();
          this.viedeo.playbackRate = this.seed;
          this.viedeo.addEventListener('timeupdate', function () {
            that.videoCurrent = that.formatTime(this.currentTime);
            that.progress = parseInt(this.currentTime / this.duration * 100);
          });
          this.viedeo.addEventListener('ended', function () {
            that.isPlay = true;
            if((that.VidoeList.length-1) != that.VidoeIndex){
              that.VidoeIndex++;
            }
          });
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "VideoDetails.styl"
</style>
