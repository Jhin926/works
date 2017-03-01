<template>
  <div id="shoporderdetail">
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
    <div class="detail-top">
    <div class="detail-path">
      <router-link to="../../../sorder">商城订单管理</router-link> >
      <span>{{orderNo}}</span>
    </div>
    <div class="order-title">
      <div class="left">
        <div class="left">
         <img src="../assets/icon_order_state.png">
        </div>
        <div class="right">
          <p>
            <b>
              <span>订单状态：</span>
              <span class="status" v-show="info.status==1">待付款</span>
              <span class="status green" v-show="info.status==2">待发货</span>
              <span class="status green" v-show="info.status==3">待收货</span>
              <span class="status grey" v-show="info.status==4">已完成</span>
              <span class="status" v-show="info.status==5">退款申请中</span>
              <span class="status grey" v-show="info.status==6">已退款</span>
              <span class="status green" v-show="info.status==7">退款中</span>
              <span class="status" v-show="info.status==11">超时关闭</span>
              <span class="status" v-show="info.status==12">已取消</span>
              <span class="status" v-show="info.status==13">失败</span>
              <span class="status" v-show="info.status==14">异常</span>
              <span class="status" v-show="info.status==15">已关闭</span>
            </b>
          </p>
          <p>
            <span>订单号：</span>
            <span>{{info.orderNumber}}</span>
            <span>&nbsp;&nbsp;&nbsp;下单时间：</span>
            <span>{{info.createTime}}</span>
          </p>
        </div>
      </div>
      <div class="right title-right">
        <p><b>买家信息</b></p>
        <p><img src="../assets/icon_phone.png">&nbsp;{{info.mobileNumber}}</p>
      </div>
      <div class="clear"></div>
    </div>
    <div class="info">
      <div class="info-cont">
        <div class="info-item">
          <div class="item"><b>付款信息</b></div>
          <div class="item">
            <p>支付方式：</p>
            <p>商品总额：</p>
            <p>茶金币抵扣：</p>
            <p>运费：</p>
            <p>付款时间：</p>
            <p>应付金额：</p>
            <p>账户余额：</p>
          </div>
          <div class="item">
            <p>微信支付</p>
            <p>&yen; {{info.totalAmount || 0}}</p>
            <p>-&yen; {{info.goldCoin || 0}}</p>
            <p>&yen; {{info.freightFee || 0}}</p>
            <p>{{info.paymentTime || '空'}}</p>
            <p class="red">&yen; {{info.paymentAmount || '0'}}</p>
            <p>&yen;{{info.useAccountBalance || 0}}</p>
          </div>
        </div>
        <div class="info-item">
          <div class="item"><b>收货地址</b></div>
          <div class="item">
            <p>收货人：</p>
            <p>手机号：</p>
            <p>收货地址：</p>
            <p>发货时间：</p>
            <p>收货时间：</p>
            <p>备注：</p>
          </div>
          <div class="item">
            <p>{{info.receiver || '空'}}</p>
            <p>{{info.mobileNumber || '空'}}</p>
            <p>{{info.receiverAddress || '空'}}</p>
            <p>{{info.deliveryTime || '空'}}</p>
            <p>{{info.receiveTime || '空'}}</p>
            <p>{{info.remark || '空'}}</p>
          </div>
        </div>
        <div class="info-item">
          <div class="item"><b>发票信息</b></div>
          <div class="item">
            <p>发票状态：</p>
            <p>发票类型：</p>
            <p>发票抬头：</p>
            <p>备注：</p>
            <p class="invoice" v-if="info.invoiceResult != null && info.invoiceResult.status == 1" v-on:click="isSwitch = !isSwitch">已开发票</p>
          </div>
          <div class="item">
            <p>{{info.invoiceResult | filterRes}}</p>
            <p>{{info.invoiceResult | filterType}}</p>
            <p>{{info.invoiceResult | filterTitle}}</p>
            <p>{{info.invoiceResult | filterRemark}}</p>
          </div>
        </div>
        <div class="info-item">
          <div class="item"><b>退款信息</b></div>
          <div class="item">
            <p>余额退款：</p>
            <p>金币退款：</p>
            <p>微信退款：</p>
            <p>退款状态：</p>
            <p>申请时间：</p>
            <p>退款时间：</p>
            <p>退款理由：</p>
            <p>退款编号：</p>
            <p>备注：</p>
          </div>
          <div class="item">
            <p>&yen; {{info.refundAccountBalance || '0'}}</p>
            <p>&yen; {{info.refundGoldCoin || '0'}}</p>
            <p>&yen; {{info.refundFeeActual || '0'}}</p>
            <p v-show="info.status==5">退款中</p>
            <p v-show="info.status==6">已退款</p>
            <p v-show="info.status !==6 && info.status !==5">空</p>
            <p>{{info.refundApplyTime || '空'}}</p>
            <p>{{info.refundFinishTime || '空'}}</p>
            <p>{{info.refundReason || '空'}}</p>
            <p>{{info.refundNumber || '空'}}</p>
            <p>{{info.refundRemark || '空'}}</p>
          </div>
        </div>
        <div class="clear"></div>
      </div>
      <div class="product-title">
        商品信息
      </div>
      <table cellpadding="0" cellspacing="0">
        <thead>
         <tr>
           <td>ID</td>
           <td>产品名称</td>
           <td>单价</td>
           <td>成交价</td>
           <td>数量</td>
           <td>总计</td>
         </tr>
        </thead>
        <tbody>
         <tr v-for="item in info.teaOrderDetailListResults">
           <td>{{item.teaId}}</td>
           <td>
             <span>
               <img :src="item.indexPicture" width="100" height="70">
             </span>
             <span>
               <p>{{item.teaCategoryName}} {{item.starLevel | starToText}} {{item.name}} {{item.weightText}}</p>
               <p class="proNo">货号：{{item.artNo || ''}}</p>
             </span>
           </td>
           <td>&yen; {{item.unitPrice}}</td>
           <td>&yen; {{item.transactionPrice}}</td>
           <td>{{item.quantity}}</td>
           <td class="red">&yen; {{item.transactionPrice * item.quantity}}</td>
         </tr>
        </tbody>
      </table>
    </div>
    </div>
    <div class="goods-info" v-if="info.status==2">
      <div class="goods-info-title">
        填写发货信息
      </div>
      <div class="goods-info-item item-first">
        <div class="left">
          <span>收货人：</span>
          <input type="text" v-model="info.receiver" readOnly="true">
        </div>
        <div class="left">
          <span>物流公司：</span>
          <input id="companyName" type="text" v-model="company" placeholder="请输入物流公司名称" v-focus>
        </div>
      </div>
      <div class="goods-info-item">
        <div class="left">
          <span>手机号：</span>
          <input type="text" v-model="info.mobileNumber" readOnly="true">
        </div>
        <div class="left">
          <span>物流单号：</span>
          <input type="text" v-model="singleNo" placeholder="请输入物流单号">
        </div>
      </div>
      <div class="goods-info-item">
        <div class="left">
          <span>收货地址：</span>
          <input type="text" v-model="info.receiverAddress" readonly="true">
        </div>
      </div>
      <div class="clear"></div>
      <div class="goods-info-item">
        <button v-on:click="deliver(info)">发货</button>
      </div>
    </div>
    <div class="goods-info" v-if="info.status==3 || info.status==4">
      <div class="goods-info-title">
        发货信息
      </div>
      <div class="goods-info-item item-first">
        <div class="left">
          <span>收货人：</span>
          <span>{{info.receiver || '空'}}</span>
        </div>
        <div class="left">
          <span>物流公司：</span>
          <span>{{info.expressCompany || '空'}}</span>
        </div>
      </div>
      <div class="goods-info-item">
        <div class="left">
          <span>手机号：</span>
          <span>{{info.receiverPhone || '空'}}</span>
        </div>
        <div class="left">
          <span>物流单号：</span>
          <span>{{info.expressNumber || '空'}}</span>
        </div>
      </div>
      <div class="goods-info-item">
        <div class="left goods-address">
          <span>收货地址：</span>
          <span class="receive-address">{{info.receiverAddress || '空'}}</span>
        </div>
      </div>
      <div class="clear"></div>
      <div class="goods-info-item" v-if="info.status==3">
        <button class="goods-info-search">物流查询</button>
      </div>
    </div>
    <div class="goods-info" v-if="info.status==5">
      <div class="goods-info-title">
        退款记录
      </div>
      <div class="goods-info-item item-first">
        <div class="left-time left">
          {{info.refundApplyTime}}
        </div>
        <div class="left-info left">
          <p><b>买家</b> - 申请退款</p>
          <p>
            <span>账户余额：</span>
            <span>&yen; {{info.useAccountBalance || 0}}</span>
          </p>
          <p>
            <span>茶金币：</span>
            <span>&yen; {{info.goldCoin || 0}}</span>
          </p>
          <p>
            <span>退款金额：</span>
            <span>&yen; {{info.paymentAmount || 0}}</span>
          </p>
          <p>
            <span>退款理由：</span>
            <span>{{info.refundReason || '空'}}</span>
          </p>
          <p>
            <span>退款编号：</span>
            <span>{{info.refundNumber || '空'}}</span>
          </p>
          <p>
            <span>备注：</span>
            <span>{{info.refundRemark || '空'}}</span>
          </p>
        </div>
      </div>
      <div class="clear"></div>
      <div class="goods-info-title">
        填写退款金额
      </div>
      <div class="goods-info-item item-second">
        <span>微信退款</span>
        <input type="text" v-model="paymentAmount">&nbsp;&nbsp;元
      </div>
      <div class="goods-info-item item-second">
        <span>余额退款</span>
        <input type="text" v-model="useAccountBalance">&nbsp;&nbsp;元
      </div>
      <div class="goods-info-item item-second">
        <span>金币退款</span>
        <input type="text" v-model="goldCoin">&nbsp;&nbsp;个
      </div>
      <div class="clear"></div>
      <div class="goods-info-item item-second">
        <button class="goods-info-refundFee" v-on:click="refund">同意退款</button>
      </div>
    </div>
    <div class="goods-info" v-if="info.status==6 || info.status==7">
      <div class="goods-info-title">
        退款记录
      </div>
      <div class="goods-info-item item-first">
        <div>
          <div class="left-time left">
            {{info.refundApplyTime}}
             <span class="right"></span>
          </div>
          <div class="left-info left">
            <p><b>买家</b> - 申请退款</p>
            <p>
              <span>微信退款：</span>
              <span>&yen; {{info.paymentAmount || 0}}</span>
            </p>
            <p>
              <span>余额退款：</span>
              <span>&yen; {{info.AccountBalance || 0}}</span>
            </p>
            <p>
              <span>金币退款：</span>
              <span>&yen; {{info.goldCoin || 0}}</span>
            </p>
            <p>
              <span>退款理由：</span>
              <span>{{info.refundReason || '空'}}</span>
            </p>
            <p>
              <span>退款编号：</span>
              <span>{{info.refundNumber || '空'}}</span>
            </p>
            <p>
              <span>备注：</span>
              <span>{{info.refundReason || '空'}}</span>
            </p>
            <p class="line"></p>
          </div>
          <div class="clear"></div>
        </div>
        <div>
          <div class="left-time left">
            {{info.refundApprovalTime}}
            <span class="right"></span>
          </div>
          <div class="left-info left">
            <p><b>商家</b> - 退款中</p>
            <p>
              <span>微信退款：</span>
              <span>&yen; {{info.refundFeeActual || 0}}</span>
            </p>
            <p>
              <span>余额退款：</span>
              <span>&yen; {{info.refundAccountBalance || 0}}</span>
            </p>
            <p>
              <span>金币退款：</span>
              <span>&yen; {{info.refundGoldCoin || 0}}</span>
            </p>
            <p>
              <span>状态：</span>
              <span class="green">退款中</span>
            </p>
            <p class="line mid-line"v-if="info.status==6"></p>
          </div>
          <div class="clear"></div>
        </div>
        <div v-if="info.status==6">
          <div class="left-time left">
            {{info.refundFinishTime}}
            <span class="right"></span>
          </div>
          <div class="left-info left">
            <p><b>商家</b> - 已退款</p>
            <p>
              <span>微信退款：</span>
              <span>&yen; {{info.refundFeeActual || 0}}</span>
            </p>
            <p>
              <span>余额退款：</span>
              <span>&yen; {{info.refundAccountBalance || 0}}</span>
            </p>
            <p>
              <span>金币退款：</span>
              <span>&yen; {{info.refundGoldCoin || 0}}</span>
            </p>
            <p>
              <span>状态：</span>
              <span class="green">已退款</span>
            </p>
          </div>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <div class="remark-model" v-show="isSwitch">
      <div class="remark-win">
        <p>是否要开发票</p>
        <p>
          <span v-on:click="isSwitch = !isSwitch">取消</span>
          <span v-on:click="submit">确定</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'shoporderdetail',
      created () {
        this.$http.get('/api/user/info').then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.href = '#/login'
          } else if (res.body.code === 0) {
            this.$data.name = res.body.data.name
          } else {
            window.alert(res.body.message)
          }
        })
        const Id = this.$route.params.id
        this.$http.get('api/tea/order/info?id=' + Id).then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.hash = '#/login'
          } else if (res.body.code === 0) {
            this.$data.info = res.body.data
            this.$data.paymentAmount = this.$data.info.paymentAmount
            this.$data.useAccountBalance = this.$data.info.useAccountBalance
            this.$data.goldCoin = this.$data.info.goldCoin
          } else {
            window.alert(res.body.message)
          }
        })
      },
      directives: {
        focus: {
          inserted: function (el) {
            el.focus()
          }
        }
      },
      methods: {
        loginout: function () {
          this.$http.get('api/user/logout').then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '/#/login'
            } else {
              window.alert(res.body.message)
            }
          })
        },
        submit: function () {
          this.$http.get('api/tea/order/invoice?bizId=' + this.$data.teaid + '&bizType=1').then(function (res) {
            if (res.body.code === 0) {
              window.location.reload()
            } else {
              window.alert(res.body.message)
            }
          })
        },
        deliver: function (info) {
          if (this.$data.company !== '' && this.$data.singleNo !== '') {
            this.$data.receiver = info.receiver
            this.$data.phone = info.mobileNumber
            this.$data.address = info.receiverAddress
            this.$http.get('api/tea/order/shipments?id=' + this.$data.teaid + '&receiver=' + this.$data.receiver + '&receiverPhone=' + this.$data.phone + '&receiverAddress=' + this.$data.address + '&expressCompany=' + this.$data.company + '&expressNumber=' + this.$data.singleNo + '').then(function (res) {
              if (res.body.code === 0) {
                window.location.reload()
              } else {
                window.alert(res.body.message)
              }
            })
          }
        },
        refund: function () {
          if (this.$data.info.refundFee >= 0 && this.$data.info.refundFee !== '' || this.$data.info.useAccountBalance >= 0 && this.$data.info.useAccountBalance !== '' || this.$data.info.goldCoin >= 0 && this.$data.info.goldCoin !== '') {
            this.$http.get('api/tea/order/refund?id=' + this.$data.teaid + '&refundFeeActual=' + this.$data.paymentAmount + '&refundAccountBalance=' + this.$data.useAccountBalance + '&refundGoldCoin=' + this.$data.goldCoin + '').then(function (res) {
              if (res.body.code === 0) {
                window.location.reload()
              } else {
                window.alert(res.body.message)
              }
            })
          }
        }
      },
      filters: {
        starToText: function (value) {
          if (value === 10) return '庄园直供'
          else {
            var starText = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
            return starText[value - 1]
          }
        },
        filterRes: function (_val) {
          if (_val) {
            if (_val.status === 1) return '待开发票'
            else if (_val.status === 2) return '已开'
            else if (_val.status === 3) return '已寄出'
            else if (_val.status === 4) return '已收'
            else return '未知'
          } else return '空'
        },
        filterType: function (_type) {
          if (_type) {
            if (_type.invoiceType === 1) return '个人'
            else if (_type.invoiceType === 2) return '公司'
            else return '未知'
          } else return '空'
        },
        filterRemark: function (_remark) {
          if (_remark) {
            if (_remark.remark) return _remark.remark
            else return '空'
          } else return '空'
        },
        filterTitle: function (_title) {
          if (_title) {
            if (_title.invoiceTitle) return _title.invoiceTitle
            else return '空'
          } else return '空'
        }
      },
      data () {
        return {
          headObj: {
            class: 'shop',
            titText: '商城订单详情'
          },
          hShow: false,
          name: '',
          info: {},
          isSwitch: false,
          teaid: this.$route.params.id,
          orderNo: this.$route.params.no,
          receiver: '',
          company: '',
          phone: '',
          singleNo: '',
          address: '',
          refundFee: '',
          fs: true,
          paymentAmount: '',
          useAccountBalance: '',
          goldCoin: ''
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
    padding:10px 10px 10px 17px;;
    position:absolute;
    border: 1px solid #eee;
    background: #fff;
    cursor:pointer;
  }
  .detail-top {
    box-shadow: 0px 3px 4px 1px #CDD1D4;
    padding:0 10px;
  }
  .detail-path {
    line-height:50px;
  }
  .detail-path span {
    color:#9b9b9b;
  }
  .order-title {
    width:100%;
    height:80px;
    border:1px solid #F7D4BF;
  }
  .order-title p {
    line-height:28px;
  }
  .order-title .left {
    width:80%;
    height:100%;
    padding:20px;
    background:#FCF8F4;
    border-right:1px solid #F7D4BF;
  }
  .order-title .right {
    width:20%;
    padding:10px;
  }
  .order-title .title-right {
    background:#FAF2EA;
  }
  .order-title .left .left {
    padding:0;
    width:10%;
    border:none;
  }
  .order-title .left .right {
    width:89%;
    padding:0;
    margin-top:-6px;
  }
  .order-title .left .right p {
    line-height:27px;
  }
  .status {
    font-size:20px;
    color:#FF7E00;
  }
  .info {
    padding:10px 0;
  }
  .info .info-cont {
    height:460px;
  }
  .info-item {
    width:530px;
    height:200px;
    float:left;
    padding:20px 0 20px 20px;
    border:1px solid #ededed;
  }
  .info .info-item:nth-child(1),
  .info .info-item:nth-child(3){
    margin-right:10px;
  }
  .info .info-item:nth-child(3),
  .info .info-item:nth-child(4){
    margin-top:10px;
    height:250px;
  }
  .info .info-item:nth-child(3) {
    position:relative;
  }
  .info .info-item:nth-child(3) .invoice {
    width:86px;
    height:24px;
    border:1px solid #A1A1A1;
    text-align:center;
    position:absolute;
    right:10px;
    bottom:10px;
    cursor:pointer;
    border-radius:3px;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    -ms-border-radius:3px;
  }
  .info-item .item {
    float:left;
    height:100%;
  }
  .info-item .item p {
    width:338px;
    white-space:nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
  .info-item .item p {
    line-height:24px;
  }
  .info-item .item:nth-child(1){
    width:15%;
    padding:4px 0;
  }
  .info-item .item:nth-child(2){
    width:18%;
  }
  .product-title {
    width:100%;
    height:50px;
    line-height:50px;
    font-size:18px;
    border-bottom:1px solid #e6e6e6;
  }
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse:collapse;
    text-align: center;
    border:1px solid #ededed;
  }
  table tr td {
    text-align:left;
  }
  table thead tr {
    background:#F6F6F6;
  }
  table thead tr td {
    height:45px;
    padding:10px 10px 10px 20px;
    font-weight:bold;
    color:#9b9b9b;
  }
  table thead tr td {
    border-bottom:1px solid #ededed;
  }
  table tbody tr td {
    height:120px;
    padding:10px 10px 10px 20px;
    border-bottom:1px solid #ededed;
  }
  table tbody tr td:nth-child(6){
    border-left:1px solid #ededed;
  }
  table thead tr td:first-child{
    width:8%;
  }
  table thead tr td:nth-child(2){
    width:38%;
  }
  table tbody tr td:nth-child(2) span{
    display:inline-block;
    vertical-align:top;
    line-height:20px;
  }
  table tbody tr td:nth-child(2) span:nth-child(1){
    width:100px;
    height:70px;
  }
  table tbody tr td:nth-child(2) span:nth-child(2){
    width:235px;
    word-break: break-all;
  }
  table tbody tr td:nth-child(2) span:nth-child(2) p {
    max-height:32px;
    overflow:hidden;
  }
  table tbody tr td:nth-child(2) span:nth-child(2) p.proNo {
    margin-top:20px;
  }
  table thead tr td:nth-child(3),
  table thead tr td:nth-child(4),
  table thead tr td:nth-child(5),
  table thead tr td:nth-child(6){
    width:14%;
  }
  .remark-win {
    width:300px;
    height:151px;
    border-radius:8px;
    border:1px solid #ededed;
    position:absolute;
    background:#fff;
    left:0;
    top:0;
    right:0;
    bottom:0;
    margin:auto;
  }
  .remark-model{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
  }
  .remark-win p {
    height:50%;
  }
  .remark-win p:first-child{
    border-bottom:1px solid #ddd;
    text-align:center;
    height:100px;
    line-height:100px;
  }
  .remark-win p span {
    display:inline-block;
    width:49%;
    text-align:center;
    line-height:50px;
    cursor:pointer;
  }
  .remark-win p span:nth-child(1) {
    border-right:1px solid #ddd;
  }
  .goods-info {
    width:100%;
    min-height:190px;
    padding:10px;
    margin-top:25px;
    box-shadow: 0px 2px 4px 1px #CDD1D4;
  }
  .goods-info .goods-info-title {
    width:100%;
    height:40px;
    font-size:18px;
    padding:10px;
    border-bottom:1px solid #E6E6E6;
  }
  .goods-info .item-first {
    margin-top:5px;
  }
  .goods-info .item-second {
    margin:16px;
  }
  .goods-info .goods-info-item .left{
    width:50%;
    padding:10px;
  }
  .goods-info .goods-info-item .goods-address {
    width:100%;
  }
  .goods-info .goods-info-item .left-time {
    width:16%;
    color:#9b9b9b;
    padding:15px;
  }
  .goods-info .goods-info-item .left-time span {
    width:12px;
    height:12px;
    border-radius:50%;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    background:#ccc;
  }
  .goods-info .goods-info-item .left-info {
    width:84%;
    position:relative;
  }
  .goods-info .goods-info-item .left-info p {
    line-height:24px;
  }
  .goods-info .goods-info-item .left-info .line {
    width: 1px;
    height: 191px;
    border: 1px solid #DEDEDE;
    position: absolute;
    left: -22px;
    top: 26px;
  }
  .goods-info .goods-info-item .left-info .mid-line {
    height:143px;
  }
  .goods-info .goods-info-item .left-info p span {
    width:90px;
  }
  .goods-info .goods-info-item .left-info p:nth-child(1) {
    height:30px;
    border-bottom:1px solid #E6E6E6;
  }
  .goods-info .goods-info-item .left-info p:nth-child(2) {
    margin-top:8px;
  }
  .goods-info .goods-info-item span {
    display:inline-block;
    width:80px;
  }
  .goods-info .goods-info-item span:nth-child(2) {
    width:430px;
    vertical-align:top;
  }
  .goods-info .goods-info-item p span:nth-child(2) {
    width:300px;
  }
  .goods-info .goods-info-item input {
    width:320px;
    height:32px;
    padding:0 10px;
    border-radius:4px;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
    border:1px solid #ddd;
  }
  .goods-info .item-second input {
    width:220px;
  }
  .goods-info-item .goods-info-search {
    float:right;
    margin: -34px 455px 0 0;
    height:30px;
  }
  .goods-info-item .goods-info-refundFee {
    margin:0 0 0 85px;
    width:96px;
  }
  .goods-info-item button {
    width:70px;
    height:36px;
    background:#476d8f;
    color:#fff;
    margin:10px 0 0 97px;
    border-radius:4px;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
  }
  .red {
    color:#D0021B;
    font-weight:bold;
  }
  .green {
    color:#21A666;
  }
  .grey {
    color:#9b9b9b;
  }
  a.router-link-active {
    color:#476d8f;
  }
</style>
