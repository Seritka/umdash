import React from 'react'
import { List, Card } from 'antd'
import dynamic from 'next/dynamic'
import { studentView, dateFormat } from '../lib/utils'

const ListItems = dynamic(() => import('../components/listItems'))
const Pie = dynamic(() => import('@ant-design/charts').then((mod) => mod.Pie), { ssr: false })
const Bar = dynamic(() => import('@ant-design/charts').then((mod) => mod.Bar), { ssr: false })

/* eslint-disable react/prop-types */
const Umdash = (props) => {
  return (<><h1 style={{ textAlign: 'left', fontWeight: 'bolder' }}>누적 우산 수량</h1>
    { props.isMobile
      ? <div>{ props.data && <Bar {...{
        data: [
          {
            name: '누적 반납된 우산 수량',
            category: '반납',
            value: props.data.umbrella_val.accumulated_returned_val
          },
          {
            name: '누적 대여된 우산 수량',
            category: '대여',
            value: props.data.umbrella_val.accumulated_shared_val
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
        height: 200,
        legend: {
          layout: 'vertical'
        }
      }} /> }
      { props.data && <Pie {...{
        data: [
          {
            name: '반납된 우산 수량',
            value: props.data.umbrella_val.returned_val
          },
          {
            name: '대여된 우산 수량',
            value: props.data.umbrella_val.shared_val
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
            content: `${props.data.umbrella_val.returned_val}개\n대여 가능`
          }
        },
        legend: {
          position: 'under',
          layout: 'vertical'
        }
      }} /> }
      </div>
      : <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', minHeight: 280 }}>
      { props.data && <Bar {...{
        data: [
          {
            name: '누적 반납된 우산 수량',
            category: '반납',
            value: props.data.umbrella_val.accumulated_returned_val
          },
          {
            name: '누적 대여된 우산 수량',
            category: '대여',
            value: props.data.umbrella_val.accumulated_shared_val
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
      { props.data && <Pie {...{
        data: [
          {
            name: '반납된 우산 수량',
            value: props.data.umbrella_val.returned_val
          },
          {
            name: '대여된 우산 수량',
            value: props.data.umbrella_val.shared_val
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
            content: `${props.data.umbrella_val.returned_val}개\n대여 가능`
          }
        }
      }}/> }
      </div>}
<div style={{ clear: 'both' }}>
{ props.data && <ListItems name="최근 반납한 기록" dataSource={Object.keys(props.data.user_state.returned_all_log)} renderItem={item => (
<List.Item>
<Card title={props.data.user_state.returned_all_log[item].student_id ? studentView(props.data.user_state.returned_all_log[item].student_id) : item + ' (학번 없음)'} type="inner">{dateFormat(props.data.user_state.returned_all_log[item].date_log, props.data.user_state.returned_all_log[item].time_log)}</Card>
</List.Item>
)}/>}

{ props.data && <ListItems name="최근 대여된 기록" dataSource={Object.keys(props.data.user_state.shared)} renderItem={item => (
<List.Item>
<Card title={props.data.user_state.shared[item].student_id ? studentView(props.data.user_state.shared[item].student_id) : item + ' (학번 없음)'} type="inner">{dateFormat(props.data.user_state.shared[item].date_log, props.data.user_state.shared[item].time_log)}</Card>
</List.Item>)}/>}
</div></>)
}

export default React.memo(Umdash)
