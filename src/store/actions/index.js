import axios from 'axios'
import router from '../../router/index.js'
import httpTool from '../../tool/httpTool.js'
import Vue from 'vue'

function openFullScreen() {
  const loading = Vue.prototype.$loading({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  return loading;
}

function closeFullScreen(loading){
  loading.close();
}

const actions = {

  goto: (ctx, param) => {
    if (typeof param === 'number') {
       router.go(param)
    } else {
      router.push(param)
    }
  },
  replaceto: (ctx, param) => {
    router.replace(param)
    // console.log('router:',router)
  },


  request: (ctx, param) => {
    axios({
      url: httpTool.httpUrlEnv() + 'key-channel' + param.url,
      method: param.method || 'GET',
      baseURL: '/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 60000,
    }).then(response => {
      sessionStorage.setItem('onLoad',true);
      console.log("response",response);
      if (response.data.code == 0 || response.data.code == 30007) {
        param.onSuccess && param.onSuccess(response)
      }
      else if (response.data.code !== 0) {
        param.onFail && param.onFail(response)
      }
      else {
        param.onFail && param.onFail(response)
      }
    }).catch(
      error => {
        // ctx.dispatch ('showLoading', false);
        if(error){
          console.log("error",error)
        }

      }
    )
  },

  resource: (ctx, param) => {
    openFullScreen();

    axios({
      url: httpTool.httpUrlEnv() + 'gemini' + param.url,
      method: param.method || 'GET',
      baseURL: '/',
      headers: param.headers || {
        Session: sessionStorage.session_id,
        token: sessionStorage.session_id
      },
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 60000,
    }).then(response => {
      console.log("response",response);
      closeFullScreen (openFullScreen());
      if (response.data.code == 0 || response.data.errcode == 0) {
        param.onSuccess && param.onSuccess(response)
      }
      else if (response.data.errcode !== 0) {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
      else {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
    }).catch(
      error => {
        closeFullScreen (openFullScreen());
        if(error){
          console.log("error",error)
        }

      }
    )
  },

  resource_: (ctx, param) => {
    // openFullScreen();

    axios({
      url: httpTool.httpUrlEnv() + 'key-channel' + param.url,
      method: param.method || 'GET',
      baseURL: '/',
      headers: param.headers || {
        Session: sessionStorage.session_id,
        token: sessionStorage.session_id,
      },
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 60000,
    }).then(response => {
      console.log("response",response);
      // closeFullScreen (openFullScreen());
      if (response.data.code == 0 || response.data.errcode == 0 || response.data.code == 30007) {
        param.onSuccess && param.onSuccess(response)
      }
      else if (response.data.errcode !== 0) {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
      else {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
    }).catch(
      error => {
        // closeFullScreen (openFullScreen());
        if(error){
          console.log("error",error)
        }

      }
    )
  },
  resourceLoading: (ctx, param) => {

    axios({
      url: httpTool.httpUrlEnv() + 'key-channel' + param.url,
      method: param.method || 'GET',
      baseURL: '/',
      headers: param.headers || {
        Session: sessionStorage.session_id,
        token: sessionStorage.session_id,
      },
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 60000,
    }).then(response => {
      if (response.data.code == 0 || response.data.errcode == 0 || response.data.code == 30007) {
        param.onSuccess && param.onSuccess(response)
      }
      else if (response.data.errcode !== 0) {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
      else {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
    }).catch(
      error => {
        if(error){
          console.log("error",error)
        }

      }
    )
  },

  resourceLoading_: (ctx, param) => {

    axios({
      url: httpTool.httpUrlEnv() + 'key-channel' + param.url,
      method: param.method || 'GET',
      baseURL: '/',
      headers: param.headers || {
        Session: sessionStorage.session_id,
        token: sessionStorage.session_id,
      },
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 60000,
    }).then(response => {
      if (response.data.code == 0 || response.data.errcode == 0) {
        param.onSuccess && param.onSuccess(response)
      }
      else if (response.data.errcode !== 0) {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
      else {
        Vue.prototype.$message.error(response.body.msg);
        param.onFail && param.onFail(response)
      }
    }).catch(
      error => {
        if(error){
          console.log("error",error)
        }

      }
    )
  },

  // 获取验证码
  getCode (ctx,param){
    ctx.dispatch('request',{
      url: '/keychannel/sendCode',
      method: 'POST',
      params: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      },
      onFail: body => {
        param.onfail ? param.onfail(body) : null
      }
    })
  },

  // 修改密码
  updatgePassword(ctx,param){
    ctx.dispatch('request',{
      url: '/keychannel/updatePassword',
      method: 'POST',
      params: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      },
      onFail: body => {
        param.onfail ? param.onfail(body) : null
      }
    })
  },

  // 修改通知者
  updateNotifier(ctx,param){
    ctx.dispatch('resourceLoading',{
      url: '/keychannel/notifier?code='+param.code,
      method: 'POST',
      body: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      },
      onFail: body => {
        param.onfail ? param.onfail(body) : null
      }
    })
  },

  // 登录
  loginEntry (ctx,param){
    ctx.dispatch('request',{
      url: '/keychannel/login',
      method: 'POST',
      params: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      },
      onFail: body => {
        param.onfail ? param.onfail(body) : null
      }
    })
  },

  // 获取酒店通知者
  notifier(ctx, param) {
    ctx.dispatch('resourceLoading', {
      url: '/keychannel/notifier',
      method: 'GET',
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 修改通知手机号验证码获取
  geNotifiertCode (ctx, param) {
    ctx.dispatch('resourceLoading', {
      url: '/keychannel/notifierCode',
      method: 'POST',
      body: param.data,
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 获取酒店列表
  hotelListAll (ctx, param) {
    ctx.dispatch('resourceLoading', {
      url: '/keychannel/hotels',
      method: 'GET',
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 获取摄像头位置list
  getLocations(ctx, param) {
    ctx.dispatch('resourceLoading', {
      url: '/keychannel/locations',
      method: 'GET',
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 获取列表
  getDoubtfulList (ctx, param) {
    ctx.dispatch('resourceLoading', {
      url: '/keychannel/illegalGuest/list?limit='+param.limit+'&offset='+param.offset,
      method: 'POST',
      body:param.data,
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 获取总数列表
  totalGuest (ctx, param) {
    ctx.dispatch('resourceLoading', {
      url: '/keychannel/illegalGuest/total',
      method: 'POST',
      body: param.data,
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 可以留宿移除操作
  hasChecked(ctx, param){
    ctx.dispatch('resourceLoading', {
      url: '/keychannel/illegalGuest/read/'+param.illegalGuestId,
      method: 'PUT',
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },

  // 获取白名单列表
  getWhiteList(ctx, param){
    ctx.dispatch('resource', {
      url: '/identity/whitelist/search?limit='+param.limit+'&offset='+param.offset,
      method: 'POST',
      body:param.data,
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 白名单删除操作
  delWhiteItem(ctx, param){
    ctx.dispatch('resource', {
      url: '/identity/whitelist',
      method: 'DELETE',
      body:param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },

  // 添加白名单
  uploadBmd(ctx, param){
    ctx.dispatch('resource', {
      url: '/identity/whiteList',
      method: 'POST',
      body:param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess (body) : null
      }
    })
  },

  // 获取灰、黑名单列表
  getBlackList(ctx, param){
    ctx.dispatch('resource_', {
      url: '/keychannel/blacklist?limit='+param.limit+'&offset='+param.offset,
      method: 'POST',
      body: param.data,
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 添加灰、黑名单
  addBlack(ctx, param){
    ctx.dispatch('resource_', {
      url: '/keychannel/blacklist/add',
      method: 'POST',
      body: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess (body) : null
      }
    })
  },

  // 删除黑、灰名单
  delBlackItem(ctx, param){
    ctx.dispatch('resource_', {
      url: '/keychannel/blacklist/delete/'+param.id,
      method: 'DELETE',
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },

  // 获取灰黑名单通知list
  blackNotifierList(ctx, param){
    ctx.dispatch('resource_', {
      url: '/keychannel//blackNotifierlist',
      method: 'GET',
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },

  // 灰黑名单通知手机号保存
  notifySave(ctx, param){
    ctx.dispatch('resource_', {
      url: '/keychannel/blackNotifiers ',
      method: 'POST',
      body: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      }
    })
  },

  // 获取图表数据
  illegalGuest(ctx, param){
    ctx.dispatch('resourceLoading_', {
      url: '/keychannel/illegalGuest/statistics',
      method: 'POST',
      body:param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess (body) : null
      }
    })
  },

  // 获取酒店列表
  getHotel (ctx, param) {
    ctx.dispatch('resource_', {
      url: '/keychannel/hotelStatus',
      method: 'GET',
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 获取酒店摄像头
  hotelCamera (ctx, param) {
    ctx.dispatch('resource_', {
      url: '/keychannel/hotelCameraStatus/' +param.hotelId,
      method: 'GET',
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

};
export default {
  actions: actions
}
