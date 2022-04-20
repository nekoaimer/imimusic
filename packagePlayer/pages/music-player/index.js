// pages/music-player/index.js
import { audioContext, playerStore } from '../../../store/index'

const playModeNames = ['order', 'repeat', 'random']

Page({
  data: {
    id: 0,
    currentSong: {}, // 当前歌曲信息
    durationTime: 0, // 歌曲时间
    lyricInfos: [], // 解析后返回的歌词与时间

    currentTime: 0, // 播放时间
    currentLyricIndex: 0, // 当前时间的歌词索引位置
    currentLyricText: '', // 当前时间的歌词

    isPlaying: false, // 暂停/播放
    playingName: 'pause',
    playModeIndex: 0, // 播放模式
    playModeName: 'order', // 播放模式对应图片

    isMusicLyric: true, // 判断机型是否显示歌词
    currentPage: 0, // 歌曲歌词样式切换
    contentHeight: 0, // 动态计算内容高度
    sliderValue: 0, // 滑动块长度
    isSliderChanging: false, // 进度是否在滑动中
    lyricScrollTop: 0, // 播放时滚动距离
  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲信息
    // this.getPageData(757567)
    // this.getPageData(id)
    this.setupPlayerStoreListener()

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2 })

    // 4.使用audioContext播放歌曲
    // audioContext.stop()
    // audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    // audioContext.autoplay = true

    // 5.audioContext的事件监听
    // this.setupAudioContextListener()
  },
  // 事件处理  
  handleSwiperChange(e) {
    const current = e.detail.current
    this.setData({
      currentPage: current
    })
  },
  // slider点击
  handleSliderChange(e) {
    // 1.获取slider变化的值
    const value = e.detail.value

    // 2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100

    // 3.设置context播放currentTime位置音乐
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)

    // 4.记录最新的sliderValue,并将isSliderChanging设置会false
    this.setData({
      sliderValue: value,
      isSliderChanging: false,
      currentTime
    })

    // 播放暂停
    this.setData({
      isPlaying: true,
      playingName: 'pause'
    })
    
  },
  // slider滑动
  handleSliderChangeing(e) {
    const value = e.detail.value
    const currentTime = this.data.durationTime * value / 100
    // this.PausePlay({ PausePlaySrc: '/assets/images/player/play_pause.png' })
    this.setData({
      isSliderChanging: true,
      currentTime,
    })
    // console.log(value, currentTime );
  },
  // 模式点击
  handleModeBtnClick(){
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex > 2) playModeIndex = 0

    // 设置playerStore中的playModeIndex
    playerStore.setState('playModeIndex', playModeIndex)
  },
  // 暂停
  handlePlayBtnClick() {
    // playerStore.setState('isPlaying', !this.data.isPlaying)
    playerStore.dispatch('changeMusicPlayStatusAction', !this.data.isPlaying)
  },
  // 上一首
  handlePrevBtnClick(){
    playerStore.dispatch('changeNewMusicAction', false)
  },
  // 下一首
  handleNextBtnClick(){
    playerStore.dispatch('changeNewMusicAction')
  },

  // 数据监听
  handleCurrentMusicListenet({
    currentSong,
    durationTime,
    lyricInfos
  }) {
    currentSong && this.setData({ currentSong })
    durationTime && this.setData({ durationTime })
    lyricInfos && this.setData({ lyricInfos })
  },
  handleCurrentLyricMusicListener({
    currentTime,
    currentLyricIndex,
    currentLyricText
  }) {
    // 时间变化
    if (currentTime && !this.data.isSliderChanging) {
      const sliderValue = currentTime / this.data.durationTime * 100
      this.setData({ currentTime, sliderValue })
    }

    // 歌词变化
    if (currentLyricIndex) {
      this.setData({
        currentLyricIndex,
        lyricScrollTop: currentLyricIndex * 35
      })
    }
    
    if (currentLyricText) {
      this.setData({
        currentLyricText
      })
    }
  },
  handleMusicModeListenet({ playModeIndex, isPlaying }) {
    if(playModeIndex != undefined) this.setData({ playModeIndex,  playModeName: playModeNames[playModeIndex]})
    if(isPlaying != undefined) this.setData({ isPlaying, playingName: isPlaying ? 'pause' :'resume' })
  },
  setupPlayerStoreListener() {
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(['currentSong', 'durationTime', 'lyricInfos'], this.handleCurrentMusicListenet)
    
    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], this.handleCurrentLyricMusicListener)

    // 3.监听播放模式相关数据
    playerStore.onStates(['playModeIndex', 'isPlaying'], this.handleMusicModeListenet)
  },
  handleBackBtnClick() {
    wx.navigateBack()
  },
  onUnload: function () {
      // 1.取消监听currentSong/durationTime/lyricInfos
      playerStore.offStates(['currentSong', 'durationTime', 'lyricInfos'], this.handleCurrentMusicListenet)
    
      // 2.取消监听currentTime/currentLyricIndex/currentLyricText
      playerStore.offStates(['currentTime', 'currentLyricIndex', 'currentLyricText'], this.handleCurrentLyricMusicListener)
  
      // 3.取消监听播放模式相关数据
      playerStore.offStates(['playModeIndex', 'isPlaying'], this.handleMusicModeListenet)
  }
})