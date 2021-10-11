import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: (null as unknown) as MongoClient,
  uri: (null as unknown) as string,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) {
      this.client = await MongoClient.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...valuesWithoutId } = collection
    return Object.assign({}, valuesWithoutId, { id: _id })
  }
}
