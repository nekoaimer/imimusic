// pages/home-profile/index.js
import { getUserInFo, getDefaultUserInfo } from '../../service/api_login'
import  { USERINFO } from '../../constants/userInfo-const'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    defaultUserInfo: {},
    hasUserInfo: false
  },
  async onLoad(){
    const userInfo = await getDefaultUserInfo()
    this.setData({ defaultUserInfo: userInfo, userInfo, hasUserInfo: false })
  },
  async getUserProfile(e){
    const resultInfo = await getUserInFo()
    this.setData({ userInfo: resultInfo.userInfo, hasUserInfo: true })
  },
  handleLoginOut(){
    const resultInfo = this.data.defaultUserInfo
    this.setData({ userInfo: resultInfo, hasUserInfo: false })
  },
})