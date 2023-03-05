import './App.scss'
import Navbar from './components/navbar/Navbar'
import { Intro } from './components/intro/Intro'
import { Send } from './components/send/Send'
import { useEffect, useState } from 'react'
import Carousel from './components/intro/carousel/Carousel'
import { GlobalInfo } from './components/send/form/GlobalInfo'
import { PerPictureInfo } from './components/send/form/PerPictureInfo'

function App (): JSX.Element {
  const [isMobile, setIsMobile] = useState(false)

  const onWindowResize = (): void => {
    if (window.innerWidth < 650) {
      setIsMobile(true)
      return
    }
    setIsMobile(false)
  }
  useEffect(() => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  })

  const [stage, setStage] = useState<'IMAGE_UPLOAD' | 'GLOBAL_INFO' | 'PER_PICTURE_INFO' | 'CONFIRM'>('GLOBAL_INFO')

  let content: JSX.Element = <></>

  const onImageUploadSubmit = (): void => {
    setStage('GLOBAL_INFO')
  }

  const onGlobalInfoSubmit = (): void => {
    setStage('PER_PICTURE_INFO')
  }

  switch (stage) {
    case 'IMAGE_UPLOAD':
      content = (
        <>
          <Intro isMobile={isMobile}/>
          <Send isMobile={isMobile} onSubmit={onImageUploadSubmit}/>
        </>
      )
      break

    case 'GLOBAL_INFO':
      content = (
        <>
          <GlobalInfo onSubmit={onGlobalInfoSubmit}/>
        </>
      )
      break
    case 'PER_PICTURE_INFO':
      content = (
        <>
          <PerPictureInfo/>
        </>
      )
      break
    default:
      break
  }

  return (
    <div id="rootOrganizer">
      <Navbar isMobile={isMobile} />
      <div id="pageContainer" className={isMobile ? 'mobile' : ''}>
        <div id="straightCarouselContainer" className={isMobile ? 'mobile' : ''}>
          {isMobile
            ? <div id="smallCarouselContainer">
            <Carousel/>
            <Carousel directionLeftToRight={false}/>
          </div>
            : <div id="wideCarouselContainer">
            <Carousel />
            <Carousel directionLeftToRight={false}/>
            <Carousel/>
          </div>
          }
        </div>
        {content}
      </div>

    </div>
  )
}

export default App
