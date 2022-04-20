const timeRegExp = /\[(\d*):(\d*).(\d*)\]/
const lyricInfos = []

export function parseLyric(lyricString){
  // console.log(lyricString);
  const lyricStrings = lyricString.split(`\n`)
  for(const lineString of lyricStrings){
    if(!lineString) continue
    // 1.获取时间
    const timeResult = timeRegExp.exec(lineString)
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecond = timeResult[3].length ===2 ? timeResult[3] * 10: timeResult[3] * 1
    const time = minute + second + millsecond
    // console.log(minute, second, millsecond);

    // 2.获取文本
    const text = lineString.replace(timeRegExp, '')
    lyricInfos.push({ time, text })
    // console.log(time, lyricText);  
  }
  return lyricInfos
}