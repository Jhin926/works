<template>
  <div id="manororderdetail">
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
    <div class="detail-path">
      <router-link to="../../../morder">庄园订单管理</router-link> >
      <span>{{orderNo}}</span>
    </div>
    <div class="detail-top">
      <div class="order-title">
        <div class="left">
          <div class="left">
            <img src="../assets/icon_order_state.png">
          </div>
          <div class="right">
            <p>
              <span>订单状态：</span>
              <b>
                <span class="status" v-show="info.status==1">待付款</span>
                <span class="status" v-show="info.status==2">已付款</span>
                <span class="status" v-show="info.status==3">已完成</span>
                <span class="status" v-show="info.status==11">超时关闭</span>
                <span class="status" v-show="info.status==12">已取消</span>
                <span class="status" v-show="info.status==13">失败</span>
                <span class="status" v-show="info.status==14">异常</span>
                <span class="status" v-show="info.status==15">已关闭</span>
              </b>
            </p>
            <p>
              <span>订单号：</span>
              <span>{{info.orderNumber || '空'}}</span>
              <span>&nbsp;&nbsp;&nbsp;下单时间：</span>
              <span>{{info.createTime || '空'}}</span>
            </p>
          </div>
        </div>
        <div class="right title-right">
          <p><b>买家信息</b></p>
          <p><img src="../assets/icon_phone.png">&nbsp;{{info.mobileNumber || '空'}}</p>
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
              <p>应付金额：</p>
              <p>账户余额：</p>
            </div>
            <div class="item">
              <p>微信支付</p>
              <p>&yen; {{info.totalAmount || 0}}</p>
              <p>-&yen; {{info.goldCoin || 0}}</p>
              <p class="red">&yen; {{info.paymentAmount || 0}}</p>
              <p>&yen;{{info.useAccountBalance || '0'}}</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item"><b>发票信息</b></div>
            <div class="item">
              <p>发票状态：</p>
              <p>发票类型：</p>
              <p>发票抬头：</p>
              <p>备注：</p>
              <p class="invoice" v-if="info.invoice != null && info.invoice.status == 1" v-on:click="isSwitch = !isSwitch">已开发票</p>
            </div>
            <div class="item">
              <p>{{info.invoice | filterStatus}}</p>
              <p>{{info.invoice | filterType}}</p>
              <p>{{info.invoice | filterTitle}}</p>
              <p>{{info.invoice | filterRemark}}</p>
            </div>
          </div>
          <div class="clear"></div>
        </div>

        <div class="remark">
          <div class="left remark-title">
            <b>备注</b>
          </div>
          <div class="left">
            <span class="buyer-remark">买家备注：</span>
            <span>{{info.remark || '空'}}</span>
          </div>
        </div>
        <div class="product-title">
          庄园信息
        </div>
        <table cellpadding="0" cellspacing="0">
          <thead>
          <tr>
            <td>ID</td>
            <td>庄园名称</td>
            <td>单价</td>
            <td>数量</td>
            <td>总计</td>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{info.id}}</td>
            <td>
               <span>
                 <img :src="info.teaManorIndexPicture" width="100" height="70">
               </span>
              <span>{{info.teaManorName || '空'}}</span>
            </td>
            <td>&yen; {{info.unitPrice || '0'}}</td>
            <td>{{info.quantity || 0}}</td>
            <td class="red">&yen;{{info.totalAmount || 0}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="detail-top quarter-info" v-for="item in info.quarterOrders">
      <div class="product-title">
        第{{item.quarter | textchange}}季度<span v-if="item.earningsType==1">收茶</span><span v-if="item.earningsType==2">代销</span>订单
      </div>
        <div class="order-title">
          <div class="left quarter-left">
            <div class="left">
              <img src="../assets/icon_order_state.png">
            </div>
            <div class="right">
              <p>
                <span>订单状态：</span>
                <b>
                  <span class="status" v-show="item.status==1">未操作</span>
                  <span class="status" v-show="item.status==2 && item.earningsType==2">已代销</span>
                  <span class="status" v-show="item.status==2 && item.earningsType==1">已领取</span>
                  <span class="status" v-show="item.status==3">待发货</span>
                  <span class="status" v-show="item.status==4 && item.earningsType==1">已发货</span>
                  <span class="status" v-show="item.status==4 && item.earningsType==2">已发放</span>
                  <span class="status" v-show="item.status==5">已收货</span>
                  <span class="status" v-show="item.status==6">待付款</span>
                  <span class="status" v-show="item.status==11">超时关闭</span>
                  <span class="status" v-show="item.status==12">取消</span>
                  <span class="status" v-show="item.status==13">失败</span>
                  <span class="status" v-show="item.status==14">异常</span>
                  <span class="status" v-show="item.status==15">已关闭</span>
                </b>
              </p>
              <p>
                <span>订单号：</span>
                <span>{{item.orderNumber || '空'}}</span>
                <span>&nbsp;&nbsp;&nbsp;下单时间：</span>
                <span>{{item.getTime || '空'}}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="info">
          <div class="info-cont">
            <div class="info-item">
              <div class="item"><b>付款信息</b></div>
              <div class="item">
                <p>支付方式：</p>
                <p>印刷费用：</p>
                <p>茶金币抵扣：</p>
                <p>付款时间：</p>
                <p>实付金额：</p>
              </div>
              <div class="item">
                <p>微信支付</p>
                <p>&yen; {{item.printedFee || 0}}</p>
                <p>-&yen; {{item.goldCoinMoney || 0}}</p>
                <p>&yen; {{item.goldCoin || 0}}</p>
                <p class="red">&yen; {{item.printedFee -item.goldCoinMoney}}</p>
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
                <p>{{item.receiver || '空'}}</p>
                <p>{{item.receiverPhone || '空'}}</p>
                <p>{{item.receiverAddress || '空'}}</p>
                <p>{{item.deliverTime || '空'}}</p>
                <p>{{item.receiveTime || '空'}}</p>
                <p>{{item.guestbook || '空'}}</p>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="info-cont" v-if="item.earningsType==2">
            <div class="info-item earnings-info">
              <div class="item"><b>收益内容</b></div>
              <div class="item">
                <p>代销收益：</p>
                <p>发放状态：</p>
                <p>发放时间：</p>
                <button v-on:click="dividend(item)">发放收益</button>
              </div>
              <div class="item">
                <p>&yen; {{item.earnings || 0}}</p>
                <p v-if="item.status==1 && item.earningsType==2">申请中</p>
                <p v-if="item.status==2 && item.earningsType==2">已发放</p>
                <p v-if="item.status!==2 && item.status!=1 && item.earningsType!==1 && item.earningsType!==2">未知</p>
                <p>{{item.getTimeActual}}</p>
              </div>
            </div>
            <div class="clear"></div>
          </div>
          <div class="remark">
            <div class="left remark-title">
              <b>印刷文字</b>
            </div>
            <div class="left">
              <span>{{item.printedText || '空'}}</span>
            </div>
          </div>
          <div class="product-title" v-if="item.teas !==null">
            收益内容
          </div>
          <table cellpadding="0" cellspacing="0" v-if="item.teas !==null">
            <thead>
            <tr>
              <td>ID</td>
              <td>庄园名称</td>
              <td>单价</td>
              <td>数量</td>
              <td>总计</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="items in item.teas">
              <td>{{items.id}}</td>
              <td>
               <span>
                 <img :src="items.indexPicture" width="100" height="70">
               </span>
                <span>{{items.teaCategoryName}} {{items.starLevel | starToText}} {{items.name}} {{items.weight}}g</span>
              </td>
              <td>&yen; {{items.unitPrice || '0'}}</td>
              <td>{{items.quantity || 0}}</td>
              <td class="red">&yen;{{items.unitPrice * items.quantity}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="goods-info quarter-goods" v-if="item.earningsType==1 && item.status==3">
          <div class="goods-info-title">
            填写发货信息
          </div>
          <div class="goods-info-item">
            <div class="left">
              <span>收货人：</span>
              <input type="text" v-model="item.receiver" readonly="true">
            </div>
            <div class="left">
              <span>物流公司：</span>
              <input type="text" v-model="company" placeholder="请输入物流公司">
            </div>
          </div>
          <div class="goods-info-item">
            <div class="left">
              <span>手机号：</span>
              <input type="text" v-model="item.receiverPhone" readonly="true">
            </div>
            <div class="left">
              <span>物流单号：</span>
              <input type="text" v-model="singleNo" placeholder="请输入物流单号">
            </div>
          </div>
          <div class="goods-info-item">
            <div class="left">
              <span>收货地址：</span>
              <input type="text" v-model="item.receiverAddress" readonly="true">
            </div>
          </div>
          <div class="clear"></div>
          <div class="goods-info-item">
            <button v-on:click="deliver(item)">发货</button>
          </div>
        </div>
       <div class="goods-info goods-info-view" v-if="item.status==4 && item.earningsType==1">
        <div class="goods-info-title">
          发货信息
        </div>
        <div class="goods-info-item">
          <div class="left">
            <span>收货人：</span>
            <span>{{item.receiver || '空'}}</span>
          </div>
          <div class="left">
            <span>物流公司：</span>
            <span>{{item.expressCompany || '空'}}</span>
          </div>
        </div>
         <div class="goods-info-item">
           <div class="left">
             <span>手机号：</span>
             <span>{{item.receiverPhone || '空'}}</span>
           </div>
           <div class="left">
             <span>物流单号：</span>
             <span>{{item.expressNo || '空'}}</span>
           </div>
         </div>
         <div class="goods-info-item">
           <div class="left">
             <span>收货地址：</span>
             <span class="receiver-address">{{item.receiverAddress || '空'}}</span>
           </div>
           <div class="left">
             <button>物流查询</button>
           </div>
           <div class="clear"></div>
         </div>
        <div class="clear"></div>
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
      name: 'manororderdetail',
      created () {
        this.$http.get('api/user/info').then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.href = '#/login'
          } else if (res.body.code === 0) {
            this.$data.name = res.body.data.name
          } else {
            window.alert(res.body.message)
          }
        })
        const Id = this.$route.params.id
        this.$http.get('api/teaManor/order/get?id=' + Id).then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.hash = '#/login'
          } else if (res.body.code === 0) {
            this.$data.info = res.body.data
          } else {
            window.alert(res.body.message)
          }
        })
      },
      filters: {
        filterStatus: function (_status) {
          if (_status) {
            if (_status.status === 1) return '待开发票'
            else if (_status.status === 2) return '已开'
            else if (_status.status === 3) return '已寄出'
            else if (_status.status === 4) return '已收'
            else return '空'
          } else return '空'
        },
        filterType: function (_type) {
          if (_type) {
            if (_type.invoiceType === 1) return '个人'
            else if (_type.invoiceType === 2) return '公司'
            else return '空'
          } else return '空'
        },
        filterTitle: function (_title) {
          if (_title) {
            if (_title.invoiceTitle) return _title.invoiceTitle
            else return '空'
          } else return '空'
        },
        filterRemark: function (_remark) {
          if (_remark) {
            if (_remark.remark) return _remark.invoiceTitle
            else return '空'
          } else return '空'
        },
        textchange: function (_text) {
          if (_text === 1) return '一'
          else if (_text === 2) return '二'
          else if (_text === 3) return '三'
          else if (_text === 4) return '四'
        },
        starToText: function (_star) {
          var text = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
          return text[_star - 1]
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
          this.$http.get('api/tea/order/invoice?bizId=' + this.$data.teaid + '&bizType=2').then(function (res) {
            if (res.body.code === 0) {
              window.location.reload()
            } else {
              window.alert(res.body.message)
            }
          })
        },
        deliver: function (item) {
          var quarterId = item.id
          if (this.$data.company !== '' && this.$data.singleNo !== '') {
            this.$http.get('api/teaManor/order/express?expressCompany=' + this.$data.company + '&expressNo=' + this.$data.singleNo + '&id=' + quarterId + '').then(function (res) {
              if (res.body.code === 0) {
                window.location.reload()
              } else {
                window.alert(res.body.message)
              }
            })
          }
        },
        dividend: function (item) {
          var quarId = item.id
          this.$http.get('api/teaManor/order/deliverymoney?id=' + quarId).then(function (res) {
            if (res.body.code === 0) {
              window.location.reload()
            } else {
              window.alert(res.body.message)
            }
          })
        }
      },
      data () {
        return {
          headObj: {
            class: 'shop',
            titText: '庄园订单详情'
          },
          hShow: false,
          name: '',
          info: {},
          isSwitch: false,
          orderNo: this.$route.params.no,
          teaid: this.$route.params.id,
          company: '',
          singleNo: ''
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
  .detail-path {
    line-height:50px;
    padding:0 10px;
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
  .quarter-info .order-title .quarter-left {
    width:100%;
    border:none;
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
    height:180px;
  }
  .info .info-cont .earnings-info {
    width:100%;
    padding-right:50%;
    margin-top:5px;
  }
  .info-item {
    width:530px;
    height:176px;
    float:left;
    padding:20px;
    padding-right:0;
    border:1px solid #ededed;
  }
  .remark {
    width:100%;
    height:50px;
    padding:17px;
    margin-top:8px;
    border:1px solid #ededed;
  }
  .remark .remark-title {
    width:75px;
  }
  .buyer-remark {
    display:inline-block;
    width:85px;
  }
  .info .info-item:nth-child(1),
  .info .info-item:nth-child(3){
    margin-right:10px;
  }
  .info .info-item:nth-child(3),
  .info .info-item:nth-child(4){
    margin-top:10px;
    height:280px;
  }
  .info .info-item:nth-child(4) .item-pic {
    height:70px;
    width:70px;
    border:1px solid #ccc;
  }
  .info .info-item:nth-child(2) {
    position:relative;
  }
  .info .info-item:nth-child(2) .invoice {
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
    width: 338px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .info-item .item button {
    width:84px;
    height:32px;
    border-radius:4px;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
    line-height:32px;
    background:#476d8f;
    color:#fff;
    margin-top:15px;
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
    padding:0 10px;
    border-bottom:1px solid #e6e6e6;
  }
  .product-title span {
    font-size:18px;
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
    color:#9b9b9b;
    font-weight:bold;
    padding:10px 10px 10px 20px;
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
    border-bottom:none;
  }
  table thead tr td:first-child{
    width:15%;
  }
  table thead tr td:nth-child(2){
    width:38%;
  }
  table tbody tr td:nth-child(2) span{
    display:inline-block;
    vertical-align:top;
  }
  table tbody tr td:nth-child(2) span:nth-child(1){
    width:100px;
    height:70px;
  }
  table tbody tr td:nth-child(2) span:nth-child(2){
    width:290px;
    line-height:20px;
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
  .quarter-goods {
    border:1px solid #e6e6e6;
    margin:5px 0 10px 0;
    min-height:180px;
  }
  .goods-info-view {
    border:1px solid #e6e6e6;
    margin:5px 0 10px 0;
  }
  .goods-info .goods-info-title {
    width:100%;
    height:40px;
    font-size:18px;
    padding:10px;
    border-bottom:1px solid #E6E6E6;
  }
  .goods-info .goods-info-item .left{
    width:50%;
    padding:10px;
  }
  .goods-info .goods-info-item .left button{
    height:30px;
    margin:-10px 0 10px 0;
  }
  .goods-info .goods-info-item .left span:nth-child(1) {
    display:inline-block;
    width:80px;
  }
  .goods-info .goods-info-item .left span:nth-child(2) {
    width:430px;
    display:inline-block;
    vertical-align:top;
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
  .goods-info .goods-info-item input {
    width:320px;
    height:32px;
    padding:0 10px;
    border-radius:4px;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
    border:1px solid #ddd;
  }
  .goods-info-item .goods-info-search {
    float:right;
    margin:-30px 454px 20px 0;
    height:30px;
  }
  .goods-info-item button {
    width:70px;
    height:36px;
    background:#476d8f;
    color:#fff;
    margin:10px 0 20px 97px;
    border-radius:4px;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
  }
  .detail-top {
    box-shadow: 0px 3px 4px 1px #CDD1D4;
    padding:0 10px;
  }
  .quarter-info {
    margin-top:30px;
    box-shadow:0px 2px 3px 2px #CDD1D4;
  }
  .red {
    color:#D0021B;
    font-weight:bold;
  }
  a.router-link-active {
    color:#476d8f;
  }
</style>
