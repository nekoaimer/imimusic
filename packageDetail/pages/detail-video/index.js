// pages/detail-video/index.js
import {
  getMVURL,
  getMVDetail,
  getRelatedVideo,
  getAllVideoMV
} from "../../../service/api_video"
import { videoStore } from '../../../store/index'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: [],
    mvDetail: {},
    relatedVideos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    
    // 获取页面的数据
    this.getPageData(id)
    
    // 监听数据
    
  },
  getPageData(id) {
      // 请求播放地址
      getMVURL(id).then(res => {
        this.setData({
          mvURLInfo: res.data
        })
    })
      // 请求视频信息
      getMVDetail(id).then(res => {
        this.setData({ mvDetail: res.data })
      })
      // 请求相关视频
      getRelatedVideo(id).then(res => {
        console.log(id, res, 'res');
        this.setData({  relatedVideos: res.data })
      })
  },
  handleVideoClick(e){
    const item = e.detail
    const id = item.vid
    this.setData({ mvDetail: item})
    console.log(this.data.mvDetail, 555);
    wx.navigateTo({ url: `/packageDetail/pages/detail-video/index?id=${id}`})
    // videoStore.setState('currentVideoInfo', this.data.mvURLInfo)
  }
})