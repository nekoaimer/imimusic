// 获取图片高度给swiper组件动态添加高度
export default function queryRect(selector){
  return new Promise(resolve => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    // query.selectViewport()
    query.exec(resolve)
  })
}