import Vue from 'vue'
import Router from 'vue-router'
import Swiper from 'vue-awesome-swiper'
import Resource from 'vue-resource'
import RegionPicker from 'vue-region-picker'
import CHINA_REGION from 'china-area-data'

import Index from './Index'
import ManorPast from './components/ManorPast'
import TeaGroup from './components/TeaGroup'
import Register from './Register'
import Forget from './Forget'
import Login from './Login'
import Login2 from './Login2'
import Resetpassword from './reset-pw'
import Mine from './Mine'
import AddressList from './AddressList'
import Address from './Address'
import Addredit from './components/AddrEdit'
import Shop from './Shop'
import Order from './Order'
import MOrder from './MOrder'
import GoodsDetail from './GoodsDetail'
import GiftDetail from './Gift'
import TypeList from './TypeList'
import ShopOrder from './ShopOrder'
import ManorOrder from './ManorOrder'
import Assets from './assets'
import ManorAsset from './ManorAsset'
import ChargeTea from './charge-tea'
import MineContract from './MineContract'
import UserSetting from './UserSetting'
import TeaGoldCoins from './TeaGoldCoins'
import AccountBalance from './AccountBalance'
import Withdraw from './Withdraw'
import AccumulatedCommission from './accumulatedcommission'
import ChangePassword from './ChangePassword'
import Refund from './Refund'
import SucRefund from './SucRefund'
import manorDetail from './ManorDetail'
import Car from './components/Car'
import Empty from './components/Empty'
import Receipt from './Receipt'
import Receipt1 from './Receipt1'
import ReplaceTheTea from './ReplaceTheTea'
import OrderDetail from './OrderDetail'
import MOrderDetail from './MOrderDetail'
import Invitation from './Invitation'
import Poxy from './Poxy'
import Agreement from './Agreement'
import GetTea from './getTea'
import GoodsSnap from './GoodsSnap'
import Loading from './components/Loading'
// import Confirm from './components/Confirm'
import Alert from './components/Alert'
import Success from './components/Success'
import Yhead from './components/Yhead'
import ShareRule from './ShareRule'
import ShareMng from './ShareMng'
import ShareOrder from './ShareOrder'
const Confirm = resolve => require(['./components/Confirm'], resolve)
const Video = resolve => require(['./components/Video'], resolve)
const Interface = resolve => require(['./components/Video'], resolve)
/* install router */
Vue.use(Router)
Vue.use(Swiper)
Vue.use(Resource)
Vue.use(RegionPicker, {
  region: CHINA_REGION,
  vueVersion: 2
})
Vue.component('confirm', Confirm)
Vue.component('alert', Alert)
Vue.component('loading', Loading)
Vue.component('success', Success)
Vue.component('y-head', Yhead)
Vue.http.options.emulateJSON = true
Vue.http.headers.common['clientType'] = 'WX'
Vue.filter('starToText', function (value) {
  var starText = ['一星', '二星', '三星', '四星', '五星', '六星', '七星', '八星', '九星', '十星']
  return starText[value - 1]
})
Vue.prototype.appid = 'wxf8e634ef20a151bb'
Vue.prototype.enUrl = encodeURIComponent('http://gf.sankoubudai.com')
// Vue.prototype.appid = 'wx2fd837f14f0941d4'
// Vue.prototype.enUrl = encodeURIComponent('http://wx.sankoubudai.com')

const routes = [
  {path: '/', redirect: '/index'},
  {path: '/index', component: Index},
  {path: '/manorpast', component: ManorPast},
  {path: '/index/teagroup/:id/:num', component: TeaGroup},
  {path: '/register', component: Register},
  {path: '/forget', component: Forget},
  {
    path: '/shop',
    component: Shop,
    children: [
      {
        path: 'typeList/:id',
        component: TypeList
      }
    ]
  },
  {path: '/shop/shopOrder', component: ShopOrder},
  {path: '/shop/manororder', component: ManorOrder},
  {path: '/goodsdetail/:id/:phone?', name: 'goodsdetail', component: GoodsDetail},
  {path: '/giftDetail/:id/:phone?', name: 'giftDetail', component: GiftDetail},
  {path: '/goodssnap/:id', component: GoodsSnap},
  {path: '/order/:id/:num/:car/:phone?', component: Order},
  {path: '/morder/:id/:num/:phone?', component: MOrder},
  {path: '/orderdetail/:id', component: OrderDetail},
  {path: '/morderdetail/:id', component: MOrderDetail},
  {path: '/login/:id', component: Login},
  {path: '/login2', component: Login2},
  {path: '/resetpw/:no', component: Resetpassword},
  {path: '/mine', component: Mine},
  {path: '/mine/addresslist', component: AddressList},
  {path: '/mine/address/:type', component: Address},
  {path: '/mine/addredit/:id/:username/:tel/:province/:city/:district/:area', component: Addredit},
  {path: '/assets', component: Assets},
  {path: '/assets/manor/:orderid/:teaid', component: ManorAsset},
  {path: '/assets/gettea/:orderid/:teaid/:id/:qua', component: GetTea},
  {path: '/charge-tea', component: ChargeTea},
  {path: '/mine/minecontract', component: MineContract},
  {path: '/mine/usersetting', component: UserSetting},
  {path: '/teagoldcoins', component: TeaGoldCoins},
  {path: '/accountbalance', component: AccountBalance},
  {path: '/mine/withdraw', component: Withdraw},
  {path: '/accumulatedcommission', component: AccumulatedCommission},
  {path: '/mine/changepassword', component: ChangePassword},
  {path: '/mine/refund/:id', component: Refund},
  {path: '/mine/suc-refund', component: SucRefund},
  {path: '/manorDetail/:id/:phone?', component: manorDetail},
  {path: '/shop/car', component: Car},
  {path: '/:root/:type/empty', component: Empty},
  {path: '/receipt/:type/:id/:amount', component: Receipt},
  {path: '/receipt1/:type/:head/:remark', component: Receipt1},
  {path: '/replacethetea/:quarterid/:orderid/:teamonarid/:qua', component: ReplaceTheTea},
  {path: '/invitation', component: Invitation},
  {path: '/index/poxy', component: Poxy},
  {path: '/agreement', component: Agreement},
  {path: '/share/rule', component: ShareRule},
  {path: '/share-order/:id/:num/:referrer', component: ShareOrder},
  {path: '/share/manage', component: ShareMng},
  {path: '/video', component: Video},
  {path: '/interface/:name/:par1?/:par2?', component: Interface}
]

/* routing */
const router = new Router({
  routes
})
router.afterEach(function () {
  var iframe = document.createElement('iframe')
  iframe.setAttribute('src', '/logo.png')
  iframe.style.display = 'none'
  iframe.addEventListener('load', function () {
    setTimeout(function () {
      iframe.removeEventListener('load', false)
      document.body.removeChild(iframe)
    }, 0)
  })
  document.body.appendChild(iframe)
})
new Vue({
  router: router,
  data: {
    appId: 'wxf8e634ef20a151bb',
    enUrl: encodeURIComponent('http://gf.sankoubudai.com')
    // appId: 'wx2fd837f14f0941d4',
    // enUrl: encodeURIComponent('http://wx.sankoubudai.com')
  }
}).$mount('#app')
