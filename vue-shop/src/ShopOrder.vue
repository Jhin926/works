<template>
  <div id="">
    <ul class="order-tab">
      <li v-for="(type, index) in typeList" :class="{active: isFoc==index}" v-on:click="tab(type, index)">{{type.name}}</li>
    </ul>
    <div class="order-list">
      <orderInfo v-on:del="delOrder" v-on:cal="calOrder" v-on:sure="sureOrder" :list="filterList"></orderInfo>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <confirm v-show="showCfm1">
      <h2 class="confirm-head" slot="head">提示</h2>
      <div slot="content">是否删除订单？</div>
      <p slot="cancel" @click="showCfm1 = false">否</p>
      <p @click="del" slot="sure">删除</p>
    </confirm>
    <confirm v-show="showCfm2">
      <h2 class="confirm-head" slot="head">提示</h2>
      <div slot="content">是否取消订单？</div>
      <p slot="cancel" @click="showCfm2 = false">否</p>
      <p @click="cal" slot="sure">是</p>
    </confirm>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
import OrderInfo from './components/OrderInfo'

export default {
  name: 'shoporder',
  components: {
    OrderInfo
  },
  methods: {
    tab: function (_type, _index) {
      this.$data.isFoc = _index
      this.$data.isLoading = true
      this.$http.get('/api/order/tea/list?status=' + _type.status + '&pageSize=200&currentPage=1').then(function (res) {
        this.$data.isLoading = false
        if (res.body.code === 0) {
          this.$data.filterList = res.body.data.results
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    del: function () {
      this.$http({
        method: 'post',
        url: '/api/order/tea/delete',
        body: {id: this.$data.delId},
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.isLoading = false
        this.$data.showCfm1 = false
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
    },
    delOrder: function (_id) {
      this.$data.delId = _id
      this.$data.showCfm1 = true
    },
    cal: function () {
      this.$http({
        method: 'post',
        url: '/api/order/tea/cancel',
        body: {id: this.$data.calId},
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.isLoading = false
        this.$data.showCfm2 = false
        if (res.body.code === 0) {
          const filterList = this.$data.filterList
          for (var i = 0; i < filterList.length; i++) {
            if (filterList[i].id === this.$data.calId) {
              filterList[i].status = 12
            }
          }
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    calOrder: function (_id) {
      this.$data.calId = _id
      this.$data.showCfm2 = true
    },
    sureOrder: function (_id) {
      const cf = window.confirm('是否确认收货')
      if (cf === true) {
        this.$http({
          method: 'post',
          url: '/api/order/tea/receipt/confirm',
          body: {id: _id},
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            const filterList = this.$data.filterList
            for (var i = 0; i < filterList.length; i++) {
              if (filterList[i].id === _id) {
                filterList[i].status = 4
              }
            }
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    }
  },
  created () {
    document.title = '商城订单'
    this.$http.get('/api/order/tea/list?status=0&pageSize=200&currentPage=1').then(function (res) {
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
  data () {
    return {
      filterList: [],
      typeList: [{name: '全部', status: 0}, {name: '待付款', status: 1}, {name: '待发货', status: 2}, {name: '待收货', status: 3}, {name: '已完成', status: 4}],
      isFoc: 0,
      isLoading: true,
      showCfm1: false,
      showCfm2: false,
      calId: '',
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
</style>
