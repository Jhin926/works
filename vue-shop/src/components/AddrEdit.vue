<template>
  <div id="">
    <ul class="add-address">
      <li>
        <label class="left">收货人</label>
        <div class="input-con">
          <input type="text" placeholder="请输入收货人姓名" v-model="address.username">
        </div>
      </li>
      <li>
        <label class="left">联系电话</label>
        <div class="input-con">
          <input type="tel" placeholder="请输入您的手机号" v-model="address.tel">
        </div>
      </li>
      <li>
        <label class="left">选择地区</label>
        <div class="input-con check-area">
          <region-picker auto :province="address.province.substring(0,address.province.length-1)" :city="$route.params.city" :district="$route.params.district" @onchange="getAddr">
          </region-picker>
        </div>
      </li>
      <li>
        <label class="left">详细地址</label>
        <div class="input-con">
          <textarea placeholder="请输入详细地址" v-model="$route.params.area"></textarea>
        </div>
      </li>
    </ul>
    <div class="button">
      <button  v-on:click="save">确认</button>
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
    name: 'addressedit',
    created () {
      document.title = '编辑地址'
    },
    methods: {
      getAddr: function (_value) {
        const address = this.$data.address
        address.province = _value.province
        address.city = _value.city
        address.district = _value.district
      },
      save: function () {
        const address = this.$data.address
        if (address.username === '') {
          window.alert('请输入收货人姓名')
          return
        }
        let myreg = /^1[34578]\d{9}$/
        if (!myreg.test(this.$data.address.tel)) {
          window.alert('请输入正确格式的联系电话')
          return
        }
        if (address.province === undefined) {
          window.alert('请选择省区或者直辖市')
          return
        }
        if (address.city === undefined) {
          window.alert('请选择城市')
          return
        }
        if (this.$route.params.area === '') {
          window.alert('请输入详细地址')
          return
        }
        var reParam = {}
        reParam.id = address.id
        reParam.receiver = address.username
        reParam.receiverPhone = address.tel
        reParam.province = address.province
        reParam.city = address.city
        reParam.district = address.district === '0' ? '' : address.district
        reParam.address = this.$route.params.area
        this.$http({
          method: 'get',
          params: reParam,
          url: '/api/address/edit',
          before: function () { this.$data.isLoading = true }
        }).then(function (res) {
          this.$data.isLoading = false
          if (res.body.code === 0) {
            this.$router.go(-1)
          } else {
            this.$data.altMessage = res.body.message
            this.$data.showAlt = true
          }
        })
      }
    },
    data () {
      const cRoute = this.$router.currentRoute.params
      return {
        address: cRoute,
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
    padding-top: .24rem;
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
