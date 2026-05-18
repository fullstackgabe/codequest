import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadJSON, removeKey, saveJSON } from '../storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads JSON values', () => {
    saveJSON('foo', { a: 1, b: 'two' })
    expect(loadJSON('foo', { a: 0, b: '' })).toEqual({ a: 1, b: 'two' })
  })

  it('returns fallback when key is missing', () => {
    expect(loadJSON('missing', 'default')).toBe('default')
  })

  it('returns fallback when stored value is invalid JSON', () => {
    localStorage.setItem('bad', '{not valid json')
    expect(loadJSON('bad', { ok: false })).toEqual({ ok: false })
  })

  it('saveJSON does not throw when localStorage.setItem fails', () => {
    const spy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('quota')
      })
    expect(() => saveJSON('x', { y: 1 })).not.toThrow()
    spy.mockRestore()
  })

  it('removeKey deletes the entry', () => {
    saveJSON('toremove', 1)
    removeKey('toremove')
    expect(loadJSON<number | null>('toremove', null)).toBe(null)
  })
})
