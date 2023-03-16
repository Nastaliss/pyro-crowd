import { useEffect, useState } from 'react'
import './Picture.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

export const Picture = ({
  className,
  picture,
  index,
  clickable,
  deletable,
  onClick,
  onSwipe,
  onDelete
}: {
  className: string
  picture: File
  index: number
  clickable: boolean
  deletable: boolean
  onClick: (index: number) => void
  onSwipe: (index: number, swipePx: number) => void
  onDelete: () => void
}): JSX.Element => {
  const [pictureSrc, setPictureSrc] = useState<string | null>(null)
  const [touchStartPos, setTouchStartPos] = useState<number | null>(null)
  const [touchCurrentPos, setTouchCurrentPos] = useState<number | null>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPictureSrc(reader.result as string)
    }
    reader.readAsDataURL(picture)
  }, [picture])

  const onTouchStart = (e: React.TouchEvent<HTMLImageElement>): void => {
    setTouchStartPos(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent<HTMLImageElement>): void => setTouchCurrentPos(e.targetTouches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent<HTMLImageElement>): void => onSwipe(index, (touchCurrentPos === null ? 0 : touchCurrentPos) - (touchStartPos === null ? 0 : touchStartPos))
  return (
    (pictureSrc !== null
      ? <div className='picture-preview'>
      <img src={pictureSrc}
        className={`${className} ${clickable ? 'clickable' : ''}`}
        onClick={() => { onClick(index) }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        />
      {deletable && <FontAwesomeIcon icon={faTrash} className='deleteIcon' onClick={() => onDelete()}/>}
      </div>
      : <></>)
  )
}
