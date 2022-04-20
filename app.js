// app.js
import { getLoginCode, codeToToken, checkToken, checkSession, getUserInFo} from './service/api_login'
import { TOKEN_KEY } from './constants/token-const'

App({
  globalData:{
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    navBarHeight: 44,
    historys: []
  },
  onLaunch(){
    // 1.获取设备信息
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    const deviceRadio = info.screenHeight / info.screenWidth
    this.globalData.deviceRadio = deviceRadio

    // 2.让用户默认进行登录
    this.handleLogin()

    // 3.获取用户信息
  },
  async handleLogin(){
    const token = wx.getStorageSync(TOKEN_KEY)
    // token 是否过期
    const checkResult = await checkToken()
    // console.log(checkResult);

    // 判断 session是否过期
    const isSessionExpire = await checkSession()
    console.log(isSessionExpire);

    if(!TOKEN_KEY || checkResult.errorCode || isSessionExpire) this.loginAction()
  },
  async loginAction(){
    // 1.获取code
    const code = await getLoginCode()
    // console.log(code);

    // 2.将code发送给服务器
    const result = await codeToToken(code)
    const token = result.token

    wx.setStorageSync(TOKEN_KEY, token)
    // console.log(wx.getStorageSync(TOKEN_KEY));
  }
})
