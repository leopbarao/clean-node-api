import {
  accountSchema,
  addSurveyParamsSchema,
  errorSchema,
  loginParamsSchema,
  saveSurveyParamsSchema,
  signUpParamsSchema,
  surveyAnswerSchema,
  surveyResultSchema,
  surveySchema,
  surveysSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  signUpParams: signUpParamsSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema
}
