import { useEffect, useState } from 'react'
import './Picture.scss'

export type PictureInfo = File

export const Picture = ({ className, picture, index, onClick, onSwipe }: { className: string, picture: PictureInfo, index: number, onClick: (index: number) => void, onSwipe: (index: number, swipePx: number) => void }): JSX.Element => {
  const [pictureSrc, setPictureSrc] = useState<string | null>(null)
  const [touchStartPos, setTouchStartPos] = useState<number | null>(null)
  const [touchCurrentPos, setTouchCurrentPos] = useState<number | null>(null)

  useEffect(() => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPictureSrc(reader.result as string)
    }
    reader.readAsDataURL(picture)
  }, [])

  const onTouchStart = (e: React.TouchEvent<HTMLImageElement>): void => {
    console.log(e.targetTouches[0])
    setTouchStartPos(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent<HTMLImageElement>): void => setTouchCurrentPos(e.targetTouches[0].clientX)
  const onTouchEnd = (e: React.TouchEvent<HTMLImageElement>): void => onSwipe(index, (touchCurrentPos === null ? 0 : touchCurrentPos) - (touchStartPos === null ? 0 : touchStartPos))

  return (
    <>{pictureSrc === null
      ? <></>
      : <img src={pictureSrc}
        className={`picture-preview ${className}`}
        onClick={() => onClick(index)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        />}</>
  )
}
