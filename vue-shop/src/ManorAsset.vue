<template>
  <div id="">
    <!--<section class="manor-total">
      <h1 class="total-tit">{{manorInfo.size}}亩茶庄园</h1>
      <div class="manor-asset">
        <div class="total-tea">
          <p class="total-type">累计收茶</p>
          <p class="total-num">&yen; {{manorInfo.totalCollectTea}}</p>
        </div>
        <div>
          <p class="total-type">累计代销</p>
          <p class="total-num">&yen; {{manorInfo.totalConsignment}}</p>
        </div>
      </div>
    </section>-->
    <overview :info="manorInfo"></overview>
    <ul class="assets-list">
      <li v-for="(item,index) in list">
        <div class="assets-info" v-on:click="open = (open == index ? -1 : index)">
          <h2 class="assets-tit">
            <span class="tit-text">第{{item.quarter}}季度</span>
            <span class="red tag" v-if="item.status ==2">可领取</span>
          </h2>
          <p class="assets-time">{{item.startTime}}~{{item.deadline}} 可操作</p>
          <span class="right btn-arrow" :class="{open: open==index}"><img src="./assets/arrow.png" width="100%" height="100%" /></span>
        </div>
        <div class="assets-detail" v-show="open==index">
          <div>
            <p class="left detail-tit">收益内容</p>
            <p class="detail-text" v-if="item.earningsType==1" v-for="items in item.teaEarningsResults">
              {{items.categoryName}} {{items.starLevel | starToText}} {{items.weight}}g
            </p>
            <p class="detail-text" v-if="item.earningsType!=1 && item.earningsType!=2">
              领取价值约&yen;{{item.teaValue}}的茶组合，或让我们为您代销这批茶叶
            </p>
            <p class="detail-text" v-if="item.earningsType==2">
              代销所得&yen;{{item.quarterEarnings}}元现金
            </p>
          </div>
          <div v-if="item.earningsType != 1 || item.status != 1">
            <p class="left detail-tit">相关说明</p>
            <p class="detail-text">代销可获现金收益</p>
          </div>
          <div>
            <p class="left detail-tit">礼盒包装</p>
            <p class="detail-text">{{item.isGiftBoxPackaging == 0 ? "否":"是"}}</p>
          </div>
          <div class="assets-handle" v-show="item.status ==2">
            <div class="btn-sale" v-on:click="change(item)"
                 v-show="item.isCanConsignment == 1 && item.hasOpenInvoice == 1">代销
            </div>
            <div @click="goPay(item.orderId,item.teaManorId,item.id,item.quarter)" v-show="item.status == 2" class="get-tea">
              收茶
            </div>
          </div>
          <!--<div class="assets-handle" v-show="item.status ==1">
            <router-link tag="div" :to="{'path': '/morderdetail/'+item.orderId}" class="get-tea">查看详情
            </router-link>
          </div>-->
        </div>
      </li>
    </ul>
    <div class="model" v-show="isSwitch">
      <div class="model-item">
        <div class="item-notice">
          <p>代销茶叶</p>
          <p>本季代销可获&yen; {{proxy.quarterEarnings}}</p>
          <p>代销后您将无法领取本季度茶叶</p>
        </div>
        <div class="item-button">
          <a v-on:click="isSwitch = !isSwitch">取消</a>
          <a v-on:click="submit($event)">确认</a>
        </div>
      </div>
    </div>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
  import Overview from './components/Overview'
  export default {
    name: 'manorassets',
    components: {
      Overview
    },
    created () {
      document.title = '私家茶庄园'
      const teaManorId = this.$router.currentRoute.params.teaid
      const orderId = this.$router.currentRoute.params.orderid
      this.$http.get('/api/tea/manor/quarter/order/info?teaManorId=' + teaManorId + '&orderId=' + orderId).then(function (res) {
        if (res.body.code === 0) {
          const data = res.body.data
          this.$set(this.$data.manorInfo, 'tit', data.size + '亩茶庄园')
          this.$set(this.$data.manorInfo, 'leftVal', data.totalCollectTea)
          this.$set(this.$data.manorInfo, 'rightVal', data.totalConsignment)
          this.$set(this.$data.manorInfo, 'tag', '第' + data.serialNumber + '期')
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
      this.$http.get('/api/tea/manor/quarter/order/list?teaManorId=' + teaManorId + '&orderId=' + orderId).then(function (res) {
        if (res.body.code === 0) {
          this.$data.list = res.body.data
          for (var i = 0; i < this.$data.list.length; i++) {
            if (this.$data.list[i].isCurrQuarter === 1) {
              this.$data.open = i
            }
          }
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    methods: {
      change: function (item) {
        this.$data.proxy = item
        this.$data.isSwitch = true
      },
      goPay: function (_orderId, _teaManorId, _id, _quarter) {
        window.location.href = '/?#/assets/gettea/' + _orderId + '/' + _teaManorId + '/' + _id + '/' + _quarter
      },
      submit: function () {
        this.$data.teaManorId = this.$router.currentRoute.params.teaid
        this.$data.orderId = this.$router.currentRoute.params.orderid
        this.$data.isLoading = true
        this.$http({
          method: 'get',
          url: '/api/tea/manor/quarter/order/confirm/consignment?id=' + this.$data.proxy.id + '&orderId=' + this.$data.orderId + '&teaManorId=' + this.$data.teaManorId
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            window.location.reload()
            this.$data.isSwitch = false
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    },
    data () {
      return {
        open: -1,
        list: {},
        manorInfo: {
          leftUrl: '/charge-tea',
          rightUrl: '/accumulatedcommission',
          bgImg: 'm-detail',
          leftName: '累计收茶',
          rightName: '累计代销'
        },
        id: '',
        orderId: '',
        teaManorId: '',
        proxy: {},
        isSwitch: false,
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
  .gray {
    background-color: #9b9b9b;
  }

  .red {
    color: #cb4042 !important;
    border: 1px solid #cb4042;
  }

  .blue {
    background-color: #476d8f;
  }

  .manor-total {
    position: relative;
    height: 2.8rem;
    padding-top: .7rem;
    background: url("./assets/cover1.png") no-repeat;
    background-size: 100% 100%;
  }

  .total-tit {
    text-align: center;
    font-size: .32rem;
  }

  .manor-asset {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1.2rem;
    padding: .27rem 0;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    background-color: rgba(0, 0, 0, .3);
  }

  .manor-asset > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    text-align: center;
  }

  .total-tea {
    border-right: .01rem solid #fff;
  }

  .total-type {
    margin-bottom: .1rem;
    font-size: .22rem;
    color: #fff;
  }

  .total-num {
    font-size: .28rem;
    color: #fff;
  }

  .assets-list {
    margin: .3rem .2rem;
  }

  .assets-list > li {
    margin-bottom: .2rem;
  }

  .assets-info {
    position: relative;
    padding: .24rem .3rem;
    border: 1px solid #dedede;
    background-color: #fff;
    border-radius: .08rem;
    -webkit-border-radius: .08rem;
    -moz-border-radius: .08rem;
  }

  .assets-tit {
    overflow: hidden;
    margin-bottom: .2rem;
  }
  .assets-tit span {
    float: left;
  }
  .assets-tit .tit-text {
    font-size: .28rem;
  }

  .assets-tit span.tag {
    display: inline-block;
    margin-left: .15rem;
    padding: .01rem .1rem;
    font-size: .2rem;
    color: #fff;
  }

  .assets-time {
    font-size: .24rem;
    color: #9b9b9b;
  }

  .assets-count {
    display: inline-block;
    position: absolute;
    top: .4rem;
    right: .3rem;
    font-size: .28rem;
    color: #476d8f;
  }

  .assets-count b {
    font-size: .28rem;
    color: #476d8f;
  }
  .btn-arrow {
    display: inline-block;
    width: .4rem;
    height: .4rem;
    position: absolute;
    top: .45rem;
    right: .16rem;
  }
  .btn-arrow.open {
    transform: rotate(90deg);
    transform: rotate(90deg);
    -webkit-transform: rotate(90deg);
  }

  .assets-detail {
    margin-top: .1rem;
    border: 1px solid #dedede;
    background-color: #fff;
    border-radius: .08rem;
    -webkit-border-radius: .08rem;
    -moz-border-radius: .08rem;
  }

  .detail-tit {
    width: 1.6rem;
    padding: .25rem 0;
    text-align: center;
    font-size: .24rem;
    color: #9b9b9b;
  }

  .assets-detail > div:nth-child(3) .detail-text {
    border-bottom: none;
  }

  .detail-text {
    margin-left: 1.6rem;
    padding: .25rem 0;
    border-bottom: 1px solid #dedede;
    font-size: .24rem;
  }

  .assets-handle {
    width: 100%;
    margin-top: -1px;
    border-top: 1px solid #dedede;
    display: box;
    display: -webkit-box;
    display: -moz-box;
  }

  .assets-handle > div {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    height: .8rem;
    padding: .28rem 0;
    text-align: center;
  }

  .btn-sale {
    color: #9b9b9b;
    font-size: .24rem;
    border-right: .01rem solid #dedede;
  }

  .get-tea {
    color: #cb4042;
    font-size: .24rem;
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
    height: 2.8rem;
    background: #fff;
    border-radius: 0.08rem;
  }

  .model-item .item-notice {
    height: 2rem;
    width: 100%;
    border-bottom: 1px solid #dedede;
    padding: 0.35rem 0;
    text-align: center;
  }

  .model-item .item-notice p:nth-child(1) {
    color: #476d8f;
    font-size: 0.28rem;
    font-weight: bold;
  }

  .model-item .item-notice p:nth-child(2) {
    color: #9b9b9b;
    margin: 0.2rem 0 0.2rem 0;
    font-size: 0.24rem;
  }

  .model-item .item-notice p:nth-child(3) {
    color: #476d8f;
    font-size: 0.24rem;
  }

  .item-button {
    width: 100%;
    height: 0.8rem;
    text-align: center;
    padding: 0.2rem 0;
  }

  .item-button a {
    display: inline-block;
    line-height: 0.4rem;
    height: 100%;
    font-size: 0.28rem;
    width: 49%;
    color: #476d8f;
  }

  .item-button a:nth-child(1) {
    color: #9b9b9b;
    border-right: 1px solid #dedede;
  }

  a {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -moz-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>
