<template>
  <div id="shopmanor">
    <div id="title">
      <h2 :class="headObj.class">
        <span class="icon-tit"></span>
        {{headObj.titText}}
      </h2>
      <div class="head-handle">
        <div class="right member-handle" v-on:click="hShow = !hShow">
          <span class="left icon-member"><img src="../assets/icon-title.png" width="32" height="32" alt=""/></span>
          {{name || '无'}}
          <span class="btn-handle"></span>
          <div v-show="hShow" class="handle-con" v-on:click="loginout">
            <span><img src="../assets/icon_logout.png"></span>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <div class="filter">
      <ul class="filter-list">
        <li>
          <label for="filter-phone">手机号</label>
          <input type="text" id="filter-phone" v-model="phone" />
        </li>
        <li>
          <label for="filter-no">订单号</label>
          <input type="text" id="filter-no" v-model="orderNo" />
        </li>
        <li>
          <label for="filter-status">状态</label>
          <select id="filter-status" v-model="status">
            <option value=""></option>
            <option value="1">待付款</option>
            <option value="2">已付款</option>
            <option value="3">已完成</option>
            <option value="11">超时关闭</option>
            <option value="12">取消</option>
            <option value="13">失败</option>
            <option value="14">异常</option>
            <option value="15">已关闭</option>
          </select>
        </li>
        <li>
          <label for="filter-quarter">季度状态</label>
          <select id="filter-quarter" v-model="quarter">
            <option value=""></option>
            <option value="1">收茶</option>
            <option value="2">代销</option>
          </select>
          <select v-if="quarter==1 || quarter==0" class="quarter-status" v-model="quarterStatus">
            <option value=""></option>
            <option value="1">未操作</option>
            <option value="2">已领取</option>
            <option value="3">待发货</option>
            <option value="4">已发货</option>
            <option value="5">已收货</option>
            <option value="6">待付款</option>
            <option value="11">超时</option>
            <option value="12">取消</option>
            <option value="13">失败</option>
            <option value="14">异常</option>
            <option value="15">已关闭</option>
          </select>
          <select v-if="quarter==2" class="quarter-status" v-model="quarterStatus">
            <option value=""></option>
            <option value="2">已代销</option>
            <option value="4">已发放</option>
          </select>
        </li>
      </ul>
      <button class="btn-filter" v-on:click="search"></button>
    </div>
    <ul class="list-head">
      <li><span class="checkbox checked"></span></li>
      <li>产品名称</li>
      <li>单价</li>
      <li>数量</li>
      <li>总金额</li>
      <li>实付金额</li>
      <li>买家</li>
      <li>状态</li>
      <li>操作</li>
    </ul>
    <div class="order-con" v-for="it in list">
      <div class="order-num-time">
        <span class="order-num"><span class="left checkbox"></span>订单号: {{it.orderNumber}}</span>
        <span class="right">下单时间: {{it.createTime}}</span>
      </div>
      <div class="order-info">
        <ul class="info-list">
          <li>
            <img class="left" :src="it.teaManorIndexPicture" width="100" height="70" alt=""/>
            <div class="order-tit">
              <h3>{{it.teaManorName}}</h3>
              <p class="price-remark">总大小: {{it.teaManorSize}} 亩</p>
              <p class="price-remark">备注: {{it.remark || '空'}}</p>
            </div>
          </li>
          <li>&yen; {{it.unitPrice}}</li>
          <li>{{it.quantity}}</li>
          <li>
            <p>&yen; {{it.totalAmount}}</p>
          </li>
          <li>
            <p class="order-price">&yen; {{it.paymentAmount}}</p>
            <p class="price-remark">账户余额付款: {{it.useAccountBalance || '0'}}元</p>
            <p class="price-remark">茶金币: {{it.goldCoin || '0'}}个 &nbsp;抵扣：{{it.goldCoinMoney || '0'}}元</p>
          </li>
          <li>{{it.mobileNumber}}</li>
          <li>
            <span class="pay-pending" v-show="it.status!==1 && it.status!==2 && it.status!==3 && it.status!==11 && it.status!==12 && it.status!==13 && it.status!==14 && it.status!==15">未知</span>
            <span class="pay-pending" v-show="it.status==1">待付款</span>
            <span class="pay-already" v-show="it.status==2">已付款</span>
            <span class="pay-receive" v-show="it.status==3">已完成</span>
            <span class="pay-pending" v-show="it.status==11">超时关闭</span>
            <span class="pay-pending" v-show="it.status==12">取消</span>
            <span class="pay-pending" v-show="it.status==13">失败</span>
            <span class="pay-pending" v-show="it.status==14">异常</span>
            <span class="pay-pending" v-show="it.status==15">已关闭</span>
          </li>
          <li><router-link :to="{'path': '/index/morder/manororderdetail/'+it.id+'/'+it.orderNumber}" tag="span" class="order-scan">查看</router-link></li>
        </ul>
      </div>
    </div>
    <paging v-on:chgPg="changePg" :total="pageObj.total" :curPg="pageObj.curPg"></paging>
  </div>
