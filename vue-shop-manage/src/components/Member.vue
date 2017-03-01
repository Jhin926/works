<template>
  <div id="member">
    <div class="member">
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
      <div class="search-cont">
        <div class="search-item">
          <span>手机号</span>
          <span><input type="text" v-model="phone"></span>
        </div>
        <div class="search-item">
          <span>等级&nbsp;&nbsp;</span>
          <span>
            <select v-model="level">
              <option value=""></option>
              <option value="1">普通庄园主</option>
              <option value="2">精英庄园主 </option>
              <option value="3">名流庄园主 </option>
              <option value="4">至尊庄园主</option>
              <option value="10">员工</option>
            </select>
            </span>
        </div>
        <div class="search-item">
          <span>状态&nbsp;&nbsp;</span>
          <span>
            <select v-model="status">
              <option value=""></option>
              <option value="1">正常</option>
              <option value="2">禁用</option>
            </select>
          </span>
        </div>
        <div class="search-item">
          <span v-on:click="search"><img src="../assets/button_search.png"></span>
        </div>
      </div>
      <div class="info">
      <div class="table-title">
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>手机号</td>
              <td>用户昵称</td>
              <td>性别</td>
              <td>等级</td>
              <td>状态</td>
              <td>金币</td>
              <td>最后登录时间</td>
              <td>注册时间</td>
              <td>地址</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="it in list">
               <td>{{it.id}}</td>
               <td><span><img src="../assets/icon_phone.png">&nbsp;</span><span>{{it.mobileNumber}}</span></td>
               <td class=""><span>{{it.wxNickname}}</span></td>
               <td v-show="it.wxSex==0 || it.wxSex===null">未知</td>
               <td v-show="it.wxSex==1">男</td>
               <td v-show="it.wxSex==2">女</td>
               <td v-show="it.level==1">普通庄园主</td>
               <td v-show="it.level==2">精英庄园主</td>
               <td v-show="it.level==3">名流庄园主</td>
               <td v-show="it.level==4">至尊庄园主</td>
               <td v-show="it.level==10">员工</td>
               <td v-show="it.level !== 1 && it.level !==2 && it.level !==3 && it.level !==4 && it.level !==10"></td>
               <td class="green" v-show="it.status==1">正常</td>
               <td class="grey" v-show="it.status==2">已禁用</td>
               <td>{{it.goldCoin}}</td>
               <td>{{it.lastLoginTime}}</td>
               <td>{{it.createTime}}</td>
               <td class="address-list"><span>{{it.wxCountry}} {{it.wxProvince}} {{it.wxCity}}</span></td>
               <td><router-link :to="{'path': 'member/memberdetail/'+it.id}" tag="span" class="detail-check">查看</router-link></td>
            </tr>
          </tbody>
        </table>
      </div>
     </div>
      <paging v-on:chgPg="changePg" :total="pageObj.total" :curPg="pageObj.curPg"></paging>
    </div>
  </div>
</template>

<script>
    import Paging from './Paging'
    export default {
      name: 'member',
      components: {
        Paging
      },
      created () {
        this.$http.get('api/appUser/list').then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.hash = '#/login'
          } else {
            this.$data.pageObj.curPg = 1
            this.$data.list = res.body.data.results
            this.$data.pageObj.total = res.body.data.totalItem
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
          this.$http.get('api/appUser/list?mobileNumber=' + this.$data.phone + '&level=' + this.$data.level + '&status=' + this.$data.status).then(function (res) {
            if (res.body.code === 300001 || res.body.code === 300002) {
              window.location.hash = '#/login'
            } else {
              this.$data.pageObj.curPg = 1
              this.$data.list = res.body.data.results
              this.$data.pageObj.total = res.body.data.totalItem
            }
          })
        },
        changePg: function (_val) {
          this.$http.post('api/appUser/list', {currentPage: _val, pageSize: this.$data.pageObj.pageSize}).then(function (res) {
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
          this.$http.get('api/user/logout').then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '/#/login'
            } else {
              window.alert(res.body.message)
            }
          })
        }
      },
      data () {
        return {
          phone: '',
          level: '',
          status: '',
          list: {},
          hShow: false,
          name: '',
          headObj: {
            class: 'shop',
            titText: '会员管理'
          },
          pageObj: {
            total: 1, // 设定一个初始值，防止报错
            pageSize: 20,
            curPg: 1
          }
        }
      }
    }
</script>

<style scoped>
  .member {
    width:100%;
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
    background: url('../assets/icon-member2.png') no-repeat;
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
  .search-item {
    height:30px;
    margin:15px;
    float:left;
  }
  .search-item span {
    display:inline-block;
    font-size:12px;
    height:100%;
  }
  .search-item span:nth-child(2) {
    width:200px;
  }
  .search-item span:nth-child(2) input {
    width:100%;
    height:100%;
    margin-left:15px;
  }
  table thead tr {
    width:1070px;
    background-color:#f6f6f6;
    border:1px solid #e6e6e6;
  }
  table {
    border-collapse:collapse;
    width:100%;
    margin:0 auto;
  }
  table tr:nth-child(even){
    background:#f6f6f6;
  }
  table tbody tr:nth-child(odd){
    background:#fff;
  }
  table thead tr td,
  table tbody tr td {
    padding:10px;
    color:#9b9b9b;
    height:45px;
    font-size:12px;
    vertical-align:middle;
  }
  table thead tr td {
    font-size:14px;
    font-weight:bold;
  }
  table tbody tr td {
    color:#212121;
  }
  table thead tr td:nth-child(1) {
    width:60px;
  }
  table thead  tr td:nth-child(5){
    width:80px;
  }
  table thead  tr td:nth-child(2){
    width:128px;
  }
  table thead  tr td:nth-child(4){
    width:48px;
  }
  table thead  tr td:nth-child(6){
    width:60px;
  }
  table thead  tr td:nth-child(7) {
    width:77px;
  }
  table thead  tr td:nth-child(8),
  table thead  tr td:nth-child(9){
    width:125px;
  }
  table thead  tr td:nth-child(10){
    width:180px;
  }
  table tbody tr  .address-list span {
    display:inline-block;
    width:180px;
    font-size:12px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  table thead  tr td:nth-child(3){
    width:110px;
  }
  table tbody  tr td:nth-child(3) span {
    display:inline-block;
    width:94px;
    font-size:12px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  table tbody  tr td:nth-child(2) span img {
    vertical-align:bottom;
  }
  table tbody tr .detail-check {
    font-size:12px;
    cursor:pointer;
    color:#476d8f;
  }
  .button{
    display:inline-block;
    width:40px;
    height:20px;
    font-size:12px;
    line-height:18px;
    text-align:center;
    border-radius:3px;
    margin-left:10px;
    cursor:pointer;
    -webkit-border-radius:3px;
    -moz-border-radius:3px;
    border:1px solid #476d8f;
  }
  .info {
    padding:0 10px;
  }
  .green {
    color:#21a666;
  }
  .blue {
    color:#476d8f;
    cursor:pointer;
  }
  .grey {
    color:#9b9b9b;
  }
  input {
    border:1px solid #cecfd0;
    background:none;
    border-radius:4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    padding:0 10px;
  }
  select {
    width:100%;
    height:100%;
    border:1px solid #cecfd0;
    background:none;
    border-radius:4px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    padding:0 10px;
  }
</style>
