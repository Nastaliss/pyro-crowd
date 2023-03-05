import { useRef } from 'react'
import { Button } from '../../button/Button'
import './Upload.scss'

const Upload = ({ onImageUpload }: { onImageUpload: (files: File[]) => any }): JSX.Element => {
  const inputRef = useRef<null | HTMLInputElement>(null)

  return (
    <div id="uploadButtonContainer">
      <Button text="Envoyer une photo" filled onClick={() => inputRef.current?.click()}/>
      <input id="hiddenInput" type="file" onChange={(e: any) => onImageUpload(e.target.files)} ref={inputRef} multiple/>
    </div>
  )
}

export default Upload
