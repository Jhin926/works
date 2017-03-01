<template>
  <div id="">
    <receiveaddress v-on:addrId="getAddr"></receiveaddress>
    <div class="order-shopping">
      <h2 class="order-tit">
        <span class="icon-tit"></span>
        订单内容
      </h2>
      <shopping :teaList="tea"></shopping>
      <p class="detail-fare">配送运费: &yen;{{freight}}</p>
    </div>
    <h2 class="order-tit">
      <span class="icon-tit"></span>
      自助服务
    </h2>
    <div class="order-info">
      <ul>
        <router-link :to="{'path': '/replacethetea/'+$route.params.id+'/'+$route.params.orderid+'/'+$route.params.teaid + '/' + $route.params.qua}" tag="li">
          <span class="left info-tit replace-tea">替换茶叶</span>
          <span class="right icon-arrow">
            <img src="./assets/arrow.png" width="100%" height="100%" />
          </span>
        </router-link>
        <li>
          <span class="left info-tit">礼盒包装<b>(&yen;{{priPrice}})</b></span>
          <p class="info-cont">
            <input v-model="useGift" type="checkbox" id="checkbox2" />
            <label for="checkbox2" class="right use-balance">
            </label>
          </p>
        </li>
      </ul>
    </div>
    <div class="order-info" v-show="useGift">
      <ul>
        <li>
          <span class="left info-tit">茶金币抵扣</span>
          <p class="info-cont">
            <input v-model="useGold" type="tel" />
            <span v-if="useGold==0" class="right use-gold">可用金币{{goldCoin}}个,可抵扣{{goldCoin*0.01}}元</span>
          </p>
        </li>
        <li>
          <span class="left info-tit">备注</span>
          <p class="info-cont">
            <input v-model="remark" type="text" placeholder="选填" />
          </p>
        </li>
      </ul>
    </div>
    <div class="order-info" v-show="useGift">
      <p class="info-tit pay-type">
        账户余额支付
        <span class="balance-tip">(余额: &yen;{{balance}})</span>
        <input v-model="useBal" type="checkbox" id="checkbox1" />
        <label for="checkbox1" class="right use-balance">
        </label>
      </p>
    </div>
    <!--<p class="balance-tip" v-if="useBal">您的账户剩余<b class="balance-pay">&yen;{{balance}}</b></p>-->
    <div class="order-sure">
      <span class="btn-sure" v-on:click="sure">确认</span>
      <span class="order-amount">&yen;{{amount}}</span>
      <span class="order-total">共计</span>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
    <success v-if="isSuccess">
      <div class="sucess-text" slot="text">领取成功</div>
      <button slot="button" @click="$router.go(-1)">返回我的茶庄园</button>
    </success>
  </div>
</template>

