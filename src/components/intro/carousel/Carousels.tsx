/* eslint-disable no-return-assign */
import { useEffect, useRef } from 'react'
import Carousel from './Carousel'

const MobileCarousel = [
  { directionLeftToRight: true },
  { directionLeftToRight: false }
]

const LargeCarousel = [
  { directionLeftToRight: true },
  { directionLeftToRight: false },
  { directionLeftToRight: true }
]

export const Carousels = ({ isMobile, animate }: { isMobile: boolean, animate: boolean }): JSX.Element => {
  // const [refs, setRefs] = useState<Array<MutableRefObject<Carousel | null>>>([])
  const itemsRef = useRef<Array<Carousel | null>>([])

  useEffect(
    () => {
      const carousel = isMobile ? MobileCarousel : LargeCarousel
      itemsRef.current = itemsRef.current.slice(0, carousel.length)
    }, [isMobile]
  )

  useEffect(
    () => {
      for (const carouselRef of itemsRef.current) {
        if (animate) {
          console.log('startSpqw')
          carouselRef?.startSpawn()
        } else carouselRef?.stopSpawn()
      }
    }, [animate]
  )

  return (
    <div id="straightCarouselContainer" className={isMobile ? 'mobile' : ''}>
      {isMobile
        ? <div id="smallCarouselContainer">
            {MobileCarousel.map((carousel, index) => <>
              <Carousel key={index} directionLeftToRight={carousel.directionLeftToRight} ref={el => itemsRef.current[index] = el}/>
            </>)}
          </div>
        : <div id="wideCarouselContainer">
            {LargeCarousel.map((carousel, index) => <>
              <Carousel key={index} directionLeftToRight={carousel.directionLeftToRight} ref={el => itemsRef.current[index] = el}/>
            </>)}
          </div>
      }
    </div>
  )
}
