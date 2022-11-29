import './Send.scss'
import Upload from './upload/Upload'
import { Form } from './form/form'
import { Hint } from './hint/hint'
import { Footer } from './footer/footer'
import { forwardRef, useRef } from 'react'

export const Send = forwardRef<HTMLDivElement | null, { isMobile: boolean }>(({ isMobile }, ref): JSX.Element => {
  const datePickerRef = useRef<{ updateDate: (lastModified: number) => any }>()
  const onPictureSubmit = (file: File): void => {
    if (datePickerRef.current === undefined) {
      return
    }
    (datePickerRef.current).updateDate(file.lastModified)
  }
  return (
      <div id="sendContainer" className={isMobile ? 'mobile' : ''} ref={ref}>
        <h2>📷 Envoyer ma photo</h2>
        <p>Télécharger une ou plusieurs photo</p>
          <div id="formContainer">
            <Upload onPictureSubmit={onPictureSubmit}/>
            <Hint/>
            <Form datePickerRef={datePickerRef}/>
        </div>
        <Footer/>
      </div>
  )
}
)

Send.displayName = 'Send'
