<template>
  <div id="">
    <div class="order-shopping">
      <y-head>
        <h2 class="tit" slot="text">订单内容</h2>
      </y-head>
      <section class="private-detail">
        <p class="private-img"><img :src="teaManor.indexPicture" width="100%" height="100%" /></p>
        <div class="private-info">
          <h3><span class="pri-detail-tit">{{teaManor.name}}</span></h3>
          <div class="private-price">
            <span class="new-cost">&yen; {{teaManor.unitPrice}}</span>
          </div>
          <span class="shopping-num"><span>x</span>{{teaManor.quantity}}</span>
        </div>
      </section>
    </div>
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
    <!--<p class="balance-tip" v-if="useBal">您的账户剩余<b class="balance-pay">&yen;{{detail.accountBalance}}</b><span v-if="needPay>0">，您仍需使用微信支付<b class="wechat-pay">&yen;{{(needPay).toFixed(2)}}</b></span>。</p>-->
    <div class="order-sure">
      <span class="btn-sure" v-on:click="sure">确认</span>
      <span class="order-amount">&yen;{{needPay}}</span>
      <span class="order-total">共计</span>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <success v-if="isSuccess">
      <div class="sucess-text" slot="text">购买成功</div>
      <button slot="button" @click="$router.replace('/assets')">查看我的茶庄园</button>
    </success>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'morder',
  created () {
    document.title = '确认订单'
    const id = this.$route.params.id
    const num = this.$route.params.num
    this.$http({
      method: 'post',
      url: '/api/tea/manor/order/prepare',
      body: {teaManorId: id, quantity: num}
    }).then(function (res) {
      if (res.body.code === 0) {
        this.$data.detail = res.body.data
        this.$data.needPay = res.body.data.orderTotalAmount
        this.$data.teaManor = res.body.data.teaManor
      } else if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      }
    })
  },
  methods: {
    sure: function () {
      const data = this.$data
      const params = this.$route.params
      var reParams = {
        goldCoin: data.payGoldCoin,
        teaManorId: params.id,
        quantity: params.num,
        useAccountBalance: data.payBalance
      }
      if (data.remark !== '') {
        reParams.remark = data.remark
      }
      /* let str = window.location.href
      if (str.indexOf('?phone=') > 0) {
        reParams.referrer = str.substring(str.indexOf('?phone=') + 7)
      } */
      if (this.$route.params.phone !== undefined) {
        reParams.referrer = this.$route.params.phone
      }
      this.$http({
        method: 'post',
        url: '/api/tea/manor/order/confirm',
        body: reParams,
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.isLoading = false
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
          window.alert(res.body.message)
        }
      })
    }
  },
  watch: {
    useBal: function (val) { // 是否使用账户余额
      if (val) { // 使用余额支付
        if (this.$data.needPay >= this.$data.detail.accountBalance) {
          this.$data.needPay = this.$data.needPay - this.$data.detail.accountBalance
          this.$data.payBalance = this.$data.detail.accountBalance
        } else {
          this.$data.payBalance = this.$data.needPay
          this.$data.needPay = 0
        }
      } else { // 不使用余额支付
        this.$data.needPay = this.$data.needPay + this.$data.payBalance
        this.$data.payBalance = 0
      }
    },
    goldCoin: function (_val) { // 限制输入的金币数目
      if (_val < 0) this.$data.goldCoin = 0
      else if (_val > this.$data.detail.foldCoin) this.$data.goldCoin = this.$data.detail.foldCoin
      if (this.$data.goldCoin * 0.01 >= this.$data.detail.orderTotalAmount) {
        this.$data.goldCoin = this.$data.detail.orderTotalAmount * 100
        this.$data.payGoldCoin = this.$data.detail.orderTotalAmount * 100
        this.$data.needPay = 0
        this.$data.payBalance = 0
      } else { // 金币不足支付订单金额
        this.$data.payGoldCoin = this.$data.goldCoin
        const unGold = this.$data.detail.orderTotalAmount - this.$data.goldCoin * 0.01 // 金币之外需要支付的钱
        if (this.$data.useBal) { // 使用余额支付
          if (unGold > this.$data.detail.accountBalance) { // 余额也不够支付的情况
            this.$data.needPay = unGold - this.$data.detail.accountBalance
            this.$data.payBalance = this.$data.detail.accountBalance
          } else { // 余额足够支付
            this.$data.needPay = 0
            this.$data.payBalance = unGold
          }
        } else {
          this.$data.needPay = this.$data.detail.orderTotalAmount - this.$data.goldCoin * 0.01
        }
      }
      if (this.$data.useBal) {
        this.$data.needPay = this.$data.detail.orderTotalAmount - this.$data.goldCoin * 0.01 - this.$data.detail.accountBalance
      } else { // 不使用账户余额
        this.$data.needPay = this.$data.detail.orderTotalAmount - this.$data.goldCoin * 0.01
      }
    }
  },
  data () {
    return {
      detail: {},
      teaManor: {},
      remark: '',
      goldCoin: '',
      useBal: false,
      isLoading: false,
      needPay: 0,
      payGoldCoin: 0,
      isSuccess: false,
      payBalance: 0
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
    padding-left: .2rem;
    border-bottom: 0.02rem solid #dedede;
    font-size: .28rem;
  }
  /* 运费 */
  .order-fare {
    height: .8rem;
    background-color: #fff;
    margin-bottom: .2rem;
    padding: .25rem .2rem;
    border-top: 0.02rem solid #dedede;
    border-bottom: 0.02rem solid #dedede;
  }
  /* 其他订单信息 */
  .order-info {
    margin: .2rem .16rem;
    background-color: #fff;
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
  /*.balance-tip b {
    font-size: .2rem;
  }*/
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
  .private-detail {
    overflow: hidden;
    padding: .16rem;
    margin: 0 .16rem;
    border: 0.02rem solid #dedede;
    position: relative;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .private-img {
    float: left;
    width: 2.7rem;
    height: 1.8rem;
  }
  .private-info {
    margin-left: 2.9rem;
  }
  .private-info h3 {
    margin-bottom: .1rem;
  }
  .private-info h3 > span {
    font-size: .26rem;
    margin-right: .1rem;
  }
  .private-tags > span {
    display: inline-block;
    padding: 0.05rem 0.08rem;
    margin-right: 0.04rem;
    border-radius: 0.07rem;
    -webkit-border-radius: 0.07rem;
    -moz-border-radius: 0.07rem;
    font-size: .18rem;
    color: #fff;
  }
  .private-tags > span.red {
    background-color: #d0021b;
  }
  .private-tags > span.green {
    background-color: #80a951;
  }
  .private-tags > span.blue {
    background-color: #476d8f;
  }
  .private-tags > span.orange {
    background-color: #F6A623;
  }
  .private-price {
    position: absolute;
    bottom: .3rem;
    left: 3.1rem;
  }
  .private-price span.new-cost {
    color: #d0021b;
    font-size: .24rem;
    margin-right: .14rem;
  }
  span.shopping-num {
    position: absolute;
    right: .2rem;
    bottom: .3rem;
    color: #9b9b9b;
    font-size: .24rem;
  }
  span.shopping-num span {
    font-size: .24rem;
    color: #9b9b9b;
  }
</style>
