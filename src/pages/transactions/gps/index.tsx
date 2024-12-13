import React from 'react'
import Mapbox from './mapbox'
import Head from 'next/head'

const Index = () => {

  return (
    <div>
      <Head>
        <title>GPS - 5aab</title>
        <meta name='our-blogs' content='GPS-5aab' key='desc' />
      </Head>
      <Mapbox />
    </div>
  )
}

export default Index
