<template>
  <div id="">
    <receiveaddress v-on:addrId="getAddr"></receiveaddress>
    <div class="order-shopping">
      <y-head>
        <h2 class="tit" slot="text">订单内容</h2>
      </y-head>
      <shopping :teaList="tea"></shopping>
    </div>
    <div class="order-fare">
      配送运费: &yen;{{detail.freightFee}}
    </div>
    <y-head>
      <h2 class="tit" slot="text">自助服务</h2>
    </y-head>
    <div class="order-info">
      <ul>
        <li>
          <span class="left info-tit">茶金币抵扣</span>
          <p class="info-cont">
            <input type="tel" v-model="goldCoin" :placeholder="'可用金币'+detail.foldCoin+'个,可抵扣'+(detail.foldCoin*0.01).toFixed(2)+'元'" />
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
    <div class="order-info">
      <p class="info-tit pay-type">
        使用账户余额支付
        <span class="balance-tip">(余额: &yen;{{detail.accountBalance}})</span>
        <input v-model="useBal" type="checkbox" id="checkbox1" />
        <label for="checkbox1" class="right use-balance">
        </label>
      </p>
    </div>
    <div class="order-sure">
      <span class="btn-sure" v-on:click="sure">确认</span>
      <span class="order-amount">&yen;{{needPay.toFixed(2)}}</span>
      <span class="order-total">共计</span>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
    <success v-if="isSuccess">
      <div class="sucess-text" slot="text">购买成功</div>
      <button slot="button" @click="$router.go(-1)">返回商品详情</button>
    </success>
  </div>
</template>

<script>
import receiveaddress from './components/ReceiveAddress'
import Shopping from './components/Shopping'
var wx = require('weixin-js-sdk')
export default {
  name: 'app',
  components: {
    receiveaddress,
    Shopping
  },
  created () {
    document.title = '确认订单'
    const ids = this.$route.params.id
    const num = this.$route.params.num
    const isCar = this.$route.params.car

    var paramsPre = isCar === '0' ? '?teaId=' + ids + '&quantity=' + num : '?shoppingCartIds=' + ids
    this.$http.get('/api/order/tea/prepare' + paramsPre).then(function (res) {
      if (res.body.code === 0) {
        this.$data.detail = res.body.data
        this.$data.tea = res.body.data.teaDetails
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
  },
  methods: {
    getAddr: function (_id) {
      this.$data.addrId = _id
    },
    sure: function () {
      const $this = this
      const orderData = this.$data
      const formatData = {}
      formatData.addressId = orderData.addrId
      formatData.freightFee = orderData.detail.freightFee
      formatData.goldCoin = orderData.goldCoin === '' ? 0 : orderData.goldCoin
      formatData.useAccountBalance = orderData.payBalance
      if ($this.$route.params.phone !== undefined) {
        formatData.referrer = $this.$route.params.phone
      }

      if (orderData.remark !== '') {
        formatData.remark = orderData.remark
      }

      const teaDetails = this.$data.tea
      const isCar = this.$route.params.car
      var str = ''
      if (isCar === '0') { // 不是从购物车进来的
        str = ',' + teaDetails[0].id + '_' + teaDetails[0].quantity + '_0'
      } else {
        const carIds = this.$route.params.id
        const carArr = carIds.split(',')
        for (var i = 0; i < teaDetails.length; i++) {
          str += ',' + teaDetails[i].id + '_' + teaDetails[i].quantity + '_' + carArr[i]
        }
      }
      formatData.teaOrderDetailEnterJson = str.substring(1)
      if (formatData.addressId === 0) {
        this.$data.altMessage = '请选择或添加一个默认地址'
        this.$data.showAlt = true
      } else {
        this.$http({
          method: 'post',
          url: '/api/order/tea/confirm',
          body: formatData,
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          $this.$data.isLoading = false
          const _this = this
          if (res.body.code === 0) {
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
                    _this.$data.isSuccess = true
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
    }
  },
  computed: {
    needPay: function () {
      let coin = this.$data.goldCoin
      let useBal = this.$data.useBal
      let bal = this.$data.detail.accountBalance
      let total = this.$data.detail.orderTotalAmount
      if (useBal) {
        if (total > coin * 0.01) { // 金币不够支付
          let needP = total - coin * 0.01
          if (needP > bal) {
            this.$data.payBalance = bal
            return needP - bal
          } else {
            this.$data.payBalance = needP
            return 0
          }
        } else {
          this.$data.payBalance = 0
          return 0
        }
      } else {
        this.$data.payBalance = 0
        if (total > coin * 0.01) { // 金币不够支付
          return total - coin * 0.01
        } else {
          return 0
        }
      }
    }
  },
  watch: {
    goldCoin: function (_val) {
      if (_val <= 0) this.$data.goldCoin = 0
      else if (_val >= this.$data.detail.foldCoin) this.$data.goldCoin = this.$data.detail.foldCoin

      if (this.$data.goldCoin * 0.01 >= this.$data.detail.orderTotalAmount) {
        this.$data.goldCoin = this.$data.detail.orderTotalAmount.toFixed(2) * 100
      }
    }
  },
  data () {
    return {
      detail: {},
      tea: [],
      balance: '',
      remark: '',
      addrId: 0,
      goldCoin: '',
      isSuccess: false,
      useBal: false,
      accountAmount: 0,
      isLoading: false,
      payBalance: 0,
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>

<style scoped>
  /* 运费 */
  .order-fare {
    margin: .16rem 0 0 .16rem;
    font-size: .2rem;
    color: #9b9b9b;
  }
  /* 其他订单信息 */
  .order-info {
    background-color: #fff;
    margin: .16rem;
    border: 0.02rem solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
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
    width: 1.4rem;
    font-size: .24rem;
  }
  .info-tit input {
    font-size: .24rem;
  }
  .info-cont {
    margin-left: 1.5rem;
    color: #9b9b9b;
    font-size: .24rem;
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
  .pay-type {
    width: 100%;
    height: .8rem;
    position: relative;
    padding: .25rem;
  }
  #checkbox1 {
    display: none;
  }
  #checkbox1:checked + .use-balance:before {
    left: .3rem;
  }
  #checkbox1:checked + .use-balance {
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
    height: 100%;
    padding-top: .28rem;
    font-size: .24rem;
  }
  .btn-sure {
    width: 2.4rem;
    background-color: #cb4042;
    text-align: center;
    color: #fff;
  }
  .order-amount {
    margin: 0 .32rem 0 .16rem;
    color: #cb4042;
  }
  .order-total {
    color: #9b9b9b;
  }
  .balance-tip {
    margin-left: .2rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .balance-pay {
    font-weight: normal;
  }
  .wechat-pay {
    color: #d0021b;
    font-weight: normal;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
