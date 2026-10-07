import { expect, test } from 'claude-code/testing'

import { compact, meterColor, meterRuns, sparkline, textOn, tokensOf, resetAt } from '../hooks/register.tsx'

test('meter goes green → yellow → red', () => {
  expect(meterColor(0)).toEqual([34, 197, 94])
  expect(meterColor(50)).toEqual([234, 179, 8])
  expect(meterColor(100)).toEqual([239, 68, 68])
})

test('percentage text contrasts with its cell', () => {
  expect(textOn([234, 179, 8])).toBe('#000000')
  expect(textOn([74, 74, 74])).toBe('#ffffff')
  const runs = meterRuns(42, 10)
  expect(runs.map(r => r.text).join('')).toBe('   42%    ')
  expect(runs[0].bg).not.toBe(runs[runs.length - 1].bg)
})

test('sparkline scales to the largest turn', () => {
  expect(sparkline([0, 50, 100])).toBe('▁▄█')
})

test('formatting', () => {
  expect(compact(98_300)).toBe('98.3k')
  expect(compact(1_250_000)).toBe('1.3M')
  expect(resetAt('2026-10-07T13:05:00', false)).toBe('13:05')
  expect(resetAt('2026-10-08T09:00:00', true)).toBe('Thu 09:00')
  expect(tokensOf({ model: 'x', input_tokens: 1, output_tokens: 2, cache_read_input_tokens: 1000, cache_creation_input_tokens: 3 })).toBe(6)
})
