<template>
  <div id="">
    <banner :banners="banners"></banner>
    <manor></manor>
    <div class="private-tea">
      <h2 class="private-tit">
        <span class="icon-tit"></span>
        高山私家茶
        <router-link to="/shop" tag="span" class="private-more">更多好茶</router-link>
      </h2>
      <private :teaList="tea"></private>
    </div>
    <bar></bar>
    <footer class="seat"></footer>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
import Banner from './components/Banner'
import Manor from './components/Manor'
import Private from './components/Private'
import Bar from './components/Bar'
var wx = require('weixin-js-sdk')

export default {
  name: 'index',
  created () {
    document.title = '人人当地主'
    var wxCode = ''
    var wSearch = window.location.search.substring(1)
    var serArr = wSearch.split('&')
    for (var i = 0; i < serArr.length; i++) {
      var oneSer = serArr[i].split('=')
      if (oneSer[0] === 'code') {
        wxCode = oneSer[1]
        break
      }
    }
    if (wxCode !== '') {
      this.$http.get('/api/user/wx/login?code=' + wxCode).then((res) => {
        if (res.body.code === 0) {
          if (res.body.data.mobileNumber === '' || res.body.data.mobileNumber === null) {
            this.$router.push('/login/' + res.body.data.id)
          }
        }
      })
    }

    // wx.hideOptionMenu()
    this.$http.get('/api/wx/config').then(function (res) {
      if (res.body.code === 0) {
        const infoObj = res.body.data
        this.$http.get('/api/user/info').then(function (res) {
          if (res.body.code === 0) {
            const wxName = res.body.data.wxNickname
            const mobile = res.body.data.mobileNumber
            wx.config({
              debug: false,
              appId: infoObj.appId,
              timestamp: infoObj.timestamp,
              nonceStr: infoObj.nonceStr,
              signature: infoObj.signature,
              jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
            })
            wx.ready(function () {
              wx.onMenuShareTimeline({
                title: wxName + '邀请您喝茶', // 分享标题
                link: 'http://gf.sankoubudai.com/share/share1.html?mobile=' + mobile + '&name=' + wxName, // 分享链接
                // link: 'http://wx.sankoubudai.com/share/share1.html?mobile=' + mobile + '&name=' + wxName, // 分享链接
                imgUrl: 'http://gf.sankoubudai.com/share/img/share.png', // 分享图标
                success: function () {
                  // window.alert('分享成功!!!!!!!!!')
                },
                cancel: function () {
                  // window.alert('取消分享')
                }
              })
              wx.onMenuShareAppMessage({
                title: wxName + '邀请您喝茶', // 分享标题
                desc: '', // 分享描述
                // link: 'http://wx.sankoubudai.com/share/share1.html?mobile=' + mobile + '&name=' + wxName, // 分享链接
                link: 'http://gf.sankoubudai.com/share/share1.html?mobile=' + mobile + '&name=' + wxName, // 分享链接
                imgUrl: 'http://gf.sankoubudai.com/share/img/share.png', // 分享图标
                success: function () {
                },
                cancel: function () {
                  // window.alert('取消分享')
                }
              })
            })
          }
        })
      } else if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })

    this.$http.get('/api/tea/list').then(function (res) {
      if (res.body.code === 0) {
        this.$data.tea = res.body.data
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
    this.$http.get('/api/banner/list?type=1').then(function (res) {
      if (res.body.code === 0) {
        this.$data.banners = res.body.data
      }
    })
  },
  components: {
    Banner,
    Manor,
    Private,
    Bar
  },
  data () {
    return {
      tea: [],
      showAlt: false,
      altMessage: '错误信息',
      banners: []
    }
  }
}
</script>

<style scoped>
  .private-tea {
    margin-top: .48rem;
    padding: 0 .16rem;
  }
  .private-tit {
    position: relative;
    margin-bottom: .16rem;
    font-size: .24rem;
  }
  .private-tit .icon-tit {
    float: left;
    width: 2px;
    height: .3rem;
    margin-top: .02rem;
    margin-right: .16rem;
    background-color: #cd4042;
  }
  .private-tit .private-more {
    position: absolute;
    top: 0;
    right: 0;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
