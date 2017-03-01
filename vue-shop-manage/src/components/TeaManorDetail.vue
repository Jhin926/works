<template>
  <div id="teamanordetail">
    <div id="title">
      <h2 :class="headObj.class">
        <span class="icon-tit"></span>
        {{headObj.titText}}
      </h2>
      <div class="head-handle">
        <button class="btn-tit" v-if="headObj.status == 3 || headObj.status ==1" v-on:click="release">
          发布
        </button>
        <button class="btn-tit" v-show="headObj.status==2" v-on:click="shelves">
          下线
        </button>
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
      <router-link to="../../../teamanor">庄园管理</router-link> >
      <span>{{list.name}}</span>
    </div>
    <div class="info-cont">
      <div class="info-item">
      <div class="left">
        <img :src="list.indexPicture ? (list.indexPicture.indexOf('http') >= 0 ? list.indexPicture : 'http://'+ list.indexPicture) : ''" width="100%" height="100%">
      </div>
      <div class="right">
        <p>{{list.name}}</p>
        <p><span>价格：</span>&yen;{{list.unitPrice || '0'}}</p>
        <div class="product-info">
          <div class="item-product">
            <span>年化收益率（显示）：</span>
            <span>{{list.annualIncomeText | textCheck}}</span>
          </div>
          <div class="item-product">
            <span>年化收益率：</span>
            <span>{{list.annualIncome || '0'}} %</span>
          </div>
          <div class="item-product">
            <span>茶叶价值：</span>
            <span>&yen;{{list.teaValue || '0'}}</span>
          </div>
          <div class="item-product productNum">
            <span>剩余 <b>{{list.leftSize || '0'}}</b> 亩</span>
          </div>
        </div>
      </div>
        <div class="clear"></div>
      </div>
      <div class="product-title">
        茶叶组合
      </div>
      <div class="tea-group">
        <div class="product-title tea-group-title">
          茶叶组合价值：<span class="tea-value">&yen; {{list.teaValue || '0'}}</span>
        </div>
        <div class="tea-group-cont">
          <p class="tea-quarter">春季</p>
          <div v-for="item in teaGroup1" class="tea-group-cont">
          <div class="tea-group-item" v-for="item1 in item.details">
            <div class="left">
              <img :src="item1.tea.indexPicture" width="100%" height="100%">
            </div>
            <div class="right">
              <p>{{item1.tea.categoryName}} {{item1.tea.name}} {{item1.tea.starLevel | toText}} {{item1.tea.weight}}g</p>
              <p class="red">&yen; {{item1.tea.unitPrice || 0}}</p>
              <p class="grey">库存：{{item1.tea.inventory || 0}}</p>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        </div>
        <div class="tea-group-cont">
          <p class="tea-quarter">夏季</p>
          <div v-for="item2 in teaGroup2" class="tea-group-cont">
          <div class="tea-group-item" v-for="item22 in item2.details">
            <div class="left">
              <img :src="item22.tea.indexPicture" width="100%" height="100%">
            </div>
            <div class="right">
              <p>{{item22.tea.categoryName}}{{item22.tea.name}} {{item22.tea.starLevel | toText}} {{item22.tea.weight}}g</p>
              <p class="red">&yen; {{item22.tea.unitPrice || 0}}</p>
              <p class="grey">库存：{{item22.tea.inventory || 0}}</p>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        </div>
        <div class="tea-group-cont">
          <p class="tea-quarter">秋季</p>
          <div v-for="item3 in teaGroup3" class="tea-group-cont">
          <div class="tea-group-item" v-for="item33 in item3.details">
            <div class="left">
              <img :src="item33.tea.indexPicture" width="100%" height="100%">
            </div>
            <div class="right">
              <p>{{item33.tea.categoryName}}{{item33.tea.name}} {{item33.tea.starLevel | toText}} {{item33.tea.weight}}g</p>
              <p class="red">&yen; {{item33.tea.unitPrice || 0}}</p>
              <p class="grey">库存：{{item33.tea.inventory || 0}}</p>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        </div>
        <div class="tea-group-cont">
          <p class="tea-quarter">冬季</p>
          <div v-for="item4 in teaGroup4" class="tea-group-cont">
          <div class="tea-group-item" v-for="item44 in item4.details">
            <div class="left">
              <img :src="item44.tea.indexPicture" width="100%" height="100%">
            </div>
            <div class="right">
              <p>{{item44.tea.categoryName}}{{item44.tea.name}} {{item44.tea.starLevel | toText}} {{item44.tea.weight}}g</p>
              <p class="red">&yen; {{item44.tea.unitPrice || 0}}</p>
              <p class="grey">库存：{{item44.tea.inventory || 0}}</p>
            </div>
          </div>
          <div class="clear"></div>
        </div>
        </div>
      </div>
      <div class="product-title">
        茶庄园参数
      </div>
      <table  border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <td>总量：</td>
          <td>{{list.amounts}} 亩</td>
          <td>开始时间：</td>
          <td>{{list.beginDate}}</td>
          <td>ID：</td>
          <td>{{list.id}}</td>
        </tr>
        <tr>
          <td>大小：</td>
          <td>{{list.amounts}} 亩</td>
          <td>结束时间：</td>
          <td>{{list.endDate}}</td>
          <td>创建时间：</td>
          <td>{{list.beginDate}}</td>
        </tr>
        <tr>
          <td>库存：</td>
          <td>{{list.amounts - list.salesVolume}} 份</td>
          <td>投资时长：</td>
          <td>{{list.duration}} 天</td>
          <td>排序号：</td>
          <td>{{list.sortNo}}</td>
        </tr>
        </thead>
      </table>
      <div class="product-title">
        茶庄园详情
      </div>
      <div class="img-cont">
        <div class="detail-word">
          {{list.desc}}
        </div>
        <div class="detail-img" v-for="lists in list.descPictures">
          <img :src="lists.pictureUrl ? (lists.pictureUrl.indexOf('http') >= 0 ? lists.pictureUrl : 'http://'+ lists.pictureUrl) : ''" width="100%" />
        </div>
      </div>
      <div class="icon-cont">
        <span v-on:click="edit(headObj)"><img src="../assets/icon_detail_edit.png"></span>
        <span v-on:click="isSwitch = !isSwitch"><img src="../assets/icon_detail_delete.png"></span>
      </div>
    </div>
    <div class="remark-model" v-show="isSwitch">
      <div class="remark-win">
        <p>
          <span class="red">删除提示</span>
          <span>确认要删除吗？</span>
          <span>删除后相关信息将会清空且无法恢复</span>
        </p>
        <p>
          <span v-on:click="isSwitch = !isSwitch">取消</span>
          <span v-on:click="remove">删除</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'teamanordetail',
      created () {
        const Id = this.$route.params.id
        this.$http.get('api/teaManor/get?id=' + Id).then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.hash = '#/login'
          } else if (res.body.code === 0) {
            this.$data.list = res.body.data
            const data = res.body.data.teaGroups
            for (var i = 0; i < data.length; i++) {
              if (data[i].quarter === 1) {
                this.$data.teaGroup1.push(data[i])
              } else if (data[i].quarter === 2) {
                this.$data.teaGroup2.push(data[i])
              } else if (data[i].quarter === 3) {
                this.$data.teaGroup3.push(data[i])
              } else if (data[i].quarter === 4) {
                this.$data.teaGroup4.push(data[i])
              }
            }
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
      filters: {
        toText: function (val) {
          if (val === 10) return '庄园直供'
          else {
            var text = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
            return text[val - 1]
          }
        },
        textCheck: function (_val) {
          if (_val) {
            if (!_val.match('%')) {
              return _val + '%'
            } else return _val
          } else return 0 + '%'
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
        release: function (_val) {
          var id = this.$route.params.id
          this.$http.get('api/teaManor/launch?id=' + id).then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '#/index/teamanor'
            } else {
              window.alert(res.body.message)
            }
          })
        },
        shelves: function (_val) {
          var id = this.$route.params.id
          this.$http.get('api/teaManor/offline?id=' + id).then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '#/index/teamanor'
            } else {
              window.alert(res.body.message)
            }
          })
        },
        remove: function () {
          var Id = this.$route.params.id
          this.$http.get('api/teaManor/delete?id=' + Id).then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '../#/index/teamanor'
            } else {
              window.alert(res.body.message)
            }
          })
        },
        edit: function (_val) {
          if (parseInt(_val.status) === 2) {
            window.alert('庄园已上线，不可编辑')
            return
          } else if (parseInt(_val.status) === 1 || parseInt(_val.status) === 3) {
            window.location.href = '#/index/teamanor/manoredit/' + this.$route.params.id
          }
        }
      },
      data () {
        return {
          headObj: {
            class: 'shop',
            titText: '茶庄园详情',
            status: this.$route.params.status
          },
          hShow: false,
          isSwitch: false,
          list: {},
          name: '',
          teaGroup1: [],
          teaGroup2: [],
          teaGroup3: [],
          teaGroup4: []
        }
      }
    }
