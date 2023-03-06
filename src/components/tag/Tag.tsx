import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Tag.scss'
import { AllTags, TagInfo } from './resources/tags'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

export const Tag = ({ tagInfo, enabled, onClick, tagId }: { tagInfo: TagInfo, enabled: boolean, onClick: (key: AllTags) => void, tagId: AllTags }): JSX.Element => {
  return (
    <div className={`tagContainer ${enabled ? 'enabled' : 'disabled'}`}>
      <div className='tag' onClick={() => onClick(tagId)}>
        <img src={tagInfo.image}/>
      </div>
      <span>{enabled ? <FontAwesomeIcon icon={faCircleCheck} className='enabledIcon'/> : <></> }{tagInfo.title}</span>
    </div>
  )
}
