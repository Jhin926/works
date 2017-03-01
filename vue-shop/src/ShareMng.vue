<template>
  <div id="share-rule">
    <section class="mng-top">
      <span class="btn-rule" @click="showRule = true">?</span>
      <div class="mng-head">
        <p class="left img-level" v-if="brokerage.level==1"><img src="./assets/avatar-lv1.png" width="100%" height="100%" /></p>
        <p class="left img-level" v-if="brokerage.level==2"><img src="./assets/avatar-lv2.png" width="100%" height="100%" /></p>
        <p class="left img-level" v-if="brokerage.level==3"><img src="./assets/avatar-lv3.png" width="100%" height="100%" /></p>
        <p class="left img-level" v-if="brokerage.level==4"><img src="./assets/avatar-lv4.png" width="100%" height="100%" /></p>
        <div class="mng-survey">
          <p class="color-gray font-sml">销售总额</p>
          <p class="mng-amount">&yen;{{brokerage.totalSales}}</p>
          <p class="color-gray font-sml">您当前为{{brokerage.level}}级分销商，可享受{{brokerage.discount * 10}}折的折扣价</p>
        </div>
      </div>
      <div class="mng-level">
        <div class="level-percent" :style="{width: (brokerage.levelRate * 100) + '%'}"></div>
        <span class="cur-level" @click="curLev=1">Lv.{{brokerage.level}}</span>
        <span class="next-level" @click="nextLev=1">Lv.{{brokerage.level>=4 ? 4: brokerage.level+1}}</span>
        <span class="level-tip cur" :style="{ opacity: curLev}" v-if="brokerage.level==1">购买200元商品成为Lv.1分销商，享受9折购买价。</span>
        <span class="level-tip cur" :style="{ opacity: curLev}" v-if="brokerage.level==2">购买2000元商品成为Lv.2分销商，享受8折购买价。</span>
        <span class="level-tip cur" :style="{ opacity: curLev}" v-if="brokerage.level==3">购买10000元商品成为Lv.3分销商，享受7折购买价。</span>
        <span class="level-tip cur" :style="{ opacity: curLev}" v-if="brokerage.level==4">购买30000元商品成为Lv.4分销商，享受6折购买价。</span>
        <span class="level-tip next" :style="{ opacity: nextLev}" v-if="brokerage.level==1">销售总额达2000元后成为Lv.2分销商，享受8折购买价。</span>
        <span class="level-tip next" :style="{ opacity: nextLev}" v-if="brokerage.level==2">销售总额达10000元后成为Lv.3分销商，享受7折购买价。</span>
        <span class="level-tip next" :style="{ opacity: nextLev}" v-if="brokerage.level==3">销售总额达30000元后成为Lv.4分销商，享受6折购买价。</span>
        <span class="level-top" v-if="brokerage.level==4"><img src="./assets/icon-crown.png" width="100%" height="100%" /></span>
      </div>
    </section>
    <section class="brokerage">
      <div class="brokerage-tit">
        <div class="left" :class="{'active': showGet}" @click="showGet=true">
          <p class="tit-text">已赚取佣金</p>
          <p class="tit-amount">&yen;{{brokerage.brokerage}}</p>
        </div>
        <div class="right" :class="{'active': !showGet}" @click="showGet=false">
          <p class="tit-text">已结算佣金</p>
          <p class="tit-amount">&yen;{{brokerage.settlementAmount}}</p>
        </div>
      </div>
      <ul v-show="showGet" class="brokerage-get">
        <li v-for="item in brokerage.hasEarnBrokerage">
          <div class="left">
            <p class="brokerage-name">{{item.wxNickname}}</p>
            <p class="brokerage-tel">{{brokerage.mobileNumber}}</p>
          </div>
          <div class="right">
            <p class="brokerage-money">
              <span class="other-amount">&yen;{{item.orderAmount}}</span>
              <span class="brokerage-amount">&yen;{{item.brokerageAmount}}</span>
            </p>
            <p class="brokerage-time">{{item.createTime}}</p>
          </div>
        </li>
      </ul>
      <ul v-show="!showGet" class="brokerage-bal">
        <li v-for="item in brokerage.hasSettlementBrokerage">
          <p class="left font-mid color-gray">{{item.createTime}}</p>
          <p class="right font-mid">&yen;{{item.amount}}</p>
        </li>
      </ul>
    </section>
    <p class="btn-balance">
      <a href="tel:400-089-9458">
        <button>结算佣金</button>
      </a>
    </p>
    <div class="modal" v-show="showRule">
      <h2>分销相关规则</h2>
      <p>平台消费满200元后即可成为一级分销商，可以9折的价格购买成品茶。只需将茶叶分享给好友，好友即可直接以原价购买茶叶，差额作为分销商的佣金收入。</p>
      <p>分销商等级随销售额提升。升级后享受更高折扣，并将已分销商品的佣金以新折扣核算，返还差额：</p>
      <p>1级：消费满200元／9折</p>
      <p>2级：销售额达2000元／8折</p>
      <p>3级：销售额达10000元／7折</p>
      <p>4级：销售额达30000元／6折</p>
      <span class="btn-close" @click="showRule = false"></span>
    </div>
    <footer class="seat"></footer>
  </div>
</template>

