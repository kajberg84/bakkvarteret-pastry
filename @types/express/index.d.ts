import { IPastry } from '../../src/models/pastry-model'

declare global {
  namespace Express {
    interface Request {
      pastry: IPastry | undefined
      user: IUser | undefined
    }
  }
}
