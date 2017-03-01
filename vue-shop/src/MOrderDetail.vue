<template>
  <div id="">
    <div class="order-shopping">
      <y-head>
        <h2 class="tit" slot="text">订单内容</h2>
      </y-head>
      <section class="private-detail">
        <p class="private-img"><img :src="detail.indexPicture" width="100%" height="100%" /></p>
        <div class="private-info">
          <h3><span class="pri-detail-tit">{{detail.teaManorName}} 第{{detail.serialNumber}}期</span></h3>
          <p class="private-size">{{detail.teaManorSize}}亩</p>
          <div class="private-price">
            <span class="new-cost">&yen; {{detail.unitPrice * detail.quantity}}</span>
          </div>
          <span class="shopping-num"><span>x</span>{{detail.quantity}}</span>
        </div>
      </section>
    </div>
    <y-head>
      <h2 class="tit" slot="text">相关信息</h2>
    </y-head>
    <ul class="order-status">
      <li>
        <span class="left status-tit">订单编号</span>
        <p class="status-text">{{detail.orderNumber}}</p>
      </li>
      <li>
        <span class="left status-tit">订单状态</span>
        <p class="status-text">{{detail.status | stauToText}}</p>
      </li>
      <li>
        <span class="left status-tit">下单时间</span>
        <p class="status-text">{{detail.createTime}}</p>
      </li>
      <li>
        <span class="left status-tit">订单备注</span>
        <p class="status-text">{{detail.remark}}</p>
      </li>
    </ul>
    <div class="order-info">
      <ul>
        <li>
          <span class="info-tit">商品金额</span>
          <span class="info-cont">&yen;{{detail.totalAmount}}</span>
        </li>
        <li>
          <span class="info-tit">茶金币抵扣</span>
          <span class="info-cont">
            -&yen;{{parseInt(detail.goldCoin)*0.01.toFixed(2)}}
          </span>
        </li>
        <li>
          <span class="info-tit">实付:</span>
          <span class="info-cont">&yen;{{detail.paymentAmount}}</span>
        </li>
      </ul>
    </div>
    <y-head>
      <h2 class="tit" slot="text">用户服务</h2>
    </y-head>
    <router-link :to="{'path': '/receipt/2/' + detail.id + '/' + detail.totalAmount}" tag="p" class="get-bill" v-if="(detail.hasOpenInvoice == 1 || detail.hasOpenInvoice == 0) && detail.isCanConsignment == 0">
      开发票
      <span class="right"><img src="./assets/arrow.png" width="100%" height="100%"/></span>
    </router-link>
    <router-link :to="{'path': '/receipt1/2/' + detail.invoiceResult.invoiceTitle + '/' + (detail.invoiceResult.remark || encodeURI(' '))}" tag="p" class="get-bill" v-if="detail.hasOpenInvoice == 2">
      开发票
      <span class="right receipted">已开票</span>
    </router-link>
    <p class="bill-warn" v-show="detail.isCanConsignment == 1">您已选择获取代销收益，无法申请开发票</p>
    <p class="contact-server"><a href="tel:400-089-9458"><span><img src="./assets/my-server.png" width="100%" height="100%" /></span>联系客服</a></p>
    <div class="order-sure" v-if="detail.status == 1">
      <span class="btn-cal" v-if="detail.status == 1" v-on:click="calId = detail.id;showCfm=true;">取消订单</span>
      <span class="btn-sure" v-if="detail.status == 1" v-on:click="pay(detail.id)">付款</span>
    </div>
    <footer class="seat" v-if="detail.status == 1"></footer>
    <loading v-if="isLoading"></loading>
    <confirm v-show="showCfm">
      <h2 class="confirm-head" slot="head">提示</h2>
      <div slot="content">是否取消订单？</div>
      <p slot="cancel" @click="showCfm = false">否</p>
      <p @click="cal" slot="sure">是</p>
    </confirm>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
    <success v-if="isSuccess">
      <div class="sucess-text" slot="text">付款成功</div>
      <button slot="button" @click="reload">返回我的订单</button>
    </success>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'morderdetail',
  methods: {
    pay: function (_id) {
      this.$http({
        method: 'post',
        url: '/api/tea/manor/order/pay',
        body: {id: _id},
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.isLoading = false
        const _this = this
        if (res.body.code === 0) {
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
          window.alert(res.body.message)
        }
      })
    },
    cal: function () {
      const _this = this
      _this.$http({
        method: 'post',
        url: '/api/tea/manor/order/cancel',
        body: {id: _this.$data.calId},
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        _this.$data.isLoading = false
        if (res.body.code === 0) {
          window.location.reload()
        } else {
          window.alert(res.body.message)
        }
      })
    },
    reload: function () {
      window.location.reload()
    }
  },
  created () {
    document.title = '庄园订单详情'
    this.$http.get('/api/tea/manor/order/detail?id=' + this.$route.params.id).then(function (res) {
      if (res.body.code === 0) {
        this.$data.detail = res.body.data
        this.$data.tea = res.body.data.teaOrderDetailListResults
      } else {
        window.alert(res.body.message)
      }
    })
  },
  filters: {
    stauToText: function (value) {
      if (value === 1) return '待付款'
      else if (value === 2) return '进行中'
      else if (value === 3) return '已完成'
      else if (value === 11) return '超时关闭'
      else if (value === 12) return '取消'
      else if (value === 13) return '失败'
      else if (value === 14) return '异常'
      else if (value === 15) return '已关闭'
      else return '未知状态'
    }
  },
  data () {
    return {
      detail: {},
      tea: [],
      isLoading: false,
      showCfm: false,
      calId: '',
      isSuccess: false
    }
  }
}
</script>

