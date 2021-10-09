import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, RequestHandler, Response } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, resp: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }

    const httpResponse = await controller.handle(httpRequest)
    resp.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
