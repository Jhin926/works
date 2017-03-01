<template>
  <div id="">
    <ul class="add-address">
      <li>
        <label class="left">收货人</label>
        <div class="input-con">
          <input type="text" placeholder="请输入收货人姓名" v-model="receiver">
        </div>
      </li>
      <li>
        <label class="left">联系电话</label>
        <div class="input-con">
          <input type="tel" placeholder="请输入您的手机号" v-model="receiverPhone">
        </div>
      </li>
      <li>
        <label class="left">选择地区</label>
        <div class="input-con check-area">
          <region-picker auto @onchange="getArea">
          </region-picker>
        </div>
      </li>
      <li>
        <label class="left">详细地址</label>
        <div class="input-con">
          <textarea placeholder="请输入详细地址" v-model="address"></textarea>
        </div>
      </li>
    </ul>
    <p class="input-warn" v-show="receiverPhone != '' && !isRecePho">请输入正确的联系电话</p>
    <div class="button">
      <button  v-on:click="add">确认</button>
    </div>
    <loading v-if="isLoading"></loading>
    <alert v-if="showAlt">
      <div slot="content">{{altMessage}}</div>
      <p slot="sure" @click="showAlt = false;">确定</p>
    </alert>
  </div>
</template>
<script>
  export default {
    name: 'address',
    created () {
      document.title = '添加地址'
    },
    methods: {
      add: function () {
        if (this.$data.receiver === '') {
          window.alert('请输入收件人')
          return
        }
        if (!this.$data.isRecePho) {
          window.alert('请输入正确的手机号码')
          return
        }
        if (this.$data.area.province === undefined) {
          window.alert('请选择省区或者直辖市')
          return
        }
        if (this.$data.area.city === undefined) {
          window.alert('请选择城市')
          return
        }
        if (this.$data.address === '') {
          window.alert('请输入详细地址')
          return
        }
        this.$http({
          method: 'get',
          url: 'api/address/edit?receiver=' + this.$data.receiver + '&receiverPhone=' + this.$data.receiverPhone + '&province=' + this.$data.area.province + ' &city=' + this.$data.area.city + '&district=' + (this.$data.area.district || '') + '&address=' + this.$data.address,
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            if (this.$route.params.type === '1') {
              this.$router.push('/mine/addresslist')
            } else {
              this.$router.go(-1)
            }
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      },
      getArea: function (value) {
        this.$data.area = value
      }
    },
    watch: {
      receiverPhone: function (_val) {
        let myreg = /^1[34578]\d{9}$/
        if (myreg.test(this.$data.receiverPhone)) this.$data.isRecePho = true
        else this.$data.isRecePho = false
      }
    },
    data () {
      return {
        receiver: '',
        receiverPhone: '',
        isRecePho: false,
        area: {},
        address: '',
        isLoading: false,
        showAlt: false,
        altMessage: '错误信息'
      }
    }
  }
</script>

<style scoped>
   .add-address {
     margin: .3rem .16rem;
     padding-left: .16rem;
     padding-right: .16rem;
     border: 1px solid #dedede;
     background-color: #fff;
     border-radius: 2px;
     -webkit-border-radius: 2px;
   }
   .add-address li {
     height: .8rem;
     overflow: hidden;
     border-bottom: 1px solid #dedede;
   }
   .add-address li:last-child {
     border-bottom: none;
   }
   .add-address li > label {
     width: 1.6rem;
     padding-top: .24rem;
     font-size: .24rem;
   }
   .input-con {
     margin-left: 1.7rem;
     padding-top: .26rem;
   }
   .check-area {
     padding-top: .2rem;
   }
   .input-con input {
     font-size: .24rem;
   }
   .region-picker >label {
     width: 33%;
   }
   textarea {
     width:100%;
     font-size:.24rem;
     outline:none;
     resize:none;
     border:none;
     word-wrap:break-word;
     word-break:break-all;
   }
   .input-warn {
     margin: 0 .16rem .1rem .16rem;
     color: #cb4042;
   }
   .button{
     text-align: center;
   }
   .button button{
     position: absolute;
     top: 8.5rem;
     left: .32rem;
     width:5.76rem;
     height:.8rem;
     border:none;
     background:#cb4042;
     border-radius:2px;
     -webkit-border-radius:2px;
     color:#fff;
     font-size:.24rem;
   }
</style>
