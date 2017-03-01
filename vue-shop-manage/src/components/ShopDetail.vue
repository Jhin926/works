<template>
  <div id="shopdetail">
    <div id="title">
      <h2 :class="headObj.class">
        <span class="icon-tit"></span>
        {{headObj.titText}}
      </h2>
      <div class="head-handle">
        <button class="btn-tit" v-if="headObj.status == 3 || headObj.status ==1" v-on:click="release">
          发布
        </button>
        <button class="btn-tit" v-show="headObj.status==2" v-on:click="shelves">
          下线
        </button>
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
    <div class="detail-path">
      <router-link to="../../../shop">商品管理</router-link> >
      <span>{{list.teaCategoryName}} {{list.starLevel | starToText}} {{list.title}} {{list.weightText}}</span>
    </div>
    <div class="info-cont">
      <div class="info-item">
       <div class="left">
         <!--<img  :src="list.indexPicture ? (list.indexPicture.indexOf('http') >= 0 ? list.indexPicture : 'http://'+ list.indexPicture) : ''"  width="100%" height="100%">-->
         <swiper :options="swiperOption" class="swiper-box">
           <swiper-slide v-for="img in list.teaPictures">
               <img :src="img.pictureUrl" width="100%" height="100%" />
           </swiper-slide>
           <div class="swiper-pagination" slot="pagination"></div>
         </swiper>
       </div>
       <div class="right">
         <p>{{list.teaCategoryName}} {{list.starLevel | starToText}} {{list.title}} {{list.weightText}}</p>
         <p>&yen;{{list.unitPrice}}</p>
         <div class="product-info">
           <div class="item-product">
             <span>货号：</span>
             <span>{{list.artNo}}</span>
           </div>
           <div class="item-product">
             <span>库存：</span>
             <span>{{list.totalInventory}}</span>
           </div>
           <div class="item-product">
             <span>销量：</span>
             <span>{{list.salesVolume}}</span>
           </div>
           <div class="item-product">
             <span>重量：</span>
             <span>{{list.weight}}g</span>
           </div>
           <div class="item-product">
             <span>星级：</span>
             <span>{{list.starLevel | starToText}}</span>
           </div>
         </div>
       </div>
        <div class="clear"></div>
      </div>

      <div class="product-title">
        商品规格
      </div>
      <table  border="0" cellspacing="0" cellpadding="0">
        <thead>
         <tr>
           <td>品类：</td>
           <td>{{list.teaCategoryName}}</td>
           <td>品名：</td>
           <td>{{list.teaCategoryName}}</td>
           <td>保质期：</td>
           <td>{{list.expirationDate}}</td>
         </tr>
         <tr>
           <td>原产地：</td>
           <td>{{list.producingArea}}</td>
           <td>排序号：</td>
           <td>{{list.sortNo}}</td>
           <td>发布日期：</td>
           <td>{{list.createTime}}</td>
         </tr>
        </thead>
      </table>
      <div class="product-title">
        详情
      </div>
      <div class="img-cont">
        <div class="detail-word">
          {{list.desc}}
        </div>
        <div class="detail-img" v-for="item in list.teaPicturesShowResults">
          <img :src="item.pictureUrl ? (item.pictureUrl.indexOf('http') >= 0 ? item.pictureUrl : 'http://'+ item.pictureUrl) : ''"  width="100%" />
        </div>
      </div>
      <div class="icon-cont">
        <span v-on:click="edit(headObj)"><img src="../assets/icon_detail_edit.png"></span>
        <span v-on:click="isSwitch = !isSwitch"><img src="../assets/icon_detail_delete.png"></span>
      </div>
    </div>
    <div class="remark-model" v-show="isSwitch">
      <div class="remark-win">
        <p>
          <span class="red">删除提示</span>
          <span>确认要删除吗？</span>
          <span>删除后相关信息将会清空且无法恢复</span>
        </p>
        <p>
          <span v-on:click="isSwitch = !isSwitch">取消</span>
          <span v-on:click="remove">删除</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'shopdetail',
      created () {
        const Id = this.$route.params.id
        this.$http.get('/api/tea/info?id=' + Id).then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.hash = '#/login'
          } else if (res.body.code === 0) {
            this.$data.list = res.body.data
          } else {
            window.alert(res.body.message)
          }
        })
        this.$http.get('api/user/info').then(function (res) {
          if (res.body.code === 300001 || res.body.code === 300002) {
            window.location.href = '#/login'
          } else if (res.body.code === 0) {
            this.$data.name = res.body.data.name
          } else {
            window.alert(res.body.message)
          }
        })
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
        },
        edit: function (_val) {
          if (parseInt(_val.status) === 2) {
            window.alert('产品已上线，不可编辑')
            return
          } else if (parseInt(_val.status) === 1 || parseInt(_val.status) === 3) {
            window.location.href = '#/index/shop/shopedit/' + this.$data.productId
          }
        },
        remove: function () {
          var Id = this.$route.params.id
          this.$http.get('api/tea/delete?id=' + Id).then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '../#/index/shop'
            } else {
              window.alert(res.body.message)
            }
          })
        },
        release: function () {
          var id = this.$route.params.id
          this.$http.get('api/tea/launch?id=' + id).then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '#/index/shop'
            } else {
              window.alert(res.body.message)
            }
          })
        },
        shelves: function (_val) {
          var id = this.$route.params.id
          this.$http.get('api/tea/offline?id=' + id).then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '#/index/shop'
            } else {
              window.alert(res.body.message)
            }
          })
        }
      },
      filters: {
        starToText: function (value) {
          if (value === 10) return '庄园直供'
          else {
            var starText = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
            return starText[value - 1]
          }
        }
      },
      data () {
        return {
          headObj: {
            class: 'shop',
            titText: '商城产品详情',
            status: this.$route.params.status
          },
          hShow: false,
          list: {},
          name: '',
          isSwitch: false,
          productId: this.$route.params.id,
          swiperOption: {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 30,
            autoplay: 3000
          }
        }
      }
    }
