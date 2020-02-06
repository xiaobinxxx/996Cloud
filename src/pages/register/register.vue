<template>
  <div class="page">
    <div class="main">
      <div class="logo">
        <img src="/static/image/logo_b.png" alt="">
      </div>
      <div class="logo-claim">娛樂版（注册）</div>
      <div class="login-area">
        <div class="login-input">
          <input type="text" v-model="username" maxlength="16" placeholder="请输入账号" required>
          <input type="password" v-model="password" maxlength="20" placeholder="请输入密码" required>
          <input type="password" v-model="ConfirmPassword" maxlength="20" placeholder="确认密码" required>
          <input type="text" v-model="nickname" maxlength="100" placeholder="请输入昵称" required>
          <input type="text" v-model="email" maxlength="60" placeholder="请输入邮箱" required>
        </div>
        <el-button style="width: 100%"
                   :loading="isRegister"
                   @click="onRegister">注册</el-button>
      </div>
      <div class="copyright">
        996Cloud——您的云，您的数据，您的方式!
      </div>
    </div>
  </div>
</template>

<script>
  import {register} from '../../axios/api'
  export default {
    name: "register",
    data(){
      return {
        isRegister: false,
        // 输入区域
        username: '',
        password: '',
        ConfirmPassword: '',
        nickname: '',
        email: '',
      }
    },
    methods:{
      /**
       * 注册点击
       */
      onRegister(){
        if(!this.username){
          this.$message.error('用户昵称不可为空');
          return
        }
        if(!this.password){
          this.$message.error('密码不可为空');
          return;
        }
        if(this.password != this.ConfirmPassword){
          this.$message.error('两次密码不一致');
          return;
        }
        if(!this.nickname){
          this.$message.error('昵称不可为空');
          return;
        }
        if(!this.email){
          this.$message.error('邮箱不正确');
          return;
        }

        this.isRegister = true;
        register({
          UserName: this.username,
          PassWord: this.password,
          ConfirmPassword: this.ConfirmPassword,
          nickname: this.nickname,
          email: this.email,
        }).then(res =>{
          this.isRegister = false;
          if(res.status != 0){
            this.$message.error(res.message);
            return
          }
          this.$message.success('注册成功，快去登录吧');
          this.$router.back();
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "register.styl"
</style>
