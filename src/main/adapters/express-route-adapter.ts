import { Controller, HttpRequest } from '@/presentation/protocols'
import { Request, RequestHandler, Response } from 'express'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (req: Request, resp: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }

    const httpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200 || httpResponse.statusCode === 204) {
      resp.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      resp.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
