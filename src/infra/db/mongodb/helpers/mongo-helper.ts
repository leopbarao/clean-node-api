import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: (null as unknown) as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...valuesWithoutId } = collection
    return Object.assign({}, valuesWithoutId, { id: _id })
  }
}
