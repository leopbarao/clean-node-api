import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (req, resp) => {
    resp.json({ ok: 'ok' })
  })
}
