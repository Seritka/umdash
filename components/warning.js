import React from 'react'
import { Alert } from 'antd'

/* eslint-disable react/prop-types */
export function Warning (props) {
  return <div>
        { props.data && !props.data.service_state
          ? <Alert
      message="Warning"
      description="서비스 상태가 점검 중이니 새로운 데이터를 보여줄 수 없습니다."
      type="warning"
      showIcon
      closable
    />
          : null }
    </div>
}
