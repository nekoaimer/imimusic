// home-music/index.js
import {
  rankingStore,
  rankingMap,
  playerStore
} from '../../store/index.js'
import {
  getBanners,
  getSongMenu
} from "../../service/api_music"
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
const throttleQueryRect = throttle(queryRect)
Page({
  data: {
    swiperHeight: 0,
    banners: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    recommendSongs: [],
    rankings: {0: {}, 1:{}, 2: {}, 3: {}},

    currentSong: {},
    isPlaying: false, // 是否在播放
    playAnimState: 'paused'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // playerStore.dispatch('playMusicWithSongIdAction', { id: 536622304 })

    // 获取页面数据
    this.getPageDate()

    // 发起网络请求
    rankingStore.dispatch('getRankingDataAction')
    rankingStore.dispatch("getRankingDataAction")

    // store获取共享的数据
    this.setupPlayerStoreListener()
  },
  // 网络请求
  getPageDate() {
    getBanners(2).then(res => {
      this.setData({ banners: res.banners })
    })
    getSongMenu().then(res => {
      this.setData({ hotSongMenu: res.playlists })
    })
    getSongMenu('华语').then(res => {
      this.setData({ recommendSongMenu: res.playlists })
    })
  },
  // 事件处理
  // 搜索
  handleSearchClick() {
    wx.navigateTo({ url: '/packageDetail/pages/detail-search/index' })
  },
  
  // 轮播图高度
  handleSwiperImageLoaded() {
    // 获取图片的高度
    throttleQueryRect('.swiper-image').then(res => {
      // console.log('res', res);
      const rect = res[0]
      this.setData({ swiperHeight: rect?.height })
    }, 1000)
  },
  // 更多
  handleMoreClick(){
    this.navigateToDetailSongsPages("hotRanking")
  },

  // 封装跳转页面
  navigateToDetailSongsPages: function(rankingName) {
    wx.navigateTo({ url: `/packageDetail/pages/detail-songs/index?ranking=${rankingName}&type=rank` })
  },

  // 榜单事件
  handleRankingItemClick(event){
    const idx = event.currentTarget.dataset.idx
    this.navigateToDetailSongsPages(rankingMap[idx])
  },
  // 获取播放歌曲的当前歌单信息
  handleSongItemClick(e){
    const index = e.currentTarget.dataset.index

    // 存取所有歌曲与index到Store里
    playerStore.setState('playListSongs', this.data.recommendSongs)
    playerStore.setState('playListIndex', index)
  },
  // 暂停/播放
  handlePlayBtnClick(e){
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },
  // 跳转到歌词页
  handlePlayBarClick(){
    wx.navigateTo({ url: `/packagePlayer/pages/music-player/index?id=${this.data.currentSong.id}` })
  },
  // 卸载页面
  onUnload: function () {
    newRanking.offState('newRaking')
  },
  // 获取排行榜数据请求
  getRankingHandler(idx){
    return (res) => {
      if(Object.keys(res).length === 0) return
      // console.log(res);
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = { name, coverImgUrl, playCount, songList }
      const newRankings = {...this.data.rankings, [idx]: rankingObj}
      // console.log(newRankings);
      // newRankings.push(rankingObj)
      this.setData({ rankings: newRankings })
    }
  },
  setupPlayerStoreListener(){
    // 1.排行榜监听
    rankingStore.onState('hotRanking', (res) => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })

    // 优化方案
    const songTopList = ['newRanking', 'hotRanking', 'originRanking', 'upRanking']
    songTopList.forEach((item, i) => rankingStore.onState(item, this.getRankingHandler(i)))
    // rankingStore.onState('newRanking', this.getRankingHandler(0))
    // rankingStore.onState('hotRanking', this.getRankingHandler(1))
    // rankingStore.onState('originRanking', this.getRankingHandler(2))
    // rankingStore.onState('upRanking', this.getRankingHandler(3))

    // 2.播放器监听
    playerStore.onStates(['currentSong', 'isPlaying'], ({ currentSong, isPlaying }) => {
      currentSong && this.setData({ currentSong })
      isPlaying != undefined && this.setData({ 
        isPlaying,
        playAnimState: isPlaying ? 'running' : 'paused'
      })
    })
  }
})
