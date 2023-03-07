import './App.scss'
import Navbar from './components/navbar/Navbar'
import { Intro } from './components/intro/Intro'
import { Send } from './components/send/Send'
import { useEffect, useState } from 'react'
import Carousel from './components/intro/carousel/Carousel'
import { GlobalInfo, Output as GlobalInfoOutput } from './components/send/form/GlobalInfo'
import { PerPictureInfo } from './components/send/form/PerPictureInfo'

const vis = (function () {
  const keysList = ['hidden', 'webkitHidden', 'mozHidden', 'msHidden'] as const
  const valueList = ['visibilitychange', 'webkitvisibilitychange', 'mozvisibilitychange', 'msvisibilitychange'] as const
  type Keys = typeof keysList[number]
  type Value = typeof valueList[number]

  let stateKey: Keys
  let eventKey: Value

  const keys = {
    hidden: 'visibilitychange',
    webkitHidden: 'webkitvisibilitychange',
    mozHidden: 'mozvisibilitychange',
    msHidden: 'msvisibilitychange'
  }
  for (stateKey in keys) {
    if (stateKey in document) {
      eventKey = keys[stateKey] as Value
      break
    }
  }
  return function (c?: () => void) {
    if (c != null) document.addEventListener(eventKey, c)
    return !((document as any)[stateKey] as boolean)
  }
})()

function App (): JSX.Element {
  const [isMobile, setIsMobile] = useState(false)
  const [animate, setAnimate] = useState(true)

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

    vis(function () {
      console.log('up')
      if (vis()) {
        setTimeout(function () {
          setAnimate(true)
        }, 300)
      } else {
        setAnimate(false)
      }
    })
  }, [])

  const [stage, setStage] = useState<'IMAGE_UPLOAD' | 'GLOBAL_INFO' | 'PER_PICTURE_INFO' | 'CONFIRM'>('IMAGE_UPLOAD')

  const [globalInfo, setGlobalInfo] = useState<GlobalInfoOutput | null>(
    { consent: true, datetime: new Date(), departement: 'Aine' }
  )

  const [imageUploads, setImageUploads] = useState<File[]>([])

  let content: JSX.Element = <></>

  const onImageUploadSubmit = (files: any): void => {
    setImageUploads(files)
    setStage('GLOBAL_INFO')
  }

  const onGlobalInfoSubmit = (globalInfoOutput: GlobalInfoOutput): void => {
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
          <PerPictureInfo globalInfo={globalInfo} imageUploads={imageUploads}/>
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
                  <Carousel key="1" directionLeftToRight={true} animate={animate}/>
                  <Carousel key="2" directionLeftToRight={false} animate={animate}/>
                  <Carousel key="3" directionLeftToRight={true} animate={animate}/>
                </div>
              </div>}
      {isMobile
        ? <div id="straightCarouselContainer" className={isMobile ? 'mobile' : ''}>
            <div id="smallCarouselContainer">
              <Carousel key="1" directionLeftToRight={true} animate={animate}/>
              <Carousel key="2" directionLeftToRight={false} animate={animate}/>
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
