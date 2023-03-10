import { useState } from 'react'
import { ModalInnerComponent } from '../../modal/Modal'
import { GlobalInfoForm, Output } from './GlobalInfo'

export const PictureInfoEditModal: ModalInnerComponent = ({ close, context }: { close: () => void, context: Output }): JSX.Element => {
  console.log('here')
  console.log(context)
  const [date, setDate] = useState<Date>(context.datetime)
  const [_, setDepartement] = useState<string>(context.departement)
  console.log(_)
  return (<>
    <button onClick={close}></button>
    <GlobalInfoForm date={date} onDateTimeChange={setDate} onDepartementChange={() => setDepartement} valid={{ date: true, time: true }} initialDepartement={context.departement}/>
  </>)
}
