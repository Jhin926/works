<template>
  <div id="register">
    <form>
      <div class="reg-input-area">
        <div class="reg-input-item">
          <p class="left"><img src="./assets/phone.png" alt="" /></p>
          <div class="reg-input">
            <input type="tel" v-model="phone" placeholder="请输入您的手机号码" />
          </div>
        </div>
        <div class="reg-input-item">
          <p class="left"><img src="./assets/safecode.png" alt="" /></p>
          <div class="reg-input">
            <input type="text" v-on:blur="checkImg" v-model="imgCode" placeholder="请输入右侧验证码" />
          </div>
          <span class="code-img" v-on:click="switchImg('ymb', $event)"><img src="/api/verify/v1/code?bizType=2&codeType=1" width="100%" height="100%" alt="" /></span>
        </div>
        <div class="reg-input-item">
          <p class="left"><img src="./assets/msgcode.png" alt="" /></p>
          <div class="reg-input">
            <input type="text" v-on:blur="checkCode" v-model="msgCode" placeholder="请输入短信验证码" />
          </div>
          <span v-on:click.stop="getCode" class="get-code" :class="{'gray': count!=59}">{{countText}}</span>
        </div>
      </div>
      <div class="msg-error" v-show="isImgCode">您的图形验证码有误，点击更换图片</div>
      <div class="msg-error" v-show="isMsgCode">您的短信验证码有误，点击更换图片</div>
      <div class="btn-register">
        <button v-on:click.stop.prevent="next">下一步</button>
      </div>
    </form>
    <loading v-if="isLoading"></loading>
    <alert v-show="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
export default {
  name: 'forget',
  created () {
    document.title = '忘记密码'
  },
  methods: {
    switchImg: function (a, $event) {
      $event.target.src = $event.target.src + '&v=' + Math.random()
    },
    checkImg: function () {
      const imgCode = this.$data.imgCode
      if (imgCode.length === 4) {
        this.$http.get('/api/verify/v1/verify?code=' + imgCode).then(function (res) {
          if (res.body.code === 0) {
            this.$data.isImgCode = false
          } else {
            this.$data.isImgCode = true
          }
        })
      } else {
        this.$data.isImgCode = true
      }
    },
    getCode: function () {
      const _this = this
      if (this.$data.phone !== '' && !this.$data.isImgCode) {
        if (this.$data.count === 59) { // 倒计时完成或者第一次开始
          this.$data.countText = this.$data.count + 's后重新发送'
          var t = setInterval(function () {
            if (_this.$data.count > 1) {
              _this.$data.count--
              _this.$data.countText = _this.$data.count + 's后重新发送'
            } else {
              _this.$data.count = 59
              _this.$data.countText = '重新发送'
              clearInterval(t)
            }
          }, 1000)
          this.$http({
            method: 'get',
            url: '/api/sms/v1/send/code?mobileNumber=' + this.$data.phone + '&bizType=2&codeType=1',
            before: function () {
              this.$data.isLoading = true
            }
          }).then(function (res) {
            this.$data.isLoading = false
            if (res.body.code === 0) {
              this.$data.keyCode = res.body.data
            } else {
              this.$data.altMessage = res.body.message
              this.$data.showAlt = true
            }
          })
        }
      }
    },
    checkCode: function () {
      const msgCode = this.$data.msgCode
      if (msgCode.length === 6 && /^\d+$/.test(msgCode)) {
        this.$data.isMsgCode = false
      } else {
        this.$data.isMsgCode = true
      }
    },
    next: function () {
      if (this.$data.phone !== '' && !this.$data.isImgCode && !this.$data.isMsgCode) {
        this.$http({
          method: 'get',
          url: 'api/sms/v1/verify?code=' + this.$data.msgCode,
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            this.$router.push('/resetpw/' + this.$data.phone)
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
      isImgCode: false,
      imgCode: '',
      isMsgCode: false,
      msgCode: '',
      count: 59,
      countText: '获取',
      isLoading: false,
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>

<style scoped>
  .reg-input-area {
    margin: .48rem .16rem;
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
    padding: .25rem 0;
    margin-left: 1.2rem;
    border-bottom: 1px solid #dedede;
  }
  .reg-input-item:last-child .reg-input {
    border-bottom: none;
  }
  .reg-input input {
    width: 100%;
    font-size: .26rem;
    line-height: .3rem;
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
    height: .48rem;
    position: absolute;
    padding: 0 .2rem;
    top: .155rem;
    right: .38rem;
    color: #cb4042;
    border: 1px solid #cb4042;
    text-align: center;
    line-height: .48rem;
    border-radius: 0.05rem;
    font-size: .26rem;
    pointer-events: auto;
  }
  .get-code.gray {
    color: #9b9b9b;
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
  .btn-register button {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #cb4042;
    color: #fff;
    font-size: .26rem;
  }
  .msg-error {
    width: 100%;
    text-align: center;
    font-size: .23rem;
    color: #cb4042;
  }
</style>
