<template>
  <div class="header base-bg">
    <div class="logo">
      <img src="/static/image/logo_b.png" alt="">
    </div>
    <div class="head-extend" v-if="isHead">
      <div class="iconfont icon-fadajing fa" v-show="!isSearchShow" @click="onSearchShow"></div>
      <div class="search" :style="isSearchShow?`width: 200px`:'width:0'">
        <span class="iconfont icon-fadajing"></span>
        <input type="text"
               v-focus="isSearchShow"
               v-blur="!isSearchShow"
               @blur="SearchBlur"
               @keyup.enter="keyEnter"
               v-model="keyword" placeholder="输入搜索的名称">
      </div>
      <div class="user-info">
        <el-popover placement="bottom"
                    width="100"
                    class="info"
                    trigger="click">
<!--          <div class="info-list">-->
<!--            <span class="iconfont icon-setting"></span>-->
<!--            <span>设置</span>-->
<!--          </div>-->
          <div class="info-list" @click="onLogout">
            <span class="iconfont icon-zhuxiao"></span>
            <span>注销</span>
          </div>
          <!--昵称-->
          <div class="name" slot="reference">
            <span>{{Global.UserInfo.nickname}}</span>
            <span class="pull-down"></span>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "HeadTitle",
    data(){
      return {
        isSearchShow: false,
        keyword: '',
        isHead: false,
      }
    },
    directives: {
      focus: {
        inserted: function(el, { value }) {
          if (value) {
            el.focus();
          }
        }
      },
      blur: {
        inserted: function(el, { value }) {
          if (value) {
            el.blur();
          }
        }
      }
    },
    mounted(){

    },
    methods:{
      /**
       * 搜索显示点击
       */
      onSearchShow(){
        this.isSearchShow = !this.isSearchShow;
      },
      /**
       * 搜索失去焦点
       */
      SearchBlur(){
        this.isSearchShow = false;
      },
      /**
       * 搜索回车
       */
      keyEnter(){
        this.$store.state.SearchValue.keyword = this.keyword;
      },
      /**
       * 注销点击
       */
      onLogout(){
        localStorage.removeItem('token');
        this.$router.push({name: 'login'});
      },
    },
    watch:{
      '$route'(to, from) {
        let RouteArr = [
          'SharePage',
          'login',
          'register',
        ];

        if(RouteArr.findIndex((value)=>value == to.name) != -1){
          this.isHead = false;
        }else {
          this.isHead = true;
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "HeadTitle.styl";
</style>
