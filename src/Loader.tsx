import React from 'react'
import dynamic from 'next/dynamic'
import GrowSEB from '../public/GrowSEB.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const Loader: React.FC = () => {
  return (
    <div className='loader-overlay'>
      <Lottie animationData={GrowSEB} style={{ width: 150, height: 150 }} />
    </div>
  )
}

export default Loader