</script>

<style scoped>
  #shopdetail {
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
    background: url('../assets/icon-shop2.png') no-repeat;
  }
  .head-handle {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 240px;
  }
  .btn-tit {
    width: 106px;
    height: 35px;
    padding: 9px 5px;
    background-color: #f9f9f8;
    border: 1px solid #c7cacd;
    border-radius: 2px;
    cursor:pointer;
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
    position:absolute;
    padding:10px 10px 10px 17px;
    border: 1px solid #eee;
    background: #fff;
    cursor:pointer;
  }
  .detail-path {
    line-height:50px;
  }
  .detail-path span {
    color:#9b9b9b;
  }
  .info-cont .info-item {
    height:230px;
  }
  .info-cont .left {
    width:322px;
    height:215px;
    border:1px solid #ccc;
  }
  .info-cont .right {
    float:left;
    padding:10px 20px;
    width:700px;
  }
  .info-cont .right p:nth-child(1){
    font-size:18px;
    color:#212121;
  }
  .info-cont .right p:nth-child(2){
    font-size:24px;
    color:#d2011b;
    margin-top:8px;
  }
  .info-cont .right p:nth-child(2) span{
    font-size:14px;
    color:#9b9b9b;
  }
  .product-info {
    width:100%;
    height:140px;
    margin-top:8px;
    padding-top:20px;
    border-top:1px solid #e6e6e6;
  }
  .item-product {
    line-height:24px;
  }
  .product-title {
    width:100%;
    height:50px;
    line-height:50px;
    font-size:18px;
    border-bottom:1px solid #e6e6e6;
  }
  table thead tr td:nth-child(1),
  table thead tr td:nth-child(3),
  table thead tr td:nth-child(5){
    height:45px;
    width:110px;
    background-color:#f6f6f6;
    padding:15px;
  }
  table {
    border-right:1px solid #e6e6e6;
    border-bottom:1px solid #e6e6e6;
  }
  table td {
    border-left:1px solid #e6e6e6;
    border-top:1px solid #e6e6e6;
  }
  table thead tr td:nth-child(2),
  table thead tr td:nth-child(4),
  table thead tr td:nth-child(6){
    height:45px;
    width:247px;
    padding:15px;
  }
  .img-cont {
    padding-top:10px;
    min-height:150px;
  }
  .img-cont .detail-word {
    width:100%;
    line-height:20px;
    margin:0 0 15px 0;
  }
  .img-cont .detail-img {
    max-width:640px;
    margin:-3px auto 0;
  }
  .icon-cont {
    position:absolute;
    width:50px;
    height:100px;
    right:24px;
    top:130px;
  }
  .icon-cont span {
    display:inline-block;
    width:36px;
    height:36px;
    border-radius:50%;
    cursor:pointer;
    margin-bottom:10px;
  }
  a.router-link-active {
    color:#476d8f;
  }
  .remark-win {
    width:300px;
    height:200px;
    border-radius:8px;
    border:1px solid #ededed;
    position:absolute;
    background:#fff;
    left:0;
    top:0;
    right:0;
    bottom:0;
    margin:auto;
  }
  .remark-model{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.4);
    position: fixed;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
  }
  .remark-win p {
    height:50%;
  }
  .remark-win p:first-child{
    border-bottom:1px solid #ddd;
    text-align:center;
    height:118px;
  }
  .remark-win p:first-child span {
    display:block;
    width:100%;
  }
  .remark-win p:first-child span:nth-child(1) {
    font-size:24px;
    color:#ff6151;
    margin:30px auto 15px;
  }
  .remark-win p:first-child span:nth-child(2) {
    font-size:14px;
    color:#212121;
    margin:0 auto 16px;
  }
  .remark-win p:nth-child(2) span {
    display:inline-block;
    width:49%;
    text-align:center;
    line-height:50px;
    cursor:pointer;
  }
  .remark-win p:nth-child(2) span:nth-child(1) {
    border-right:1px solid #ddd;
  }
  .swiper-box {
    width:100%;
    height:100%;
  }
</style>
