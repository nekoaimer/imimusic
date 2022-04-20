import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../service/api_player'
import { parseLyric } from '../utils/parse-lyric'
import { random } from '../utils/random'

// const audioContext = wx.createInnerAudioContext()
const audioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    id: 0,                // 歌曲id
    isFirstPlay: true,    // 是否是第一次播放
    isStoping: false,     // 是否是出余停止状态
    currentSong: {},      // 当前歌曲信息
    durationTime: 0,      // 歌曲时间
    lyricInfos: [],       // 解析后返回的歌词与时间
    currentTime: 0,       // 播放时间
    currentLyricIndex: 0, // 当前时间的歌词索引位置
    currentLyricText: '', // 当前时间的歌词
    isPlaying: false,     // 播放/暂停
    playModeIndex: 0,     // 0:循环播放 1:单曲循环 2:随机播放
    playListSongs: [],    // 播放的歌单信息
    playListIndex: 0,     // 播放歌单中某一首的索引
  },
  actions: {
    // 1.网络请求与播放相应的歌曲
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }){
      // 如果歌曲页面退出再进时的播放歌曲一样 继续之前的操作 播放/暂停
      if(ctx.id === id && !isRefresh) {
        this.dispatch('changeMusicPlayStatusAction', true)
        return
      } 
      ctx.id = id

      // 1.修改播放状态
      ctx.isPlaying = true
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ''

      // 2.根据id请求数据
      // 2.1 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
        audioContext.title = res.songs[0].name
      })

      // 2.2 请求歌词数据
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        ctx.lyricInfos = parseLyric(lyricString)
      })

      // 3.播放对应的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id
      audioContext.autoplay = true

      // 4.监听audioContext事件
      if(ctx.isFirstPlay){
         this.dispatch('setupAudioContextListenerAction')
         ctx.isFirstPlay = false
      }
      
    },

    // 2.处理AudioContext操作
    setupAudioContextListenerAction(ctx){
      // 1.监听歌曲可以播放
      audioContext.onCanplay(() => audioContext.play())
  
      // 2.监听时间改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000
        
        // 2.根据当前时间修改currentTime/sliderValue
        ctx.currentTime = currentTime
  
        // 3.根据当前时间查找播放的歌词
        if(!ctx.lyricInfos.length) return
        // console.log(this.data.lyricInfos);
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) break;
        }
  
        // 设置当前歌词的索引和内容
        const currentLyricIndex = i - 1
          if (ctx.currentLyricIndex !== currentLyricIndex) {
            const currentLyricText = ctx.lyricInfos[currentLyricIndex]?.text
            ctx.currentLyricText = currentLyricText
            ctx.currentLyricIndex = currentLyricIndex
          }
      })

      // 3.监听歌曲播放完成
      audioContext.onEnded(() => {
        this.dispatch('changeNewMusicAction')
      })

      // 4.监听音乐状态
      // 播放
      audioContext.onPlay(() => ctx.isPlaying = true)
      // 暂停
      audioContext.onPause(() => ctx.isPlaying = false)

      // 5.
      audioContext.onStop(() => {
        ctx.isPlaying = false
        ctx.isStoping = true
      })
    },
    
    // 3.播放/暂停
    changeMusicPlayStatusAction(ctx, isPlaying = true){
      ctx.isPlaying = isPlaying
      if(ctx.isPlaying && ctx.isStoping){
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${ctx.id}.mp3`
        audioContext.title = currentSong.name
        audioContext.startTime = ctx.currentTime / 1000
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },

    // 4. 上一首/下一首
    changeNewMusicAction(ctx, isNext = true){
      // 1.获取当前索引
      let index = ctx.playListIndex

      // 2.根据不同的播放模式，获取下一首的索引
      switch(ctx.playModeIndex){
        case 0:
          index = isNext ? index + 1 : index - 1
          if(index > ctx.playListSongs.length) index = 0
          if(index < 0) index = ctx.playListSongs.length - 1
          break;
          case 1:
            break;
        case 2: 
          index = random(+ctx.playListSongs.length, index)
          break;
      }
      ctx.playListIndex = index

      // 3.获取歌曲
      let currentSong = ctx.playListSongs[index]
      if(!currentSong) currentSong = ctx.currentSong
      console.log(ctx.currentSong);
      // 4.播放歌曲
      // this.dispatch('playMusicWithSongIdAction', { id: currentSong.id })
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    },
  }
})


export {
  audioContext,
  playerStore
}