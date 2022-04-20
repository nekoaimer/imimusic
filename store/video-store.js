import { HYEventStore } from 'hy-event-store'

const videoStore = new HYEventStore({
  state: {
    currentVideoInfo: {}
  }
})

export {
  videoStore
}