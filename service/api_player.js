import nekoRequest from './index'

export const getSongDetail = ids => nekoRequest.get('/song/detail', { ids })
// export function getSongDetail(ids){
//   return nekoRequest.get('song/detail', { ids })
// }


export const getSongLyric = id => nekoRequest.get('/lyric', { id })
// export function getSongLyric(id){
//   return nekoRequest.get('lyric', { id })
// }