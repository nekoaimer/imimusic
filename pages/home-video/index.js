// pages/home-video/index.js
import {
  getTopMV,
  getAllMV
} from '../../service/api_video'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    allMV: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllMVData(0)
  },

  async getAllMVData(offset) {

    // 还有数据时hasMore为false 没有数据且不是第一次执行就不请求数据
    if (!this.data.hasMore && offset !== 0) return

    wx.showNavigationBarLoading() // 请求开始时显示加载Loadong

    // 请求数据
    const res = await getAllMV(offset)
    let newData = this.data.allMV

    if (offset === 0) newData = res.data
    else newData = newData.concat(res.data)

    // 设置数据
    this.setData({ allMV: newData,  hasMore: res.hasMore })
    
    wx.hideNavigationBarLoading() // 请求结束时关闭加载Loadong
    if (offset === 0) wx.stopPullDownRefresh()
  },

  handleVideoClick(event){
    // 获取视频id
    const item = event.currentTarget.dataset.item
    
    const id = item.id

    // 页面跳转
    wx.navigateTo({ url: `/packageDetail/pages/detail-video/index?id=${id}`})

    // 监听当前视频信息及推荐视频数据r
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getAllMVData(0) // 下拉传入0偏移量
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 根据数组长度偏移量请求数据 例如：默认数据 数组请求10条数据 offset=0
    // 那么上拉时传入偏移量10 则请求的data是offset=10 依次类推
    this.getAllMVData(this.data.allMV.length)
  }
})