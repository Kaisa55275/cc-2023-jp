import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="jp">
      <Head >
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="コーチェラ日本時間スケジュール" />
        <meta property="og:title" content="コーチェラ日本時間スケジュール" />
        <meta property="og:description" content="コーチェラ日本時間スケジュールです。間違ってたら教えてください！" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cc-2023-jp.vercel.app/" />
        <meta property="og:image" content="https://cc-2023-jp.vercel.app/og.png" />
        <meta property="og:site_name" content="コーチェラ日本時間スケジュール" />
        <meta property="og:locale" content="ja_JP" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@26Nanokayo" />
        <meta name="twitter:creator" content="@26Nanokayo" />
        <meta name="twitter:title" content="コーチェラ日本時間スケジュール" />
        <meta name="twitter:description" content="コーチェラ日本時間スケジュールです。間違ってたら教えてください！" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
