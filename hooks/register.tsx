import { atom, read, update } from 'claude-code'
import type { Register, SessionRateLimit, TurnUsage } from 'claude-code'
import type { TurnTokens } from '../types'

const HISTORY = 12
const METER_WIDTH = 10
const BARS = '▁▂▃▄▅▆▇█'
const TRACK = '#4a4a4a'

// Token totals of the last turns, oldest first; kept across reloads
const turns = atom({ plugin: 'usage', key: 'turns' } as const, [] as TurnTokens)

// Tokens a turn spent: everything but cache reads, which re-count the whole context every step
export const tokensOf = (u: TurnUsage | undefined) =>
  u ? u.input_tokens + u.cache_creation_input_tokens + u.output_tokens : 0

type Rgb = [number, number, number]
const STOPS: Rgb[] = [
  [34, 197, 94], // green
  [234, 179, 8], // yellow
  [239, 68, 68], // red
]

export function meterColor(pct: number): Rgb {
  const t = Math.min(Math.max(pct, 0), 100) / 50
  const i = Math.min(Math.floor(t), 1)
  const f = t - i
  const [a, b] = [STOPS[i], STOPS[i + 1]]
  return [0, 1, 2].map(k => Math.round(a[k] + (b[k] - a[k]) * f)) as Rgb
}

const hex = (c: Rgb) => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('')

const luminance = (c: Rgb) => {
  const [r, g, b] = c.map(v => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Black or white, whichever contrasts more with the background (WCAG ratio)
export function textOn(bg: Rgb) {
  const l = luminance(bg)
  return (l + 0.05) / 0.05 >= 1.05 / (l + 0.05) ? '#000000' : '#ffffff'
}

const rgbOf = (h: string): Rgb => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)) as Rgb

// One run of cells per background, the percentage centred over the bar
export function meterRuns(pct: number, width = METER_WIDTH) {
  const label = `${Math.round(pct)}%`
  const start = Math.floor((width - label.length) / 2)
  const cells = Array.from({ length: width }, (_, i) => label[i - start] ?? ' ')
  const filled = Math.min(width, Math.round((Math.min(pct, 100) / 100) * width))
  const fill = hex(meterColor(pct))
  const runs: { text: string; bg: string; fg: string }[] = []
  cells.forEach((ch, i) => {
    const bg = i < filled ? fill : TRACK
    const last = runs[runs.length - 1]
    if (last && last.bg === bg) last.text += ch
    else runs.push({ text: ch, bg, fg: textOn(rgbOf(bg)) })
  })
  return runs
}

export function sparkline(values: number[]) {
  const max = Math.max(...values, 1)
  return values.map(v => BARS[Math.min(BARS.length - 1, Math.floor((v / max) * (BARS.length - 1)))]).join('')
}

export function compact(n: number) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k'
  return String(n)
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Local reset time: "15:30" for the session window, "Thu 15:30" for the week
export function resetAt(resetsAt: string, withDay: boolean) {
  const d = new Date(resetsAt)
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return withDay ? `${DAYS[d.getDay()]} ${time}` : time
}

export const register: Register = on => {
  // Subagent tokens spent since the last main-loop turn ended
  let pending = 0

  on('turn.complete', async ($, e, next) => {
    pending += tokensOf(e.usage)
    if (!e.agentId) {
      const spent = pending
      pending = 0
      await update($, turns, list => [...list, spent].slice(-HISTORY))
    }
    return next(e)
  })

  on('session.measure', ($, e, next) => {
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)

    const history = await read($, turns)
    const { rateLimits } = await $.session.usage()
    const find = (kind: string): SessionRateLimit | undefined => rateLimits.find(r => r.kind === kind)
    const meters = [
      { label: 'session', limit: find('five_hour'), withDay: false },
      { label: 'weekly', limit: find('seven_day'), withDay: true },
    ].filter(m => m.limit)

    if (meters.length === 0 && history.length === 0) return next(e)

    const { Box, Text } = $.ui.resolve(e)
    const lastTurn = history[history.length - 1]

    return (
      <Box flexDirection="row">
        <Text color="claude">◔ </Text>
        {meters.map(({ label, limit, withDay }) => (
          <Box key={label} flexDirection="row">
            <Text dimColor>{label} </Text>
            {meterRuns(limit!.percentUsed).map((r, i) => (
              <Text key={String(i)} backgroundColor={r.bg} color={r.fg} bold>
                {r.text}
              </Text>
            ))}
            {limit!.resetsAt ? <Text dimColor> ↻ {resetAt(limit!.resetsAt, withDay)}</Text> : null}
            <Text>{'  '}</Text>
          </Box>
        ))}
        {history.length > 0 ? (
          <Text>
            <Text color="suggestion">{sparkline(history)}</Text>
            <Text dimColor>{'  '}▲ +{compact(lastTurn)} last turn</Text>
          </Text>
        ) : null}
      </Box>
    )
  })
}
