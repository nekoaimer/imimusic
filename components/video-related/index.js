// components/videos-related/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleVideoClick(e){
      const item = e.currentTarget.dataset.item
      this.triggerEvent('click', item)
    }
  }
})
