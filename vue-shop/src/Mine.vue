<template>
  <div class="my">
    <overview :info="myinfo"></overview>
    <div class="my-handle">
      <router-link tag="p" to="/shop/manororder">
        <span class="handle-img"><img src="./assets/my-morder.png" width="100%" height="100%" alt=""/></span>
        <span class="handle-text">庄园订单</span>
      </router-link>
      <router-link tag="p" to="/shop/shopOrder">
        <span class="handle-img"><img src="./assets/my-sorder.png" width="100%" height="100%" alt=""/></span>
        <span class="handle-text">商城订单</span>
      </router-link>
      <router-link tag="p" to="/invitation">
        <span class="handle-img"><img src="./assets/my-invite.png" width="100%" height="100%" alt=""/></span>
        <span class="handle-text">邀请有礼</span>
      </router-link>
    </div>
    <ul class="my-list">
      <router-link tag="li" to="/share/manage">
        <span class="item-icon"><img width="100%" height="100%" src="./assets/icon-share.png" alt=""/></span>
        分销管理
        <span class="item-btn"><img width="100%" height="100%" src="./assets/icon_arrow.png"></span>
      </router-link>
      <router-link tag="li" to="/mine/addresslist">
        <span class="item-icon"><img width="100%" height="100%" src="./assets/my-address.png" alt=""/></span>
        地址管理
        <span class="item-btn"><img width="100%" height="100%" src="./assets/icon_arrow.png"></span>
      </router-link>
      <router-link tag="li" to="/mine/minecontract">
        <span class="item-icon"><img width="100%" height="100%" src="./assets/my-pact.png" alt=""/></span>
        我的合同
        <span class="item-btn"><img width="100%" height="100%" src="./assets/icon_arrow.png"></span>
      </router-link>
      <li>
        <a class="cantact-server" href="tel:400-089-9458">
          <span class="item-icon"><img width="100%" height="100%" src="./assets/my-server.png" alt=""/></span>
          联系客服
          <span class="item-btn"><img width="100%" height="100%" src="./assets/icon_arrow.png"></span>
        </a>
      </li>
    </ul>
    <bar></bar>
  </div>
</template>

<script>
  import Bar from './components/Bar'
  import Overview from './components/Overview'
  export default {
    name: 'my',
    components: {
      Bar,
      Overview
    },
    created () {
      document.title = '我的'
      this.$http.get('api/mine/info').then(function (res) {
        if (res.body.code === 300002 || res.body.code === 300001) {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          var data = res.body.data
          if (data.level === 1) {
            data.levelText = '普通庄园主'
          } else if (data.level === 2) {
            data.levelText = '精英庄园主'
          } else if (data.level === 3) {
            data.levelText = '名流庄园主'
          } else if (data.level === 4) {
            data.levelText = '至尊庄园主'
          }
          this.$set(this.$data.myinfo, 'tag', data.levelText)
          this.$set(this.$data.myinfo, 'tit', data.wxNickname || data.mobileNumber)
          this.$set(this.$data.myinfo, 'rightVal', data.goldCoin)
        }
      })
      this.$http.get('api/account/query/account/balance').then(function (res) {
        if (res.body.code === 300002 || res.body.code === 300001) {
          window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
        } else {
          this.$set(this.$data.myinfo, 'leftVal', res.body.data)
        }
      })
    },
    data () {
      return {
        myinfo: {
          leftUrl: '/accountbalance',
          rightUrl: '/teagoldcoins',
          bgImg: 'my',
          leftName: '账户余额',
          rightName: '茶金币(个)'
        }
      }
    }
  }
</script>

<style scoped>
  .my {
    height: 100%;
    overflow: hidden;
  }

  .my-handle {
    display: box;
    display: -webkit-box;
    display: -moz-box;
    margin: .16rem;
  }
  .my-handle > p {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    height: 1.28rem;
    padding: .16rem 0;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    margin-right: .16rem;
    border: 1px solid #dedede;
    text-align: center;
  }
  .my-handle > p:last-child {
    margin-right: 0;
  }
  .my-handle > p .handle-img {
    display: block;
    width: .6rem;
    height: .6rem;
    margin: 0 auto .1rem auto;
  }
  .my-handle > p .handle-text {
    font-size: .24rem;
  }
  .my-list {
    margin: 0 .16rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .my-list.my-set {
    margin-top: .16rem;
  }
  .my-list li {
    position: relative;
    height: .8rem;
    margin-left: .6rem;
    padding-top: .25rem;
    border-bottom: 1px solid #dedede;
    font-size: .24rem;
  }
  .my-list li a {
    font-size: .24rem;
  }
  .my-list li:last-child {
    border-bottom: none;
  }
  .cantact-server {
    display: block;
  }
  .my-list li .item-icon {
    display: inline-block;
    width: .32rem;
    height: .32rem;
    position: absolute;
    left: -.45rem;
    top: .25rem;
  }
  .item-btn {
    float: right;
    display: inline-block;
    width: .4rem;
    height: .4rem;
    margin-right: .16rem;
    margin-top: -.03rem;
  }

  .model {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .model-item {
    width: 90%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    margin: auto;
    height: 2.8rem;
    background: #fff;
    border-radius: 0.08rem;
  }

  .model-item .item-notice {
    height: 2rem;
    width: 100%;
    border-bottom: 1px solid #dedede;
    padding: 0.35rem 0;
    text-align: center;
  }

  .model-item .item-notice p:nth-child(1) {
    color: #476d8f;
    font-size: 0.28rem;
    font-weight: bold;
  }

  .model-item .item-notice p:nth-child(2) {
    color: #9b9b9b;
    margin: 0.2rem 0 0.2rem 0;
    font-size: 0.24rem;
  }

  .model-item .item-notice p:nth-child(3) {
    color: #476d8f;
    font-size: 0.24rem;
  }

  .item-button {
    width: 100%;
    height: 0.8rem;
    text-align: center;
    padding: 0.2rem 0;
  }

  .item-button a {
    display: inline-block;
    line-height: 0.4rem;
    height: 100%;
    font-size: 0.28rem;
    width: 49%;
    color: #476d8f;
  }

  .item-button a:nth-child(1) {
    color: #9b9b9b;
    border-right: 1px solid #dedede;
  }

  a {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
