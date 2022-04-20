import nekoRequest from './index'

export function getBanners(type = 2){
  return nekoRequest.get("/banner", {
    type
  })
}

export function getRankings(idx){
  return nekoRequest.get("/top/list", {
    idx
  })
}

export function getSongMenu(cat = '全部', limit = 6, offset = 0){
  return nekoRequest.get('/top/playlist', {
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id){
  return nekoRequest.get('/playlist/detail/dynamic', {
    id
  })
}