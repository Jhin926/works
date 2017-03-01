<template>
  <div id="setting">
    <ul class="setting-list">
      <router-link tag="li" to="/mine/changepassword" class="btn-setting">
        修改密码
        <span class="right icon-arrow"><img width="100%" height="100%" src="./assets/icon_arrow.png"></span>
      </router-link>
    </ul>
    <div class="logout">
      <button v-on:click="loginout">退出账号</button>
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
    name: 'setting',
    methods: {
      loginout: function () {
        this.$data.isLoading = true
        this.$http.get('/api/user/logout').then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            this.$router.push('/index')
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    },
    created () {
      document.title = '用户设置'
    },
    data () {
      return {
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
  .setting-list {
    margin: .32rem .16rem;
  }
  .setting-list li {
    height: .8rem;
    padding-top: .24rem;
    padding-left: .16rem;
    border: 1px solid #dedede;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    font-size: .24rem;
  }
  .icon-arrow {
    width: .4rem;
    height: .4rem;
    margin-top: -.05rem;
  }
  .logout {
    position: fixed;
    left: 0;
    bottom: 1rem;
    width: 100%;
    height: .8rem;
    text-align: center;
  }

  .logout button {
    width: 5.76rem;
    height: .8rem;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #fff;
    color: #cb4042;
    font-size: 0.24rem;
  }
</style>
