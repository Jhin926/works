<template>
  <div class="address">
    <router-link v-if="addrObj.receiver" class="order-address" tag="section" to="/mine/addresslist">
      <p class="receiver-name">{{addrObj.receiver}}</p>
      <div class="receiver-info">
        <p class="receiver-tel">{{addrObj.receiverPhone}}</p>
        <p class="receiver-home">{{addrObj.province}}{{addrObj.city}}{{addrObj.district}}{{addrObj.address}}</p>
      </div>
      <span class="change-address"><img src="../assets/arrow.png" width="100%" /></span>
      <p class="address-line"></p>
    </router-link>
    <router-link class="order-address" v-if="!addrObj.receiver" tag="section" to="/mine/address/0">
      <p class="none-address">暂无地址，马上填写</p>
      <span class="change-address add-address"><img src="../assets/arrow.png" width="100%" /></span>
      <p class="address-line"></p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'receiveaddr',
  created () {
    this.$http.get('/api/address/default').then(function (res) {
      if (res.body.code === 0 && res.body.data !== null) {
        this.$data.addrObj = res.body.data
        this.$emit('addrId', res.body.data.id)
      } else if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      }
    })
  },
  data () {
    return {
      addrObj: {}
    }
  }
}
</script>

<style scoped>
  /* 收货地址 */
  .order-address {
    position: relative;
    padding: .36rem 0 .46rem 0;
    background-color: #fff;
  }
  .none-address {
    font-size: .28rem;
    color: #9b9b9b;
    text-align: center;
  }
  .address-line {
    width: 100%;
    height: .1rem;
    position: absolute;
    left: 0;
    bottom: 0;
    background: url("../assets/address.png") repeat-x bottom #fff;
  }
  .receiver-name {
    width: 1.28rem;
    text-align: center;
    font-size: .28rem;
    float: left;
  }
  .receiver-info {
    margin-left: 1.28rem;
  }
  .receiver-tel {
    margin-bottom: .18rem;
    font-size: .28rem;
  }
  .receiver-home {
    margin-right: .4rem;
    color: #9b9b9b;
    font-size: .24rem;
  }
  .change-address {
    display: inline-block;
    width: .4rem;
    height: .4rem;
    position: absolute;
    right: .1rem;
    top: .6rem;
  }
  .change-address.add-address {
    top: .33rem;
  }
</style>