<style scoped>
  /* 订单状态 */
  .order-status {
    padding: .3rem .16rem;
    margin: 0 .16rem .16rem .16rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .order-status li {
    margin-bottom: .15rem;
  }
  .order-status li:last-child {
    margin-bottom: 0;
  }
  .order-status .status-tit {
    width: 1.3rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .order-status .status-text {
    margin-left: 1.4rem;
    font-size: .24rem;
    min-height: .33rem;
  }
  .order-status .status-text.blue {
    color: #476d8f;
  }
  /* 订单内容 */
  .order-shopping {
    margin-top: .2rem;
    margin-bottom: .2rem;
  }
  h2.order-tit {
    height: .8rem;
    padding-top: .25rem;
    padding-left: .2rem;
    border-bottom: 0.02rem solid #dedede;
    font-size: .28rem;
  }
  /* 其他订单信息 */
  .order-info {
    background-color: #fff;
    margin: 0 .16rem .2rem .16rem;
    padding: .16rem 0;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .order-info.none-bottom {
    margin-bottom: 0;
  }
  .order-info > ul > li {
    height: .5rem;
    margin-left: .2rem;
    padding: .05rem .2rem .05rem 0;
  }
  .order-info > ul > li:last-child {
    height: .6rem;
    margin-top: .16rem;
    padding-top: .22rem;
    border-top: 1px solid #dedede;
  }
  .info-tit {
    display: inline-block;
    width: 1.6rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .info-cont {
    font-size: .24rem;
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
    float: left;
    display: inline-block;
    width: 50%;
    height: 100%;
    padding-top: .26rem;
    font-size: .24rem;
    text-align: center;
  }.btn-sure {
     background-color: #cb4042;
     color: #fff;
   }
  .btn-cal {
    background-color: #fff;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
  .all-amount {
    overflow: hidden;
    padding: .25rem .2rem;
    background-color: #fff;
  }
  .pay-amount {
    color: #d0021b;
    font-size: .36rem;
  }
  .get-bill {
    padding: .25rem .2rem;
    margin: .2rem .16rem 0 .16rem;
    background-color: #fff;
    font-size: .24rem;
    color: #9b9b9b;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .get-bill span {
    width: .4rem;
    height: .4rem;
    margin-top: -2px;
  }
  .get-bill span.receipted {
    width: .8rem;
    margin-top: 0;
    font-size: .24rem;
    color: #cb4042;
  }
  .bill-warn {
    margin-top: .1rem;
    padding: .02rem 0 0 .2rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .private-detail {
    overflow: hidden;
    background-color: #fff;
    padding: .3rem .16rem;
    margin: 0 .16rem;
    border: 0.02rem solid #dedede;
    position: relative;
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
  .private-size {
    font-size: .24rem;
    color: #9b9b9b;
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
    color: #cb4042;
    font-size: .24rem;
    margin-right: .14rem;
  }
  .old-cost {
    font-size: .2rem;
    color: #9b9b9b;
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
  .contact-server {
    margin-top: .18rem;
    padding: .3rem 0;
    text-align: center;
  }
  .contact-server a {
    display: inline-block;
    width: 1.6rem;
    color: #9b9b9b;
    font-size: .24rem;
  }
  .contact-server span {
    display: inline-block;
    width: .32rem;
    height: .32rem;
    float: left;
  }
</style>
