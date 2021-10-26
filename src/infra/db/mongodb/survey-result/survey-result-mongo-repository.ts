import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { ReturnDocument } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultsCollection = await MongoHelper.getCollection('surveyResults')
    const { surveyId, accountId, date, answer } = data
    const surveyResult = await surveyResultsCollection.findOneAndUpdate(
      { surveyId, accountId },
      { $set: { date, answer } },
      { upsert: true, returnDocument: ReturnDocument.AFTER }
    )
    return MongoHelper.map(surveyResult.value)
  }
}
