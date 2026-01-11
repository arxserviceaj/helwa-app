import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from '../../data/MainCarouselData';


const MainCarousel = () => {
    const items = mainCarouselData.map((item)=> <img src={item.image} className='cursor-help' alt='' role='presentation'/>)

    return(
    <AliceCarousel
        items={items}
        disableButtonsControls
        autoPlay
        autoPlayInterval={900}
        infinite
        disableDotsControls
    />
)
};

export default MainCarousel;