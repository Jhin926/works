<template>
  <div id="teamanor">
    <div id="title">
      <h2 :class="headObj.class">
        <span class="icon-tit"></span>
        {{headObj.titText}}
      </h2>
      <div class="head-handle">
        <router-link tag="button" to="/index/teamanor/Manor" class="btn-tit">
          <span class="left icon-add"></span>
          {{headObj.btnText}}
        </router-link>
        <div class="right member-handle" v-on:click="hShow = !hShow">
          <span class="left icon-member"><img src="../assets/icon-title.png" width="32" height="32" alt="" /></span>
          {{name || '无'}}
          <span class="btn-handle"></span>
          <div v-show="hShow" class="handle-con" v-on:click="loginout">
            <span><img src="../assets/icon_logout.png"></span>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <table class="list" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <td><span class="checkbox checked"></span></td>
        <td>ID</td>
        <td>名称</td>
        <td>单价</td>
        <td>总量</td>
        <td>销量</td>
        <td>状态</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="tea in list">
        <td><span class="checkbox"></span></td>
        <td><b>{{tea.id}}</b></td>
        <td>
          <img class="left" :src="tea.indexPicture ? (tea.indexPicture.indexOf('http') >= 0 ? tea.indexPicture : 'http://'+ tea.indexPicture) : ''" width="100" height="70" alt="" />
          <div class="tea-info">
            <h2>{{tea.name}}</h2>
            <div class="tea-param">
              <ul class="param-inner">
                <li>年化收益率：{{tea.annualIncome || 0}}%</li>
                <li>年化收益率(显示)：{{tea.annualIncomeText | textCheck}}</li>
                <li>茶叶价值：&yen;{{tea.teaValue || '0'}}</li>
              </ul>
              <ul class="param-inner">
                <li>开始日期：{{tea.beginDate}}</li>
                <li>结束日期：{{tea.endDate}}</li>
              </ul>
            </div>
          </div>
        </td>
        <td><b class="pro-price">&yen;{{tea.unitPrice}}</b></td>
        <td><b>{{tea.amounts}}</b></td>
        <td><b>{{tea.salesVolume}}</b></td>
        <td>
          <p class="tea-status" v-if="tea.status===1">草稿</p>
          <p class="tea-status" v-if="tea.status===2">发布</p>
          <p class="tea-status" v-if="tea.status===3">下线</p>
          <p class="list-status" v-if="tea.status===1 || tea.status==3" v-on:click="release(tea)">发布</p>
          <p class="list-status" v-if="tea.status===2" v-on:click="shelves(tea)">下线</p>
          <p>{{tea.createTime}}</p>
        </td>
        <td><router-link :to="{'path': 'teamanor/teamanordetail/'+tea.id+'/'+tea.status}" class="btn-edit" tag="span">查看</router-link></td>
      </tr>
      </tbody>
    </table>
    <paging v-on:chgPg="changePg" :total="pageObj.total" :curPg="pageObj.curPg"></paging>
  </div>
</template>

<script>
import Paging from './Paging'
export default {
  name: 'teamanor',
  components: {
    Paging
  },
  created () {
    this.$http.get('api/teaManor/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
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
  methods: {
    changePg: function (_val) {
      this.$data.pageObj.curPg = _val
      this.$http.post('api/teaManor/list', {currentPage: _val, pageSize: this.$data.pageObj.pageSize}).then(function (res) {
        if (res.body.code === 0) {
          this.$data.pageObj.curPg = _val
          this.$data.list = res.body.data.results
          this.$data.pageObj.total = res.body.data.totalItem
        } else {
          window.alert(res.body.data.message)
        }
      })
    },
    release: function (_val) {
      var id = _val.id
      this.$http.get('api/teaManor/launch?id=' + id).then(function (res) {
        if (res.body.code === 0) {
          this.$http.get('api/teaManor/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
            if (res.body.code === 300001 || res.body.code === 300002) {
              window.location.hash = '#/login'
            } else if (res.body.code === 0) {
              this.$data.list = res.body.data.results
              this.$data.pageObj.total = res.body.data.totalItem
            } else {
              window.alert(res.body.message)
            }
          })
        } else {
          window.alert(res.body.message)
        }
      })
    },
    shelves: function (_val) {
      var id = _val.id
      this.$http.get('api/teaManor/offline?id=' + id).then(function (res) {
        if (res.body.code === 0) {
          this.$http.get('api/teaManor/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
            if (res.body.code === 300001 || res.body.code === 300002) {
              window.location.hash = '#/login'
            } else if (res.body.code === 0) {
              this.$data.list = res.body.data.results
              this.$data.pageObj.total = res.body.data.totalItem
            } else {
              window.alert(res.body.message)
            }
          })
        } else {
          window.alert(res.body.message)
        }
      })
    },
    loginout: function () {
      this.$http.get('api/user/logout').then(function (res) {
        if (res.body.code === 0) {
          window.location.href = '/#/login'
        } else {
          window.alert(res.body.message)
        }
      })
    }
  },
  filters: {
    textCheck: function (_val) {
      if (_val) {
        if (!_val.match('%')) {
          return _val + '%'
        } else return _val
      } else return 0
    }
  },
  data () {
    return {
      list: {},
      hShow: false,
      headObj: {
        class: 'shop',
        titText: '庄园管理',
        btnText: '发布庄园'
      },
      pageObj: {
        total: 1, // 设定一个初始值，防止报错
        pageSize: 20,
        curPg: 1
      },
      name: ''
    }
  }
}
</script>

