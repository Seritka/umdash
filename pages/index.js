import { Layout, Menu } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { ref, child, onValue } from 'firebase/database'
import dynamic from 'next/dynamic'
import MobileDetect from 'mobile-detect'
import db from '../lib/firebase'
import adviceJSON from '../lib/advice.json'

const { Sider, Header, Footer, Content } = Layout
const Warning = dynamic(() => import('../components/warning'))
const Umdash = dynamic(() => import('../components/umdash'))
const Schooldash = dynamic(() => import('../components/schooldash'))
const isMobile = dynamic(() => import('react-device-detect').then(mod => mod.isMobile), { ssr: false })
const DashboardOutlined = dynamic(() => import('@ant-design/icons/DashboardOutlined'), { ssr: false })

/* eslint-disable react/prop-types */
export default function Home (props) {
  const [data, setData] = useState(null)
  const [Umdata, setUmData] = useState(null)
  const [AirData, setAirData] = useState(null)
  const [ClickData, setClickData] = useState(null)
  const [NumUm, setNumUm] = useState('machine_1')
  const [advice, setAdvice] = useState(`명언${Math.floor(Math.random() * 101)}`)

  useEffect(() => {
    onValue(child(ref(db), `/${NumUm}`), (snapshot) => {
      if (snapshot.exists()) {
        setUmData(snapshot.val())
      } else {
        setUmData(undefined)
      }
    })
  }, [])

  useMemo(() => {
    onValue(child(ref(db), '/'), (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val())
      } else {
        setData(undefined)
      }
    })
  }, [])

  useMemo(() => {
    const id = setInterval(() => {
      setAdvice(`명언${Math.floor(Math.random() * Object.keys(adviceJSON).length + 1)}`)
    }, 120000)
    return () => clearInterval(id)
  }, [advice])

  useMemo(() => {
    onValue(child(ref(db), '/air_quality'), (snapshot) => {
      if (snapshot.exists()) {
        setAirData(snapshot.val().data)
      } else {
        setAirData(undefined)
      }
    })
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <h1 style={{ color: 'white', fontWeight: 'bold' }}>{ NumUm === 'air'
          ? '우리 학교 현황'
          : '행신고 우산 대여 현황' }</h1>
        </Header>
      <Layout>
        { !props.isMobile && <Sider collapsed={true}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {
              data && Object.keys(data).filter(k => k.startsWith('machine_')).map((key, index) => {
                let disabled = true
                if (data[key].service_state) disabled = false
                return (
                      <Menu.Item key={index !== 0 ? index : index + 1} icon={<DashboardOutlined />} disabled={disabled} onClick={() => { setClickData(data[key]); setNumUm(key) }}>
                        Machine {index !== 0 ? index : index + 1}
                      </Menu.Item>
                )
              })
              }
              <Menu.Item key={'air'} icon={<DashboardOutlined />} onClick={() => { setClickData(data); setNumUm('air') }}>
                School
              </Menu.Item>
          </Menu>
        </Sider> /* 모바일은 삭제 되게 변경 */ }
          <Content style={{ margin: '16px', background: '#fff', padding: 24, minHeight: 270 }}>
            <Warning data={ClickData && 'air_quality' in ClickData === false ? ClickData : false}/>
              { ClickData && NumUm === 'air'
                ? <Schooldash data={AirData} advice={advice}/>
                : <Umdash data={ClickData === null ? Umdata : ClickData}/> }
        </Content>
      </Layout>
      { props.isMobile && AirData && <div style={{ textAlign: 'center' }}>
          {AirData.dust}µg/m³ {AirData.humi}% {AirData.temp}°C
          <br/>
          {dateFormat(AirData.date_log, AirData.time_log).replace('2021년 ', '')} 업데이트됨
        </div> }
      <Footer style={{ textAlign: 'center' }}>
         { NumUm === 'air' ? <div>우리 학교 현황 프로젝트<br/>© 2021 CodIT &amp; 황정언 &amp; 김택우</div> : <div>행신고 무인 우산 대여 장치 프로젝트<br/>© 2021~latest CodIT &amp; Warehouse</div> }
        </Footer>
    </Layout>
  )
}

function dateFormat (dateLog, timeLog) {
  const date = dateLog.split('_')
  const time = timeLog.split('_')
  return '20' + date[0] + '년 ' + date[1] + '월 ' + date[2] + '일 ' + time[0] + '시 ' + time[1] + '분 ' + time[2] + '초'
}

export async function getServerSideProps ({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  let mobile
  if (req) {
    const md = new MobileDetect(req.headers['user-agent'])
    mobile = !!md.mobile()
  } else {
    mobile = isMobile
  }

  return {
    props: {
      isMobile: mobile
    }
  }
}
