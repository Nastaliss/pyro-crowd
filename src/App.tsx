import './App.scss'
import Navbar from './components/navbar/Navbar'
import { Intro } from './components/intro/Intro'
import { Send } from './components/send/Send'
import { useEffect, useRef, useState } from 'react'

function App (): JSX.Element {
  const [isMobile, setIsMobile] = useState(false)

  const sendComponentRef = useRef<HTMLDivElement>(null)

  const onWindowResize = (): void => {
    if (window.innerWidth < 650) {
      setIsMobile(true)
      return
    }
    setIsMobile(false)
  }

  const scrollToSend = (): void => {
    sendComponentRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  })

  return (
    <div id="rootOrganizer">
      <Navbar isMobile={isMobile} />
      <Intro isMobile={isMobile} scrollToSend={scrollToSend}/>
      <Send isMobile={isMobile} ref={sendComponentRef}/>
    </div>
  )
}

export default App
