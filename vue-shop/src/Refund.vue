<template>
  <div id="refund">
    <div class="refund-item">
      <p class="left item-tit">退款理由</p>
      <div class="item-input">
        <input type="text" v-model="reason" placeholder="必填" />
      </div>
    </div>
    <div class="refund-item">
      <p class="left item-tit">备注</p>
      <div class="item-input">
        <input type="text" v-model="remark" placeholder="选填" />
      </div>
    </div>
    <div class="button">
      <button v-on:click="refund">申请退款</button>
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
    name: 'refund',
    methods: {
      refund: function () {
        if (this.$data.reason === '') {
          window.alert('请填写退款理由')
          return
        }
        const reData = {
          orderId: this.$route.params.id,
          refundReason: this.$data.reason,
          refundRemark: this.$data.remark
        }
        this.$http({
          method: 'post',
          url: '/api/refund/application',
          body: reData,
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            this.$router.replace('/mine/suc-refund')
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    },
    created () {
      document.title = '申请退款'
    },
    data () {
      return {
        reason: '',
        remark: '',
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
  #refund {
    margin-top: .48rem;
  }
  .refund-item {
    margin: .16rem .16rem 0;
    padding: .24rem .32rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .item-tit {
    width: 1rem;
    font-size: .24rem;
  }
  .item-input {
    margin-left: 1.1rem;
  }
  .item-input input {
    width: 100%;
    font-size: .24rem;
    text-align: right;
  }
  input::-moz-placeholder {
    text-align: right;
  }
  input::-webkit-input-placeholder {
    text-align: right;
  }
  .button{
    text-align: center;
  }
  .button button{
    position: absolute;
    top: 8.5rem;
    left: .32rem;
    width:5.76rem;
    height:.8rem;
    border:none;
    background:#cb4042;
    border-radius:2px;
    -webkit-border-radius:2px;
    color:#fff;
    font-size:.24rem;
  }
</style>
