import axios from 'axios'

const BASE_URL = 'http://152.228.213.70:8080'

interface createMediaDTO {
  id: number
  created_at: Date
  type: 'image' | 'video'
}

class UploadService {
  token: string
  constructor (token: string) {
    this.token = token
  }

  async uploadPicture (picture: File): Promise<number> {
    const createMediaResponse = await axios.post<createMediaDTO>(`${BASE_URL}/media/`, {
      type: 'image'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const mediaId = createMediaResponse.data.id
    const formData = new FormData()
    formData.append('image', picture)
    await axios.post(`${BASE_URL}/media/${mediaId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return mediaId
  }

  // async labelPicture (pictureId: number, )
}

const uploadService = new UploadService('abc')
export default uploadService
