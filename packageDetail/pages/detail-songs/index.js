// pages/detail-songs/index.js
import { playerStore, rankingStore } from '../../../store/index'
import { getSongMenuDetail } from '../../../service/api_music'
Page({
  data: {
    type: '',
    ranking: '',
    songInfo: {},
  },

  onLoad: function (options) {
    const type = options.type
    this.setData({ type })

    if(type === "menu"){
      const id = options.id
      this.setData({ type })
      getSongMenuDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
    }else if(type == "rank"){
      const ranking = options.ranking
      this.setData({ ranking  })
      // 1.获取数据
      rankingStore.onState(ranking, this.getRankingDataHanlder)
      // console.log(rankingStore, ranking);
    }
  },
  
  getRankingDataHanlder(res){
    this.setData({ songInfo: res })
  },
  
  handleSongItemClick(e){
    const index = e.currentTarget.dataset.index
    playerStore.setState('playListSongs', this.data.songInfo.tracks)
    playerStore.setState('playListIndex', index)
    // console.log(this.data.songInfo.tracks);
  },

  onUnload: function () {
    if (this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
    }
  }
})