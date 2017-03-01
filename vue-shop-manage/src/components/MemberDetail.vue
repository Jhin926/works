<template>
  <div id="memberdetail">
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
      <router-link to="../../member">会员管理</router-link> >
      <span>{{list.mobileNumber}}</span>
    </div>
    <div class="bg-cont">
      <div class="head-img">
        <img :src="list.wxHeadimgurl" width="100" height="100" v-show="list.wxHeadimgurl!=null && list.wxHeadimgurl!=''">
        <img src="../assets/user_head_default.png" width="100" height="100" v-show="list.wxHeadimgurl===null || list.wxHeadimgurl==''">
      </div>
      <router-link tag="span" :to="{'path': './memberedit/'+userId+'/'+list.mobileNumber+'/'+list.level+'/'+list.status}" class="info-edit"><img src="../assets/icon_detail_edit.png"></router-link>
    </div>
    <div class="info">
      <div class="left">
        <p>{{list.mobileNumber}}</p>
        <p class="user-level" v-show="list.level==1">普通庄园主</p>
        <p class="user-level" v-show="list.level==2">精英庄园主</p>
        <p class="user-level" v-show="list.level==3">名流庄园主</p>
        <p class="user-level" v-show="list.level==4">至尊庄园主</p>
        <p v-show="list.level !==1 && list.level !==2 && list.level !==3 && list.level !==4"></p>
        <p class="top green" v-show="list.status==1">正常</p>
        <p class="top" v-show="list.status==2">禁用</p>
      </div>
      <div class="right">
        <div class="item-title">
          <p>金币</p>
          <p>{{list.goldCoin}}</p>
        </div>
        <div class="item-title">
          <p>账户余额</p>
          <p>{{list.balance}}</p>
        </div>
        <div class="item-title">
          <p>邀请人数</p>
          <p>{{list.referrerCount}}</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">ID：</p>
          <p class="right">{{list.id}}</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">注册时间：</p>
          <p class="right">{{list.createTime}}</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">最后登录时间：</p>
          <p class="right">{{list.lastLoginTime}}</p>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="left">
        <span><img src="../assets/icon_weixin.png"></span>
      </div>
      <div class="right special">
        <div class="item-info">
          <p class="left">微信 OpenID：</p>
          <p class="right">{{list.wxOpenId}}</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">用户昵称：</p>
          <p class="right">{{list.wxNickname}}</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">性别：</p>
          <p class="right" v-show="list.wxSex==0">未知</p>
          <p class="right" v-show="list.wxSex==1">男</p>
          <p class="right" v-show="list.wxSex==2">女</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">省份：</p>
          <p class="right">{{list.wxProvince}}</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">城市：</p>
          <p class="right">{{list.wxCity}}</p>
        </div>
        <div class="clear"></div>
        <div class="item-info">
          <p class="left">国家：</p>
          <p class="right">{{list.wxCountry}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'memberdetail',
      created () {
        const Id = this.$route.params.id
        this.$data.userId = Id
        this.$data.name = this.$route.params.name
        this.$http.get('api/appUser/get?id=' + Id).then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.hash = '#/login'
          } else if (res.body.code === 0) {
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
          headObj: {
            class: 'shop',
            titText: '会员详情'
          },
          hShow: false,
          list: {},
          name: '',
          userId: ''
        }
      }
    }
</script>

<style scoped>
  #memberdetail {
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
    background: url('../assets/icon-member.png') no-repeat;
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
    cursor: pointer;
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
    padding:10px 10px 10px 17px;;
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
  .bg-cont {
    width:100%;
    height:140px;
    background:url('../assets/user_detail_banner.png');
    position:relative;
  }
  .head-img {
    width:100px;
    height:100px;
    position:absolute;
    left:157px;
    bottom:0;
    overflow:hidden;
    margin-bottom:-50px;
    background-size:cover;
    border-radius:50%;
    -wibkit-border-radius:50%;
    -moz-border-radius:50%;
  }
  .info {
    height:250px;
    border:1px solid #ccc;
    border-top:none;
    padding:0 10px;
  }
  .info .left{
    height:100%;
    padding:70px 0 0;
    width:38%;
  }
  .info .right {
    height:100%;
    padding:20px 0 0;
    width:61%;
  }
  .info .special {
    padding:6px 0;
  }
  .info .left p {
    width:100%;
    text-align:center;
  }
  .top {
    margin-top:10px;
  }
  .info .left p.user-level {
    width:90px;
    height:20px;
    border-radius:10px;
    -webkit-border-radius:10px;
    -moz-border-radius:10px;
    line-height:20px;
    background-color:#FFC600;
    margin:0 auto;
  }
  .info .left p:nth-child(1){
    font-size:16px;
    line-height:40px;
  }
  .info .left span {
    display:inline-block;
    width:56px;
    height:56px;
    margin:30px 170px;
  }
  .item-title {
    width:33%;
    float:left;
    height:70px;
    border-bottom:1px solid #ddd;
  }
  .item-title p {
    line-height:24px;
    color:#212121;
  }
  .item-title p:nth-child(2){
    font-size:20px;
  }
  .item-info .left {
    width:110px;
    padding:20px 0 0;
  }
  .item-info .right {
    float:left;
  }
  .info-edit {
    position:absolute;
    right:20px;
    bottom:-17px;
    cursor:pointer;
  }
  a.router-link-active {
    color:#476D8F;
  }
</style>
