
export function dust (dust) {
  if (dust <= 15) { // dust >= 0 &&
    // message, hex
    return ['좋음', '2359c4']
  } else if (dust >= 16 && dust <= 35) {
    return ['보통', '01b670']
  } else if (dust >= 36 && dust <= 75) {
    return ['나쁨', 'FDCC1F']
  } else if (dust >= 76) {
    return ['매우 나쁨', 'd4191d']
  }
}

export function getToday () {
  const week = new Array(['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'])
  const today = new Date().getDay()
  const todayLabel = week[today]
  return todayLabel
}

export function dateFormat (dateLog, timeLog) {
  const date = dateLog.split('_')
  const time = timeLog.split('_')

  const si = time[0] === '00' ? '12' : time[0]

  return '20' + date[0] + '년 ' + date[1] + '월 ' + date[2] + '일 ' + si + '시 ' + time[1] + '분 ' + time[2] + '초'
}

export function studentView (id) {
  const str = id.toString()
  const qks = str.substr(1, 1) === '0' ? str.substr(2, 1) : str.substr(1, 2)
  const qjs = str.substr(3, 1) === '0' ? str.substr(4, 1) : str.substr(3, 2)
  return str.substr(0, 1) + '학년 ' + qks + '반 ' + qjs + '번'
}
