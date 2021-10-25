import { AddAccountModel, AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<AccountModel>
}
