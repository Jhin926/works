<template>
  <div id="shop">
    <div id="title">
      <h2 :class="headObj.class">
        <span class="icon-tit"></span>
        {{headObj.titText}}
      </h2>
      <div class="head-handle">
        <router-link tag="button" to="/index/shop/product" class="btn-tit">
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

    <div class="filter">
      <ul class="filter-list">
        <li>
          <label for="filter-type">品类</label>
          <select v-model="Protype" id="filter-type">
            <option value="0"></option>
            <option v-for="type in typeList" v-bind:value="type.id">
              {{type.name}}
            </option>
          </select>
        </li>
        <li>
          <label for="filter-star">星级</label>
          <select v-model="Prostar" id="filter-star">
            <option value="0"></option>
            <option value="1">一星</option>
            <option value="2">二星</option>
            <option value="3">三星</option>
            <option value="4">四星</option>
            <option value="5">五星</option>
            <option value="6">六星</option>
          </select>
        </li>
        <li>
          <label for="filter-name">名称</label>
          <input type="text" v-model="Proname" id="filter-name"/>
        </li>
        <li class="search-status search-star">
          <label for="filter-status">状态</label>
          <select v-model="Prostatus" id="filter-status">
            <option value="0"></option>
            <option value="1">草稿</option>
            <option value="2">发布</option>
            <option value="3">下线</option>
          </select>
        </li>
        <li class="search-star">
          <label for="filter-no">货号</label>
          <input type="text" v-model="Prono" id="filter-no"/>
        </li>
      </ul>
      <button class="btn-filter" v-on:click.stop="filterPro"></button>
    </div>
    <table class="list" cellpadding="0" cellspacing="0">
      <thead>
      <tr>
        <td><span class="checkbox checked"></span></td>
        <td>ID</td>
        <td>产品名称</td>
        <td>价格</td>
        <td>库存</td>
        <td>销量</td>
        <td>状态</td>
        <td>操作</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="tea in teaList">
        <td><span class="checkbox"></span></td>
        <td><b>{{tea.id}}</b></td>
        <td>
          <img class="left" :src="tea.indexPicture ? (tea.indexPicture.indexOf('http') >= 0 ? tea.indexPicture : 'http://'+ tea.indexPicture) : ''" width="100" height="70" alt="" />
          <div class="tea-info">
            <h2>{{tea.teaCategoryName}} {{tea.starLevel | starToText}} {{tea.name}} {{tea.weightText}}</h2>
            <div class="tea-param">
              <ul class="param-inner">
                <li>货号:{{tea.artNo}}</li>
                <li>品类:{{tea.teaCategoryName}}</li>
              </ul>
              <ul class="param-inner">
                <li>保质期:{{tea.expirationDate || '0'}}</li>
                <li>原产地:{{tea.producingArea}}</li>
                <li>排序号:{{tea.sortNo}}</li>
              </ul>
            </div>
          </div>
        </td>
        <td><b class="pro-price">&yen;{{tea.unitPrice}}</b></td>
        <td><b>{{tea.totalInventory}}</b></td>
        <td><b>{{tea.salesVolume}}</b></td>
        <td>
          <p class="tea-status" v-if="tea.status===1">草稿</p>
          <p class="tea-status" v-if="tea.status===2">发布</p>
          <p class="tea-status" v-if="tea.status===3">下线</p>
          <p class="list-status" v-if="tea.status===1 || tea.status==3" v-on:click="release(tea)">发布</p>
          <p class="list-status" v-if="tea.status===2" v-on:click="shelves(tea)">下线</p>
          <p>{{tea.createTime}}</p>
        </td>
        <td><router-link tag="span" :to="{'path': '/index/shop/shopdetail/'+tea.id+'/'+tea.status}" class="btn-edit">查看</router-link></td>
      </tr>
      </tbody>
    </table>

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
    filterPro: function () {
      this.$http.get('/api/tea/list?name=' + this.$data.Proname + '&artNo=' + this.$data.Prono + '&teaCategoryId=' + this.$data.Protype + '&status=' + this.$data.Prostatus + '&starLevel=' + this.$data.Prostar + '').then(function (res) {
        if (res.body.code === 0) {
          this.$data.pageObj.curPg = 1
          this.$data.teaList = res.body.data.results
          this.$data.pageObj.total = res.body.data.totalItem
        } else {
          window.alert(res.body.data.message)
        }
      })
    },
    changePg: function (_val) {
      this.$http.post('/api/tea/list', {currentPage: _val, pageSize: this.$data.pageObj.pageSize}).then(function (res) {
        if (res.body.code === 0) {
          this.$data.pageObj.curPg = _val
          this.$data.teaList = res.body.data.results
          this.$data.pageObj.total = res.body.data.totalItem
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
    },
    release: function (_val) {
      var id = _val.id
      this.$http.get('api/tea/launch?id=' + id).then(function (res) {
        if (res.body.code === 0) {
          this.$http.get('/api/tea/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
            if (res.body.code === 300001 || res.body.code === 300002) {
              window.location.hash = '#/login'
            } else if (res.body.code === 0) {
              this.$data.teaList = res.body.data.results
              this.$data.pageObj.total = res.body.data.totalItem
            } else {
              window.alert(res.body.data.message)
            }
          })
        } else {
          window.alert(res.body.message)
        }
      })
    },
    shelves: function (_val) {
      var id = _val.id
      this.$http.get('api/tea/offline?id=' + id).then(function (res) {
        if (res.body.code === 0) {
          this.$http.get('/api/tea/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
            if (res.body.code === 300001 || res.body.code === 300002) {
              window.location.hash = '#/login'
            } else if (res.body.code === 0) {
              this.$data.teaList = res.body.data.results
              this.$data.pageObj.total = res.body.data.totalItem
            } else {
              window.alert(res.body.data.message)
            }
          })
        } else {
          window.alert(res.body.message)
        }
      })
    }
  },
  created () {
    this.$http.get('/api/tea/list?pageSize=' + this.$data.pageObj.pageSize).then(function (res) {
      if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.hash = '#/login'
      } else if (res.body.code === 0) {
        this.$data.teaList = res.body.data.results
        this.$data.pageObj.total = res.body.data.totalItem
      } else {
        window.alert(res.body.data.message)
      }
    })
    this.$http.get('api/tea/category/list').then(function (res) {
      if (res.body.code === 0) {
        this.$data.typeList = res.body.data
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
    starToText: function (value) {
      if (value === 10) return '庄园直供'
      else {
        var starText = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
        return starText[value - 1]
      }
    },
    checkImg: function (_img) {
      console.log(_img)
    }
  },
  data () {
    return {
      Proname: '',
      Prono: '',
      Protype: 0,
      Prostatus: 0,
      Prostar: 0,
      teaList: [],
      typeList: [],
      hShow: false,
      headObj: {
        class: 'shop',
        titText: '商品管理',
        btnText: '发布产品'
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
    background: url('../assets/icon-shop2.png') no-repeat;
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
    padding:10px 10px 10px 17px;
    position:absolute;
    cursor:pointer;
    z-index:1;
    margin-top: 15px;
    border: 1px solid #eee;
    background: #fff;
  }
  #shop {
    padding: 0 10px;
  }
  .filter {
    padding: 20px;
    font-size: 12px;
  }
  .filter-list li {
    float: left;
    margin-right: 100px;
  }
  .filter-list li label {
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
    width:200px;
    padding:4px;
  }
  .btn-filter {
    width: 66px;
    height: 30px;
    float:right;
    margin:10px 105px 0 0;
    background: url("../assets/btn-filter.png") no-repeat;
    outline: none;
    cursor: pointer;
  }
  .search-star {
    margin:10px 0;
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
    width: 160px;
  }
  .tea-param .param-inner li:nth-child(2) {
    width: 200px;
  }
  .tea-param .param-inner li:nth-child(3) {
    width: 160px;
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
