import { useState } from 'react'
import { ModalInnerComponent } from '../../modal/Modal'
import { GlobalInfoForm, Output } from './GlobalInfo'
import { Button } from '../../button/Button'
import { Value } from './fields/Fields'
import { PictureInfo } from './pictureInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'

export type PictureInfoEditModalContext = PictureInfo & {
  patchInfo: (info: Output) => void
}

export const PictureInfoEditModal: ModalInnerComponent = ({ close, context }: { close: () => void, context: PictureInfoEditModalContext }): JSX.Element => {
  const [date, setDate] = useState<Date>(context.datetime)
  const [departement, setDepartement] = useState<Value>(context.departement)
  const submit = (): void => {
    context.patchInfo({ datetime: date, departement: departement as string, consent: true })
    close()
  }
  return (<>
    <FontAwesomeIcon icon={faCircleXmark} className='closeIcon' onClick={close}/>
    <GlobalInfoForm date={date} onDateTimeChange={setDate} onDepartementChange={(d) => setDepartement(d as string)} valid={{ date: true, time: true }} initialDepartement={context.departement}/>
    <Button text='Valider' onClick={submit }/>
  </>)
}
