import axios from 'axios'
import router from '../../router/index.js'
import httpTool from '../../tool/httpTool.js'
import Vue from 'vue'

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
      url: httpTool.httpUrlEnv() + 'ecard-wechat' + param.url,
      method: param.method || 'GET',
      baseURL: '/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: param.params || null,
      data: param.body || null,
      timeout: param.timeout || 60000,
    }).then(response => {
      console.log("response",response);
      if (response.data.code == 0) {
        param.onSuccess && param.onSuccess(response)
      }
      else if (response.data.errcode !== 0) {
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
        // ctx.dispatch ('showLoading', false);
        if(error){
          console.log("error",error)
        }

      }
    )
  },

  // 获取验证码
  getCode (ctx,param){
    ctx.dispatch('request',{
      url: '/ecard/workWechat/sendCode',
      method: 'POST',
      params: param.data,
      onSuccess: body => {
        param.onsuccess ? param.onsuccess(body) : null
      },
      onFail: body => {
      }
    })
  },

  // 登录
  loginEntry (ctx,param){
    ctx.dispatch('request',{
      url: '/ecard/workWechat/channelLogin',
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

  // 获取列表
  getDoubtfulList (ctx, param) {
    ctx.dispatch('resource', {
      url: '/identity/illegalGuest/list?limit='+param.limit+'&offset='+param.offset,
      method: 'POST',
      body:param.data,
      onSuccess: (body,headers) => {
        param.onsuccess ? param.onsuccess(body,headers) : null
      }
    })
  },

  // 可以留宿移除操作
  hasChecked(ctx, param){
    ctx.dispatch('resource', {
      url: '/identity/illegalGuest/read/'+param.illegalGuestId,
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
  }

};
export default {
  actions: actions
}
