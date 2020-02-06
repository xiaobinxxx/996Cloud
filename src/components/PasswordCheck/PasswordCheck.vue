<template>
  <!--密码校验-->
  <div class="main">
    <div class="logo">
      <img src="/static/image/logo_b.png" alt="">
    </div>
    <div class="logo-claim">这是一个私密链接分享</div>
    <div class="login-area">
      <div class="login-input">
        <input type="password" placeholder="请输入密码" @keyup="onEnterKeyUp" v-model="password" required>
      </div>
      <el-button style="width: 100%"
                 :loading="isEnter"
                 @click="onEnter">进入</el-button>
    </div>
    <div class="copyright">
      996Cloud——您的云，您的数据，您的方式!
    </div>
  </div>
</template>

<script>
  import {ShareCheckPassword} from '../../axios/api'
  export default {
    name: "PasswordCheck",
    data(){
      return {
        // 密码进入
        isEnter: false,
        password: '',
        PassToke: '',
        privacy: '',
        ShareUrl: '',
      }
    },
    mounted(){
      this.privacy = this.$route.query.privacy||'';
      this.ShareUrl = this.$route.query.ShareUrl||'';
    },
    methods: {
      /**
       * 密码校验
       */
      async checkPassword(){
        if(this.privacy == 2){
          return;
        }
        this.isEnter = true;
        await ShareCheckPassword({
          ShareUrl: this.ShareUrl,
          password: this.password,
          PassToke: this.PassToke,
        }).then(res =>{
          if(res.status != 0){
            this.$message.error(res.message);
            this.isEnter = false;
          }
          if(res.status === -100){
            this.PassToke = '';
            sessionStorage.removeItem('PassToke');
            this.$message.error(res.message);
            return;
          }
          if(res.result.PassToke){
            this.PassToke = res.result.PassToke;
            this.$emit('PassTok',res.result.PassToke);
            sessionStorage.setItem('PassToke',this.PassToke);
          }
          this.isEnter = false;
        })
      },
      /**
       * 进入回车
       */
      onEnterKeyUp(e){
        if(e.keyCode === 13){
          this.checkPassword();
        }
      },
      /**
       * 进入点击
       */
      onEnter(){
        this.checkPassword();
      },
    }
  }
</script>

<style scoped lang="stylus">
  @import "PasswordCheck.styl"
</style>
