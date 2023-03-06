import './App.scss'
import Navbar from './components/navbar/Navbar'
import { Intro } from './components/intro/Intro'
import { Send } from './components/send/Send'
import { useEffect, useState } from 'react'
import Carousel from './components/intro/carousel/Carousel'
import { GlobalInfo, Output } from './components/send/form/GlobalInfo'
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

  const [stage, setStage] = useState<'IMAGE_UPLOAD' | 'GLOBAL_INFO' | 'PER_PICTURE_INFO' | 'CONFIRM'>('PER_PICTURE_INFO')

  const [globalInfo, setGlobalInfo] = useState<Output | null>(
    { consent: true, datetime: new Date(), departement: 'Aine' }
  )

  let content: JSX.Element = <></>

  const onImageUploadSubmit = (): void => {
    setStage('GLOBAL_INFO')
  }

  const onGlobalInfoSubmit = (globalInfoOutput: Output): void => {
    setGlobalInfo(globalInfoOutput)
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
      if (globalInfo === null) {
        throw TypeError('globalInfo is null')
      }
      content = (
        <>
          <PerPictureInfo globalInfo={globalInfo }/>
        </>
      )
      break
    default:
      break
  }

  return (
    <div id="rootOrganizer">
      <Navbar isMobile={isMobile} />
          {isMobile
            ? <></>
            : <div id="straightCarouselContainer" className={isMobile ? 'mobile' : ''}>
                <div id="wideCarouselContainer">
                  <Carousel directionLeftToRight={true}/>
                  <Carousel directionLeftToRight={false}/>
                  <Carousel directionLeftToRight={true}/>
                </div>
              </div>}
      {isMobile
        ? <div id="straightCarouselContainer" className={isMobile ? 'mobile' : ''}>
            <div id="smallCarouselContainer">
              <Carousel directionLeftToRight={true}/>
              <Carousel directionLeftToRight={false}/>
            </div>
          </div>
        : <></>}
      <div id="pageContainer" className={isMobile ? 'mobile' : ''}>
        {content}
      </div>
    </div>
  )
}

export default App
