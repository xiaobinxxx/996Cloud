<template>
  <div class="page">
    <div class="main">
      <div class="logo">
        <img src="/static/image/logo_b.png" alt="">
      </div>
      <div class="logo-claim">娛樂版</div>
      <div class="login-area">
        <div class="login-input">
          <input type="text" v-model="username" @keyup="onLoginKeyUp" placeholder="请输入账号" required>
          <input type="password" v-model="password" @keyup="onLoginKeyUp" placeholder="请输入密码" required>
        </div>
        <el-button style="width: 100%"
                   :loading="isLogin"
                   @click="onLogin">登录</el-button>
        <div class="reset-pass" v-if="PassErrorNum > 1">
          <span @click="onResetPass">{{resetStr}}</span>
        </div>
      </div>
      <div class="copyright">
        996Cloud——您的云，您的数据，您的方式!
      </div>
    </div>
  </div>
</template>

<script>
  import {Login,SendEmails} from '../../axios/api'
  export default {
    name: "login",
    data(){
      return {
        // 登录
        username: '',
        password: '',
        isLogin: false,
        PassErrorNum: 0,
        resetStr: '是否需要重置密码?'
      }
    },
    methods:{
      /**
       * 登录函数
       */
      login(){
        if(!this.username){
          this.$message.error('账号不可为空');
          return;
        }
        if(!this.password){
          this.$message.error('密码不可为空');
          return;
        }
        this.isLogin = true;
        Login({
          UserName: this.username,
          PassWord: this.password,
        }).then(res =>{
          this.isLogin = false;
          if(res.status === -100){
            this.$router.push({name: 'register'});
            this.$message.error(res.message);
            return;
          }
          if(res.status != 0){
            this.$message.error(res.message);
            this.PassErrorNum++;
            return;
          }
          localStorage.setItem('UserInfo',JSON.stringify(res.result));
          this.$router.back();
          this.$message.success('登录成功');
        })

      },
      /**
       * 登录输入框键盘监听
       */
      onLoginKeyUp(e){
        if(e.keyCode === 13){
          this.login();
        }
      },
      /**
       * 登录按钮点击
       */
      onLogin(){
        this.login();
      },
      /**
       * 重置密码点击
       */
      onResetPass(){
        console.log(this.username);
        SendEmails({
          username: this.username,
        }).then(res =>{
          this.resetStr = '密码重置邮件已经发送到您的电子邮箱中。如果您长时间没能收到邮件，请检查您的垃圾/广告邮件箱。\n' +
            '如果未能收到邮件请联系管理员。'
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "login.styl"
</style>
