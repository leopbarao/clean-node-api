import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hash'))
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => resolve(true))
  }
}))

interface SutTypes {
  sut: BcryptAdapter
}

const salt = 12
const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt)

  return {
    sut
  }
}

describe('Bcrypt Adapter', () => {
  test('Should call hash with correct value', async () => {
    const { sut } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const { sut } = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw if hash throws', async () => {
    const { sut } = makeSut()
    const rejectFunc: () => void = async () => {
      await new Promise((resolve, reject) => reject(new Error()))
    }

    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(rejectFunc())
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_value', 'hash')
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'hash')
  })
})
