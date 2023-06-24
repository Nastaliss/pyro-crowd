import { MongoClient, ServerApiVersion } from 'mongodb'
import { AllTags } from '../../pages/per-picture-info/tags/resources/tags'

const USERNAME = process.env.MONGODB_USERNAME
const PASSWORD = process.env.MONGODB_PASSWORD
const URL = process.env.MONGODB_URL

if (USERNAME === undefined || PASSWORD === undefined || URL === undefined) {
  throw new Error('Missing MongoDB credentials')
}

const uri = `mongodb+srv://${USERNAME}:${PASSWORD}@${URL}/?retryWrites=true&w=majority`

export class MetadataService {
  client: MongoClient
  public constructor () {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
  }

  public async uploadMetadataForImageUrl (metadata: AllTags[], url: string): Promise<void> {
    await this.client.connect()
    const db = this.client.db('crowdsourcer')
    const collection = db.collection('images')
    await collection.insertOne({ metadata, url })
  }
}
