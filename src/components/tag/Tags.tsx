import { useState } from 'react'
import { Tag } from './Tag'
import './Tags.scss'
import { AllTags, allTags, tags } from './resources/tags'

export const Tags = (): JSX.Element => {
  const [tagEnabled, setTagEnabled] = useState<Record<AllTags, boolean>>({
    clouds: false,
    fire: false,
    fog: false,
    sky: false,
    smoke: false
  })

  const onTagClick = (tagKey: AllTags): void => {
    setTagEnabled({
      ...tagEnabled,
      [tagKey]: !tagEnabled[tagKey]
    })
    console.log(tagKey)
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
