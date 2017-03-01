<template>
  <div id="releasesuccess">
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
    <div class="cont">
      <p><img src="../assets/chenggong.png" width="100%"></p>
      <p>发布成功</p>
      <router-link to="../../index/shop" tag="p">确定</router-link>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'releasesuccess',
      created () {
        this.$http.get('api//user/info').then(function (res) {
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
          headObj: {
            class: 'shop',
            titText: '庄园订单详情'
          },
          hShow: false,
          name: ''
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
        }
      }
    }
</script>

<style scoped>
  #releasesuccess {
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
  .cont {
    width:100%;
    height:390px;
    padding:150px 490px 0;
  }
  .cont p:nth-child(2) {
    font-size:16px;
    color:#212121;
    font-weight:bold;
    margin:20px 0 30px;
    text-align:center;
  }
  .cont p:nth-child(3) {
    width: 100%;
    height: 36px;
    line-height: 37px;
    background: #476d8f;
    border-radius: 4px;
    color: #fff;
    text-align: center;
  }
</style>