</template>

<script>
import Paging from './Paging'
export default {
  name: 'app',
  components: {
    Paging
  },
  methods: {
    changePg: function (_val) {
      this.$data.pageObj.curPg = _val
      this.$http.post('/api/teaManor/order/list', {currentPage: _val, pageSize: this.$data.pageObj.pageSize}).then(function (res) {
        if (res.body.code === 0) {
          this.$data.pageObj.curPg = _val
          this.$data.list = res.body.data.results
          this.$data.pageObj.total = res.body.data.totalItem
        } else {
          window.alert(res.body.data.message)
        }
      })
    },
    loginout: function () {
      this.$http.get('/api/user/logout').then(function (res) {
        if (res.body.code === 0) {
          window.location.href = '#/login'
        }
      })
    },
    search: function () {
      this.$http.get('api/teaManor/order/list?mobileNumber=' + this.$data.phone + '&orderNumber=' + this.$data.orderNo + '&status=' + this.$data.status + '&earningsType=' + this.$data.quarter + '&earningsStatus=' + this.$data.quarterStatus + '&pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
        if (res.body.code === 0) {
          this.$data.pageObj.curPg = 1
          this.$data.list = res.body.data.results
          this.$data.pageObj.total = res.body.data.totalItem
        }
      })
    }
  },
  created () {
    this.$http.get('api/teaManor/order/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
      if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.hash = '#/login'
      } else if (res.body.code === 0) {
        this.$data.list = res.body.data.results
        this.$data.pageObj.total = res.body.data.totalItem
      } else {
        window.alert(res.body.message)
      }
    })
    this.$http.get('api/user/info').then(function (res) {
      if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.href = '#/login'
      } else if (res.body.code === 0) {
        this.$data.name = res.body.data.name
      } else {
        window.alert(res.body.message)
      }
    })
  },
  data () {
    return {
      list: [],
      hShow: false,
      phone: '',
      orderNo: '',
      status: '',
      headObj: {
        class: 'shop',
        titText: '庄园订单管理',
        btnText: '发布产品',
        userName: 'Admin'
      },
      pageObj: {
        total: 1, // 设定一个初始值，防止报错
        pageSize: 10,
        curPg: 1
      },
      name: '',
      quarter: '',
      quarterStatus: ''
    }
  }
}
</script>

