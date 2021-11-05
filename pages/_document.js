import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

class MyDocument extends Document {
  render () {
    return (
      <Html lang="ko">
        <Head>
            <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
            <script dangerouslySetInnerHTML={{
              __html: `
            if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
              __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};
            }`
            }}/>
            <meta charSet="utf-8"/>
            <meta name='application-name' content='행신고 우산 대여 현황' />
            <meta name='description' content='' />
        </Head>
        <body>
          <noscript>You should use javascript</noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
