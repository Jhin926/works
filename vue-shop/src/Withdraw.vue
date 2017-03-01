<template>
  <div id="withdrawmoney">
    <div class="withdrawmoney">
      <div class="withdrawmoney-item">
        <div class="money-item-title">
          <p class="left">提现账户
          <p>
          <p class="left right">
            微信零钱
            <span class="title-color">(无需手续费)</span>
          <p>
        </div>
        <div class="clear"></div>
        <div class="money-item-con">
          <div class="item-con-money">
            <p class="left">&yen;</p>
            <div class="left">
              <input type="tel" placeholder="请输入提现金额" v-model="amount">
            </div>
            <p class="right" v-on:click="amount = maxAmount">全部转出</p>
          </div>
        </div>
        <div class="clear"></div>
      </div>
      <p v-show="amount > maxAmount" class="warning">提现金额不能大于账户总额</p>
      <p v-show="amount< 0" class="warning">提现金额必须大于0</p>
      <!--<p v-show="typeof amount != 'number'" class="warning">请输入合法数字</p>-->
      <div class="button">
        <button v-on:click="submit">提现</button>
      </div>
    </div>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
    <success v-if="isSuccess">
      <div class="sucess-text" slot="text">提现成功</div>
      <router-link tag="button" to="/accountbalance" slot="button">返回个人界面</router-link>
    </success>
  </div>
</template>

<script>
  export default {
    name: 'withdraw',
    created () {
      document.title = '提现'
      this.$http.get('/api/account/query/account/balance').then(function (res) {
        if (res.body.code === 0) {
          this.$data.maxAmount = res.body.data
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    methods: {
      submit: function () {
        if (this.$data.amount !== '') {
          this.$data.isLoading = true
          this.$http.get('/api/account/withdraw?transactionType=2&amount=' + this.$data.amount).then(function (res) {
            this.$data.isLoading = false
            if (res.body.code === 0) {
              this.$data.isSuccess = true
            } else {
              this.$data.altMessage = res.body.message
              this.$data.showAlt = true
            }
          })
        }
      }
    },
    data () {
      return {
        maxAmount: 0,
        amount: '',
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息',
        isSuccess: false
      }
    }
  }
</script>

<style scoped>
  .withdrawmoney {
    max-width: 640px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #efefef;
  }

  .withdrawmoney-item {
    width: 5.8rem;
    height: 2.7rem;
    margin: 0.2rem auto;
    border-radius: 0.15rem;
    background-color: #f7f7f7;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.2);
  }

  .money-item-title {
    height: 0.88rem;
    width: 100%;
    padding-left: 0.3rem;
    border-bottom: 1px solid #ededed;
  }

  .money-item-title .left {
    font-size: 0.28rem;
    height: 100%;
    line-height: 0.88rem;
  }

  .money-item-title .right {
    margin-left: 0.4rem;
    float: left;
  }

  .title-color {
    font-size: 0.2rem;
    color: #9b9b9b;
  }

  .item-con-money {
    width: 100%;
    height: 1.81rem;
    line-height: 1.81rem;
    padding: 0 0.3rem;
  }

  .item-con-money .left {
    height: 100%;
    font-size: 0.6rem;
    line-height: 1.81rem;
  }

  .item-con-money .right {
    height: 100%;
    font-size: 0.24rem;
    color: #476d8f;
    padding-top: 0.1rem;
    line-height: 1.81rem;
  }

  .item-con-money input {
    width: 3.6rem;
    height: 50%;
    padding: 0 .05rem;
    font-size: 0.28rem;
    background: none;
  }

  .button {
    width: 5.6rem;
    height: 0.75rem;
    margin: 1rem auto 0 auto;
    border-radius: 0.1rem;
    background-color: #476d8f;
  }

  .button button {
    width: 100%;
    height: 100%;
    font-size: 0.28rem;
    text-align: center;
    line-height: 0.75rem;
    color: #fff;
  }

  .warning {
    margin-left: .3rem;
    color: #d0021b;
    font-size: .18rem;
  }
</style>
