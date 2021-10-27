import app from '../config/app'
import env from '../config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

let surveyCollection: Collection
let accountCollection: Collection

const makeAccessToken = async (): Promise<string> => {
  const resInsert = await accountCollection.insertOne({
    name: 'Leonardo Barão',
    email: 'leopbarao@gmail.com',
    password: '123'
  })
  const accessToken = sign({ id: resInsert.insertedId }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: resInsert.insertedId
  }, {
    $set: { accessToken }
  })

  return accessToken
}

const makeSurvey = async (): Promise<string> => {
  const resInsert = await surveyCollection.insertOne({
    question: 'Question 1',
    answers: [{
      image: 'http://image-name.com',
      answer: 'Answer 1'
    },
    {
      answer: 'Answer 2'
    }],
    date: new Date()
  })
  return resInsert.insertedId.toString()
}

describe('SurveyResult Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken()
      const surveyId = await makeSurvey()
      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200)
    })
  })
})
