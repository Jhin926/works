<template>
  <div id="">
    <div class="">
      <y-head>
        <h2 class="tit" slot="text">默认地址</h2>
      </y-head>
      <section class="address-default" v-if="address.receiver">
        <ul class="default-info">
          <li>
            <p class="left info-tit">收货人:</p>
            <div class="info-text">{{address.receiver}}</div>
          </li>
          <li>
            <p class="left info-tit">联系电话:</p>
            <div class="info-text phoneno">{{address.receiverPhone}}</div>
          </li>
          <li>
            <p class="left info-tit">收货地址:</p>
            <div class="info-text">{{address.province}}{{address.city}}{{address.district}}{{address.address}}</div>
          </li>
        </ul>
        <div class="default-handle">
          <span class="left handle-btn" v-on:click="remove(address)">
            删除地址
          </span>
          <router-link class="handle-btn red" tag="span" :to="{'path': '/mine/addredit/'+ address.id + '/'+address.receiver + '/'+address.receiverPhone + '/'+address.province+'/'+address.city+'/'+(address.district || 0)+'/'+address.address}">
            编辑
          </router-link>
        </div>
      </section>
      <section class="default-none" v-if="!address.receiver">
        您还没有默认地址，点击下方设定
      </section>
    </div>
    <div class="address-other" v-if="addressList.length > 0">
      <y-head>
        <h2 class="tit" slot="text">其他地址</h2>
      </y-head>
      <section class="address-default" v-for="address in addressList">
        <ul class="default-info">
          <li>
            <p class="left info-tit">收货人:</p>
            <div class="info-text">{{address.receiver}}</div>
          </li>
          <li>
            <p class="left info-tit">联系电话:</p>
            <div class="info-text phoneno">{{address.receiverPhone}}</div>
          </li>
          <li>
            <p class="left info-tit">收货地址:</p>
            <div class="info-text">{{address.province}}{{address.city}}{{address.district}}{{address.address}}</div>
          </li>
        </ul>
        <div class="default-handle">
          <span v-on:click="remove(address)" class="left handle-btn">
            删除地址
          </span>
          <span class="handle-btn red" v-on:click="setDefault(address)">设为默认</span>
          <router-link class="handle-btn red" tag="span" :to="{'path': '/mine/addredit/'+ address.id + '/'+address.receiver + '/'+address.receiverPhone + '/'+address.province+'/'+address.city+'/'+(address.district || 0)+'/'+address.address}">
            编辑
          </router-link>
        </div>
      </section>
    </div>
    <div class="address-add">
      <router-link class="btn-add" tag="button" to="/mine/address/0">
        新增地址
      </router-link>
    </div>
    <footer class="seat"></footer>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
  export default {
    name: 'address-list',
    created () {
      document.title = '地址管理'
      this.$http({
        method: 'get',
        url: '/api/address/list?pageSize=200&currentPage=1',
        before: function () { this.$data.isLoading = true }
      }).then(function (res) {
        this.$data.isLoading = false
        if (res.body.code === 0 && res.body.data.results !== null) {
          const addrList = res.body.data.results
          if (addrList.length > 0) {
            for (var i = 0; i < addrList.length; i++) {
              if (addrList[i].isDefault === 0) {
                this.$data.addressList.push(addrList[i])
              } else {
                this.$data.address = addrList[i]
              }
            }
          } else {
            this.$router.replace('/mine/addrlist/empty')
          }
        }
      })
    },
    methods: {
      remove: function (_address) {
        this.$http({
          method: 'get',
          url: '/api/address/delete?id=' + _address.id,
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            if (this.$data.address === _address) {
              this.$data.address = {}
            } else {
              const otherAddr = this.$data.addressList
              for (var i = 0; i < otherAddr.length; i++) {
                if (otherAddr[i] === _address) {
                  otherAddr.splice(i, 1)
                }
              }
            }
          }
        })
      },
      setDefault: function (_address) {
        this.$http({
          method: 'get',
          url: '/api/address/marked/default?id=' + _address.id + '&isDefault=1',
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            const otherAddr = this.$data.addressList
            for (var i = 0; i < otherAddr.length; i++) {
              if (otherAddr[i] === _address) {
                otherAddr.splice(i, 1)
              }
            }
            var isEmt = false
            for (var item in this.$data.address) {
              console.log(item)
              isEmt = true
              break
            }
            if (isEmt) {
              otherAddr.push(this.$data.address)
            }
            this.$data.address = _address
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    },
    data () {
      return {
        address: {},
        addressList: [],
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
  .address-add {
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    margin-top: .6rem;
    background: #cb4042;
    text-align: center;
  }
  .btn-add {
    width: 100%;
    padding: .26rem 0;
    font-size: .24rem;
    color: #fff;
  }
  .address-default {
    margin: 0 .16rem;
    background-color: #fff;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    border: 1px solid #dedede;
  }
  .default-none {
    padding: 0 .2rem .2rem.2rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .default-info {
    padding: .2rem;
  }
  .default-info >li {
    margin-bottom: .2rem;
    overflow: hidden;
  }
  .default-info .info-tit {
    width: 1.4rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .default-info .info-text {
    font-size: .24rem;
    margin-left: 1.4rem;
  }
  .default-info .info-text.phoneno {
    font-size: .24rem;
  }
  .default-handle {
    padding: .2rem;
    text-align: right;
    border-top: 0.01rem solid #dedede;
  }
  .default-handle > span {
    display: inline-block;
    width: .96rem;
    height: .4rem;
    padding: .06rem 0;
    text-align: center;
    border: 1px solid #9b9b9b;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    font-size: .2rem;
  }
  .handle-btn {
    color: #9b9b9b;
  }
  .handle-btn.red {
    margin-left: .14rem;
    color: #cb4042;
    border-color: #cd4042;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
