<template>
  <div id="register">
    <div class="reg-input-area">
      <div class="reg-input-item">
        <p class="left"><img src="./assets/phone.png" alt=""/></p>
        <div class="reg-input">
          <input type="tel" maxlength="11" v-model.lazy="phone" placeholder="请输入您的手机号码"/>
        </div>
      </div>
      <div class="reg-input-item">
        <p class="left"><img src="./assets/safecode.png" alt=""/></p>
        <div class="reg-input">
          <input type="text" v-model="imgCode" placeholder="请输入右侧验证码"/>
        </div>
        <span class="code-img" v-on:click="imgCodeSrc += '&v=' + Math.random()"><img :src="imgCodeSrc" width="100%" height="100%" alt=""/></span>
      </div>
      <div class="reg-input-item">
        <p class="left"><img src="./assets/msgcode.png" alt=""/></p>
        <div class="reg-input">
          <input type="tel" v-model.lazy="msgCode" placeholder="请输入短信验证码"/>
        </div>
        <span v-on:click="getCode" v-bind:class="{'code-disabled': codeDis }" class="get-code">{{countText}}</span>
      </div>
      <div class="reg-input-item">
        <p class="left"><img src="./assets/password.png" alt=""/></p>
        <div class="reg-input">
          <input type="password" v-model="pwd" placeholder="请输入6位以上的密码"/>
        </div>
      </div>
    </div>
    <div class="msg-error" v-show="phone!='' && phone.length!=11">您的手机号输入不正确，请检查</div>
    <div class="msg-error" v-show="pwd!='' && pwd.length<6">请输入至少6位的密码</div>
    <div class="msg-error" v-show="msgCode!='' && msgCode.length!=6">您的短信验证码有误</div>
    <p class="has-invite" v-if="!hasInvite" v-on:click="hasInvite = true">
      <span class="icon-invite"><img src="./assets/invitation1.png" width="100%" height="100%"/></span>
      我有邀请人
    </p>
    <div class="reg-input-area" v-if="hasInvite">
      <div class="reg-input-item">
        <p class="left"><img src="./assets/invitation.png" alt=""/></p>
        <div class="reg-input">
          <input type="text" v-model="referrer" placeholder="请输入推荐人的手机号码"/>
        </div>
      </div>
    </div>
    <div class="msg-error" v-show="!curDisPhone">邀请人手机号输入不正确，请检查</div>
    <div class="btn-register">
      <span v-on:click="register">注册并登录</span>
    </div>
    <loading v-if="isLoading"></loading>
    <confirm v-show="showCfm">
      <h2 class="confirm-head" slot="head">提示</h2>
      <div slot="content">该号码已注册，是否立即登录</div>
      <p slot="cancel" @click="showCfm = false;phone=''">取消</p>
      <router-link tag="p" to="/login" slot="sure">登录</router-link>
    </confirm>
    <alert v-show="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
  export default {
    name: 'register',
    created () {
      document.title = '注册'
      var wxOpenId = ''
      var wSearch = window.location.search.substring(1)
      var serArr = wSearch.split('&')
      for (var i = 0; i < serArr.length; i++) {
        var oneSer = serArr[i].split('=')
        if (oneSer[0] === 'code') {
          wxOpenId = oneSer[1]
          break
        }
      }
      this.$data.wxOpenId = wxOpenId
    },
    watch: {
      phone: function (_val) {
        const myreg = /^1[34578]\d{9}$/
        if (!myreg.test(_val)) {
          this.$data.curPhone = false
        } else {
          this.$data.curPhone = true
          this.$http.get('/api/user/is/register?mobileNumber=' + _val).then(function (res) {
            if (res.body.code === 300006) {
              this.$data.showCfm = true
            }
          })
        }
      },
      msgCode: function (_val) {
        if (_val.length === 6 && /^\d+$/.test(_val)) {
          this.$data.isMsgCode = true
        } else {
          this.$data.isMsgCode = false
        }
      },
      pwd: function (_val) {
        if (_val.length >= 6) {
          this.$data.isPwd = true
        } else {
          this.$data.isPwd = false
        }
      },
      referrer: function (_val) {
        const myreg = /^1[34578]\d{9}$/
        if (!myreg.test(_val)) {
          this.$data.curDisPhone = false
        } else {
          this.$data.curDisPhone = true
        }
      }
    },
    methods: {
      getCode: function () {
        const _this = this.$data
        const imgCode = _this.imgCode
        if (_this.curPhone) {
          if (imgCode.length === 4) {
            this.$data.isLoading = true
            this.$http.get('/api/verify/v1/verify?code=' + imgCode).then(function (a) {
              if (a.body.code === 0) {
                if (_this.phone !== '' && _this.count === 59) {
                  _this.codeDis = true
                  _this.countText = _this.count + 's后重新发送'
                  var t = setInterval(function () {
                    if (_this.count > 1) {
                      _this.count--
                      _this.countText = _this.count + 's后重新发送'
                    } else {
                      _this.codeDis = false
                      _this.count = 59
                      _this.countText = '重新发送'
                      clearInterval(t)
                    }
                  }, 1000)

                  this.$http.get('/api/sms/v1/send/code?mobileNumber=' + _this.phone + '&bizType=2&codeType=1').then(function (a) {
                    _this.isLoading = false
                    if (a.body.code === 0) {
                      _this.codeKey = a.body.data
                    } else {
                      _this.altMessage = a.body.message
                      _this.showAlt = true
                    }
                  })
                }
              } else {
                _this.imgCodeSrc += '&v=' + Math.random()
                _this.isLoading = false
                _this.altMessage = a.body.message
                _this.showAlt = true
              }
            })
          } else {
            _this.altMessage = '图片验证码不正确'
            _this.showAlt = true
          }
        }
      },
      register: function () {
        if (this.$data.curPhone && this.$data.isMsgCode && this.$data.isPwd) {
          this.$data.isLoading = true
          var reqData = {}
          reqData.referrer = this.$data.referrer
          reqData.mobileNumber = this.$data.phone
          reqData.password = this.$data.pwd
          reqData.smsCode = this.$data.msgCode
          reqData.codeKey = this.$data.codeKey
          reqData.wxOpenId = this.$data.wxOpenId
          this.$http.post('/api/user/register', reqData).then(function (res) {
            this.$data.isLoading = false
            if (res.body.code === 0) {
              window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2fd837f14f0941d4&redirect_uri=http%3a%2f%2fwx.sankoubudai.com&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            } else {
              this.$data.altMessage = res.body.message
              this.$data.showAlt = true
            }
          })
        }
      }
    },
    data () {
      return {
        phone: '',
        imgCodeSrc: '/api/verify/v1/code?bizType=2&codeType=1',
        curPhone: false,
        imgCode: '',
        isPwd: false,
        isMsgCode: false,
        msgCode: '',
        pwd: '',
        codeKey: '',
        wxOpenId: '',
        referrer: '',
        count: 59,
        countText: '获取',
        isLoading: false,
        codeDis: false,
        curDisPhone: true,
        hasInvite: false,
        showCfm: false,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
  .reg-input-area {
    margin: .2rem .16rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }

  .reg-input-item {
    overflow: hidden;
    position: relative;
  }

  .reg-input-item .left {
    width: 1.2rem;
    margin-top: .2rem;
    text-align: center;
  }

  .reg-input-item .left img {
    width: .4rem;
    height: .4rem;
    vertical-align: middle;
  }

  .reg-input {
    height: .8rem;
    margin-left: 1.2rem;
    border-bottom: 1px solid #dedede;
  }

  .reg-input-item:last-child .reg-input {
    border-bottom: none;
  }

  .reg-input input {
    width: 100%;
    height: 100%;
    font-size: .26rem;
    line-height: .79rem;
  }

  .code-img {
    display: inline-block;
    width: .96rem;
    height: .48rem;
    position: absolute;
    top: .155rem;
    right: .38rem;
    background-color: #ccc;
    pointer-events: auto;
  }

  .get-code {
    display: inline-block;
    height: .4rem;
    position: absolute;
    padding: 0 .25rem;
    top: .155rem;
    right: .38rem;
    color: #cb4042;
    border: 1px solid #cb4042;
    text-align: center;
    line-height: .4rem;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    font-size: .2rem;
  }

  .get-code.code-disabled {
    color: #9b9b9b;
    border: 1px solid #9b9b9b;
  }

  .btn-register {
    position: absolute;
    bottom: 1.28rem;
    left: .4rem;
    margin: 0 auto;
    width: 5.6rem;
    height: .8rem;
  }

  .btn-register span {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: .24rem 0;
    text-align: center;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #cb4042;
    color: #fff;
    font-size: .24rem;
  }

  .msg-error {
    width: 100%;
    text-align: center;
    font-size: .23rem;
    color: #d0021b;
  }

  .has-invite {
    width: 2rem;
    margin: .48rem auto;
    font-size: .26rem;
    line-height: .4rem;
    color: #9b9b9b;
  }

  .icon-invite {
    display: inline-block;
    width: .4rem;
    height: .4rem;
    float: left;
    margin-right: .1rem;
  }
</style>
