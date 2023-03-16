import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import './Modal.scss'

export type ModalContext = any
export type ModalInnerComponent = React.FC<{ close: () => void, context: ModalContext }>
export interface ModalRef {
  open: (content: ModalInnerComponent, context: ModalContext) => void
  close: () => unknown
}

const ANIMATION_DURATION_SECONDS = 0.3

export const Modal = forwardRef<ModalRef, {}>((_, ref: any): JSX.Element => {
  const [isClosing, setIsClosing] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [InnerComponent, setInnerComponent] = useState<ModalInnerComponent | null>(null)
  const [context, setContext] = useState<ModalContext>(null)

  const close = (): void => {
    console.log('clooose')
    setIsClosing(true)
    setTimeout(() => setIsOpen(false), ANIMATION_DURATION_SECONDS * 1000)
  }

  useImperativeHandle(ref, (): ModalRef => ({
    open (content: ModalInnerComponent, context: ModalContext) {
      setIsClosing(true)
      if (content === null) {
        throw new Error('content cant be null')
      }
      setInnerComponent(() => content) // Why is this required ?
      setContext(context)
      setIsOpen(true)
    },
    close
  }))

  useEffect(() => {
    if (!isOpen) return
    setIsClosing(false)
  }, [isOpen])

  return (
    <>
     {isOpen && InnerComponent !== null &&
  <div id="modalContainer" className={isClosing ? 'isClosing' : ''} style={{ transition: `opacity ${ANIMATION_DURATION_SECONDS}s` }}>
        <div id="modal">
          <InnerComponent close={close} context={context}/>
        </div>
      </div> }
    </>
  )
})
Modal.displayName = 'Modal'
