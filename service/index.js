import { TOKEN_KEY } from '../constants/token-const'

const BASE_URL = "http://123.207.32.32:9001"

const token = wx.getStorageSync(TOKEN_KEY)


// 以及部署好的
const LOGIN_BASE_URL = "http://123.207.32.32:3000"
// 服务器代码 自己部署
// const LOGIN_BASE_URL = "http://localhost:3000"

class NekoRequest {
  constructor(baseURL, authHeader = {}){
    this.baseURL = baseURL
    this.authHeader = authHeader
  }
  request(url, method, params, isAuth = false, header = {}) {
    const finalHeader = isAuth ? { ...this.authHeader, ...header } : header
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        data: params,
        header: finalHeader,
        success(res){
          resolve(res.data)
        },
        fail: reject
      })
    })
  }
  get(url, params, isAuth = false, header){
    return this.request(url, 'GET', params, isAuth, header)
  }
  post(url, data, isAuth = false, header){
    return this.request(url, 'POST', data, isAuth, header)
  }
}
const nekoRequest = new NekoRequest(BASE_URL)
const nekoLoginRequest = new NekoRequest(LOGIN_BASE_URL, {
  token 
})

export default nekoRequest
export {
  nekoLoginRequest
}