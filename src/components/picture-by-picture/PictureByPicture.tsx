import { useState } from 'react'
import './PictureByPicture.scss'
import { Picture, PictureInfo } from './Picture'

export const PictureByPicture = ({ pictures }: { pictures: PictureInfo[] }): JSX.Element => {
  const [currentPictureIndex, setCurrentPictureIndex] = useState<number>(0)

  const pictureWidth = '60vw'
  const margin = '10px'

  const onPictureClick = (pictureIndex: number): void => {
    if (pictureIndex === currentPictureIndex + 1) {
      setCurrentPictureIndex(currentPictureIndex + 1)
    } else if (pictureIndex === currentPictureIndex - 1) {
      setCurrentPictureIndex(currentPictureIndex - 1)
    }
  }

  const onPictureSwipe = (pictureIndex: number, pictureSwipePx: number): void => {
    if (pictureIndex !== currentPictureIndex) return
    if (Math.abs(pictureSwipePx) < 50) return
    if (pictureSwipePx > 0) setCurrentPictureIndex(Math.max(0, currentPictureIndex - 1))
    if (pictureSwipePx < 0) setCurrentPictureIndex(Math.min(pictures.length - 1, currentPictureIndex + 1))
  }

  return (
    <div id='picture-by-picture' style={{
      transform: `translateX(calc(-${currentPictureIndex} * (${pictureWidth} + 2 * ${margin})))`
    }}>
      {pictures.map((picture, pictureIndex) =>
      <Picture
      key={pictureIndex}
      className={`${pictureIndex === currentPictureIndex ? 'selected' : ''}`}
      picture={picture}
      index={pictureIndex}
      onClick={onPictureClick}
      onSwipe={onPictureSwipe}
      />)}
    </div>
  )
}
