import React from 'react'
import advice from '../lib/advice.json'
import fetch from 'unfetch'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => r.json())

/* eslint-disable react/prop-types */
const Schooldash = (props) => {
  const { data, error } = useSWR(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=d7df428d3d4548d0940e2d7c3a7b61b6&Type=json&pIndex=1&pSize=10&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530135&MLSV_YMD=${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}`, fetcher)

  return <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontWeight: 'bolder', textAlign: 'center' }}>현재 시각</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <h1 style= {{ marginRight: '25px', fontWeight: 'bold', fontSize: '105px' }}>{new Date().getHours() > 12 ? new Date().getHours() - 12 : new Date().getHours() === 0 ? '12' : new Date().getHours()}:{new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()}</h1>
      <div style={{ marginTop: '55px', fontSize: '20px' }}>
        <div style={{ fontWeight: 'bolder' }}>
        {new Date().getMonth() + 1}월 {new Date().getDate()}일 {getToday()}
          <br/>
          {new Date().getHours() > 12 ? '오후' : '오전' }
        </div>
      </div>
      </div>
      <div style={{ fontFamily: 'Uiyeun', fontSize: '30px', textAlign: 'left' }}>
        <div style={{ lineHeight: '55px', fontWeight: 'bolder', fontSize: '55px' }}>오늘의 급식</div>
        <div style={{ lineHeight: '45px' }}>
          {console.log(data)}
          {!error && data && 'mealServiceDietInfo' in data && data.mealServiceDietInfo.length >= 1 && 'row' in data.mealServiceDietInfo[1]
            ? data.mealServiceDietInfo[1].row.map(row => {
              return String(row.DDISH_NM).split('<br/>').map(dish => {
                return <div key={dish}>{dish}</div>
              })
            })
            : <h4>오늘의 급식은 없습니다</h4>}
        </div>
      </div>
      <i style={{ lineHeight: '25px', fontWeight: 'lighter', fontSize: '22px', opacity: '75%', fontFamily: 'Uiyeun' }}>
          *요리명에 표시된 번호는 알레르기를 유발할수 있는 식재료입니다
        <br/>
          (1.난류, 2.우유, 3.메밀, 4.땅콩, 5.대두, 6.밀, 7.고등어, 8.게, 9.새우, 10.돼지고기,
        <br/>
          11.복숭아, 12.토마토, 13.아황산염, 14.호두, 15.닭고기, 16.쇠고기, 17.오징어, 18.조개류(굴,전복,홍합 등)
        </i>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontWeight: 'bolder', textAlign: 'center' }}>우리학교 공기질</h3>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <h1 style= {{ marginRight: '25px', fontWeight: 'bold', fontSize: '105px' }}>{Math.floor(props.data.temp)}°C</h1>
      <div style={{ marginTop: '50px', fontSize: '20px', fontWeight: 'bolder' }}>
        미세먼지: <b style={{ color: `#${dust(props.data.dust)[1]}` }}>{dust(props.data.dust)[0]}</b> ({props.data.dust}㎍/㎥)
        <br/>
        습&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;도: {Math.floor(props.data.humi)}%
        <br/>
        <div style={{ fontSize: '12px' }}>
        {dateFormat(props.data.date_log, props.data.time_log)} 업데이트 됨
        </div>
        </div>
      </div>
      <h4 style={{ fontSize: '25px', fontFamily: 'MaruBuri-Regular', fontWeight: 'bold', display: 'inline-block', width: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>
        {advice[props.advice]}
      </h4>
    </div>
  </div>
}

export default React.memo(Schooldash)

function dust (dust) {
  if (dust >= 0 && dust <= 15) {
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

function getToday () {
  // eslint-disable-next-line no-array-constructor
  const week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일')
  const today = new Date().getDay()
  const todayLabel = week[today]
  return todayLabel
}

function dateFormat (dateLog, timeLog) {
  const date = dateLog.split('_')
  const time = timeLog.split('_')

  const si = time[0] === '00' ? '12' : time[0]

  return '20' + date[0] + '년 ' + date[1] + '월 ' + date[2] + '일 ' + si + '시 ' + time[1] + '분 ' + time[2] + '초'
}
