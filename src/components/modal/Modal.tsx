import { forwardRef, useImperativeHandle, useState } from 'react'
import './Modal.scss'

export type ModalContext = any
export type ModalInnerComponent = React.FC<{ close: () => void, context: ModalContext }>
export interface ModalRef {
  open: (content: ModalInnerComponent, context: ModalContext) => void
  close: () => unknown
}

export const Modal = forwardRef<ModalRef, {}>((_, ref: any): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [InnerComponent, setInnerComponent] = useState<ModalInnerComponent | null>(null)
  const [context, setContext] = useState<ModalContext>(null)

  const close = (): void => setIsOpen(false)

  useImperativeHandle(ref, (): ModalRef => ({
    open (content: ModalInnerComponent, context: ModalContext) {
      if (content === null) {
        throw new Error('content cant be null')
      }
      setInnerComponent(() => content) // Why is this required ?
      setContext(context)
      setIsOpen(true)
    },
    close
  }))

  return (
    <>
     {isOpen && InnerComponent !== null && <div id="modalContainer">
        <InnerComponent close={close} context={context}/>
      </div> }
    </>
  )
})
Modal.displayName = 'Modal'
