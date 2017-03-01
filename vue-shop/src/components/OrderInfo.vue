<template>
  <div style="">
    <div class="list-none" v-show="list.length === 0">
      <p class="none-img"><img width="100%" src="../assets/icon_empty_scorder.png" /></p>
      <p class="none-text">您还没有相关订单</p>
      <router-link tag="p" class="none-btn" to="/shop">去商城转转</router-link>
    </div>
    <section v-if="list.length > 0" v-for="info in list" v-on:click.stop="detail(info.id)" class="order-info">
      <p class="order-num">订单编号: {{info.orderNumber}}</p>
      <span class="order-status">{{info.status | stauToText}}</span>
      <div class="shopping-list">
        <div class="shopping-info" v-for="shop in info.teaOrderDetailListResults">
          <p class="left shopping-img"><img :src="shop.indexPicture" width="100%" height="100%" /></p>
          <div class="shopping-text">
            <h2 class="shopping-tit">{{shop.teaCategoryName}} {{shop.starLevel | starToText}} {{shop.name}}</h2>
            <p class="shopping-weight">{{shop.weightText}}</p>
            <div class="shopping-price">
              <span class="new-cost">&yen;{{shop.transactionPrice}}</span>
            </div>
            <span class="shopping-num">x{{shop.quantity}}</span>
          </div>
        </div>
      </div>
      <!--<div class="shopping-total">
        <p class="left total-num">共{{info.quantity}}件商品</p>
        <p class="right total-amount">合计: <span class="total-cost">&yen;{{info.totalAmount}}</span><span class="total-remark">(含运费{{info.freightFee}}元)</span></p>
      </div>-->
      <div class="order-handle"  v-if="info.status == 1 || info.status == 3 || info.status == 11 || info.status == 12 || info.status == 13 || info.status == 15">
        <button class="left btn btn-bad" v-on:click.stop="cal(info.id)" v-if="info.status == 1">取消订单</button>
        <button class="left btn btn-bad" v-on:click.stop="del(info.id)" v-if="info.status == 11 || info.status == 1 || info.status == 12 || info.status == 13 || info.status == 15">删除</button>
        <button class="right btn btn-good" v-on:click.stop="pay(info.id)" v-if="info.status == 1">付款</button>
        <button class="right btn btn-good" v-on:click.stop="sure(info.id)" v-if="info.status == 3">确认收货</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'orderinfo',
  props: ['list'],
  methods: {
    detail: function (_id) {
      window.location.href = '/?#/orderdetail/' + _id
    },
    pay: function (_id) {
      window.location.href = '/?#/orderdetail/' + _id
    },
    cal: function (_id) {
      this.$emit('cal', _id)
    },
    del: function (_id) {
      this.$emit('del', _id)
    },
    sure: function (_id) {
      this.$emit('sure', _id)
    }
  },
  filters: {
    stauToText: function (value) {
      if (value === 1) return '待付款'
      else if (value === 2) return '待发货'
      else if (value === 3) return '待收货'
      else if (value === 4) return '交易成功'
      else if (value === 5) return '退款申请中'
      else if (value === 6) return '已退款'
      else if (value === 7) return '退款中'
      else if (value === 11) return '超时关闭'
      else if (value === 12) return '已取消'
      else if (value === 13) return '失败'
      else if (value === 14) return '异常'
      else if (value === 15) return '已关闭'
      else return '未知类型'
    }
  }
}
</script>

<style scoped>
  .order-info {
    margin: .2rem .16rem 0 .16rem;
    background-color: #fff;
    border: 1px solid #dedede;
    position: relative;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .order-num {
    padding: .2rem;
    font-size: .24rem;
    color: #9b9b9b;
    border-bottom: 0.02rem solid #dedede;
  }
  .order-status {
    position: absolute;
    top: .2rem;
    right: .2rem;
    font-size: .23rem;
    color: #cb4042;
  }
  .shopping-list {
    margin-left: .2rem;
    padding-bottom: .2rem;
  }
  .shopping-info {
    position: relative;
    overflow: hidden;
    margin-top: .2rem;
  }
  .shopping-img {
    width: 2.7rem;
    height: 1.8rem;
  }
  .shopping-text {
    margin-left: 2.86rem;
  }
  .shopping-tit {
    font-size: .28rem;
    line-height: .36rem;
  }
  .shopping-weight {
    margin-top: .16rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .shopping-price {
    position: absolute;
    bottom: 0;
    margin-top: .22rem;
  }
  .shopping-price span,
  .shopping-price del {
    font-size: .24rem;
    color: #cd4042;
  }
  .shopping-price del {
    color: #9b9b9b;
    margin-left: .1rem;
  }
  .shopping-num {
    position: absolute;
    right: .2rem;
    bottom: 0;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .shopping-total {
    overflow: hidden;
    padding: .25rem;
  }
  .total-num,
  .total-amount {
    font-size: .22rem;
  }
  .total-cost {
    font-size: .22rem;
    font-weight: bold;
    margin-left: .1rem;
  }
  .total-remark {
    font-size: .22rem;
    color: #9b9b9b;
  }
  .order-handle {
    overflow: hidden;
    padding: .1rem 0;
    border-top: .02rem solid #dedede;
  }
  .btn {
    width: .96rem;
    height: .4rem;
    border-radius: .05rem;
    -webkit-border-radius: .05rem;
    -moz-border-radius: .05rem;
    outline: none;
    border: 1px solid #9b9b9b;
    font-size: .2rem;
    color: #9b9b9b;
  }
  .btn-bad {
    margin-left: .16rem;
  }
  .btn-good {
    border-color: #cb4042;
    color: #cb4042;
    margin-right: .16rem;
  }
  .none-img {
    width: 2rem;
    margin: 1.5rem auto 0 auto;
  }
  .none-text {
    margin-top: .5rem;
    font-size: .28rem;
    text-align: center;
  }
  .none-btn {
    width: 5.76rem;
    padding: .2rem 0;
    margin-top: .8rem;
    margin-left: .32rem;
    font-size: .24rem;
    color: #fff;
    background-color: #cb4042;
    text-align: center;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
  }
</style>