<style scoped>
  #teamanor {
    padding: 0 10px;
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
    padding:10px 10px 10px 17px;
    position:absolute;
    z-index:1;
    border: 1px solid #eee;
    background: #fff;
    cursor:pointer;
  }
  .filter {
    padding: 20px;
    font-size: 12px;
  }
  .filter-list li {
    float: left;
    margin-right: 50px;
  }
  .filter-list li label {
    margin-right: 10px;
  }
  .filter-list li input {
    border: 1px solid #cccdd1;
    height: 30px;
    padding: 8px;
    line-height: 30px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    border-radius: 5px;
  }
  .btn-filter {
    width: 66px;
    height: 30px;
    background: url("../assets/btn-filter.png") no-repeat;
    outline: none;
    cursor: pointer;
  }
  .list {
    width: 100%;
    table-layout: fixed;
    border-collapse:collapse;
    text-align: center;
  }
  .checkbox {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    background-color: transparent;
    border: 1px solid #cfcfcf;
    cursor: pointer;
  }
  .checkbox.checked {
    background-color: #6d8193;
  }
  .list thead tr {
    background-color: #f6f6f6;
    border: 1px solid #e6e6e6;
  }
  .list thead tr td {
    height: 45px;
    color: #9b9b9b;
    font-weight: bold;
  }
  .list thead tr td:first-child {
    width: 30px;
  }
  .list thead tr td:nth-child(2) {
    width: 60px;
  }
  .list thead tr td:nth-child(4) {
    width: 90px;
  }
  .list thead tr td:nth-child(5) {
    width: 100px;
  }
  .list thead tr td:nth-child(6) {
    width: 60px;
  }
  .list thead tr td:nth-child(7) {
    width: 180px;
  }
  .list thead tr td:last-child {
    width: 60px;
  }
  .list thead tr td:nth-child(2),
  .list thead tr td:nth-child(3),
  .list tbody tr td:nth-child(2),
  .list tbody tr td:nth-child(3) {
    text-align: left;
  }
  .list tbody tr td:nth-child(3),
  .list tbody tr td:nth-child(4),
  .list tbody tr td:nth-child(5),
  .list tbody tr td:nth-child(6),
  .list tbody tr td:nth-child(7),
  .list tbody tr td:last-child {
    vertical-align: top;
  }
  .list tbody tr {
    border-bottom: 1px solid #e6e6e6;
  }
  .list tbody tr td {
    padding: 20px 0;
  }
  .tea-info {
    margin-left: 110px;
  }
  .tea-info h2 {
    font-weight: bold;
  }
  .tea-param {
    position: relative;
    margin-top: 14px;
  }
  .tea-param .param-inner {
    width: 520px;
    overflow: hidden;
  }
  .tea-param .param-inner li {
    float: left;
    margin-bottom: 10px;
    font-size: 12px;
    color: #9b9b9b;
  }
  .tea-param .param-inner li:first-child {
    width: 170px;
  }
  .tea-param .param-inner li:nth-child(2) {
    width: 200px;
  }
  .tea-param .param-inner li:nth-child(3) {
    width: 150px;
  }
  .pro-price {
    color: #d0021b;
  }
  .btn-edit {
    cursor: pointer;
    color: #476d8f;
  }
  .tea-status {
    margin:0 0 10px;
  }
  .list-status {
    width:40px;
    height:24px;
    margin:0 auto 10px;
    border-radius:4px;
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
    background:#476d8f;
    line-height:24px;
    font-size:12px;
    cursor:pointer;
    color:#fff;
    text-align:center;
  }
</style>
