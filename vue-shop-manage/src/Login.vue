<template>
  <div id="login">
    <div class="login" v-bind:style="{ height: winHei + 'px' }">
      <div class="login-title">
        {{info}}
      </div>
      <div class="login-cont">
      <div class="login-input">
        <div class="input-item">
          <span><img src="./assets/icon_user.png"></span>
          <input type="text" placeholder="用户名" v-model="phone">
        </div>
        <div class="input-item">
          <span><img src="./assets/icon_password.png"></span>
          <input type="password" placeholder="密码" v-model="pw" v-on:keyup.enter="submit">
        </div>
      </div>
      <div class="button">
        <button v-on:click="submit">登录</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'login',
      created () {
        this.$http.get('api/config/list/boss').then(function (res) {
          if (res.body.code === 0) {
            for (var i in res.body.data) {
              if (res.body.data[i].name === 'boss.name') {
                this.$data.info = res.body.data[i].value
              }
            }
          } else {
            window.alert(res.body.message)
          }
        })
      },
      methods: {
        submit: function () {
          if (this.$data.phone === '') {
            window.alert('请输入手机号')
            return
          }
          if (this.$data.pw === '') {
            window.alert('请输入密码')
            return
          }
          if (this.$data.phone !== '' && this.$data.pw !== '') {
            this.$http.get('api/user/login?mobileNumber=' + this.$data.phone + '&password=' + this.$data.pw).then(function (res) {
              if (res.body.code === 0) {
                window.location.href = ''
              } else {
                window.alert(res.body.message)
              }
            })
          }
        }
      },
      data () {
        return {
          phone: '',
          pw: '',
          winHei: window.innerHeight,
          info: ''
        }
      }
    }
</script>

<style scoped>
  .login {
    width:100%;
    margin:0 auto;
    background:rgb(235,235,235);
  }
  .login-title {
    font-size:30px;
    color:#476d8f;
    text-align:center;
    padding:120px 0 40px;
  }
  .login-cont {
    width:410px;
    height:260px;
    margin:0 auto;
    padding:45px 0;
    border-radius:8px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    -ms-border-radius: 8px;
    background:#fff;
    box-shadow:0 4px 4px 0.15px #ccc;
    -webkit-box-shadow:0 4px 4px 0.15px #ccc;
    -moz-box-shadow:0 4px 4px 0.15px #ccc;
  }
  .input-item {
    width:310px;
    height:45px;
    margin:0 auto;
    border:1px solid #cecfd0;
    margin-bottom:15px;
    padding:10px;
    border-radius:3px;
  }
  .input-item input {
    height:100%;
    vertical-align:bottom;
    width:260px;
    margin-left:5px;
  }
  .button {
    width:316px;
    height:45px;
    margin:0 auto;
    background-color:#476d8f;
    border-radius:4px;
    margin-top:30px;
  }
  .button button {
    width:100%;
    height:100%;
    text-align:center;
    line-height:45px;
    font-size:14px;
    color:#fff;
  }
  input {
    background:none;
    border:none;
    outline:none;
  }
</style>
