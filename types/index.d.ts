export type TurnTokens = number[]

declare module 'claude-code' {
  interface PluginState {
    usage: { turns: TurnTokens }
  }
}
