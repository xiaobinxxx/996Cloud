<template>
  <div id="app">
    <head-title></head-title>
    <router-view></router-view>
  </div>
</template>

<script>
  import HeadTitle from './components/HeadTitle/HeadTitle'

  export default {
    name: 'app',
    components:{
      HeadTitle,
    },
    beforeUpdate() {
      this.Global.UserInfo = JSON.parse(localStorage.getItem('UserInfo'));
    }
  }
</script>

<style lang="stylus">
  @import "/static/css/public.css";
  @import "./style/change.styl";
  @import "/static/font/iconfont.css"
  /*-------通用样式----------*/
  // 右边更多
  .more-right{
    width 8px;
    height 8px;
    border-right 1px solid #9c9ea5;
    border-bottom 1px solid #9c9ea5;
    transform rotate(-45deg);
  }
  /* 超出一行省略号 */
  .one-omit {
    white-space: nowrap; /*规定段落中的文本不进行换行*/
    overflow: hidden; /*内容会被修剪，并且其余内容是不可见的。*/
    text-overflow: ellipsis; /*显示省略号来代表被修剪的文本*/
  }

  .two-omit {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
  }
</style>
