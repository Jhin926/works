<template>
  <div>
    <div class="car">
      <div class="">
        <router-link tag="section" :to="{'path': '/goodsdetail/'+shop.teaId}" class="car-list" v-for="(shop, index) in carList">
          <input v-on:click.stop="" class="left order-check" type="checkbox" :value="shop" v-model="checked" />
          <div class="car-scan">
            <p class="left car-img">
              <img :src="shop.indexPicture" width="100%" height="100%" alt=""/>
            </p>
            <div class="car-info">
              <h2 class="big car-tit">
                {{shop.teaCategoryName}}&nbsp;{{shop.starLeve | starToText}}&nbsp;{{shop.teaName | cutTitle}}
              </h2>
              <p class="car-weight">{{shop.weightText}}</p>
              <p class="car-price">
                <span class="new-cost">&yen;{{shop.unitPrice}}</span>
              </p>
              <p class="num-cont">
              <span class="check-num">
               <span v-on:click.stop="changeNum(shop, index)" class="left num-add"><img
                 src="../assets/minus.png" width="100%"/></span>
               <span class="check-number">{{shop.quantity}}</span>
               <span v-on:click.stop="changeNum(shop, index, true)" class="right num-less"><img src="../assets/plus.png" width="100%"/></span>
             </span>
              </p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="car-handle">
        <input type="checkbox" name="all-checked" class="left order-check all-check" v-on:click.stop="checkAll" :checked="allCheck" />
        <span class="left middle btn-all">全选</span>
        <span class="left middle btn-del" v-on:click="remove">删除</span>
        <span class="left middle btn-total">共计 </span>
        <span class="left all-amount">&yen;{{checkedAmount}}</span>
        <button v-on:click.stop="goPay(teaIds, teaNums)" class="right big btn-place">确认<!--<span class="checked-num">({{checked.length}})</span>--></button>
      </div>
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
  name: 'car',
  filters: {
    cutTitle: function (value) {
      if (!value) return ''
      if (value.length > 12) {
        return value.substring(0, 12)
      }
      return value
    }
  },
  methods: {
    checkAll: function () {
      var _this = this
      if (_this.$data.allCheck === true) {
        _this.checked = []
      } else {
        _this.checked = _this.carList
      }
    },
    changeNum: function (_shop, _index, _isAdd) {
      if (_isAdd) {
        _shop.quantity += 1
      } else {
        if (_shop.quantity > 1) {
          _shop.quantity--
        }
      }
      this.$data.isLoading = true
      this.$http.get('api/shoppingcart/ quantity/modify?id=' + _shop.id + '&quantity=' + _shop.quantity).then(function (res) {
        this.$data.isLoading = false
        if (res.body.code === 0) {
          this.$data.carList.splice(_index, 1, _shop)
          const checked = this.$data.checked
          var checkedAmount = 0
          for (var i = 0; i < checked.length; i++) {
            checkedAmount += checked[i].quantity * checked[i].unitPrice
          }
          if (checkedAmount > 0) {
            this.$data.checkedAmount = checkedAmount.toFixed(2)
          }
        } else {
          this.$data.altMessage = res.body.message
          this.$data.showAlt = true
        }
      })
    },
    remove: function () {
      const checkedCar = this.$data.checked
      if (checkedCar.length > 0) {
        var ids = ''
        for (var i = 0; i < checkedCar.length; i++) {
          ids += ',' + checkedCar[i].id
        }
        this.$http({
          method: 'get',
          url: '/api/shoppingcart/batch/remove?ids=' + ids.substring(1),
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            this.$data.checked = []
            const carList = this.$data.carList
            for (var i = 0; i < carList.length; i++) {
              for (var j = 0; j < checkedCar.length; j++) {
                if (carList[i] === checkedCar[j]) {
                  carList.splice(i, 1)
                  i--
                }
              }
            }
            if (carList.length === 0) {
              this.$router.replace('/shop/car/empty')
            }
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      } else {
        this.$data.altMessage = '请先选中订单'
        this.$data.showAlt = true
      }
    },
    goPay: function (_teaIds, _teaNums) {
      if (_teaIds === '') {
        this.$data.altMessage = '请先选中订单'
        this.$data.showAlt = true
      } else {
        window.location.href = '/?#/order/' + _teaIds + '/' + _teaNums + '/1'
      }
    }
  },
  watch: {
    'checked': {
      handler: function (_val) {
        const checked = this.$data.checked
        var checkedAmount = 0
        var checkedIds = ''
        var checkedNums = ''
        for (var i = 0; i < checked.length; i++) {
          checkedAmount += checked[i].quantity * checked[i].unitPrice
          checkedIds += checked[i].id + ','
          checkedNums += checked[i].quantity + ','
        }
        this.$data.checkedAmount = checkedAmount.toFixed(2)// 选中的茶价格
        this.$data.teaIds = checkedIds.substring(0, checkedIds.length - 1)// 选中的购物车的id
        this.$data.teaNums = checkedNums.substring(0, checkedNums.length - 1)// 选中的茶数量
        if (_val.length === this.$data.carList.length) {
          this.$data.allCheck = true
        } else {
          this.$data.allCheck = false
        }
      },
      deep: true
    }
  },
  created () {
    document.title = '购物车'
    this.$http({
      method: 'get',
      url: '/api/shoppingcart/list',
      before: function () { this.$data.isLoading = true }
    }).then(function (res) {
      this.$data.isLoading = false
      if (res.body.code === 0) {
        if (res.body.data.length > 0) {
          this.$data.carList = res.body.data
        } else {
          this.$router.replace('/shop/car/empty')
        }
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
      carList: [],
      checked: [],
      teaIds: '',
      teaNums: '',
      allCheck: false,
      buyNumber: 1,
      checkedAmount: 0,
      isActive: true,
      isLoading: false,
      showAlt: false,
      altMessage: '错误信息'
    }
  }
}
</script>

<style scoped>
  .big {
    font-size: .26rem;
  }
  .middle {
    font-size: .24rem;
  }
  .gray {
    color: #9b9b9b;
  }
  .car {
    background-color: #fff;
    margin: .2rem .16rem;
    border: 1px solid #dedede;
    border-radius: 2px;
    -webkit-border-radius: 2px;
  }
  .car-list {
    position: relative;
    overflow: hidden;
    margin-left: .2rem;
    padding: .3rem .2rem .3rem 0;
    border-bottom: 0.02rem solid #dedede;
  }
  input.order-check {
    display: inline-block;
    background: none;
    width: .3rem;
    height: .3rem;
    border: 0.02rem solid #9b9b9b;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    margin-top: .36rem;
    appearance:none;
    -webkit-appearance:none;
    -moz-appearance:none;
    outline: none;
  }
  input.order-check:checked {
    background: url("../assets/selected.png") no-repeat center;
    background-size: 90% 90%;
  }
  input.all-check {
    margin: .26rem .06rem 0 .2rem
  }
  .car-scan {
    margin-left: .5rem;
    overflow: hidden;
  }
  .car-img {
    width: 1.6rem;
    height: 1.06rem;
    overflow: hidden;
  }
  .car-info {
    margin-left: 1.8rem;
  }
  .car-weight {
    margin-top: .1rem;
    font-size: .24rem;
    color: #9b9b9b;
  }
  .car-list:last-child {
    border-bottom: none;
  }
  .car-price {
    margin-top: .1rem;
  }
  .new-cost {
    margin-right: .1rem;
    font-size: .24rem;
    color: #d0021b;
  }
  .num-cont {
    position: absolute;
    right: .16rem;
    top: .8rem;
  }
  .check-num {
    display: inline-block;
    width: 1.2rem;
    height: .24rem;
    text-align: center;
  }
  .check-num .num-add,
  .check-num .num-less {
    display: inline-block;
    width: .28rem;
    height: .28rem;
    border: 0.02rem solid #dedede;
    font-size: .28rem;
    color: #9b9b9b;
    line-height: .28rem;
  }
  .check-number {
    line-height: .24rem;
    font-size: .21rem;
  }
  .car-handle {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: .8rem;
    background-color: #fff;
    border-top: .02rem solid #ededed;
  }
  .btn-all,
  .btn-del {
    margin: .26rem .16rem 0 .1rem;
  }
  .btn-total {
    margin-left: .26rem;
    margin-top: .26rem;
  }
  .all-amount {
    margin-top: .26rem;
    font-size: 0.24rem;
    color: #cb4042;
  }
  .btn-place {
    width: 2rem;
    height: 100%;
    background-color: #cb4042;
    color: #fff;
  }
  .checked-num {
    color: #fff;
    font-size: .28rem;
  }
  .seat {
    min-width: .1rem;
    min-height: 1.1rem;
  }
</style>
