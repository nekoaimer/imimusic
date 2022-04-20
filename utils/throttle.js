function throttle(fn, interval = 1000, options = {
  leading: true,
  trailing: true,
  isRes: true
}) {
  let lastTriggerTime = 0
  let timer = null
  const {
    leading,
    trailing,
    isRes
  } = options

  function execTryCatch(isRes = true, res, resolve, reject) {
    try {
      if (isRes === true || isRes === 'true') resolve(res)
    } catch (err) {
      reject(err)
    }
  }

  function execClearTimeout(timer, initTime = false) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (initTime === true) lastTriggerTime = 0
  }

  const _throttle = function (...args) {
    return new Promise((resolve, reject) => {
      let triggerTime = +new Date
      if (!leading && !lastTriggerTime) lastTriggerTime = triggerTime

      const remainTime = interval - (triggerTime - lastTriggerTime)
      if (remainTime <= 0) {
        execClearTimeout(timer)

        const res = fn.apply(this, args)

        execTryCatch(isRes, res, resolve, reject)

        return lastTriggerTime = triggerTime
      }

      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null

          const res = fn.apply(this, args)

          execTryCatch(isRes, res, resolve, reject)

          lastTriggerTime = +new Date
        }, remainTime)
      }
    })
  }

  _throttle.cancel = () => execClearTimeout(timer, true)

  return _throttle
}


export default throttle