<script>
import receiveaddress from './components/ReceiveAddress'
import Shopping from './components/Shopping1'
var wx = require('weixin-js-sdk')
export default {
  name: 'gettea',
  components: {
    receiveaddress,
    Shopping
  },
  methods: {
    getAddr: function (_id) {
      this.$data.addrId = _id
    },
    sure: function () {
      const reParams = {
        id: this.$route.params.id,
        orderId: this.$route.params.orderid,
        guestbook: this.$data.remark || '1',
        goldCoin: this.$data.useGold || 0,
        useAccountBalance: this.$data.useBalance,
        payAmount: this.amount,
        addressId: this.$data.addrId,
        isGiftBoxPackaging: this.$data.useGift ? 1 : 0
      }
      this.$http({
        method: 'post',
        url: '/api/tea/manor/quarter/order/confirm/receive',
        body: reParams,
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.isLoading = false
        if (res.body.code === 0) {
          const _this = this
          if (res.body.data.order.paymentAmount > 0) {
            wx.config({
              debug: false,
              appId: res.body.data.wxconfig.appId,
              timestamp: res.body.data.wxconfig.timestamp,
              nonceStr: res.body.data.wxconfig.nonceStr,
              signature: res.body.data.wxconfig.signature,
              jsApiList: ['chooseWXPay']
            })
            wx.ready(function () {
              wx.chooseWXPay({
                appId: res.body.data.order.clientRequestWXPayMap.appId,
                timestamp: res.body.data.order.clientRequestWXPayMap.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.body.data.order.clientRequestWXPayMap.nonceStr, // 支付签名随机串，不长于 32 位
                package: res.body.data.order.clientRequestWXPayMap.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: res.body.data.order.clientRequestWXPayMap.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.body.data.order.clientRequestWXPayMap.paySign, // 支付签名
                success: function (res) {
                  _this.$router.push('/assets')
                },
                cancel: function () {
                  _this.$router.go(-1)
                }
              })
            })
          } else {
            _this.$data.isSuccess = true
          }
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    }
  },
  computed: {
    amount: function () {
      if (this.$data.useGift) {
        const useGold = this.$data.useGold * 0.01
        const price = this.$data.priPrice
        const balance = this.$data.balance
        const freight = this.$data.freight

        if (this.$data.useBal) {
          const am = (price + freight) - useGold
          if (am > 0) { // 金币不够支付
            if (am - balance > 0) { // 金币
              this.$data.useBalance = balance
              return am - balance
            } else {
              this.$data.useBalance = am - balance
              return 0
            }
          } else {
            this.$data.useBalance = 0
            return 0
          }
        } else {
          this.$data.useBalance = 0
          const am = (price + freight) - useGold
          if (am > 0) {
            return am
          } else {
            return 0
          }
        }
      } else {
        this.$data.useBalance = 0
        this.$data.useGold = ''
        return 0
      }
    }
  },
  created () {
    document.title = '领取茶叶'
    this.$http({
      method: 'post',
      url: '/api/teagroup/tea/bags',
      body: {quarterOrderId: this.$route.params.id}
    }).then(function (res) {
      if (res.body.code === 0) {
        this.$data.tea = res.body.data
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
    this.$http.get('/api/printedfee/info').then(function (res) {
      if (res.body.code === 0) {
        this.$data.balance = res.body.data.accountBalance
        this.$data.goldCoin = res.body.data.goldCoin
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
    this.$http.get('/api/tea/manor/quarter/order/giftbox/packing?id=' + this.$route.params.orderid).then(function (res) {
      if (res.body.code === 0) {
        this.$data.priPrice = res.body.data
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
    this.$http.get('/api/freightfee/get').then(function (res) {
      if (res.body.code === 0) {
        this.$data.freight = res.body.data
      }
    })
  },
  data () {
    return {
      tea: [],
      remark: '',
      addrId: '',
      useBal: false,
      balance: 0,
      useBalance: 0,
      goldCoin: 0,
      useGold: '',
      useGift: true,
      priPrice: 0,
      isLoading: false,
      showAlt: false,
      altMessage: '错误信息',
      isSuccess: false,
      isGiftBoxPackaging: 1,
      freight: 0 // 运费
    }
  }
}
</script>

<style scoped>
  /* 订单内容 */
  .order-shopping {
    margin-top: .2rem;
  }
  h2.order-tit {
    height: .8rem;
    padding-top: .25rem;
    padding-left: .16rem;
    font-size: .24rem;
  }
  .icon-tit {
    float: left;
    width: 2px;
    height: .3rem;
    margin-top: .02rem;
    margin-right: .16rem;
    background-color: #cd4042;
  }
  .detail-fare {
    margin: .16rem 0 0 .16rem;
    font-size: .2rem;
    color: #9b9b9b;
  }
  /* 其他订单信息 */
  .order-info {
    background-color: #fff;
    margin: 0 .16rem .2rem .16rem;
    border: 0.02rem solid #dedede;
  }
  .order-info > ul > li {
    height: .8rem;
    margin-left: .2rem;
    padding: .25rem .2rem .25rem 0;
    border-bottom: 0.02rem solid #dedede;
  }
  .order-info > ul > li:last-child {
    border-bottom: none;
  }
  .info-tit {
    font-size: .24rem;
  }
  .info-tit b {
    color: #9b9b9b;
    font-size: .24rem;
    font-weight: normal;
  }
  .info-tit.replace-tea {
    width: auto;
  }
  .info-tit input {
    font-size: .24rem;
  }
  .info-cont {
    margin-left: 1.5rem;
    color: #9b9b9b;
    font-size: .28rem;
  }
  .info-cont input {
    border: none;
    width: 100%;
    height: 100%;
    outline: none;
    font-size: .24rem;
    text-align: right;
  }
  .info-cont input::-moz-placeholder {
    text-align: right;
  }
  .info-cont input::-webkit-input-placeholder {
    text-align: right;
  }
  .gift-tip {
    font-size: .24rem;
    color: #9b9b9b;
    pointer-events:none;
  }
  .use-gold {
    position: relative;
    margin-top: -.3rem;
    font-size: .24rem;
    color: #9b9b9b;
    pointer-events:none;
  }
  .icon-arrow {
    display: inline-block;
    width: .4rem;
    height: .4rem;
    margin-top: -0.06rem;
  }
  .order-sure {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1rem;
    background-color: #fff;
    border-top: 0.02rem solid #dedede;
  }
  .order-sure > span {
    float: right;
    display: inline-block;
  }
  .btn-sure {
    width: 2.4rem;
    height: 100%;
    padding-top: .35rem;
    background-color: #476d8f;
    text-align: center;
    font-size: .28rem;
    color: #fff;
  }
  .pay-type {
    width: 100%;
    height: .8rem;
    position: relative;
    padding: .25rem;
  }
  .balance-tip {
    font-size: .24rem;
    color: #9b9b9b;
  }
  #checkbox1,
  #checkbox2 {
    display: none;
  }
  #checkbox1:checked + .use-balance:before,
  #checkbox2:checked + .use-balance:before {
    left: .3rem;
  }
  #checkbox1:checked + .use-balance,
  #checkbox2:checked + .use-balance {
    -webkit-box-shadow: inset 0 0 0 .18rem rgb(230,64,66),0 0 0 1px rgb(230,64,66);
    -moz-box-shadow: inset 0 0 0 .18rem rgb(230,64,66),0 0 0 1px rgb(230,64,66);
    box-shadow: inset 0 0 0 .18rem rgb(230,64,66),0 0 0 1px rgb(230,64,66);
  }
  .use-balance {
    -webkit-box-shadow: inset 0 0 0 0px rgb(230,64,66),0 0 0 1px #dddddd;
    -moz-box-shadow: inset 0 0 0 0px rgb(230,64,66),0 0 0 1px #dddddd;
    box-shadow: inset 0 0 0 0px rgb(230,64,66),0 0 0 1px #dddddd;
    display: block;
    position: relative;
    width: .48rem;
    height: .12rem;
    margin-top: .1rem;
    -webkit-border-radius: .35rem;
    -moz-border-radius: .35rem;
    border-radius: .35rem;
    background: #f8f8f8;
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;
  }
  .use-balance:before {
    box-sizing: border-box;
    content: '';
    display: block;
    position: absolute;
    height: .24rem;
    width: .24rem;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    top: -.06rem;
    left: 0;
    background: white;
    -webkit-box-shadow: 0 3px 3px rgba(0,0,0,.2),0 0 0 1px #dddddd;
    -moz-box-shadow: 0 3px 3px rgba(0,0,0,.2),0 0 0 1px #dddddd;
    box-shadow: 0 3px 3px rgba(0,0,0,.2),0 0 0 1px #dddddd;
    -webkit-transition: .25s ease-in-out;
    -moz-transition: .25s ease-in-out;
    -o-transition: .25s ease-in-out;
    transition: .25s ease-in-out;
  }
  .order-sure {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: .8rem;
    background-color: #fff;
    border-top: 0.02rem solid #dedede;
  }
  .order-sure > span {
    float: right;
    display: inline-block;
  }
  .btn-sure {
    width: 2.4rem;
    height: 100%;
    padding-top: .25rem;
    background-color: #cb4042;
    text-align: center;
    font-size: .24rem;
    color: #fff;
  }
  .order-amount {
    margin: 0 .3rem 0 .2rem;
    padding-top: .25rem;
    font-size: .24rem;
    color: #d0011b;
  }
  .order-total {
    padding-top: .25rem;
    color: #9b9b9b;
    font-size: .24rem;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
