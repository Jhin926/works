<template>
  <div id="teaglodcoins">
    <div class="teaglodcoins">
      <div class="mine-bg">
        <p class="list-rule">
          <button v-on:click="alert">规则</button>
        </p>
        <p class="username">可用金币(个)</p>
        <p class="user">{{goldcoins}}</p>
      </div>
      <div class="coins-recard">
        <section class="recard-item" v-for="(list, key) in golddetails">
          <h2 class="recard-tit">
            <span class="icon-tit"></span>
            {{key}}
          </h2>
          <ul class="recard-list">
            <li class="recard-item" v-for="item in list">
              <div class="left">
                <p class="recard-type">{{item.transactionType==1?"收入":"支出"}}</p>
                <p class="recard-time">{{item.createTime}}</p>
              </div>
              <div class="right recard-right">
                <p class="recard-num" :class="{add: item.transactionType==1}">{{item.transactionType==1? "+" : "-"}}{{item.goldCoin}}</p>
                <p class="total-num">{{item.remainingGoldCoin}}</p>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <div class="model" v-show="isSwitch">
        <div class="model-item">
          <div class="item-notice">
            <p>茶金币相关规则</p>
          </div>
          <div class="notice-const">
            <div class="notice-const-item">
              <p class="left">1、</p>
              <p class="right">您可通过活动、消费等方式获取茶金币：邀请好友注册成功后获得1000个茶金币；消费实付金额1:1获得茶金币。</p>
            </div>
            <div class="clear"></div>
            <div class="notice-const-item">
              <p class="left">2、</p>
              <p class="right">茶金币可在提交订单时抵扣需付款金额，100个茶金币抵扣1元人民币。</p>
            </div>
            <div class="clear"></div>
            <div class="notice-const-item">
              <p class="left">3、</p>
              <p class="right">茶金币不可兑换成现金。</p>
            </div>
            <div class="clear"></div>
            <div class="notice-const-item">
              <p class="left">4、</p>
              <p class="right">若发现违规套取茶金币的行为，将不予发放奖励并封停相关权益；情节严重会依法追究其法律责任。</p>
            </div>
          </div>
          <div class="clear"></div>
          <div class="item-button" v-on:click="isSwitch = !isSwitch">
            好的
          </div>
        </div>
      </div>
    </div>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
  export default {
    name: 'teagoldcoins',
    created () {
      document.title = '茶金币'
      this.$http.get('api/mine/tea/goldcoin/balance').then(function (res) {
        if (res.body.code === 0) {
          this.$data.goldcoins = res.body.data
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
      this.$http.get('api/mine/tea/goldcoin/detail?&pageSize=20&currentPage=1').then(function (res) {
        if (JSON.stringify(res.body.data) === '{}') {
          this.$router.replace('/mine/teagoldcoin/empty')
        } else {
          this.$data.golddetails = res.body.data
        }
      })
    },
    methods: {
      alert: function () {
        this.$data.isSwitch = true
      }
    },
    data () {
      return {
        goldcoins: 0,
        golddetails: {},
        isSwitch: false,
        timeArr: [],
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
  .teaglodcoins {
    margin: 0 auto;
    overflow: hidden;
  }

  .mine-bg {
    max-width: 640px;
    height: 1.9rem;
    margin: 0 auto;
    background: url('./assets/wo_jinbi_bg.png') no-repeat;
    background-size: cover;
  }

  .mine-bg .list-rule {
    width: 100%;
    height: 0.6rem;
    margin: 0 auto;
    padding: 0.32rem .16rem;
  }

  .mine-bg .list-rule button {
    width: 0.75rem;
    height: 0.36rem;
    float: right;
    border-radius: 1px;
    -webkit-border-radius: 1px;
    text-align: center;
    line-height: 0.36rem;
    background: #9c741f;
    color: #fff;
    font-size: 0.2rem;
  }

  .mine-bg p {
    width: 4rem;
    margin: 0.24rem auto;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .mine-bg p.user {
    font-size: 0.6rem;
    color: #fff;
    margin: -0.1rem auto;
  }

  /* 金币交易记录 */
  .recard-tit {
    height: 0.7rem;
    padding-left: 0.2rem;
    padding-top: 0.26rem;
    font-size: 0.26rem;
  }

  .icon-tit {
    float: left;
    width: 2px;
    height: .3rem;
    margin-top: .02rem;
    margin-right: .16rem;
    background-color: #cd4042;
  }

  .recard-list {
    margin: 0 .16rem;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }

  .recard-list .recard-item {
    margin-left: .3rem;
    padding: .26rem .2rem .26rem 0;
    border-bottom: 1px solid #dedede;
    overflow: hidden;
  }

  .recard-list .recard-item:last-child {
    border-bottom: none;
  }

  .recard-type {
    margin-bottom: .1rem;
    font-size: .28rem;
  }

  .recard-time {
    font-size: .24rem;
    color: #9b9b9b;
  }

  .recard-right {
    text-align: right;
  }

  .recard-num {
    margin-bottom: .1rem;
    font-size: .28rem;
    font-weight: bold;
  }
  .recard-num.add {
    color: #cb4042;
  }

  .total-num {
    font-size: .24rem;
    color: #9b9b9b;
  }

  .mine-bg .username {
    width: 1.5rem;
    height: 0.3rem;
    color: #fff;
    font-size: 0.24rem;
    text-align: center;
    line-height: 0.3rem;
    margin-top: -0.05rem;
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
    height: 6.2rem;
    background: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }

  .model-item .item-notice {
    width: 100%;
    padding: 0.6rem 0 0.4rem;
    text-align: center;
  }

  .model-item .item-notice p {
    font-size: 0.32rem;
    font-weight: bold;
  }

  .notice-const {
    width: 100%;
    padding: 0 0.4rem 0.4rem;
  }

  .notice-const-item p {
    font-size: 0.24rem;
    line-height: 0.4rem;
    color: #9b9b9b;
  }

  .item-button {
    width: 100%;
    height: 0.8rem;
    text-align: center;
    padding: 0.24rem 0;
    font-size: 0.28rem;
    color: #cb4042;
    margin-top: 0.4rem;
    border-top: 1px solid #dedede;
  }

  .notice-const-item .right {
    width: 91%;
  }
</style>
