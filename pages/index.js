import { Layout, Menu } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { ref, child, onValue } from 'firebase/database'
import dynamic from 'next/dynamic'
import MobileDetect from 'mobile-detect'
import db from '../lib/firebase'
import { dateFormat } from '../lib/utils'

const { Sider, Header, Footer, Content } = Layout
const Warning = dynamic(() => import('../components/warning'))
const Umdash = dynamic(() => import('../components/umdash'))
const isMobile = dynamic(() => import('react-device-detect').then(mod => mod.isMobile), { ssr: false })
const DashboardOutlined = dynamic(() => import('@ant-design/icons/DashboardOutlined'), { ssr: false })

/* eslint-disable react/prop-types */
export default function Home (props) {
  const [data, setData] = useState(null)
  const [Umdata, setUmData] = useState(null)
  const [ClickData, setClickData] = useState(null)
  const [NumUm] = useState('machine_1')
  const [AirData, setAirData] = useState(null)

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
        if ('air_quality' in snapshot.val()) setAirData(snapshot.val().air_quality.data)
        setData(snapshot.val())
      } else {
        setData(undefined)
      }
    })
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header>
        <h1 style={{ color: 'white', fontWeight: 'bold' }}>행신고 우산 대여 현황</h1>
        </Header>
      <Layout>

        { !props.isMobile && <Sider collapsed={true}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {
              data && Object.keys(data).filter(k => k.startsWith('machine_')).map((key, index) => {
                let disabled = true
                if (data[key].service_state) disabled = false
                return (
                      <Menu.Item key={index !== 0 ? index : index + 1} icon={<DashboardOutlined />} disabled={disabled} onClick={() => { setClickData(data[key]) }}>
                        Machine {index !== 0 ? index : index + 1}
                      </Menu.Item>
                )
              })
              }
          </Menu>
        </Sider> /* 모바일은 삭제 되게 변경 */ }
          <Content style={{ margin: '16px', background: '#fff', minHeight: 270 }}>
            { Umdata && <Warning service_state={Umdata.service_state}/> }
            <div style={{ padding: 24 }}>
              { data && <Umdash data={ClickData === null ? Umdata : ClickData} isMobile={props.isMobile} />}
            </div>
        </Content>
      </Layout>
      { props.isMobile && AirData && <div style={{ textAlign: 'center' }}>
          {AirData.dust}µg/m³ {AirData.humi}% {AirData.temp}°C
          <br/>
          { dateFormat(AirData.date_log, AirData.time_log) }
          <br/>
          업데이트됨
        </div> }
      <Footer style={{ textAlign: 'center' }}>
         행신고 무인 우산 대여 장치 프로젝트<br/>© 2021~latest CodIT &amp; Warehouse
        </Footer>
    </Layout>
  )
}

export async function getServerSideProps ({ req, res }) {
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
