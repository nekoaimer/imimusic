// pages/detail-search/index.js
import { playerStore } from '../../../store/index'
import {
  getSearchHot,
  getSearchSuggest,
  getSearchResult
} from '../../../service/api_search'
import debounce from '../../../utils/debounce'
import stringToNodes from '../../../utils/string2nodes'
const debounceGetSearchSuggest = debounce(getSearchSuggest)
const app = getApp()
Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    searchValue: "",
    historys: app.globalData.historys
  },

  onLoad: function (options) {
    this.getPageData()
    this.setData({ historys: app.globalData.historys })
  },

  // 网络请求 热门搜索
  getPageData() {
    getSearchHot().then(res => {
      // console.log(res);
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  // 事件处理
  // 1.搜索建议
  handleSearchChange(e) {
    // 1.1 获取输入的关键字
    const searchValue = e.detail

    // 1.2 保存关键字
    this.setData({ searchValue: searchValue })

    // 1.3 判断关键字为空字符的处理逻辑
    if (!searchValue.length) {
      this.setData({ suggestSongs: [], resultSongs: []  })
      debounceGetSearchSuggest.cancel()
      return
    }
    // 1.4 根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
        // 1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if (!suggestSongs) return

      // 2.转成nodes节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({
        suggestSongsNodes
      })
    })
  },

  // 2.搜索结果
  handleSearchAction(e) {
    const searchValue = this.data.searchValue
    if(!searchValue.length) return
    getSearchResult(searchValue).then(res => {
      playerStore.setState('playListSongs', res.result.songs)
      this.setData({ resultSongs: res.result.songs })
    })
  },

  // 3.热门搜索标签点击
  handleKeywordItemClick(e) {
    // 3.1 获取点击的关键字
    // const index = e.currentTarget.dataset.index
    // const keyword = this.data.suggestSongs[index].keyword
    const keyword = e.currentTarget.dataset.keyword
    
    // 3.2 将关键字设置到searchValue中
    this.setData({ searchValue: keyword })

    // 3.3 发送网络请求
    this.handleSearchAction()
    
    // 3.4 历史记录
    this.history(keyword)
  },

  // 4.封装历史记录
  history(keyword){
    // 4.1 保存历史纪律
    wx.getStorageSync({
      key: 'historys',
      success: res => app.globalData.historys = res.data
    })
    // 4.2 从全局拿到记录
    const historys = app.globalData.historys

    // 4.3 对历史记录的操作 添加、插入、删除、排序(新历史纪录插入在前面)、清空
    if(!historys[keyword]){
      historys.unshift(keyword)
      historys[keyword] = keyword
    }else{
      historys.forEach((item, i) => {
        if(keyword == item){
          historys.splice(i, 1)
          historys.unshift(keyword)
        }
      })
    }
    
    // 4.4 保存历史记录 这里没有global是因为setData会回调更新数据
    this.setData({historys: historys})
    wx.setStorageSync({
      key:"historys",
      data: this.data.historys
    })
  },

  // 5.清除历史记录
  clearStorageSync(){
    this.setData({ historys: [] })
    app.globalData.historys = this.data.historys
    wx.clearStorageSync()
  }
})