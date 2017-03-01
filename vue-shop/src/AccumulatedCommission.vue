<template>
  <div id="accumulatedcommission">
    <div class="accumulatedcommission">
      <div class="mine-other">
        <div class="tea-list-item" v-for="item in infoList">
          <div class="list-item-title">
            <span>{{item[0].year}}</span>
            <span>.</span>
            <span v-show="item[0].month>=1 && item[0].month<=3">春</span>
            <span v-show="item[0].month>=4 && item[0].month<=6">夏</span>
            <span v-show="item[0].month>=7 && item[0].month<=9">秋</span>
            <span v-show="item[0].month>=10 && item[0].month<=12">冬</span>
          </div>
          <div class="mine-other-item" v-for="items in item">
            <router-link :to="{path: 'assets/manor/'+items.orderId+'/'+items.teaManorId}">
              <span class="list-item">
                <span class="other-word">
                  <span class="list-title">{{items.teaManorName}}</span>
                  <p>{{items.updateTime}}</p>
                </span>
                <span class="other-word word-right">
                  {{items.earnings}}元
                </span>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'accumulatedcommission',
    created () {
      document.title = '代销收益'
      this.$http.get('api/assets/tea/manor/quarter/order?earningsType=2').then(function (res) {
        if (JSON.stringify(res.body.data) === '{}') {
          this.$router.replace('/assets/sales/empty')
        } else {
          this.$data.infoList = res.body.data
        }
      })
    },
    data () {
      return {
        infoList: {}
      }
    }
  }
</script>

<style scoped>
   .accumulatedcommission {
     max-width:640px;
     margin:0 auto;
     overflow:hidden;
   }
   .mine-other {
     width: 100%;
     margin: 0.2rem auto;
   }
   .mine-other .mine-other-item {
     width:100%;
     margin:0 auto;
     height:0.88rem;
   }
   .list-item-title {
     width:100%;
     height:0.6rem;
     margin:0 auto;
     font-size:0.24rem;
     background:#EFEFEF;
     padding-left:0.2rem;
     line-height:0.6rem;
   }
   .list-item-title span {
     font-size:0.24rem;
   }
   .mine-other .mine-other-item:nth-child(1){
     border-top:1px solid #dedede;
   }
   .mine-other .mine-other-item .list-item{
     width:100%;
     height:100%;
     line-height:0.88rem;
     padding:0.1rem 0.2rem;
     border-bottom:1px solid #dedede;
   }
   .mine-other .mine-other-item span {
     display:inline-block;
     font-size:0.28rem;
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
     height:100%;
     vertical-align:middle;
     color:#486E8F !important;
   }
   i {
     font-style:normal;
   }
   .list-title {
     margin-bottom:0.1rem;
   }
   .clear {
     clear: both;
   }
</style>
