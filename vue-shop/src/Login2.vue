<template>
  <div class="login" v-bind:style="{ height: winHei + 'px' }">
      <div class="top"></div>
      <div class="wrap">
        <div class="body">
          <div class="con">
            <span class="phone"></span>
            <input type="tel" placeholder="手机号" v-model="phone">
          </div>
          <div class="con">
            <span class="password"></span>
            <input type="password" placeholder="密码" v-model="password">
          </div>
          <div class="con" v-show="info==800003">
            <span class="code"></span>
            <input type="text" v-model="imgCode" placeholder="请输入右侧验证码" />
            <span class="code-img" v-on:click="switchImg('ymb', $event)"><img src="/api/verify/v1/code?bizType=2&codeType=1" width="100%" height="100%" alt="" /></span>
          </div>
          <div class="button">
            <button v-on:click.stop.prevent="login">确认</button>
          </div>
        </div>
        <div class="footer">
          <div class="con">
            <router-link to="register">立即注册&nbsp;</router-link>
            <router-link to="forget">&nbsp;忘记密码</router-link>
          </div>
        </div>
      </div>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
export default {
  name: 'login',
  created () {
    document.title = '登录'
  },
  methods: {
    login: function () {
      if (this.$data.phone !== '' && this.$data.password !== '') {
        this.$data.isLoading = true
        this.$http({
          method: 'get',
          url: '/api/user/login?mobileNumber=' + this.$data.phone + '&password=' + this.$data.password + '&clientType=WX' + '&code=' + this.$data.imgCode
        }).then(function (res) {
          this.$data.isLoading = false
          this.$data.info = res.body.code
          if (res.body.code === 0) {
            if (res.body.data.wxOpenId === null || res.body.data.wxOpenId === '') {
              window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2fd837f14f0941d4&redirect_uri=http%3a%2f%2fwx.sankoubudai.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            } else {
              this.$data.session = res.body.data.sessionKey
              this.$router.replace('/index')
            }
          } else if (res.body.code !== 800003) {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          } else if (res.body.code === 800003) {
            this.$data.altMessage = '用户名或密码错误'
            this.$data.showAlt = true
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    },
    switchImg: function (a, $event) {
      $event.target.src = $event.target.src + '&v=' + Math.random()
    }
  },
  data () {
    return {
      phone: '',
      password: '',
      imgCode: '',
      session: '',
      info: {},
      isLoading: false,
      winHei: window.innerHeight,
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>
<style scoped>
  .login{
     height:100%;
     overflow:hidden;
  }
   .top{
     background:url("./assets/cover2.png") no-repeat center;
     background-size: 50%;
     width:100%;
     height:4.2rem;
     margin:0 auto;
   }
  .wrap{
    width:100%;
  }
  .body .con{
    width:5.76rem;
    margin:0 auto;
    margin-bottom: -1px;
    height:0.75rem;
    padding-top:0.06rem;
    padding-left:0.1rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
   .body .con input[type=text]:focus,
   .body .con input[type=submit]:focus,
   .body .con input[type=button]:focus,
   .body .con input{
     display:inline-block;
     border:none;
     height:0.5rem;
     background:none;
     outline:none;
     width:87%;
     font-size:0.24rem;
   }
   .body .con span{
     display:inline-block;
     width:0.3rem;
     height:0.3rem;
     vertical-align: bottom;;
     margin-bottom:0.1rem;
     margin-right:0.2rem;
     margin-top:0.15rem;
   }
  .body .con .phone{
    background:url("./assets/phone.png")no-repeat;
    background-size: cover;
  }
  .body .con .password{
    background:url("./assets/password.png")no-repeat;
    background-size: cover;
  }
  .body .con .code{
    background:url("./assets/safecode.png")no-repeat;
    background-size: cover;
  }
  .login .wrap .body .con:nth-child(3) input {
    width:65%;
  }
  .login .wrap .body .con:nth-child(3) .code-img {
    width:0.96rem;
    height:0.45rem;
    display:inline-block;
  }
  .button{
    width:5.76rem;
    margin: .48rem auto;
  }
  .button button{
    width:100%;
    height:0.8rem;
    border:none;
    color:#fff;
    font-size:0.26rem;
    border-radius:0.07rem;
    background:#cb4042;
  }
  .footer{
    position: absolute;
    left: 0;
    bottom: .64rem;
    width:100%;
    margin:0 auto;
    margin-bottom:0.4rem;
  }
  .footer .con{
    padding-top:0.4rem;
    padding-bottom:0.4rem;
    width:90%;
    height:0.5rem;
    margin:0 auto;
    color:#9b9b9b;
  }
  .footer .con a{
    display:inline-block;
    width:49%;
    text-decoration: none;
    font-size:0.24rem;
    color:#9b9b9b;
  }
  .footer .con a:nth-child(1){
    color: #cb4042;
    text-align:right;
    padding-right:0.2rem;
    border-right:1px solid #93a5b1;
  }
  .footer .con a:nth-child(2){
    padding-left:0.2rem;
  }
  ::-webkit-input-placeholder{color:#9b9b9b;font-size:0.24rem;}
  ::-moz-placeholder{color:#9b9b9b;font-size:0.24rem;}
  :-moz-placeholder{color:#9b9b9b;font-size:0.24rem;}
</style>