<script>
    export default {
      name: 'ShareManage',
      beforeCreate () {
        this.$http.get('/api/distributor/info').then((res) => {
          if (res.body.code === 0) {
            if (res.body.data === null) {
              this.$router.replace('/share/rule')
            } else {
              this.$data.brokerage = res.body.data
            }
          }
        })
      },
      watch: {
        curLev: function (_val) {
          if (_val) {
            window.setTimeout(() => {
              this.$data.curLev = 0
            }, 2000)
          }
        },
        nextLev: function (_val) {
          if (_val) {
            window.setTimeout(() => {
              this.$data.nextLev = 0
            }, 2000)
          }
        }
      },
      data () {
        return {
          showGet: true,
          curLev: 0,
          nextLev: 0,
          brokerage: {},
          showRule: false
        }
      }
    }
</script>
<style scoped>
  .mng-top {
    position: relative;
    margin: .32rem .16rem;
    padding: .5rem .32rem .16rem .32rem;
    border: 1px solid #dedede;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .btn-rule {
    position: absolute;
    top: .32rem;
    right: .32rem;
    display: inline-block;
    width: .32rem;
    height: .32rem;
    padding-top: .04rem;
    border: 1px solid #dedede;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    text-align: center;
    color: #dedede;
    font-size: .2rem;
  }
  .mng-head {
    overflow: hidden;
  }
  .img-level {
    width: 1.28rem;
    height: 1.28rem;
  }
  .mng-survey {
    margin-left: 1.6rem;
  }
  .mng-amount {
    margin: .08rem 0 .16rem;
    padding-bottom: .16rem;
    border-bottom: 1px solid #dedede;
    font-size: .32rem;
  }
  .mng-level {
    position: relative;
    height: 4px;
    margin-top: .5rem;
    background-color: #d8d8d8;
    border-radius: 4px;
    -webkit-border-radius: 4px;
  }
  .level-percent {
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    background-color: #cb4042;
    border-radius: 4px;
    -webkit-border-radius: 4px;
  }
  .cur-level {
    position: absolute;
    top: -.28rem;
    left: 0;
    display: inline-block;
    font-size: .2rem;
    color: #cb4042;
  }
  .next-level {
    position: absolute;
    top: -.28rem;
    right: 0;
    display: inline-block;
    font-size: .2rem;
    color: #9b9b9b;
  }
  .level-tip {
    position: absolute;
    bottom: .6rem;
    display: inline-block;
    width: 3.2rem;
    padding: .1rem .16rem;
    background-color: #4a4a4a;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    transition: all 1s;
    -webkit-transition: all 1s;
    color: #fff;
    font-size: .24rem;
  }
  .level-tip:before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    position: absolute;
    bottom: -8px;
    border: 3px solid transparent;
    border-top-width: 5px;
    border-top-color: #4a4a4a;
  }
  .level-tip.cur {
    left: -.32rem;
  }
  .level-tip.cur:before {
    left: .3rem;
  }
  .level-tip.next {
    right: -.32rem;
  }
  .level-tip.next:before {
    right: .3rem;
  }
  .level-top {
    position: absolute;
    right: -.02rem;
    bottom: .36rem;
    display: inline-block;
    width: .32rem;
    height: .23rem;
  }

  /* 佣金部分样式 */
  .brokerage {
    margin: 0 .16rem;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .brokerage-tit {
    overflow: hidden;
    border-bottom: 1px solid #ededed;
  }
  .brokerage-tit > div {
    width: 50%;
    padding-top: .26rem;
    padding-bottom: .22rem;
    text-align: center;
    background-color: #ededed;
  }
  .brokerage-tit > div.active {
    background-color: #fff;
  }
  .tit-text {
    margin-bottom: .08rem;
    font-size: .2rem;
    color: #9b9b9b;
  }
  .tit-amount {
    font-size: .32rem;
  }
  .brokerage-get li {
    overflow: hidden;
    padding: .22rem .32rem;
    border-bottom: 1px solid #dedede;
  }
  .brokerage-get li:last-child {
    border-bottom: none;
  }
  .brokerage-name {
    font-size: .24rem;
  }
  .brokerage-tel {
    margin-top: .16rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .other-amount {
    display: inline-block;
    padding: 1px 2px;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    font-size: .24rem;
    color: #dedede;
  }
  .brokerage-amount {
    display: inline-block;
    padding: 1px 2px;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    background-color: #cb4042;
    color: #fff;
    font-size: .24rem;
  }
  .brokerage-money {
    text-align: right;
  }
  .brokerage-time {
    margin-top: .12rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .btn-balance {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: .8rem;
    background-color: #cb4042;
  }
  .btn-balance button {
    width: 100%;
    height: 100%;
    color: #fff;
    font-size: .24rem;
  }
  .brokerage-bal li {
    padding: .32rem;
    overflow: hidden;
    border-bottom: 1px solid #dedede;
  }
  .brokerage-bal li:last-child {
    border-bottom: none;
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
  }
  .modal h2 {
    margin-top: 1.96rem;
    margin-bottom: .48rem;
    text-align: center;
    color: #fff;
    font-size: .28rem;
  }
  .modal p {
    margin: 0 .6rem;
    color: #fff;
    font-size: .24rem;
    line-height: .36rem;
  }
  .btn-close {
    position: absolute;
    top: .48rem;
    right: .32rem;
    display: inline-block;
    width: 13px;
    height: 13px;
  }
  .btn-close:before,
  .btn-close:after {
    content: '';
    display: inline-block;
    width: 18px;
    height: 0;
    border-top: 1px solid #fff;
    position: absolute;
    top: 6px;
    left: -2px;
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }
  .btn-close:after {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
