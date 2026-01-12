import React from 'react'
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import HomeSectionCard from './HomeSectionCard';

const HomeSectionCarousel = () => {
    const responsive = {
        0:{items:1},
        720:{items:3},
        1024:{items:5.5}
    }

    const items = [1,1,1,1,1].map((items)=><HomeSectionCard/>)
  return (
    <div className='relative px-4 lg:px-8'>
        <div className='relative p-5'>
        <AliceCarousel
                items={items}
                disableButtonsControls
                infinite
                responsive={responsive}
                />
        </div>
    </div>
  )
}

export default HomeSectionCarousel