<style scoped>

  #title {
    position: relative;
  }
  #title h2 {
    height: 60px;
    padding: 20px;
    border-bottom: 1px solid #d6d7d9;
    font-size: 16px;
  }
  #title h2 .icon-tit {
    float: left;
    margin-top: 3px;
    margin-right: 10px;
  }
  .shop .icon-tit {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url('../assets/icon-order2.png') no-repeat;
  }
  .head-handle {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 240px;
  }
  .btn-tit {
    width: 106px;
    height: 35px;
    padding: 9px 5px;
    background-color: #f9f9f8;
    border: 1px solid #c7cacd;
    border-radius: 2px;
  }
  .icon-add {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-left: 2px;
    background: url("../assets/icon-add.png") no-repeat;
  }
  .member-handle {
    padding: 10px 0;
    position:relative;
    cursor:pointer;
  }
  .icon-member {
    margin-top: -8px;
    margin-right: 6px;
  }
  .btn-handle {
    display: inline-block;
    width: 9px;
    height: 6px;
    margin-top: -1px;
    margin-left: 6px;
    background: url("../assets/arrow-down.png") no-repeat;
    cursor: pointer;
  }
  .handle-con {
    width: 110px;
    height: 40px;
    margin-top: 15px;
    position:absolute;
    z-index:1;
    padding:10px 10px 10px 17px;
    border: 1px solid #eee;
    background: #fff;
    cursor:pointer;
  }
  #shopmanor {
    padding: 0 10px;
  }
  .filter {
    position: relative;
    padding: 20px;
    font-size: 12px;
    overflow: hidden;
  }
  .filter-list li {
    float: left;
    margin-bottom: 10px;
    margin-right: 50px;
  }
  .filter-list li label {
    display: inline-block;
    width: 60px;
    margin-right: 10px;
  }
  .filter-list li input,
  .filter-list li select {
    border: 1px solid #cccdd1;
    height: 30px;
    padding: 8px;
    width:200px;
    line-height: 30px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    border-radius: 5px;
  }
  .filter-list li select {
    padding:4px;
    width:200px;
  }
  .filter-list li .quarter-status {
    margin-left:50px;
  }
  .btn-filter {
    position: absolute;
    bottom: 30px;
    right: 130px;
    width: 66px;
    height: 30px;
    background: url("../assets/btn-filter.png") no-repeat;
    outline: none;
    cursor: pointer;
  }
  .list-head {
    background-color: #f6f6f6;
    border: 1px solid #e6e6e6;
    margin-bottom: 8px;
    overflow: hidden;
    text-align: center;
  }
  .list-head li {
    height: 45px;
    float: left;
    padding: 15px 0;
    color: #9b9b9b;
    font-weight: bold;
  }
  .list-head li:first-child {
    max-width: 3%;
    padding: 15px 5px;
  }
  .list-head li:nth-child(2) {
    width: 26%;
    text-align: left;
  }
  .list-head li:nth-child(3) {
    width: 11%;
    text-align: left;
  }
  .list-head li:nth-child(4) {
    width: 5%;
  }
  .list-head li:nth-child(5) {
    width: 10%;
  }
  .list-head li:nth-child(6) {
    width: 17%;
  }
  .list-head li:nth-child(7) {
    width: 8.4%;
  }
  .list-head li:nth-child(8) {
    width: 10%;
  }
  .list-head li:nth-child(9) {
    width: 10%;
  }
  .checkbox {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-top: 1px;
    background-color: transparent;
    border: 1px solid #cfcfcf;
    cursor: pointer;
  }
  .checkbox.checked {
    background-color: #6d8193;
  }
  .order-num-time {
    overflow: hidden;
    height: 40px;
    margin-top: 10px;
    padding: 0 25px 0 5px;
    background-color: #f5f5f5;
    border-top: 1px solid #d6d7d9;
    border-bottom: 1px solid #e6e6e6;
  }
  .order-num-time span {
    font-size: 12px;
    line-height: 40px;
  }
  .order-num {
    display: inline-block;
  }
  .order-num span {
    margin-top: 13px;
    margin-right: 4px;
  }
  .order-info {
    padding: 25px 0;
    overflow: hidden;
  }
  .info-list {
    text-align: center;
  }
  .info-list li {
    float: left;
    font-size: 12px;
  }
  .info-list li:first-child {
    width: 28%;
  }
  .info-list li:nth-child(2) {
    width: 11%;
    text-align: left;
  }
  .info-list li:nth-child(3) {
    width: 5%;
    font-size: 12px;
  }
  .info-list li:nth-child(4) {
    width:10%;
    font-size: 12px;
  }
  .info-list li:nth-child(5) {
    width:17%;
  }
  .info-list li:nth-child(5) p {
    text-align:center;
  }
  .info-list li:nth-child(6) {
    width:8.4%;
  }
  .info-list li:nth-child(7) {
    width:10%;
  }
  .info-list li:nth-child(8) {
    width:10%;
  }
  .info-id {
    margin-top: 26px;
    font-size: 12px;
  }
  .order-tit {
    margin-left: 110px;
  }
  .order-tit h3 {
    margin-bottom: 20px;
    text-align:left;
  }
  .order-remark {
    font-size: 12px;
    color: #9b9b9b;
  }
  .order-price {
    font-size: 14px;
    color: #d0021b;
    font-weight: bold;
  }
  .price-remark {
    margin-top: 8px;
    font-size: 12px;
    color: #9b9b9b;
    text-align:left;
    width: 190px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .pay-pending {
    font-size: 12px;
    color: #ff7e00;
  }
  .pay-already {
    font-size: 12px;
    color: #21a666;
  }
  .pay-success {
    font-size: 12px;
    color: #9b9b9b;
  }
  .order-scan {
    font-size: 12px;
    color: #476d8f;
    cursor: pointer;
  }
</style>
