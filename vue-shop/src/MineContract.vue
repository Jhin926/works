<template>
  <div id="contract">
    <div class="contract">
      <div class="mine-other">
        <router-link tag="div" to="/agreement" class="mine-other-item" v-for="item in list">
          <span class="list-item">
            <span class="other-word">
              <span class="list-title">{{item.teaManorName}}</span>
              <p class="time">{{item.createTime}}</p>
            </span>
            <img src="./assets/icon_arrow.png">
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'minecontract',
    created () {
      document.title = '合同列表'
      this.$http.get('/api/contract/list').then(function (res) {
        if (res.body.code === 0) {
          this.$data.list = res.body.data
        }
      })
    },
    data () {
      return {
        list: {}
      }
    }
  }
</script>

<style scoped>
   .contract {
     margin:0 auto;
     overflow:hidden;
   }
   .mine-other {
     width: 100%;
     margin: 0.4rem auto;
   }
   .mine-other .mine-other-item {
     width:100%;
     margin:0 auto;
     height:1.2rem;
   }
   .mine-other .mine-other-item:nth-child(1){
     border-top:1px solid #dedede;
   }
   .mine-other .mine-other-item .list-item{
     width:100%;
     border-bottom:1px solid #dedede;
   }
   .mine-other .mine-other-item span {
     display:inline-block;
     font-size:0.28rem;
   }
   .mine-other .other-word{
     display:inline-block;
     width:90%;
   }
   .mine-other .other-word .list-title {
     padding-top:0.2rem;
   }
   .mine-other .mine-other-item span img{
     width:0.4rem;
     height:0.4rem;
     margin:0.15rem 0;
   }
   .mine-other .mine-other-item .list-item{
     padding-left:0.3rem;
   }
   .time {
     color:#9b9b9b;
     font-size:0.24rem;
     margin:0.13rem 0;
   }
   .clear {
     clear: both;
   }
</style>