</script>

<style scoped>
  #teamanordetail {
    padding:0 10px;
  }
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
    background: url('../assets/icon-manor2.png') no-repeat;
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
  .btn-tit {
    width: 106px;
    height: 35px;
    padding: 9px 5px;
    background-color: #f9f9f8;
    border: 1px solid #c7cacd;
    border-radius: 2px;
    cursor:pointer;
  }
  .handle-con {
    width: 110px;
    height: 40px;
    margin-top: 15px;
    padding:10px 10px 10px 17px;
    position:absolute;
    border: 1px solid #eee;
    background: #fff;
    cursor:pointer;
  }
  .detail-path {
    line-height:50px;
  }
  .detail-path span {
    color:#9b9b9b;
  }
  .info-cont .info-item {
    height:230px;
  }
  .info-cont .left {
    width:49%;
    height:215px;
    border:1px solid #ccc;
  }
  .info-cont .right {
    float:left;
    padding:10px 70px 0 20px;
    width:50%;
  }
  .info-cont .right p:nth-child(1){
    font-size:18px;
    color:#212121;
  }
  .info-cont .right p:nth-child(2){
    font-size:24px;
    color:#d2011b;
  }
  .info-cont .right p:nth-child(2) span{
    font-size:14px;
    color:#d2011b;
  }
  .product-info {
    width:100%;
    height:140px;
    margin-top:8px;
    padding-top:20px;
    border-top:1px solid #e6e6e6;
  }
  .item-product {
    line-height:24px;
  }
  .product-info .productNum {
    width:105px;
    height:30px;
    line-height:30px;
    margin-top:10px;
    text-align:center;
    background-color:#CEF2BE;
    border-radius:15px;
    -webkit-border-radius:15px;
    -moz-border-radius:15px;
  }
  .product-info .productNum span {
    color:#37791A;
  }
  .info-cont .tea-group-title {
    font-size:14px;
  }
  .product-title {
    width:100%;
    height:50px;
    line-height:50px;
    font-size:18px;
    border-bottom:1px solid #e6e6e6;
  }
  .product-title span {
    font-size:22px;
    color:#d0021b;
  }
  table thead tr td:nth-child(1),
  table thead tr td:nth-child(3),
  table thead tr td:nth-child(5){
    height:45px;
    width:110px;
    background-color:#f6f6f6;
    color:#9b9b9b;
    padding:15px;
  }
  table {
    border-right:1px solid #e6e6e6;
    border-bottom:1px solid #e6e6e6;
  }
  table td {
    border-left:1px solid #e6e6e6;
    border-top:1px solid #e6e6e6;
  }
  table thead tr td:nth-child(2),
  table thead tr td:nth-child(4),
  table thead tr td:nth-child(6){
    height:45px;
    width:247px;
    padding:15px;
  }
  .img-cont {
    padding:10px 0;
    min-height:150px;
  }
  .img-cont .detail-word {
    width:100%;
    line-height:20px;
    margin:0 0 15px 0;
  }
  .img-cont .detail-img {
    max-width:640px;
    margin:-3px auto 0;
  }
  .icon-cont {
    position:absolute;
    width:50px;
    height:100px;
    right:24px;
    top:130px;
  }
  .icon-cont span {
    display:inline-block;
    width:36px;
    height:36px;
    border-radius:50%;
    margin-bottom:10px;
    cursor:pointer;
  }
  a.router-link-active {
    color:#476D8F;
  }
  .remark-win {
    width:300px;
    height:200px;
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
    height:118px;
  }
  .remark-win p:first-child span {
    display:block;
    width:100%;
  }
  .remark-win p:first-child span:nth-child(1) {
    font-size:24px;
    color:#ff6151;
    margin:30px auto 15px;
  }
  .remark-win p:first-child span:nth-child(2) {
    font-size:14px;
    color:#212121;
    margin:0 auto 16px;
  }
  .remark-win p:nth-child(2) span {
    display:inline-block;
    width:49%;
    text-align:center;
    line-height:50px;
    cursor:pointer;
  }
  .remark-win p:nth-child(2) span:nth-child(1) {
    border-right:1px solid #ddd;
  }
  .tea-group {
    min-height:154px;
  }
  .tea-group-cont {
    margin-bottom:15px;
  }
  .tea-group .tea-group-cont .tea-quarter {
    height:35px;
    line-height:35px;
    font-size:16px;
  }
  .tea-group-cont .tea-group-item:nth-child(odd) {
    border:1px solid #e6e6e6;
    margin-left:0;
  }
  .tea-group-cont .tea-group-item:nth-child(even) {
    border:1px solid #e6e6e6;
    margin-left:0;
  }
  .tea-group-cont .tea-group-item {
    padding:0 0 0 10px;
    border:1px solid #e6e6e6;
    border-top:none;
  }
  .tea-group-item {
    width:50%;
    float:left;
    height:104px;
  }
  .tea-group-item .left {
    width:104px;
    height:70px;
    margin:17px 0;
  }
  .tea-group-item .right {
    width:419px;
    height:70px;
    margin:17px 0;
    padding:0 0 0 10px;
  }
  .info-cont .tea-group-item .right p {
    font-size:14px;
    line-height:25px;
  }
  .grey {
    color:#9b9b9b;
  }
</style>
