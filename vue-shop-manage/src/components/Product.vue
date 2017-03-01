<template>
  <div id="product">
    <div id="title">
      <h2 :class="headObj.class">
        {{headObj.titText}}
      </h2>
      <div class="head-handle">
        <div class="right member-handle" v-on:click="hShow = !hShow">
          <span class="left icon-member"><img src="../assets/icon-title.png" width="32" height="32" alt="" /></span>
          {{name || '无'}}
          <span class="btn-handle"></span>
          <div v-show="hShow" class="handle-con" v-on:click="loginout">
            <span><img src="../assets/icon_logout.png"></span>
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <div class="product-path">
      <router-link to="../shop">商品管理</router-link> >
      <span>发布产品</span>
    </div>
    <ul class="pro-input">
      <li>
        <label for="pro-name"><span>*</span>产品名称</label>
        <input class="large" type="text" id="pro-name" v-model="teaObj.title" />
      </li>
      <li>
        <div>
          <label for="pro-type"><span>*</span>品类</label>
          <select class="middle" id="pro-type" v-model="teaObj.teaCategoryId">
            <option v-for="cate in category" :value="cate.id">{{cate.name}}</option>
          </select>
        </div>
        <div>
          <label for="type-name"><span>*</span>品名</label>
          <input class="middle" type="text" id="type-name" v-model="teaObj.name" />
        </div>
      </li>
      <li>
        <div style="width: 420px;">
          <label for="pro-price"><span>*</span>单价</label>
          <input class="middle" type="text" id="pro-price" v-model="teaObj.unitPrice" /> 元
        </div>
        <div style="width: 360px;">
          <label style="width: 80px;" for="pro-num"><span>*</span>货号</label>
          <input class="middle" type="text" id="pro-num" v-model="teaObj.artNo" />
        </div>
      </li>
      <li>
        <div>
          <label for="pro-star"><span>*</span>星级</label>
          <select class="middle" id="pro-star" v-model="teaObj.starLevel">
            <option value="1">一星</option>
            <option value="2">二星</option>
            <option value="3">三星</option>
            <option value="4">四星</option>
            <option value="5">五星</option>
            <option value="6">六星</option>
            <option value="7">七星</option>
            <option value="8">八星</option>
            <option value="9">九星</option>
            <option value="10">庄园直供</option>
          </select>
          <!--<input class="middle" type="text" id="pro-star" v-model="teaObj.starLevel" />-->
        </div>
        <div>
          <label for="pro-shelf">保质期</label>
          <input class="middle" type="text" id="pro-shelf" v-model="teaObj.expirationDate" />
        </div>
      </li>
      <li>
        <div style="width: 420px;">
          <label for="pro-weight"><span>*</span>重量</label>
          <input class="middle" type="text" id="pro-weight" v-model="teaObj.weight" /> 克
        </div>
        <div style="width: 360px;">
          <label style="width: 80px;" for="pro-stock"><span>*</span>库存</label>
          <input class="middle" type="text" id="pro-stock" v-model="teaObj.totalInventory" />
        </div>
      </li>
      <li>
        <div>
          <label for="pro-origin"><span>*</span>原产地</label>
          <input class="middle" type="text" id="pro-origin" v-model="teaObj.producingArea" />
        </div>
        <div>
          <label for="pro-sort">排序号</label>
          <input class="middle" type="text" id="pro-sort" v-model="sortNo" />
        </div>
      </li>
      <li>
        <label><span>*</span>首图</label>
        <ul class="btn-upload">
          <li class="left del-cont" v-if="indList.length>0">
            <img :src="indList[0]" width="100" height="100" /></li>
          <div class="clear"></div>
          <li><label for="uploadindex"><img src="../assets/img-upload.png" width="100" height="100" alt="" /></label></li>
        </ul>
        <p class="upload-prompt">支持jpg、jpeg、png图片格式，主图大小不能超过3MB，宽度不超过640px</p>
        <form style="display: none;" id="uploadImgIndex" enctype="multipart/form-data" method="post">
          <input name="file" v-on:change="uploadImgInd($event)" id="uploadindex" type="file"/>
          <input name="dictFileUpType" type="number" value="0" />
          <input name="uploadCatalog" type="text" value="tea" />
        </form>
      </li>
      <li>
        <label><span>*</span>图片</label>
        <draggable class="btn-upload" :list="imgList">
          <li v-for="(img, index) in imgList" class="left del-cont">
            <span class="img-del" v-on:click="imgList.splice(index,1)"><img src="../assets/icon-del2.png"></span>
            <img :src="img" width="100" height="100" /></li>
          <li class="clear"></li>
        </draggable>
        <p class="upload-img"><label for="upload"><img src="../assets/img-upload.png" width="100" height="100" alt="" /></label></p>
        <p class="upload-prompt">支持jpg、jpeg、png图片格式，图片大小不能超过3MB，宽度不超过640px</p>
        <form style="display: none;" id="uploadImgCon" enctype="multipart/form-data" method="post">
          <input name="file" v-on:change="uploadImg($event)" id="upload" type="file" multiple />
          <input name="dictFileUpType" type="number" value="0" />
          <input name="uploadCatalog" type="text" value="tea" />
        </form>
      </li>
      <li>
        <label><span>*</span>描述图片</label>
        <draggable class="btn-upload" :list="depictList">
          <li v-for="(img, index) in depictList" class="left del-cont">
            <span class="img-del" v-on:click="depictList.splice(index,1)"><img src="../assets/icon-del2.png"></span>
            <img :src="img" width="100" height="100" /></li>
          <div class="clear"></div>
          <li>
            <label for="uploaddes">
              <img src="../assets/img-upload.png" width="100" height="100" alt="" />
            </label>
          </li>
        </draggable>
        <form style="display: none;" id="uploadImgDes" enctype="multipart/form-data" method="post">
          <input name="file" v-on:change="uploadImgDes($event)" id="uploaddes" type="file" multiple />
          <input name="dictFileUpType" type="number" value="0" />
          <input name="uploadCatalog" type="text" value="tea" />
        </form>
        <p class="upload-prompt">支持jpg、jpeg、png图片格式，图片大小不能超过3MB，宽度不超过640px</p>
      </li>
      <li style="display:none;">
        <label>产品详情</label>
        <textarea class="pro-detail" v-model="teaObj.desc"></textarea>
      </li>
    </ul>
    <div class="btn-share">
      <button v-on:click.stop="save">保存</button>
      <button v-on:click.stop="publish">保存并发布</button>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'product',
  components: {
    draggable
  },
  beforeCreate () {
    this.$http.get('/api/tea/category/list').then(function (res) {
      if (res.body.code === 0) {
        this.$data.category = res.body.data
      }
    })
    this.$http.get('api//user/info').then(function (res) {
      if (res.body.code === 300001 || res.body.code === 300002) {
        window.location.href = '#/login'
      } else if (res.body.code === 0) {
        this.$data.name = res.body.data.name
      } else {
        window.alert(res.body.message)
      }
    })
    this.$http.get('api/tea/serialno').then(function (res) {
      if (res.body.code === 0) {
        this.$data.sortNo = res.body.data
      } else {
        window.alert(res.body.message)
      }
    })
  },
  methods: {
    uploadImg: function ($event) {
      const _this = this
      // const fileObj = $event.target.files[0]
      // document.getElementById('uploadImgCon').submit()
      var file = $event.target.value
      if (!/.(jpg|jpeg|png|GIF|JPG|png)$/.test(file)) {
        window.alert('图片类型必须是jpeg,jpg,png中的一种')
        return false
      }
      var getForm = document.getElementById('uploadImgCon')
      var reParams = new window.FormData(getForm)
      var oReq = new window.XMLHttpRequest()
      oReq.open('POST', '/api/file/upload')
      oReq.send(reParams)
      oReq.onreadystatechange = function () {
        if (oReq.readyState === 4) {
          if (oReq.status === 200) {
            // console.log(oReq.responseText)
            const resObj = JSON.parse(oReq.responseText)
            if (resObj.code === 0) {
              // console.log(resObj.data)
              // _this.$data.imgSrc = resObj.data
              var imgArr = resObj.data.split(',')
              for (var i = 0; i < imgArr.length; i++) {
                if (imgArr[i].indexOf('http://') < 0) {
                  imgArr[i] = 'http://' + imgArr[i]
                }
              }
              const imgStr = imgArr.join(',')
              // _this.$data.imgSrc = imgStr
              _this.$data.imgSrc += (',' + imgStr)
              _this.$data.imgList = _this.$data.imgList.concat(imgArr)
            } else {
              window.alert(resObj.message)
            }
          }
        }
      }

      /* this.$http({
        method: 'post',
        url: '/api/file/upload',
        params: reParams
      }).then(function (res) {
        // console.log(res)
      }) */
      /* document.getElementById('uploadImgCon').submit(function () {
        _this.$http({
          method: 'post',
          url: '/api/file/upload',
          params: {file: $event.target.files[0], dictFileUpType: 0}
        }).then(function (res) {
          console.log(res)
        })
        return false
      }) */
      // console.log($event.target.files)
    },
    uploadImgDes: function ($event) {
      const desPic = this
      var file = $event.target.value
      if (!/.(jpg|jpeg|png|GIF|JPG|png)$/.test(file)) {
        window.alert('图片类型必须是jpeg,jpg,png中的一种')
        return false
      }
      var getForms = document.getElementById('uploadImgDes')
      var reParamsdes = new window.FormData(getForms)
      var oReqs = new window.XMLHttpRequest()
      oReqs.open('POST', '/api/file/upload')
      oReqs.send(reParamsdes)
      oReqs.onreadystatechange = function () {
        if (oReqs.readyState === 4) {
          if (oReqs.status === 200) {
            const desObj = JSON.parse(oReqs.responseText)
            if (desObj.code === 0) {
              var imgArr = desObj.data.split(',')
              for (var i = 0; i < imgArr.length; i++) {
                if (imgArr[i].indexOf('http://') < 0) {
                  imgArr[i] = 'http://' + imgArr[i]
                }
              }
              const imgStr = imgArr.join(',')
              desPic.$data.desImgSrc += (',' + imgStr)
              desPic.$data.depictList = desPic.$data.depictList.concat(imgArr)
              // console.log(desPic.$data.depictList)
            } else {
              window.alert(desObj.message)
            }
          }
        }
      }
    },
    uploadImgInd: function ($event) {
      const indPic = this
      var file = $event.target.value
      if (!/.(jpg|jpeg|png|GIF|JPG|png)$/.test(file)) {
        window.alert('图片类型必须是jpeg,jpg,png中的一种')
        return false
      }
      // if (this.$data.indList.length > 0) {
        // window.alert('只能上传一张主图')
        // return
      // }
      var getForm = document.getElementById('uploadImgIndex')
      var reParamsind = new window.FormData(getForm)
      var oReqs = new window.XMLHttpRequest()
      oReqs.open('POST', '/api/file/upload')
      oReqs.send(reParamsind)
      oReqs.onreadystatechange = function () {
        if (oReqs.readyState === 4) {
          if (oReqs.status === 200) {
            const indObj = JSON.parse(oReqs.responseText)
            if (indObj.code === 0) {
              var imgArr = indObj.data.split(',')
              for (var i = 0; i < imgArr.length; i++) {
                if (imgArr[i].indexOf('http://') < 0) {
                  imgArr[i] = 'http://' + imgArr[i]
                }
              }
              const imgStr = imgArr.join(',')
              indPic.$data.indImgSrc = imgStr
              indPic.$data.indList.unshift(indObj.data)
            } else {
              window.alert(indObj.message)
            }
          }
        }
      }
    },
    publish: function () {
      if (this.$data.imgList.length > 0 && this.$data.imgList.length > 0 && this.$data.imgList.length > 0) {
        this.$data.teaObj.indexPicture = this.$data.indImgSrc
        this.$data.teaObj.teaPictures = this.$data.imgList.join(',')
        this.$data.teaObj.teaDescPictures = this.$data.depictList.join(',')
        this.$data.teaObj.sortNo = this.$data.sortNo
        this.$data.teaObj.status = 2
        this.$http({
          method: 'post',
          url: '/api/tea/add',
          body: this.$data.teaObj
        }).then(function (res) {
          if (res.body.code === 0) {
            window.location.href = '#/index/shop'
          } else {
            window.alert(res.body.message)
          }
        })
      } else {
        window.alert('请上传图片')
      }
    },
    save: function () {
      if (this.$data.imgList.length > 0 && this.$data.imgList.length > 0 && this.$data.imgList.length > 0) {
        this.$data.teaObj.indexPicture = this.$data.indImgSrc
        // this.$data.teaObj.teaPictures = this.$data.imgSrc.substring(1)
        // this.$data.teaObj.teaDescPictures = this.$data.desImgSrc.substring(1)
        this.$data.teaObj.teaPictures = this.$data.imgList.join(',')
        this.$data.teaObj.teaDescPictures = this.$data.depictList.join(',')
        this.$data.teaObj.sortNo = this.$data.sortNo
        this.$data.teaObj.status = 1
        this.$http({
          method: 'post',
          url: '/api/tea/add',
          body: this.$data.teaObj
        }).then(function (res) {
          if (res.body.code === 0) {
            window.location.href = '#/index/shop'
          } else {
            window.alert(res.body.message)
          }
        })
      } else {
        window.alert('请上传图片')
      }
    },
    loginout: function () {
      this.$http.get('api/user/logout').then(function (res) {
        if (res.body.code === 0) {
          window.location.href = '/#/login'
        } else {
          window.alert(res.body.message)
        }
      })
    }
  },
  data () {
    return {
      list: [
        {id: 1, val: 1},
        {id: 2, val: 2},
        {id: 3, val: 3},
        {id: 4, val: 4}
      ],
      category: [],
      hShow: false,
      teaObj: {
        teaCategoryId: 1
      },
      headObj: {
        titText: '发布产品'
      },
      imgList: [],
      depictList: [],
      indList: [],
      name: '',
      imgSrc: '',
      desImgSrc: '',
      indImgSrc: '',
      sortNo: ''
    }
  }
}
</script>

