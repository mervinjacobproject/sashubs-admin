import React from 'react'
// import { Lottie } from 'lottie-react'
import infinityAnimation from '../../public/animation.json'

const InfinityLoader: React.FC = () => {
  try {
    return (
      <div className='infinity-loader' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* <Lottie animationData={infinityAnimation} loop autoplay /> */}
      </div>
    )
  } catch (error) {
    console.error('Error loading animation:', error)
    return <div>Error loading animation</div>
  }
}

export default InfinityLoader
