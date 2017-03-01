<template>
   <div id="empty">
     <div class="empty">
        <p class="empty-img">
          <img v-if="emptyCurrent.path == 'manor'" src="../assets/icon_empty_zyorder.png" />
          <img v-if="emptyCurrent.path == 'assets'" src="../assets/icon_empty_zichan.png" />
          <img v-if="emptyCurrent.path == 'car'" src="../assets/icon_shoppingcart_empty.png" />
          <img v-if="emptyCurrent.path == 'shop'" src="../assets/icon_empty_scorder.png" />
          <img v-if="emptyCurrent.path == 'teagoldcoin'" src="../assets/icon_empty_jinbi.png" />
          <img v-if="emptyCurrent.path == 'wallet'" src="../assets/icon_empty_wallet.png" />
          <img v-if="emptyCurrent.path == 'addrlist'" src="../assets/icon_empty_address.png" />
          <img v-if="emptyCurrent.path == 'sales'" src="../assets/icon_empty_daixiao.png" />
          <img v-if="emptyCurrent.path == 'tea'" src="../assets/icon_empty_shoucha.png" />
        </p>
        <p class="empty-text">{{emptyCurrent.text}}</p>
        <router-link tag="button" :to="{'path': goUrl}" class="empty-btn">{{emptyCurrent.btnText}}</router-link>
     </div>
     <bar></bar>
     <footer class="seat"></footer>
   </div>
</template>

<script>
  import Bar from './Bar'
  export default {
    name: 'empty',
    components: {
      Bar
    },
    created () {
      // document.title = 'empty'
      const type = this.$router.currentRoute.params.type
      const emtList = this.$data.emptyList
      for (var i = 0; i < emtList.length; i++) {
        if (emtList[i].path === type) {
          this.$data.emptyCurrent = emtList[i]
          if (type === 'addrlist') {
            this.$data.goUrl = '/mine/address/1'
          } else if (type === 'shop' || type === 'car') {
            this.$data.goUrl = '/shop'
          } else if (type === 'assets') {
            this.$data.goUrl = '/manorDetail/0'
          } else if (type === 'manor' || type === 'tea' || type === 'sales') {
            this.$data.goUrl = '/index'
          } else if (type === 'teagoldcoin') {
            this.$data.goUrl = '../invitation'
          } else if (type === 'wallet') {
            this.$data.goUrl = '/manorDetail/0'
          }
        }
      }
    },
    data () {
      return {
        emptyList: [
          {
            text: '您还没有属于自己的庄园',
            btnText: '承包庄园',
            imgUrl: '../assets/icon_empty_zichan.png',
            path: 'assets'
          },
          {
            text: '购物车空空如也',
            btnText: '买好茶',
            imgUrl: '../assets/icon_shoppingcart_empty.png',
            path: 'car'
          },
          {
            text: '您还没有相关订单',
            btnText: '去商城转转',
            imgUrl: '../assets/icon_empty_scorder.png',
            path: 'shop'
          },
          {
            text: '免费赚取更多茶金币',
            btnText: '邀请好友',
            imgUrl: '../assets/icon_empty_jinbi.png',
            path: 'teagoldcoin'
          },
          {
            text: '钱包空空',
            btnText: '去赚钱',
            imgUrl: '../assets/icon_empty_wallet.png',
            path: 'wallet'
          },
          {
            text: '您还没有相关订单',
            btnText: '承包庄园',
            imgUrl: '../assets/icon_empty_zyorder.png',
            path: 'manor'
          },
          {
            text: '您还没有添加过收货地址',
            btnText: '添加地址',
            imgUrl: '../assets/icon_empty_address.png',
            path: 'addrlist'
          },
          {
            text: '您要先种茶才会有收获哦',
            btnText: '承包庄园',
            imgUrl: '../assets/icon_empty_daixiao.png',
            path: 'sales'
          },
          {
            text: '您要先种茶才会有收获哦',
            btnText: '承包庄园',
            imgUrl: '../assets/icon_empty_shoucha.png',
            path: 'tea'
          }
        ],
        emptyCurrent: {
          text: '您还没有相关订单',
          btnText: '承包庄园',
          imgUrl: '../assets/icon_empty_zyorder.png',
          path: 'car'
        },
        goUrl: ''
      }
    }
  }
</script>

<style scoped>
  .empty {
    text-align: center;
  }
  .empty-img {
    margin: auto;
  }
  img {
    width:3rem;
    height:3rem;
    margin: 2rem 0 0;
  }
  .empty-text {
    margin-top: .5rem;
    font-size: .24rem;
  }
  .empty-btn {
    width: 5.76rem;
    padding: .2rem 0;
    margin-top: .8rem;
    font-size: .24rem;
    color: #fff;
    background-color: #cb4042;
    border-radius: 2px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
