import { PictureInfo } from '../../pages/per-picture-info/PerPictureInfo'
import { AllTags } from '../../pages/per-picture-info/tags/resources/tags'
import { MetadataService } from '../metadata/metadata.service'
import { StorageService } from '../storage/storage.service'

export const uploadImagesAndMetadata = async (perPictureInfo: PictureInfo[]): Promise<void> => {
  const storageService = new StorageService()
  await storageService.initialize()
  const metadataService = new MetadataService()
  await Promise.all(perPictureInfo.map(async (pictureInfo) => {
    const url = await storageService.uploadMediaAndGetUrl(pictureInfo.file)
    const metadata = Object.keys(pictureInfo.tags).filter((key) => pictureInfo.tags[key as AllTags])
    await metadataService.uploadMetadataForImageUrl(metadata as AllTags[], url)
  }
  ))
}
