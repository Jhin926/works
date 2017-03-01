<template>
  <div id="shoporder">
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
            <option value="0"></option>
            <option value="1">待付款</option>
            <option value="2">待发货</option>
            <option value="3">待收货</option>
            <option value="4">已完成</option>
            <option value="5">退款申请中</option>
            <option value="6">已退款</option>
            <option value="7">退款中</option>
            <option value="11">超时</option>
            <option value="12">取消</option>
            <option value="13">失败</option>
            <option value="14">异常</option>
            <option value="15">已关闭</option>
          </select>
        </li>
        <li>
          <label for="filter-type">品类</label>
          <select id="filter-type" v-model="category">
            <option value="0"></option>
            <option v-for="type in list" v-bind:value="type.id">{{type.name}}</option>
          </select>
        </li>
        <li>
          <label for="filter-num">产品编号</label>
          <input type="text" id="filter-num" v-model="productNo" />
        </li>
      </ul>
      <button class="btn-filter" v-on:click="search"></button>
    </div>
    <ul class="list-head">
      <li><span class="checkbox checked"></span></li>
      <!--<li>ID</li>-->
      <li>产品名称</li>
      <li>单价</li>
      <li>数量</li>
      <li>总金额</li>
      <li>实付金额</li>
      <li>买家</li>
      <li>交易状态</li>
      <li>操作</li>
    </ul>
    <div class="order-con" v-for="item in teaList">
      <div class="order-num-time">
        <span class="order-num"><span class="left checkbox"></span>订单号: {{item.orderNumber}}</span>
        <span class="order-money red">&yen; {{item.paymentAmount}}</span>
        <span class="right">下单时间: {{item.createTime}}</span>
      </div>
      <div class="order-info" v-for="items in item.teaOrderDetailListResults">
        <ul class="info-list">
          <li>
            <img class="left" :src="items.indexPicture" width="100" height="70" alt=""/>
            <div class="order-tit">
              <h3>{{items.teaCategoryName}} {{items.starLevel | starToText}} {{items.name}}{{items.weightText}}</h3>
              <p class="order-remark">货号：{{items.artNo || ''}}</p>
              <p class="order-remark">备注: {{item.remark || '无'}}</p>
            </div>
          </li>
          <li>&yen;{{items.unitPrice}}</li>
          <li>{{items.quantity}}</li>
          <li>
            <p>&yen;{{items.totalAmount}}</p>
          </li>
          <li >
            <p class="order-price">&yen;{{items.transactionPrice * items.quantity}}</p>
            <p class="price-remark">账户余额付款：{{item.useAccountBalance || 0}}元</p>
            <p class="price-remark">茶金币：{{item.goldCoinText | cutGoldCoins}} &nbsp;抵扣：{{item.goldCoinText | cutGoldCoin}}</p>
            <p class="price-remark">运费：{{items.freightFee || 0}} 元</p>
          </li>
          <li>{{item.mobileNumber || '空'}}</li>
          <li>
            <span class="pay-pending" v-show="item.status==1">待付款</span>
            <span class="pay-already" v-show="item.status==2">待发货</span>
            <span class="pay-receive" v-show="item.status==3">待收货</span>
            <span class="pay-success" v-show="item.status==4">已完成</span>
            <span class="pay-pending" v-show="item.status==5">退款申请中</span>
            <span class="pay-pending" v-show="item.status==6">已退款</span>
            <span class="pay-pending" v-show="item.status==7">退款中</span>
            <span class="pay-pending" v-show="item.status==11">超时关闭</span>
            <span class="pay-pending" v-show="item.status==12">取消</span>
            <span class="pay-pending" v-show="item.status==13">失败</span>
            <span class="pay-pending" v-show="item.status==14">异常</span>
            <span class="pay-pending" v-show="item.status==15">已关闭</span>
            <p class="btn-send">
              <router-link :to="{'path': '/index/sorder/shoporderdetail/'+item.id+'/'+item.orderNumber}" tag="button" v-show="item.status==2">发货</router-link>
            </p>
          </li>
          <li><router-link :to="{'path': '/index/sorder/shoporderdetail/'+item.id+'/'+item.orderNumber}" tag="span" class="order-scan">查看</router-link></li>
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
  filters: {
    starToText: function (value) {
      if (value === 10) return '庄园直供'
      else {
        var starText = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
        return starText[value - 1]
      }
    },
    cutGoldCoin: function (_val) {
      if (_val) {
        return _val.substr(_val.indexOf('、') + 1)
      } else return '0个'
    },
    cutGoldCoins: function (_val) {
      if (_val) {
        return _val.substr(0, _val.indexOf('、'))
      } else return '0元'
    }
  },
  created () {
    this.$http.get('api/tea/order/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
      if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.hash = '#/login'
      } else if (res.body.code === 0) {
        this.$data.teaList = res.body.data.results
        this.$data.pageObj.total = res.body.data.totalItem
      } else {
        window.alert(res.body.message)
      }
    })
    this.$http.get('api/tea/category/list').then(function (res) {
      if (res.body.code === 0) {
        this.$data.list = res.body.data
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
  methods: {
    search: function () {
      var productNo = 0
      if (this.$data.productNo !== '') {
        productNo = this.$data.productNo
      }
      this.$http.get('api/tea/order/list?mobileNumber=' + this.$data.phone + '&orderNumber=' + this.$data.orderNo + '&status=' + this.$data.status + '&teaId=' + productNo + '&teaCategoryId= ' + this.$data.category + '&pageSize=' + this.$data.pageObj.pageSize + '').then(function (res) {
        if (res.body.code === 300001 || res.body.code === 300002) {
          window.location.hash = '#/login'
        } else if (res.body.code === 0) {
          this.$data.pageObj.curPg = 1
          this.$data.teaList = res.body.data.results
          this.$data.pageObj.total = res.body.data.totalItem
        } else {
          window.alert(res.body.message)
        }
      })
    },
    changePg: function (_val) {
      this.$http.post('/api/tea/order/list', {currentPage: _val, pageSize: this.$data.pageObj.pageSize}).then(function (res) {
        if (res.body.code === 0) {
          this.$data.pageObj.curPg = _val
          this.$data.pageObj.total = res.body.data.totalItem
          this.$data.teaList = res.body.data.results
        } else {
          window.alert(res.body.data.message)
        }
      })
    },
    loginout: function () {
      this.$http.get('api/user/logout').then(function (res) {
        if (res.body.code === 0) {
          window.location.href = '#/login'
        } else {
          window.alert(res.body.message)
        }
      })
    }
  },
  data () {
    return {
      teaList: [],
      list: [],
      hShow: false,
      headObj: {
        class: 'shop',
        titText: '商城订单管理'
      },
      phone: '',
      orderNo: '',
      status: 0,
      category: 0,
      productNo: '',
      pageObj: {
        total: 1, // 设定一个初始值，防止报错
        pageSize: 10,
        curPg: 1
      },
      name: ''
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
    z-index:1;
    position:absolute;
    padding:10px 10px 10px 17px;
    cursor:pointer;
    border: 1px solid #eee;
    background: #fff;
  }
  #shoporder {
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
  .filter-list li select,
  .filter-list li input {
    border: 1px solid #cccdd1;
    height: 30px;
    padding: 8px;
    line-height: 30px;
    width:200px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    border-radius: 5px;
  }
  .filter-list li select {
    width:200px;
    height:30px;
    padding:4px;
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
    width: 28%;
    text-align: left;
  }
  .list-head li:nth-child(3) {
    width: 8%;
    padding-left:10px;
    text-align: left;
  }
  .list-head li:nth-child(4) {
    width: 5%;
  }
  .list-head li:nth-child(5) {
    width: 10%;
  }
  .list-head li:nth-child(6) {
    width: 18%;
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
    width:554px;
  }
  .order-money {
    width:200px;
    display:inline-block;
    text-align:center;
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
    font-size: 14px;
  }
  .info-list li:first-child {
    width: 30%;
  }
  .info-list li:nth-child(2) {
    width: 8%;
    padding-left:10px;
    text-align: left;
  }
  .info-list li:nth-child(3) {
    width: 5%;
    font-size: 14px;
  }
  .info-list li:nth-child(4) {
    width:10%;
    font-size: 14px;
  }
  .info-list li:nth-child(5) {
    width:18%;
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
    margin-bottom: 4px;
    max-height:32px;
    overflow:hidden;
    text-align:left;
  }
  .order-remark {
    font-size: 12px;
    color: #9b9b9b;
    margin:6px 0;
    width: 210px;
    text-align:left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  }
  .pay-pending {
    color: #ff7e00;
  }
  .pay-already {
    color: #21a666;
  }
  .pay-receive {
  }
  .pay-success {
    color: #9b9b9b;
  }
  .btn-send {
    margin-top: 15px;
    text-align: center;
  }
  .btn-send button {
    padding: 0 8px;
    height: 24px;
    text-align: center;
    background-color: #476d8f;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    outline: none;
  }
  .order-scan {
    font-size: 12px;
    color: #476d8f;
    cursor: pointer;
  }
  .red {
    color:#D0021B;
    font-weight:bold;
  }
</style>
