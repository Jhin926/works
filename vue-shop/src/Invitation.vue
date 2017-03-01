<template>
    <div class="invitation">
       <div class="invitation-top">
         <img src="./assets/top_title.png" width="100%" />
       </div>
       <div class="invitation-const">
          <div class="invitation-const-item">
             <div class="const-item-title">
               <p class="left">
                 <span>成功邀请</span>
                 <span>赚取金币</span>
               </p>
               <p class="left big">
                 <span>{{invite.inviteNum}}人</span>
                 <span>{{invite.referrerGoldCoin}}个</span>
               </p>
             </div>
             <div class="item-cont">
               <p class="cont-title">邀请奖励规则</p>
               <div class="cont-article">
                 <div class="article-item">
                   <p class="left">1、</p>
                   <p class="right">分享邀请链接至您的好友，好友注册成功，您和您的好友可同时获得1000茶金币；</p>
                 </div>
                 <div class="clear"></div>
                 <div class="article-item">
                   <p class="left">2、</p>
                   <p class="right">多邀请多得，茶金币可以直接抵扣茶叶购买费用，可累加使用；</p>
                 </div>
                 <div class="clear"></div>
                 <div class="article-item">
                   <p class="left">3、</p>
                   <p class="right">在本页面可查询邀请情况和茶金币额度；</p>
                 </div>
                 <!--<div class="clear"></div>
                 <div class="article-item">
                   <p class="left">4、</p>
                   <p class="right">活动最终解释权归属三口布袋所有。</p>
                 </div>-->
                 <div class="clear"></div>
                 <div class="button">
                   <a>
                     <p v-on:click.stop="showModal = true">
                       <span><img src="./assets/wechat_icon.png" width="100%" /></span>
                       <span>一键邀请微信好友</span>
                     </p>
                   </a>
                 </div>
                 <div class="footer-message">
                   <p>
                     <span>任何疑问，欢迎</span>
                     <a href="tel:400-089-9458">咨询客服</a>
                   </p>
                 </div>
               </div>
             </div>
          </div>
       </div>
      <div class="share-modal" v-show="showModal">
        <p class="share-cont"><img src="./assets/img-share.png" width="100%" height="100%" /></p>
      </div>
      <alert v-if="showAlt">
        <div slot="content">{{altMessage}}</div>
        <p slot="sure" @click="showAlt = false;">确定</p>
      </alert>
    </div>
</template>

<script>
var wx = require('weixin-js-sdk')
export default {
  name: 'invitation',
  created () {
    document.title = '邀请有礼'
    this.$http.get('/api/invite/info').then(function (res) {
      if (res.body.code === 0) {
        this.$data.invite = res.body.data
      } else if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appid + '&redirect_uri=' + this.enUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
      } else {
        this.$data.altMessage = res.body.message
        this.$data.showAlt = true
      }
    })
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
                imgUrl: 'http://gf.sankoubudai.com/share/img/share.png', // 分享图标
                success: function () {
                  this.$data.showModal = false
                  // window.alert('分享成功!!!!!!!!!')
                },
                cancel: function () {
                  // window.alert('取消分享')
                }
              })
              wx.onMenuShareAppMessage({
                title: wxName + '邀请您喝茶', // 分享标题
                desc: '', // 分享描述
                link: 'http://gf.sankoubudai.com/share/share1.html?mobile=' + mobile + '&name=' + wxName, // 分享链接
                imgUrl: 'http://gf.sankoubudai.com/share/img/share.png', // 分享图标
                success: function () {
                  this.$data.showModal = false
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
  },
  data () {
    return {
      showModal: false,
      invite: {},
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>

<style scoped>
  .invitation {
    position: absolute;
    height: 100%;
    background: -webkit-linear-gradient(left, #2297e3 , #8e54e9);
    background: -o-linear-gradient(right, #2297e3, #8e54e9);
    background: -moz-linear-gradient(right, #2297e3, #8e54e9);
    background: linear-gradient(to right, #2297e3 , #8e54e9);
  }
  .invitation-top {
    margin-top: -.6rem;
  }
  .invitation-const {
    height:6.5rem;
    margin-top:0.2rem;
  }
  .invitation-const-item {
    width:86%;
    margin:0 auto;
    border:1px solid #ededed;
    border-radius:0.1rem;
    background-color:#f7f7f7;
  }
  .const-item-title {
    width:100%;
    background:#fff;
    height:1.1rem;
  }
  .const-item-title p {
    width:100%;
    margin:0.15rem auto -0.05rem;
  }
  .const-item-title p span {
    display:inline-block;
    width:49%;
    font-size:0.2rem;
    color:#9b9b9b;
    text-align:center;
  }
  .const-item-title .big span{
    font-size:0.4rem;
  }
  .item-cont {
    padding:0.25rem 0.2rem 0;
    height:4.5rem;
  }
  .cont-title {
    font-size:0.24rem;
    width:100%;
    text-align:center;
  }
  .cont-article {
    margin:0.15rem 0 0.25rem;
  }
  .article-item p {
    font-size:0.24rem;
    color:#9b9b9b;
    line-height:0.35rem;
  }
  .left {
    width:7%;
  }
  .right {
    width:92%;
  }
  .button {
    width:100%;
    border-radius:0.1rem;
    height:0.8rem;
    background:#65b633;
    margin:0.25rem 0 0.1rem;
  }
  .button a {
    display:inline-block;
    width:100%;
    height:100%;
  }
  .button a p {
    height:100%;
    text-align:center;
  }
  .button a p span {
    display:inline-block;
    line-height:0.8rem;
    font-size:0.24rem;
    color:#fff;
  }
  .button a p span:nth-child(1){
    width:0.4rem;
    height:0.4rem;
    margin-right:0.1rem;
  }
  img {
    vertical-align:middle;
  }
  .footer-message p {
    text-align:center;
    font-size:0.2rem;
    line-height:0.3rem;
  }
  .footer-message p span {
    color:#9b9b9b;
  }
  .footer-message p a {
    color:#4a4a4a;
  }
  .clear {
    clear:both;
  }
  .share-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .4);
  }
  .share-cont {
    width: 2.75rem;
    height: 1.66rem;
    float: right;
    text-align: right;
  }
</style>
