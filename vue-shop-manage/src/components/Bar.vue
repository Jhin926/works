<template>
  <div id="bar" class="left" v-bind:style="{ height: winHei + 'px'}">
    <h1 class="logo">{{info}}</h1>
    <ul class="bar-list">
      <router-link to="/index/member" tag="li">
        <span class="left bar-ico bar-member"></span>
        <p class="bar-text">会员管理</p>
      </router-link>
      <router-link to="/index/shop" tag="li">
        <span class="left bar-ico bar-product"></span>
        <p class="bar-text">商品管理</p>
      </router-link>
      <router-link to="/index/teamanor" tag="li">
        <span class="left bar-ico bar-manor"></span>
        <p class="bar-text">庄园管理</p>
      </router-link>
      <router-link to="/index/sorder" tag="li">
        <span class="left bar-ico bar-order"></span>
        <p class="bar-text">商城订单管理</p>
      </router-link>
      <router-link to="/index/morder" tag="li">
        <span class="left bar-ico bar-order"></span>
        <p class="bar-text">庄园订单管理</p>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'bar',
  created () {
    this.$http.get('api/config/list/boss').then(function (res) {
      if (res.body.code === 0) {
        for (var i in res.body.data) {
          if (res.body.data[i].name === 'boss.name') {
            this.$data.info = res.body.data[i].value
          }
        }
      } else {
        window.alert(res.body.message)
      }
    })
  },
  data () {
    return {
      winHei: document.documentElement.clientHeight,
      info: ''
    }
  }
}
</script>

<style scoped>
#bar {
  width: 220px;
  background-color: #476d8f;
}
.logo {
  height: 80px;
  line-height:80px;
  font-size:16px;
  color:#fff;
  text-align: center;
}
.bar-list {
  border-top: 1px solid #527da0;
  border-bottom: 1px solid #527da0;
}
.bar-list li {
  height: 45px;
  padding: 14px 20px;
  border-bottom: 1px solid #527da0;
}
.bar-list li:hover,
.bar-list li.router-link-active {
  cursor: pointer;
  border-left: 3px solid #91cd76;
  background: url("../assets/arrow-right.png") no-repeat 191px center #375e81;
}
.bar-ico {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 10px;
}
.bar-ico.bar-product {
  background: url("../assets/icon-shop.png") no-repeat;
}
li.router-link-active .bar-ico.bar-product {
  background: url("../assets/icon-shop1.png") no-repeat;
}
.bar-ico.bar-order {
  background: url("../assets/icon-order.png") no-repeat;
}
li.router-link-active .bar-ico.bar-order {
  background: url("../assets/icon-order1.png") no-repeat;
}
.bar-ico.bar-member {
  background: url("../assets/icon-member.png") no-repeat;
}
li.router-link-active .bar-ico.bar-member {
  background: url("../assets/icon-member1.png") no-repeat;
}
.bar-ico.bar-manor {
  background: url("../assets/icon-manor.png") no-repeat;
}
li.router-link-active .bar-ico.bar-manor {
  background: url("../assets/icon-manor1.png") no-repeat;
}
.bar-text {
  color: #aac5d6;
}
.bar-list li.router-link-active .bar-text {
  color: #fff;
  font-weight: bold;
}
</style>
