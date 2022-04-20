import nekoRequest from './index'

// home-video所有MV
export function getAllMV(offset, limit = 10){
  return nekoRequest.get("/mv/all", {
    offset,
    limit
  })
}


// export function getTopMV(offset, limit = 10){
//   return nekoRequest.get("/top/mv", {
//     offset,
//     limit
//   })
// }

/*
* 请求MV播放地址
* @params {number}  MV的id 
*/
export function getMVURL(id){
  return nekoRequest.get('/mv/url', {
    id
  })
}

/*
* 请求MV播放地址
* @params {number}  MV的id 
*/
export function getMVDetail(mvid){
  return nekoRequest.get('/mv/detail', {
    mvid
  })
}

/*
* 请求MV播放地址
* @params {number}  MV的id 
*/
// 相关视频
export function getRelatedVideo(id){
  return nekoRequest.get('/related/allvideo', {
    id
  })
}

// 推荐视频
export function getRecommendVideo(offset = 10){
  return nekoRequest.get('/video/timeline/recommend', {
    offset
  })
}
