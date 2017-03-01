<template>
  <div id="">
    <ul class="order-tab">
      <ul class="order-tab">
        <li v-for="(type, index) in typeList" :class="{active: isFoc==index}" v-on:click="tab(type, index)">{{type.name}}</li>
      </ul>
    </ul>
    <div class="order-list">
      <div class="list-none" v-show="filterList.length === 0">
        <p class="none-img"><img width="100%" src="./assets/icon_empty_scorder.png" /></p>
        <p class="none-text">您还没有相关订单</p>
        <router-link tag="p" class="none-btn" to="/manorDetail/0">承包庄园</router-link>
      </div>
      <router-link tag="section" :to="{'path': '/morderdetail/'+info.id}" class="order-info" v-for="info in filterList">
        <p class="order-num">订单号: {{info.orderNumber}}</p>
        <span class="order-status">{{info.status | stauToText}}</span>
        <div class="shopping-list">
          <div class="shopping-info">
            <p class="left shopping-img"><img :src="info.indexPicture" width="100%" height="100%" /></p>
            <div class="shopping-text">
              <h2 class="shopping-tit">{{info.teaManorName}}</h2>
              <div class="shopping-price">
                <span class="new-cost">&yen;{{info.paymentAmount}}</span>
              </div>
              <span class="shopping-num">x{{info.quantity}}</span>
            </div>
          </div>
        </div>
        <div class="order-handle">
          <button class="left btn btn-bad" v-on:click.stop="delId=info.id;showCfm=true;" v-if="info.status == 1 || info.status == 11 || info.status == 12 || info.status == 13 || info.status == 15">删除</button>
          <button class="right btn btn-good" v-on:click.stop="pay(info.id)" v-if="info.status == 1">付款</button>
          <router-link tag="button" :to="{'path': '/assets/manor/'+info.id+'/'+info.teaManorId}" class="right btn btn-good" v-if="info.status == 2">查看庄园</router-link>
        </div>
      </router-link>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <confirm v-show="showCfm">
      <h2 class="confirm-head" slot="head">提示</h2>
      <div slot="content">是否删除订单？</div>
      <p slot="cancel" @click="showCfm = false">取消</p>
      <p @click="del" slot="sure">删除</p>
    </confirm>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
export default {
  name: 'manororder',
  methods: {
    tab: function (_type, _index) {
      this.$data.isFoc = _index
      this.$http({
        method: 'get',
        url: '/api/tea/manor/order/list?status=' + _type.status + '&pageSize=200&currentPage=1',
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.isLoading = false
        if (res.body.code === 0) {
          this.$data.filterList = res.body.data.results
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    pay: function (_id) {
      /* this.$http.post('/api/tea/manor/order/pay', {id: _id}).then(function (res) {
        if (res.body.code === 0) {
        }
      }) */
      window.location.href = '/?#/morderdetail/' + _id
    },
    del: function () {
      this.$http({
        method: 'post',
        url: '/api/tea/manor/order/delete',
        body: {id: this.$data.delId},
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.showCfm = false
        this.$data.isLoading = false
        if (res.body.code === 0) {
          const list = this.$data.filterList
          for (var i = 0; i < list.length; i++) {
            if (list[i].id === this.$data.delId) {
              this.$data.filterList.splice(i, 1)
            }
          }
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    }
  },
  created () {
    document.title = '庄园订单'
    this.$http.get('/api/tea/manor/order/list?status=0&pageSize=200&currentPage=1').then(function (res) {
      this.$data.isLoading = false
      if (res.body.code === 0) {
        if (res.body.data.results.length > 0) { // 有多条数据
          this.$data.filterList = res.body.data.results
        }
      } else if (res.body.code === 300002 || res.body.code === 300001) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
  },
  filters: {
    stauToText: function (value) {
      if (value === 1) return '待付款'
      else if (value === 2) return '已付款'
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
      filterList: [],
      typeList: [{name: '全部', status: 0}, {name: '待付款', status: 1}, {name: '已付款', status: 2}, {name: '已完成', status: 3}],
      isFoc: 0,
      isLoading: true,
      showCfm: false,
      delId: '',
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>

<style scoped>
  .order-tab {
    background-color: #fff;
    display: box;
    display: -webkit-box;
    display: -moz-box;
    width: 100%;
    height: .8rem;
    border-bottom: 0.01rem solid #dedede;
  }
  .order-tab li {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    box-flex: 1;
    height: 100%;
    padding: .25rem 0;
    font-size: .24rem;
    text-align: center;
    color: #9b9b9b;
  }
  .order-tab li.active {
    color: #cb4042;
    border-bottom: 1px solid #cb4042;
  }
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
    font-size: .24rem;
    color: #cb4042;
  }
  .shopping-list {
    margin-left: .2rem;
    padding-bottom: .2rem;
  }
  .shopping-info {
    position: relative;
    margin-top: .2rem;
    overflow: hidden;
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
  .shopping-price {
    position: absolute;
    bottom: 0;
    margin-top: .22rem;
  }
  .shopping-price span,
  .shopping-price del {
    font-size: .24rem;
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
  .order-handle {
    overflow: hidden;
    padding: .1rem 0;
    border-top: .02rem solid #dedede;
  }
  .btn {
    width: .96rem;
    height: .4rem;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
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
