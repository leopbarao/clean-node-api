import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeLoadSurveys } from '@/main/factories/usecases/survey/load-surveys/db-load-surveys-factory'

export const makeLoadSurveysController = (): Controller => {
  const loadSurveysController = new LoadSurveysController(makeLoadSurveys())
  return makeLogControllerDecorator(loadSurveysController)
}
