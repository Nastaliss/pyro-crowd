import { AllTags } from '../../tag/resources/tags'
import { Output } from './GlobalInfo'

export type PictureInfo = Output & {
  tags: Record<AllTags, boolean>
  file: File
  deleted: boolean
}
