<template>
  <div id="memberedit">
    <div id="title">
      <h2 :class="headObj.class">
        <span class="icon-tit"></span>
        {{headObj.titText}}
      </h2>
      <div class="head-handle">
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
      <router-link to="../../../../../../member">会员管理</router-link> >
      <router-link :to="{'path': '../../../../../memberdetail/'+userId}" class="grey">{{phone}}</router-link> >
      <span>编辑</span>
    </div>
    <div class="input-item">
      <span>等级</span>
      <select v-model="level">
        <option value="1">普通庄园主</option>
        <option value="2">精英庄园主 </option>
        <option value="3">名流庄园主 </option>
        <option value="4">至尊庄园主</option>
        <option value="10">员工</option>
      </select>
    </div>
    <div class="input-item">
      <span>状态</span>
      <select v-model="status">
        <option value="1">正常</option>
        <option value="2">禁用 </option>
      </select>
    </div>
    <div class="input-item">
      <button v-on:click="submit">保存</button>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'memberedit',
      created () {
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
      data () {
        return {
          name: '',
          headObj: {
            class: 'shop',
            titText: '会员编辑'
          },
          hShow: false,
          phone: this.$route.params.name,
          userId: this.$route.params.Id,
          level: this.$route.params.level,
          status: this.$route.params.status
        }
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
        submit: function () {
          this.$http.get('api/appUser/update?id=' + this.$data.userId + '&level=' + this.$data.level + '&status=' + this.$data.status + '').then(function (res) {
            if (res.body.code === 0) {
              window.location.href = '../../#/index/member'
            } else {
              window.alert(res.body.message)
            }
          })
        }
      }
    }
</script>

<style scoped>
  #memberedit {
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
    background: url('../assets/icon-member.png') no-repeat;
  }
  .head-handle {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 240px;
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
    cursor: pointer;
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
  }
  .handle-con {
    width: 110px;
    height: 40px;
    margin-top: 15px;
    padding:10px 10px 10px 17px;;
    position:absolute;
    border: 1px solid #eee;
    background: #fff;
    cursor:pointer;
  }
  .detail-path span {
    display:inline-block;
    line-height:50px;
    color:#9b9b9b;
  }
  .input-item {
    margin:10px 15px;
  }
  .input-item span {
    display:inline-block;
    width:40px;
  }
  .input-item select{
    width:172px;
    height:30px;
    border-radius:4px;
  }
  .input-item button {
    width:80px;
    height:30px;
    border-radius:4px;
    margin-top:10px;
    background:#476d8f;
    margin-left:45px;
    color:#fff;
  }
  a.grey {
    color:#476d8f;
  }
  a.router-link-active {
    color:#476d8f;
  }
</style>
