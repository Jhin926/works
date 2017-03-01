<template>
  <div id="">
    <y-head>
      <h2 class="tit" slot="text">收货信息</h2>
    </y-head>
    <ul class="add-address">
      <li>
        <label class="left">收货人</label>
        <div class="input-con">
          <input type="text" placeholder="请输入收货人姓名" v-model="receiver">
        </div>
      </li>
      <li>
        <label class="left">联系电话</label>
        <div class="input-con">
          <input type="tel" placeholder="请输入您的手机号" v-model="receiverPhone">
        </div>
      </li>
      <li>
        <label class="left">选择地区</label>
        <div class="input-con check-area">
          <region-picker auto :province="region.province" :city="region.city" :district="region.district" @onchange="getArea">
          </region-picker>
        </div>
      </li>
      <li>
        <label class="left">详细地址</label>
        <div class="input-con">
          <textarea placeholder="请输入详细地址" v-model="address"></textarea>
        </div>
      </li>
    </ul>
    <y-head>
      <h2 class="tit" slot="text">订单内容</h2>
    </y-head>
    <shopping :teaList="tea"></shopping>
    <p class="tip-fare">配送费用&yen;{{detail.freightFee}}</p>
    <div class="order-sure">
      <span class="btn-sure" @click="sure">确认</span>
      <span class="order-amount">&yen;{{(detail.orderTotalAmount).toFixed(2)}}</span>
      <span class="order-total">共计</span>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <success v-if="isSuccess">
      <div class="sucess-text" slot="text">购买成功</div>
      <button slot="button" @click="$router.go(-1)">返回商品详情</button>
    </success>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>
<script>
  import Shopping from './components/Shopping'
  import wx from 'weixin-js-sdk'
  export default {
    name: 'address',
    components: {
      Shopping
    },
    created () {
      document.title = '确认订单'
      var paramsPre = '?teaId=' + this.$route.params.id + '&quantity=' + this.$route.params.num
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
      getArea: function (value) {
        this.$data.area = value
      },
      sure: function () {
        const _this = this
        let reqData = {}
        if (_this.$data.receiver === '') {
          this.$data.altMessage = '请填写收货人'
          this.$data.showAlt = true
          return
        }
        if (_this.$data.receiverPhone === '') {
          this.$data.altMessage = '请填写联系电话'
          this.$data.showAlt = true
          return
        }
        if (JSON.stringify(_this.$data.area) === '{}') {
          this.$data.altMessage = '请选择地址'
          this.$data.showAlt = true
          return
        }
        if (_this.$data.address === '') {
          this.$data.altMessage = '请填写详细地址'
          this.$data.showAlt = true
          return
        }
        reqData.receiver = _this.$data.receiver
        reqData.receiverPhone = _this.$data.receiverPhone
        reqData.province = _this.$data.area.province
        reqData.city = _this.$data.area.city
        reqData.district = _this.$data.area.district
        reqData.address = _this.$data.address
        reqData.teaOrderDetailEnterJson = this.$route.params.id + '_' + this.$route.params.num + '_0'
        reqData.referrer = this.$route.params.referrer
        reqData.goldCoin = 0
        reqData.useAccountBalance = 0
        this.$http({
          method: 'post',
          url: '/api/order/tea/share/confirm',
          before: function () { _this.$data.isLoading = true },
          body: reqData
        }).then((res) => {
          _this.$data.isLoading = false
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
            _this.$data.altMessage = res.body.message
            _this.$data.showAlt = true
          }
        })
      }
    },
    data () {
      return {
        detail: {
          orderTotalAmount: 0
        },
        region: {},
        receiver: '',
        receiverPhone: '',
        area: {},
        address: '',
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息',
        isSuccess: false,
        tea: []
      }
    }
  }
</script>

<style scoped>
   .add-address {
     margin: .3rem .16rem;
     padding-left: .16rem;
     padding-right: .16rem;
     border: 1px solid #dedede;
     background-color: #fff;
     border-radius: 2px;
     -webkit-border-radius: 2px;
   }
   .add-address li {
     height: .8rem;
     overflow: hidden;
     border-bottom: 1px solid #dedede;
   }
   .add-address li:last-child {
     border-bottom: none;
   }
   .add-address li > label {
     width: 1.6rem;
     padding-top: .24rem;
     font-size: .24rem;
   }
   .input-con {
     margin-left: 1.7rem;
     padding-top: .24rem;
   }
   .input-con input {
     font-size: .24rem;
     -webkit-tap-highlight-color: rgba(255,255,255,0);
   }
   .tip-fare {
     margin: .16rem;
     font-size: .2rem;
     color: #9b9b9b;
   }
   .region-picker >label {
     width: 33%;
   }
   textarea {
     width:100%;
     font-size:.24rem;
     outline:none;
     resize:none;
     border:none;
     word-wrap:break-word;
     word-break:break-all;
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
   .seat {
     min-width: .1rem;
     min-height: 1.1rem;
   }
</style>
