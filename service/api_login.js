import { nekoLoginRequest } from './index'

export function getLoginCode(){
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 5000,
      success(res){
        resolve(res.code)
      },
      fail(err){
        reject(err)
      }
    }) 
  })
}

export function codeToToken(code){
  return nekoLoginRequest.post('/login', { code })
}

export function checkToken(){
  return nekoLoginRequest.post('/auth', {}, true)
}

export function postFavorRequest(id){
  return nekoLoginRequest.post('/api/favor', { id }, true)
}

export function checkSession(){
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: () => resolve(true),
      fail: () => (false)
    })
  })
}

export function getUserInFo(){
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '用来展示您的头像、昵称等信息',
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export function getDefaultUserInfo(){
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      success(res){
        resolve(res.userInfo)
      },
      fail(err){
        reject(err)
      }
    })
  })
}