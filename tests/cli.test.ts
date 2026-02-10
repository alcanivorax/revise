import { describe, it, expect } from 'vitest'
import { run } from '../src/index.js'

describe('index', () => {
  it('should return running message', async () => {
    const result = await run()
    expect(result).toContain('is running...')
  })
})
