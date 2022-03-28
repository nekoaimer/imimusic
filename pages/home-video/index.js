// pages/home-video/index.js
import {
  getTopMV
} from '../../service/api_video'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTopMVData(0)
  },

  async getTopMVData(offset) {
    // 还有数据时hasMore为false 没有数据且不是第一次执行就不请求数据
    if (!this.data.hasMore && offset !== 0) return

    wx.showNavigationBarLoading() // 请求开始时显示加载Loadong

    // 请求数据
    const res = await getTopMV(offset)
    let newData = this.data.topMVs

    if (offset === 0) newData = res.data
    else newData = newData.concat(res.data)

    // 设置数据
    this.setData({
      topMVs: newData
    })
    this.setData({
      hasMore: res.hasMore
    })
    wx.hideNavigationBarLoading() // 请求结束时关闭加载Loadong
    if (offset === 0) wx.stopPullDownRefresh()
  },

  handleVideoItemClick(event){
    // 获取视频id
    const id = event.currentTarget.dataset.item.id
    // 页面跳转
    wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })
    // console.log(id);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getTopMVData(0) // 下拉传入0偏移量
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 根据数组长度偏移量请求数据 例如：默认数据 数组请求10条数据 offset=0
    // 那么上拉时传入偏移量10 则请求的data是offset=10 依次类推
    this.getTopMVData(this.data.topMVs.length)
  }
})