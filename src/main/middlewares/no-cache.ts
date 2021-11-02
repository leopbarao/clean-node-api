import { Request, Response, NextFunction } from 'express'

export const noCache = (req: Request, resp: Response, next: NextFunction): void => {
  resp.set('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  resp.set('pragma', 'no-cache')
  resp.set('expires', '0')
  resp.set('surrogate-control', 'no-store')
  next()
}
