import { Layout, Menu, List, Card } from 'antd'
import React, { useEffect, useState } from 'react'
import { ref, child, onValue } from 'firebase/database'
import dynamic from 'next/dynamic'
import MobileDetect from 'mobile-detect'
import db from '../lib/firebase'

const { Sider, Header, Footer, Content } = Layout
const ListItems = dynamic(() => import('../components/listItems'))
const Warning = dynamic(() => import('../components/warning'))
const isMobile = dynamic(() => import('react-device-detect').then(mod => mod.isMobile), { ssr: false })
const DashboardOutlined = dynamic(() => import('@ant-design/icons/DashboardOutlined'), { ssr: false })
const Pie = dynamic(() => import('@ant-design/charts').then((mod) => mod.Pie), { ssr: false })
const Bar = dynamic(() => import('@ant-design/charts').then((mod) => mod.Bar), { ssr: false })

/* eslint-disable react/prop-types */
export default function Home (props) {
  const [data, setData] = useState(undefined)
  const [ClickData, setClickData] = useState(undefined)

  useEffect(() => {
    onValue(child(ref(db), '/'), (snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val().machine_1) setClickData(snapshot.val().machine_1)
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
        {props.isMobile
          ? null
          : <Sider collapsed={true}>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            {
              data && Object.keys(data).map((key, index) => {
                if (key.startsWith('machine_')) {
                  let disabled = true
                  if (data[key].service_state) disabled = false
                  return (
                    <Menu.Item key={index + 1} icon={<DashboardOutlined />} disabled={disabled} onClick={() => setClickData(data[key])}>
                      Machine {index + 1}
                    </Menu.Item>
                  )
                } else {
                  return null
                }
              })
            }
          </Menu>
        </Sider> /* 모바일은 삭제 되게 변경 */ }
          <Content style={{ margin: '16px' }}>
            <Warning data={ClickData}/>
            <div style={{ background: '#fff', padding: 24, minHeight: 260 }}>
            <h1 style={{ textAlign: 'left', fontWeight: 'bolder' }}>누적 우산 수량</h1>
            { props.isMobile
              ? <div>{ ClickData && <Bar {...{
                data: [
                  {
                    name: '누적 반납된 우산 수량',
                    category: '반납',
                    value: ClickData.umbrella_val.accumulated_returned_val
                  },
                  {
                    name: '누적 대여된 우산 수량',
                    category: '대여',
                    value: ClickData.umbrella_val.accumulated_shared_val
                  }
                ],
                xField: 'value',
                yField: 'category',
                seriesField: 'name',
                isStack: true,
                label: {
                  position: 'middle',
                  content: function content (item) {
                    return item.value.toFixed(0)
                  },
                  style: { fill: '#fff' }
                },
                height: 200
              }} /> }
              { ClickData && <Pie {...{
                data: [
                  {
                    name: '반납된 우산 수량',
                    value: ClickData.umbrella_val.returned_val
                  },
                  {
                    name: '대여된 우산 수량',
                    value: ClickData.umbrella_val.shared_val
                  }
                ],
                appendPadding: 10,
                angleField: 'value',
                colorField: 'name',
                radius: 1,
                innerRadius: 0.6,
                label: {
                  type: 'inner',
                  offset: '-50%',
                  content: '{value}',
                  style: {
                    textAlign: 'center',
                    fontSize: 14
                  }
                },
                interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
                statistic: {
                  title: false,
                  content: {
                    style: {
                      whiteSpace: 'pre-wrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: 14
                    },
                    content: `${ClickData.umbrella_val.returned_val}개\n대여 가능`
                  }
                },
                legend: {
                  layout: 'vertical',
                  position: 'under'
                }
              }} /> }
              </div>
              : <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', minHeight: 280 }}>
              { ClickData && <Bar {...{
                data: [
                  {
                    name: '누적 반납된 우산 수량',
                    category: '반납',
                    value: ClickData.umbrella_val.accumulated_returned_val
                  },
                  {
                    name: '누적 대여된 우산 수량',
                    category: '대여',
                    value: ClickData.umbrella_val.accumulated_shared_val
                  }
                ],
                xField: 'value',
                yField: 'category',
                seriesField: 'name',
                isStack: true,
                label: {
                  position: 'middle',
                  content: function content (item) {
                    return item.value.toFixed(0)
                  },
                  style: { fill: '#fff' }
                }
              }}/> }
              { ClickData && <Pie {...{
                data: [
                  {
                    name: '반납된 우산 수량',
                    value: ClickData.umbrella_val.returned_val
                  },
                  {
                    name: '대여된 우산 수량',
                    value: ClickData.umbrella_val.shared_val
                  }
                ],
                appendPadding: 10,
                angleField: 'value',
                colorField: 'name',
                radius: 1,
                innerRadius: 0.6,
                label: {
                  type: 'inner',
                  offset: '-50%',
                  content: '{value}',
                  style: {
                    textAlign: 'center',
                    fontSize: 14
                  }
                },
                interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
                statistic: {
                  title: false,
                  content: {
                    style: {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: 14,
                      clear: 'both'
                    },
                    content: `${ClickData.umbrella_val.returned_val}개\n대여 가능`
                  }
                }
              }}/> }
              </div>}
  <div style={{ clear: 'both' }}>
    { ClickData && <ListItems name="최근 반납한 기록" dataSource={Object.keys(ClickData.user_state.returned_all_log)} renderItem={item => (
      <List.Item>
        <Card title={ClickData.user_state.returned_all_log[item].student_id ? studentView(ClickData.user_state.returned_all_log[item].student_id) : item + ' (학번 없음)'} type="inner">{dateFormat(ClickData.user_state.returned_all_log[item].date_log, ClickData.user_state.returned_all_log[item].time_log)}</Card>
      </List.Item>
    )}/>}

    { ClickData && <ListItems name="최근 대여된 기록" dataSource={Object.keys(ClickData.user_state.shared)} renderItem={item => (
      <List.Item>
        <Card title={ClickData.user_state.shared[item].student_id ? studentView(ClickData.user_state.shared[item].student_id) : item + ' (학번 없음)'} type="inner">{dateFormat(ClickData.user_state.shared[item].date_log, ClickData.user_state.shared[item].time_log)}</Card>
      </List.Item>)}/>}
      </div>
    </div>
        </Content>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>행신고 무인 우산 대여 장치 프로젝트<br/>© 2021~latest CodIT &amp; Warehouse</Footer>
    </Layout>
  )
}

function dateFormat (dateLog, timeLog) {
  const date = dateLog.split('_')
  const time = timeLog.split('_')
  return '20' + date[0] + '년 ' + date[1] + '월 ' + date[2] + '일 ' + time[0] + '시 ' + time[1] + '분 ' + time[2] + '초'
}

function studentView (id) {
  const str = id.toString()
  const qks = str.substr(1, 1) === '0' ? str.substr(2, 1) : str.substr(1, 2)
  const qjs = str.substr(3, 1) === '0' ? str.substr(4, 1) : str.substr(3, 2)
  return str.substr(0, 1) + '학년 ' + qks + '반 ' + qjs + '번'
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
