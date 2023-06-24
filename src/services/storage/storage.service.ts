import axios, { AxiosHeaderValue } from 'axios'
import { CreateMediaResponseDTO, GetMediaUrlDTO, LoginResponseDTO } from './storage-api.dto'

export class StorageService {
  private readonly storageUrl = process.env.STORAGE_URL as string
  private readonly storagePort = process.env.STORAGE_PORT as string
  private readonly username = process.env.STORAGE_USERNAME as string
  private readonly password = process.env.STORAGE_PASSWORD as string
  private bearer: string | null = null

  private async initializeIfNotInitialized (): Promise<void> {
    if (this.bearer === null) {
      await this.initialize()
    }
  }

  private generateHeaders (): { Authorization: AxiosHeaderValue } {
    return { Authorization: `Bearer ${this.bearer as string}` }
  }

  public async initialize (): Promise<void> {
    const loginFormData = new FormData()
    loginFormData.append('username', this.username)
    loginFormData.append('password', this.password)
    const resp = await axios.post<LoginResponseDTO>(
      `${this.storageUrl}:${this.storagePort}/login/access-token`,
      loginFormData
    )
    this.bearer = resp.data.access_token
  }

  // public async getMedias (): Promise<string[]> {
  //   await this.initializeIfNotInitialized()
  //   const resp = await axios.get<string[]>(
  //     `${this.storageUrl}:${this.storagePort}/medias`,
  //     { headers: this.generateHeaders() }
  //   )
  //   return resp.data
  // }

  private async createMedia (): Promise<number> {
    const resp = await axios.post<CreateMediaResponseDTO>(
      `${this.storageUrl}:${this.storagePort}/media`,
      {},
      { headers: this.generateHeaders() }
    )
    return resp.data.id
  }

  private async uploadImageToMedia (mediaId: number, image: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', image)
    await axios.post<CreateMediaResponseDTO>(
      `${this.storageUrl}:${this.storagePort}/media/${mediaId}/upload`,
      formData,
      { headers: this.generateHeaders() }
    )
  }

  private async getMediaUrl (mediaId: number): Promise<string> {
    const resp = await axios.get<GetMediaUrlDTO>(
      `${this.storageUrl}:${this.storagePort}/media/${mediaId}/url`,
      { headers: this.generateHeaders() }
    )
    return resp.data.url
  }

  public async uploadMediaAndGetUrl (image: File): Promise<string> {
    await this.initializeIfNotInitialized()
    const mediaId = await this.createMedia()
    await this.uploadImageToMedia(mediaId, image)
    const url = await this.getMediaUrl(mediaId)
    return url
  }
}
