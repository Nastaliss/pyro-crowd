import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { Pill } from '../../pill/Pill'
import { Output } from './GlobalInfo'
import './PerPictureInfo.scss'
import { ALL_TAGS_TO_FALSE, TagState, Tags } from '../../tag/Tags'
import { PictureSelector } from '../../picture-by-picture/PictureSelector'
import { ModalRef } from '../../modal/Modal'
import { PictureInfoEditModal, PictureInfoEditModalContext } from './PictureInfoEditModal'
import { useEffect, useState } from 'react'
import { AllTags } from '../../tag/resources/tags'
import { PictureInfo } from './pictureInfo'
import { Button } from '../../button/Button'

export const PerPictureInfo = ({
  globalInfo,
  imageUploads,
  modalRef,
  isMobile
}: {
  globalInfo: Output
  imageUploads: File[]
  modalRef: ModalRef
  isMobile: boolean
}): JSX.Element => {
  const [perPictureInfo, setPerPictureInfo] = useState<PictureInfo[]>([])
  const [currentPictureIndex, setCurrentPictureIndex] = useState<number>(0)
  const [currentPictureDeleting, setCurrentPictureDeleting] = useState<boolean>(false)
  const [picturesLeftToTagCount, setPicturesLeftToTagCount] = useState<number | null>(null)
  const [firstInvalidPictureIndex, setFirstInvalidPictureIndex] = useState<number | null>(null)

  const [isReady, setIsReady] = useState(false)

  const setTagEnabled = (tagEnabled: TagState): void => {
    patchInfo({ tags: tagEnabled })
  }

  const formatDate = (date: Date): string => date.toLocaleDateString('fr-FR')
  const formatTime = (date: Date): string => date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })

  const patchInfo = (info: Partial<PictureInfo>): void => {
    const previousPerPictureInfo = perPictureInfo
    previousPerPictureInfo[currentPictureIndex] = { ...previousPerPictureInfo[currentPictureIndex], ...info }
    setPerPictureInfo([...previousPerPictureInfo]) // Shallow-ish copy to trigger repaint
  }

  const onPillClick = (): void => {
    const modalContext: PictureInfoEditModalContext = { ...perPictureInfo[currentPictureIndex], patchInfo }
    modalRef.open(PictureInfoEditModal, modalContext)
  }

  const buildInitialPerPictureInforFromGlobalInfo = (): void => {
    const perPictureInfoBuilder: PictureInfo[] = []
    for (let pictureIndex = 0; pictureIndex < imageUploads.length; pictureIndex++) {
      perPictureInfoBuilder.push({
        ...globalInfo,
        datetime: new Date(globalInfo.datetime), // Deep copying is required to break bond between dates
        file: structuredClone(imageUploads[pictureIndex]),
        tags: ALL_TAGS_TO_FALSE,
        deleted: false
      })
    }
    setPerPictureInfo(perPictureInfoBuilder)
    setIsReady(true)
  }

  const pictureIsValid = (pictureIndex: number): boolean => {
    for (const tag of Object.keys(perPictureInfo[pictureIndex].tags)) {
      if (perPictureInfo[pictureIndex].tags[tag as AllTags]) {
        return true
      }
    }
    return false
  }

  useEffect(buildInitialPerPictureInforFromGlobalInfo, [])

  const updateValidity = (): void => {
    let _picturesLeftToTagCount = 0
    let firstInvalidPicture = null
    for (let pictureIndex = 0; pictureIndex < perPictureInfo.length; pictureIndex++) {
      if (!pictureIsValid(pictureIndex)) {
        _picturesLeftToTagCount++
        if (firstInvalidPicture === null) firstInvalidPicture = pictureIndex
      }
    }
    setPicturesLeftToTagCount(_picturesLeftToTagCount)
    setFirstInvalidPictureIndex(firstInvalidPicture)
  }

  useEffect(updateValidity, [perPictureInfo])

  const triggerCurrentPictureDeleteAnimation = (): void => {
    setCurrentPictureDeleting(true)
  }
  const onCurrentPictureDeleteAnimationComplete = (): void => {
    setCurrentPictureDeleting(false)

    const editedPerPictureInfo = perPictureInfo
    editedPerPictureInfo.splice(currentPictureIndex, 1)
    setCurrentPictureIndex(Math.max(0, currentPictureIndex - 1))
    setPerPictureInfo([...editedPerPictureInfo])
  }

  const selectFirstInvalidPicture = (): void => {
    if (firstInvalidPictureIndex === null) return
    setCurrentPictureIndex(firstInvalidPictureIndex)
  }

  if (!isReady) return <></>
  return (
    <div className="contentContainer" id="perPictureInfo">
      <PictureSelector
        pictures={perPictureInfo}
        currentPictureIndex={currentPictureIndex}
        setCurrentPictureIndex={setCurrentPictureIndex}
        deleteCurrentPicture={triggerCurrentPictureDeleteAnimation}
        nextPictureSelectable={pictureIsValid(currentPictureIndex)}
        currentPictureDeleting={currentPictureDeleting}
        onCurrentPictureDeleted={onCurrentPictureDeleteAnimationComplete}
      />
      <div className="pillsContainer">
        <Pill text={formatDate(perPictureInfo[currentPictureIndex].datetime)} onClick={onPillClick} icon={faPencil}/>
        <Pill text={formatTime(perPictureInfo[currentPictureIndex].datetime)} onClick={onPillClick} icon={faPencil}/>
        <Pill text={perPictureInfo[currentPictureIndex].departement} onClick={onPillClick} icon={faPencil}/>
      </div>
      <h3>Quels éléments apparaissent ?</h3>
      <p>Sélectionnez les éléments que vous voyez</p>
      <Tags tagEnabled={perPictureInfo[currentPictureIndex].tags} setTagEnabled={setTagEnabled}/>
      {picturesLeftToTagCount !== null && picturesLeftToTagCount !== 0 && <p className='error'>Il reste {picturesLeftToTagCount} {picturesLeftToTagCount === 1 ? 'photo' : 'photos' } à décrire. <span className='clickable' onClick={selectFirstInvalidPicture}>Voir</span></p>}
      <Button text='Envoyer' filled={isMobile} disabled={picturesLeftToTagCount !== 0}/>
    </div>
  )
}
