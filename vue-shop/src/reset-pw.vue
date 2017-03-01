<template>
  <div id="ResetPw">
    <div class="reg-input-area">
      <div class="reg-input-item">
        <p class="left"><img src="./assets/password.png" alt=""/></p>
        <div class="reg-input">
          <input type="password" placeholder="请输入6位以上的密码" v-model="newpw"/>
        </div>
      </div>
      <div class="reg-input-item">
        <p class="left"><img src="./assets/password.png" alt=""/></p>
        <div class="reg-input">
          <input type="password" placeholder="请重复输入密码" v-model="pwconfirm"/>
        </div>
      </div>
    </div>
    <div class="btn-submit">
      <button v-on:click="change">确认</button>
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
  name: 'reset-pw',
  created () {
    document.title = '重设密码'
  },
  methods: {
    change: function () {
      const telNo = this.$route.params.no
      if (this.$data.newpw !== '' && this.$data.pwconfirm !== '' && (this.$data.newpw === this.$data.pwconfirm)) {
        this.$data.isLoading = true
        this.$http.get('/api/user/reset/password?mobileNumber=' + telNo + '&newPassword=' + this.$data.newpw + '&newPasswordConfirm=' + this.$data.pwconfirm).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            window.location.href = '/#/login'
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
      newpw: '',
      pwconfirm: '',
      isLoading: false,
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>

<style scoped>
  .reg-input-area {
    margin: .4rem .16rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .reg-input-item {
    overflow: hidden;
    position: relative;
  }
  .reg-input-item .left{
    width: 1.2rem;
    margin-top: 0.22rem;
    text-align: center;
  }
  .reg-input-item .left img{
    width: 0.4rem;
    height: 0.4rem;
    vertical-align: middle;
  }
  .reg-input {
    height: 0.8rem;
    margin-left: 1.2rem;
    border-bottom: 1px solid #dedede;
  }
  .reg-input-item:last-child .reg-input {
    border-bottom: none;
    border-top:none;
  }
  .reg-input input{
    width: 100%;
    height: 100%;
    font-size: 0.26rem;
    line-height: 0.79rem;
  }
  .btn-submit {
    position: absolute;
    left: .32rem;
    bottom: 1.28rem;
    width:5.76rem;
    height:0.8rem;
  }
  .btn-submit button{
    width:100%;
    height:100%;
    border-radius:2px;
    -webkit-border-radius:2px;
    background-color: #cb4042;
    color: #fff;
    font-size: 0.26rem;
  }
</style>
