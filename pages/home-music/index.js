// home-music/index.js
import { getBanners } from "../../service/api_music"
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
const throttleQueryRect = throttle(queryRect)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: 0,
    banners: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getBanners(2).then(res => {
      this.setData({ banners: res.banners })
    })
   },

  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index'
    })
  },

  handleSwiperImageLoaded(){
    // 获取图片的高度
    throttleQueryRect('.swiper-image').then(res => {
      console.log(res, 456);
      this,this.setData({swiperHeight: res[0].height})
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(1);
  }
})