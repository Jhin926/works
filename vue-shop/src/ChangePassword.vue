<template>
   <div id="changepassword">
     <div class="changepw">
        <div class="item-input">
           <p class="left">原密码</p>
           <div class="left">
             <input type="password" placeholder="请输入当前密码" v-model="pw">
           </div>
        </div>
       <div class="clear"></div>
       <div class="item-input">
         <p class="left">新密码</p>
         <div class="left">
           <input type="password" placeholder="请输入新的密码" v-model="newpw">
         </div>
       </div>
       <div class="clear"></div>
       <div class="item-input">
         <p class="left">重复密码</p>
         <div class="left">
           <input type="password" placeholder="请再次输入新的密码" v-model="pwconfirm">
         </div>
       </div>
       <div class="msg-error" v-show="newpw!=pwconfirm">两次输入密码不一致，请重新输入。</div>
     </div>
     <div class="button" v-on:click="change">
       <button>提交</button>
     </div>
     <loading v-if="isLoading"></loading>
     <alert v-show="showAlt">
       <div slot="content">{{altMessage}}</div>
       <p slot="sure" @click="showAlt = false;">确定</p>
     </alert>
     <success v-if="isSuccess">
       <div class="sucess-text" slot="text">修改成功</div>
       <router-link tag="button" to="/mine" slot="button">返回个人界面</router-link>
     </success>
   </div>
</template>

<script>
  export default {
    name: 'changepassword',
    created () {
      document.title = '修改密码'
      this.$http.get('api/mine/info').then(function (res) {
        this.$data.phone = res.body.data.mobileNumber
      })
    },
    methods: {
      change: function () {
        if (this.$data.pw !== '' && this.$data.newpw !== '' && this.$data.pwconfirm !== '' && (this.$data.newpw === this.$data.pwconfirm)) {
          this.$http({
            method: 'get',
            url: 'api/user/ modify/password?mobileNumber=' + this.$data.phone + '&newPassword=' + this.$data.newpw + '&newPasswordConfirm=' + this.$data.pwconfirm + '&password=' + this.$data.pw,
            before: function () { this.$data.isLoading = true }
          }).then(function (res) {
            this.$data.isLoading = false
            if (res.body.code === 0) {
              this.$data.isSuccess = true
            } else {
              this.$data.altMessage = res.body.message
              this.$data.showAlt = true
            }
          })
        } else {
          this.$data.altMessage = '输入值不合法'
          this.$data.showAlt = true
        }
      }
    },
    data () {
      return {
        pw: '',
        newpw: '',
        pwconfirm: '',
        phone: '',
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息',
        isSuccess: false
      }
    }
  }
</script>

<style scoped>
  .changepw {
    margin: .3rem .16rem;
    background-color: #fff;
    border:1px solid #ededed;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .item-input {
    height:0.88rem;
    width:100%;
    line-height:0.88rem;
    border-bottom:1px solid #ededed;
    padding:0 .3rem;
    background:#fff;
  }
  .item-input input {
    height:0.88rem;
    line-height:0.88rem;
    font-size:0.26rem;
    background:none;
    width:4.2rem;
  }
  p {
    font-size:.24rem;
    color:#9b9b9b;
    height:0.88rem;
    line-height:0.88rem;
    width:1.08rem;
  }
  .msg-error {
    color:#d0021b;
    font-size:0.24rem;
    text-align:center;
    margin-top:0.2rem;
  }
  .button {
    position: absolute;
    left: .32rem;
    bottom: 1.28rem;
    width:5.76rem;
    height:0.8rem;
    border-radius:2px;
    -webkit-border-radius:2px;
  }
  .button button {
    display:inline-block;
    width:100%;
    height:100%;
    font-size:0.24rem;
    color:#fff;
    background:#cb4042;
    line-height:0.8rem;
    text-align:center;
  }
</style>
