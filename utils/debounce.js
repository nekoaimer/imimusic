export default function debounce(fn, delay = 233, immediate = true, isRes = true) {
  let timer = null
  let isInvoke = true

  function execTryCatch(isRes, res, resolve, reject) {
    try {
      if (isRes) resolve(res)
    } catch (err) {
      reject(err)
    }
  }

  function execClearTimeout(timer) {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const _debounce = function (...args) {
    return new Promise((resolve, reject) => {
      if (immediate && !isInvoke) {
        const res = fn.apply(this, args)
        execTryCatch(isRes, res, resolve, reject)
        isInvoke = true
      }
      execClearTimeout(timer)
      timer = setTimeout(() => {
        const res = fn.apply(this, args)
        execTryCatch(isRes, res, resolve, reject)
      }, delay)
    })

  }

  _debounce.cancel = () => execClearTimeout(timer)

  return _debounce
}



