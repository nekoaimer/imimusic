import nekoRequest from './index'

export function getBanners(type = 2){
  return nekoRequest.get("banner", {
    type
  })
}