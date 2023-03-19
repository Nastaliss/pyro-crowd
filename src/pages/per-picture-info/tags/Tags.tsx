import './Tags.scss'
import { AllTags, allTags, tags } from './resources/tags'
import { Tag } from './tag/Tag'

export const ALL_TAGS_TO_FALSE = {
  clouds: false,
  fire: false,
  fog: false,
  sky: false,
  smoke: false
}

export type TagState = Record<AllTags, boolean>

export const Tags = ({ tagEnabled, setTagEnabled }: { tagEnabled: TagState, setTagEnabled: (tags: TagState) => void }): JSX.Element => {
  const onTagClick = (tagKey: AllTags): void => {
    setTagEnabled({
      ...tagEnabled,
      [tagKey]: !tagEnabled[tagKey]
    })
  }

  const tagsElements = allTags.map((tagKey, tagIndex1) => <>
    <Tag tagInfo={tags[tagKey]} enabled={tagEnabled[tagKey]} onClick={onTagClick} key={tagIndex1} tagId={tagKey}/>
  </>)
  return (
    <div className='tagsContainer'>
      {tagsElements}
    </div>
  )
}
