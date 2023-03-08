import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { Pill } from '../../pill/Pill'
import { Output } from './GlobalInfo'
import './PerPictureInfo.scss'
import { Tags } from '../../tag/Tags'
import { PictureByPicture } from '../../picture-by-picture/PictureByPicture'

export const PerPictureInfo = ({ globalInfo, imageUploads }: { globalInfo: Output, imageUploads: File[] }): JSX.Element => {
  const formatDate = (date: Date): string => date.toLocaleDateString('fr-FR')

  const formatTime = (date: Date): string => date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="contentContainer" id="perPictureInfo">
      <PictureByPicture pictures={imageUploads}/>
      <div className="pillsContainer">
        <Pill text={formatDate(globalInfo.datetime)} onClick={() => console.log('click')} icon={faPencil}/>
        <Pill text={formatTime(globalInfo.datetime)} onClick={() => console.log('click')} icon={faPencil}/>
        <Pill text='test' onClick={() => console.log('click')} icon={faPencil}/>
      </div>
      <h3>Quels éléments apparaissent ?</h3>
      <p>Sélectionnez les éléments que vous voyez</p>
      <Tags/>
    </div>
  )
}
