import 'antd/dist/antd.css'
import Head from 'next/head'
import * as React from 'react'

// eslint-disable-next-line react/prop-types
export default function App ({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover' />
        <title>행신고 우산 대여 현황</title>
      </Head>
      <Component {...pageProps} />
   </>
  )
}
