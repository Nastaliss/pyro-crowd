import './Send.scss';
import Upload from './upload/Upload';
import { Form } from './form/form';
import { Hint } from './hint/hint';
import { Footer } from './footer/footer'
import { useRef } from 'react';

export const Send = ({isMobile}: {isMobile: boolean}) => {
  const datePickerRef = useRef()
  const onPictureSubmit = (file: File) => {
    if ( !datePickerRef.current ) {
      return;
    }
    (datePickerRef.current as {updateDate: (lastModified: number)=> any}).updateDate(file.lastModified)
  }
  return (
      <div id="sendContainer" className={isMobile? 'mobile': ''}>
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
