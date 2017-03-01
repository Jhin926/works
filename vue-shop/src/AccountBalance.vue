<template>
  <div id="accountbalance">
    <div class="accountbalance">
      <div class="mine-bg">
        <p class="list-rule">
          <router-link v-if="mineinfo > 0" to="/mine/withdraw">提现</router-link>
        </p>
        <p class="username">可用余额(元)</p>
        <p class="user">￥{{mineinfo}}</p>
      </div>
      <div class="mine-other">
        <div class="tea-list-item" v-for="item in list">
          <div class="list-item-title">
            {{item[0].transactionTime | cutTime}}
          </div>
          <div class="mine-other-item" v-for="items in item">
          <span class="list-item">
            <span class="other-word">
              <span class="list-title" v-show="items.transactionType==1">收入</span>
              <span class="list-title" v-show="items.transactionType==2">提现</span>
              <span class="list-title" v-show="items.transactionType==3">消费</span>
              <p class="list-time">{{items.transactionTime}}</p>
            </span>
            <span class="other-word word-right">
              <span class="list-title">
                <span class="add" v-show="items.transactionType==1">+</span>
                <span class="plus" v-show="items.transactionType==2">-</span>
                {{items.amount}}
              </span>
              <p class="list-time">{{items.balance}}</p>
            </span>
          </span>
          </div>
        </div>
      </div>
    </div>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>

<script>
  export default {
    name: 'accountbalance',
    created () {
      document.title = '账户余额'
      this.$http.get('api/account/query/account/balance').then(function (res) {
        if (res.body.code === 0) {
          this.$data.mineinfo = res.body.data
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
      this.$http.get('api/account/list/account/balance').then(function (res) {
        if (res.body.code === 0) {
          if (JSON.stringify(res.body.data) === '{}') {
            this.$router.replace('/assets/wallet/empty')
          } else {
            this.$data.list = res.body.data
          }
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    filters: {
      cutTime: function (value) {
        return value.slice(0, 4) + '年' + value.slice(5, 7) + '月'
      }
    },
    data () {
      return {
        mineinfo: 0,
        list: {},
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
   .accountbalance {
     max-width:640px;
     margin:0 auto;
     overflow:hidden;
   }
   .mine-bg {
     width: 100%;
     height: 1.9rem;
     margin: 0 auto;
     background:url('./assets/wo_yue_bg.png')no-repeat;
     background-size:cover;
   }
   .mine-bg .list-rule {
     width:100%;
     height:0.6rem;
     margin:0 auto;
     padding:0.2rem 0.2rem 0.1rem 0;
   }
   .mine-bg .list-rule a {
     width:0.75rem;
     display:inline-block;
     height:0.36rem;
     float:right;
     border-radius:0.1rem;
     text-align:center;
     line-height:0.36rem;
     background:rgba(0,0,0,0.3);
     color:#fff;
     font-size:0.24rem;
   }
   .mine-bg p {
     width: 4rem;
     margin: 0.24rem auto;
     text-align: center;
     text-overflow: ellipsis;
     overflow: hidden;
   }
   .mine-bg p.user {
     font-size:0.6rem;
     color:#fff;
     margin:-0.1rem auto;
   }
   .mine-bg .username {
     width:1.5rem;
     height:0.3rem;
     color:#fff;
     font-size:0.24rem;
     text-align:center;
     line-height:0.3rem;
     margin-top:-0.05rem;
   }
   .mine-other {
     width: 100%;
   }
   .mine-other .mine-other-item {
     width:100%;
     margin:0 auto;
     height:1.2rem;
     padding:0.1rem;
     background-color:#fff;
   }
   .mine-other .mine-other-item:last-child span{
     border-bottom:none;
   }
   .list-item-title {
     width:100%;
     height:0.7rem;
     margin:0 auto;
     font-size:0.26rem;
     background:#efefef;
     padding-left:0.2rem;
     padding-top:0.1rem;
     line-height:0.7rem;
   }
   .mine-other .mine-other-item:nth-child(1){
     border-top:1px solid #dedede;
   }
   .mine-other .mine-other-item .list-item{
     width:100%;
     height:100%;
     line-height:1.2rem;
     margin-left:0.2rem;
     padding:0.1rem 0.4rem 0.1rem 0;
     border-bottom:1px solid #dedede;
   }
   .mine-other .mine-other-item span {
     display:inline-block;
     font-size:0.28rem;
     vertical-align:top;
   }
   .mine-other .other-word{
     display:inline-block;
     width:49%;
   }
   .mine-other .mine-other-item span img{
     width:0.3rem;
     height:0.3rem;
     margin:0.15rem 0.12rem;
     vertical-align:middle;
   }
   .word-right {
     text-align:right;
   }
   .list-time {
     font-size:0.24rem;
     color:#9b9b9b;
   }
   .list-title {
     margin-bottom:0.1rem;
   }
</style>
