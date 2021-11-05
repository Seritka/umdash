import React from 'react'
import { List } from 'antd'

/* eslint-disable react/prop-types */
export default function ListItems (props) {
  return <List
          header={<div>{props.name}</div>}
          grid={{
            gutter: 8,
            column: 4,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3
          }}
    dataSource={props.dataSource}
    renderItem={props.renderItem}
  />
}
