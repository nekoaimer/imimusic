import nekoRequest from './index'
export function getTopMV(offset, limit = 10){
  return nekoRequest.get("top/mv", {
    offset,
    limit
  })
}

/*
* 请求MV播放地址
* @params {number}  MV的id 
*/
export function getMVURL(id){
  return nekoRequest.get('mv/url', {
    id
  })
}

/*
* 请求MV播放地址
* @params {number}  MV的id 
*/
export function getMVDetail(mvid){
  return nekoRequest.get('mv/detail', {
    mvid
  })
}

/*
* 请求MV播放地址
* @params {number}  MV的id 
*/
export function getRelatedVideo(id){
  return nekoRequest.get('related/allvideo', {
    id
  })
}