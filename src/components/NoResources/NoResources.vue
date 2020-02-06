<template>
  <div class="no-resources">
    <div class="iconfont icon" :class="IconClass"></div>
    <div class="hint">{{hint}}</div>
  </div>
</template>

<script>
  export default {
    name: "NoResources",
    props:{
      IconClass: {
        type: String,
        default: 'icon-none'
      },
      hint:{
        type: String,
        default: '文件资源空或链接资源已失效，请联系上传者'
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "NoResources.styl"
</style>
