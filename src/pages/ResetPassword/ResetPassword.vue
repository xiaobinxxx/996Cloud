<template>
  <div class="page">
    <div class="main">
      <div class="logo">
        <img src="/static/image/logo_b.png" alt="">
      </div>
      <div class="logo-claim">娛樂版（重置密码）</div>
      <div class="login-area">
        <div class="login-input">
          <input type="text" v-model="username" maxlength="16" placeholder="请输入账号" required>
          <input type="password" v-model="password" maxlength="20" placeholder="请输入密码" required>
          <input type="password" v-model="ConfirmPassword" maxlength="20" placeholder="确认密码" required>
          <input type="tel" v-model="code" maxlength="6" placeholder="请验证码" required>
        </div>
        <el-button style="width: 100%"
                   :loading="isReset"
                   @click="onReset">确认</el-button>
      </div>
      <div class="copyright">
        996Cloud——您的云，您的数据，您的方式!
      </div>
    </div>
  </div>
</template>

<script>
  import {ResetPassword} from '../../axios/api'
  export default {
    name: "ResetPassword",
    data(){
      return {
        isReset: false,
        username: '',
        password: '',
        ConfirmPassword: '',
        code: '',
      }
    },
    methods:{
      /**
       * 重置密码点击
       */
      onReset(){
        this.isReset = true;
        ResetPassword({
          username: this.username,
          password: this.password,
          ConfirmPassword: this.ConfirmPassword,
          code: this.code,
        }).then(res =>{
          this.isReset = false;
          if(res.status != 0){
            this.$message.error(res.message);
            return;
          }
          this.$router.replace({name: 'login'});
          this.$message.success(res.message);
        })
      },

    }
  }
</script>

<style scoped lang="stylus">
  @import "ResetPassword.styl"
</style>
