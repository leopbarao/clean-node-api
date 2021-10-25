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
    password: '123',
    role: 'admin'
  })
  const accessToken = sign({ id: resInsert.insertedId }, env.jwtSecret)
  await accountCollection.updateOne({
    _id: resInsert.insertedId
  }, {
    $set: { accessToken }
  })

  return accessToken
}

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question 1',
          answers: [{
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey use valid accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', await makeAccessToken())
        .send({
          question: 'Question 1',
          answers: [{
            image: 'http://image-name.com',
            answer: 'Answer 1'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 on load surveys use valid accessToken', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }, {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }])

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', await makeAccessToken())
        .expect(200)
    })
  })
})
