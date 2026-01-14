import React from 'react'
import MainCarousel from '../customer/components/MainCarousel'
import HomeSectionCarousel from '../components/Common/HomeSectionCarousel'

const Homepage = () => {
  return (
    <div>
        <MainCarousel/>
        <div>
          <HomeSectionCarousel/>
        </div>
    </div>
  )
}

export default Homepage