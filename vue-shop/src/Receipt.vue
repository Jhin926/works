<template>
  <div id="">
    <receiveaddress v-on:addrId="getAddr"></receiveaddress>
    <div class="receipt-type">
      <h2 class="type-tit">发票类型</h2>
      <ul class="type-item">
        <li v-on:click="personal = true">
          个人
          <span v-if="personal" class="right type-select"><img src="./assets/selected.png" width="100%" height="100%" /></span>
        </li>
        <li v-on:click="personal = false">
          公司
          <span v-if="!personal" class="right type-select"><img src="./assets/selected.png" width="100%" height="100%" /></span>
        </li>
      </ul>
    </div>
    <p class="receipt-tips">如需增值税发票，请<a href="tel:400-089-9458">联系客服</a>。</p>
    <div class="receipt-info">
      <p class="left receipt-tit">发票抬头</p>
      <p class="receipt-input"><input v-model="invoiceTitle" type="text" placeholder="必填" /></p>
    </div>
    <div class="receipt-info">
      <p class="left receipt-tit">备注</p>
      <p class="receipt-input"><input v-model="remark" type="text" placeholder="选填" /></p>
    </div>
    <p class="btn-sure">
      <button v-on:click="receipt">确认</button>
    </p>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
    <success v-if="isSuccess">
      <div class="sucess-text" slot="text">申请成功</div>
      <button slot="button" @click="$router.go(-1)">返回订单详情</button>
    </success>
  </div>
</template>

<script>
import receiveaddress from './components/ReceiveAddress'
export default {
  name: 'receipt',
  components: {
    receiveaddress
  },
  methods: {
    getAddr: function (_id) {
      this.$data.addrId = _id
    },
    receipt: function () {
      if (this.$data.invoiceTitle === '') {
        window.alert('发票抬头不能为空')
        return
      }
      const reData = {
        bizType: this.$route.params.type, // 1,商城订单2，庄园订单
        bizId: this.$route.params.id, // 对应的定单id
        invoiceType: this.$data.personal ? 1 : 2, // 1个人
        invoiceTitle: this.$data.invoiceTitle, // 发票抬头
        remark: this.$data.remark, // 备注
        totalAmount: this.$route.params.amount, // 订单总金额
        invoiceAmount: this.$route.params.amount, // 开票总金额
        addressId: this.$data.addrId
      }
      console.log(reData)
      this.$data.isLoading = true
      this.$http({
        method: 'post',
        url: '/api/invoice/receive',
        body: reData
      }).then(function (res) {
        this.$data.isLoading = false
        if (res.body.code === 0) {
          this.$data.isSuccess = true
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    }
  },
  created () {
    document.title = '领取发票'
  },
  data () {
    return {
      addrId: '',
      personal: false,
      invoiceTitle: '',
      remark: '',
      isLoading: false,
      showAlt: false,
      altMessage: '错误信息',
      isSuccess: false
    }
  }
}
</script>

<style scoped>
  * {
    line-height: 1;
    font-size: .24rem;
  }
  .receipt-type {
    margin: .2rem .16rem 0 .16rem;
    border: .02rem solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #fff;
  }
  .type-tit {
    padding: .2rem;
    border-bottom: .02rem solid #dedede;
  }
  .type-item li {
    margin-left: .2rem;
    padding: .2rem 0;
    border-bottom: .02rem solid #dedede;
  }
  .type-item li:last-child {
    border-bottom: none;
  }
  .type-select {
    width: .2rem;
    height: .2rem;
    margin-right: .2rem;
  }
  .receipt-tips {
    margin: .16rem;
    font-size: .2rem;
    color: #9b9b9b;
  }
  .receipt-tips a {
    font-size: .2rem;
    color: #cb4042;
  }
  .receipt-info {
    overflow: hidden;
    margin: .2rem .16rem 0 .16rem;
    border: .01rem solid #dedede;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .receipt-tit {
    width: 1.6rem;
    padding: .22rem 0 .2rem .2rem;
    color: #9b9b9b;
  }
  .receipt-input {
    padding: .23rem 0 .17rem;
    margin-left: 1.6rem;
    margin-right: .2rem;
  }
  .receipt-input input {
    width: 100%;
    text-align: right;
  }
  .btn-sure {
    position: fixed;
    left: .32rem;
    top: 8.5rem;
    width: 5.76rem;
    height: .8rem;
    text-align: center;
    background-color: #cb4042;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .btn-sure button {
    width: 100%;
    height: 100%;
    color: #fff;
  }
  input::-moz-placeholder{color: #a4a4a4;text-align: right;}
  input::-webkit-input-placeholder{color: #a4a4a4;text-align: right;}
</style>