<style scoped>
  #title {
    position: relative;
  }
  #title h2 {
    height: 60px;
    padding: 20px;
    border-bottom: 1px solid #d6d7d9;
    font-size: 16px;
  }
  .head-handle {
    position: absolute;
    top: 12px;
    right: 20px;
    width: 240px;
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
    cursor:pointer;
    border: 1px solid #eee;
    background: #fff;
    z-index:1;
  }
  .pro-input {
    padding: 10px 10px 30px;
  }
  .pro-input li {
    overflow: hidden;
    margin-bottom: 20px;
  }
  .pro-input li > div {
    float: left;
    width: 390px;
  }
  .pro-input label {
    display: inline-block;
    float: left;
    width: 110px;
    line-height: 30px;
    margin-right: 10px;
    text-align: right;
  }
  .pro-input label img {
    float:left;
  }
  .pro-input label span {
    color: #eb1f1c;
  }
  .pro-input input[type=text],
  .pro-input select {
    border: 1px solid #cdcdd0;
    height: 30px;
    padding: 0 5px;
    border-radius: 3px;
  }
  .pro-input input.large {
    width: 800px;
  }
  .pro-input .middle {
    width: 270px;
  }
  .pro-input input.small {
    width: 145px;
  }
  .btn-share {
    text-align: center;
  }
  .btn-share button {
    width: 132px;
    height: 40px;
    background-color: #476d8f;
    color: #fff;
    margin:0 50px;
    font-weight: bold;
  }
  .pro-input li > div.btn-upload {
    width: auto;
    float: none;
  }
  .btn-upload {
    margin-left: 120px;
  }
  .btn-upload .del-cont {
    position:relative;
  }
  .btn-upload .del-cont span {
    position:absolute;
    right:5px;
    top:5px;
    cursor:pointer;
  }
  .btn-upload li {
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .upload-img {
    overflow: hidden;
    margin-left: 120px;
    margin-bottom: 8px;
  }
  .upload-prompt {
    color: #9b9b9b;
    margin-left: 120px;
  }
  .pro-detail {
    width: 663px;
    height: 300px;
    padding: 6px;
  }
  .product-path span {
    line-height:50px;
  }
  textarea {
    width:100%;
  }
  a.router-link-active {
    color:#476d8f;
    padding-left:20px;
  }
</style>
