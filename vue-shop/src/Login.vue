<template>
  <div id="register">
    <div class="register-img">
      <img src="./assets/register.png" alt="" />
    </div>
    <div class="input-list">
      <div class="input-item">
        <span class="left"><img src="./assets/phone.png" width="100%" height="100%" /></span>
        <p class="input-con">
          <input type="tel" v-model="phone" placeholder="请输入您的手机号" />
          <span class="input-btn" @click="getCode" v-show="count==59">获取</span>
          <span class="input-btn disabled" v-show="count!=59">{{count}}s后获取</span>
        </p>
      </div>
      <div class="input-item">
        <span class="left"><img src="./assets/msgcode.png" width="100%" height="100%" /></span>
        <p class="input-con"><input type="tel" v-model="code" placeholder="请输入短信验证码" /></p>
      </div>
    </div>
    <p class="error-msg" v-show="phone != '' && !curPhone">请输入正确手机号</p>
    <p class="error-msg" v-show="code != '' && !curCode">请输入正确验证码</p>
    <div class="btn-register">
      <span v-on:click="register">确认</span>
    </div>
    <loading v-if="isLoading"></loading>
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
      document.title = '验证手机号'
    },
    watch: {
      phone: function (_val) {
        const myreg = /^1[34578]\d{9}$/
        this.$data.curPhone = myreg.test(_val) ? myreg.test(_val) : false
      },
      code: function (_val) {
        const myreg = /^\d{6}$/
        this.$data.curCode = myreg.test(_val) ? myreg.test(_val) : false
      }
    },
    methods: {
      getCode: function () {
        const _this = this.$data
        if (_this.curPhone) {
          if (_this.count === 59) {
            let t = setInterval(() => {
              if (_this.count > 1) _this.count--
              else {
                _this.count = 59
                clearInterval(t)
              }
            }, 1000)
            _this.isLoading = true
            this.$http.get('/api/sms/v1/send/code?mobileNumber=' + _this.phone + '&bizType=2&codeType=1').then((res) => {
              _this.isLoading = false
              if (res.body.code !== 0) {
                _this.altMessage = res.body.message
                _this.showAlt = true
              }
            })
          }
        } else {
          _this.showAlt = true
          _this.altMessage = '手机号格式不正确'
        }
      },
      register: function () {
        let _this = this.$data
        if (_this.curPhone && _this.curCode) {
          this.$http({
            method: 'post',
            url: '/api/user/complete/mobilenumber',
            before: function () { _this.isLoading = true },
            body: {mobileNumber: _this.phone, code: _this.code, userId: this.$route.params.id}
          }).then((res) => {
            _this.isLoading = false
            if (res.body.code === 0) {
              this.$router.go(-1)
            } else {
              _this.showAlt = true
              _this.altMessage = res.body.message
            }
          })
        }
      }
    },
    data () {
      return {
        phone: '',
        curPhone: false,
        code: '',
        curCode: false,
        altMessage: '错误信息',
        count: 59,
        showAlt: false,
        isLoading: false
      }
    }
  }
</script>

<style scoped>
  .register-img {
    margin-top: 2rem;
    margin-bottom: .8rem;
    text-align: center;
  }
  .register-img img {
    width: 1.9rem;
    height: 1.9rem;
  }
  .input-list {
    margin: 0 .32rem;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    border: 1px solid #dedede;
    background-color: #fff;
  }
  .input-list .input-item {
    overflow: hidden;
  }
  .input-list .input-item span.left {
    display: inline-block;
    width: .32rem;
    height: .32rem;
    margin-left: .16rem;
    margin-top: .22rem;
  }
  .input-item .input-con {
    position: relative;
    margin-left: .64rem;
    padding: .24rem 0;
    border-bottom: 1px solid #dedede;
  }
  .input-item:last-child .input-con {
    border-bottom: none;
  }
  .input-item .input-con input {
    font-size: .24rem;
    -webkit-tap-highlight-color: rgba(255,255,255,0);
  }
  .input-btn {
    display: inline-block;
    height: .4rem;
    padding: .07rem .25rem;
    position: absolute;
    top: .16rem;
    right: .16rem;
    border: 1px solid #cb4042;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    text-align: center;
    color: #cb4042;
    font-size: .2rem;
  }
  .input-btn.disabled {
    border-color: #dedede;
    color: #9b9b9b;
  }
  .error-msg {
    margin-top: .16rem;
    margin-left: .32rem;
    color: #cb4042;
    font-size: .2rem;
  }
  .btn-register {
    position: absolute;
    top: 9rem;
    left: .32rem;
    margin: 0 auto;
    width: 5.76rem;
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
</style>
