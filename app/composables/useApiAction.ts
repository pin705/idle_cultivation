import { usePlayerStore } from '../stores/player'

export type ActionType =
  | 'LOAD'
  | 'SAVE'
  | 'OFFLINE_CALC'
  | 'BREAKTHROUGH'
  | 'FIND_ITEM'
  | 'AUTH_LOGIN'
  | 'AUTH_REGISTER'
  | 'AUTH_LOGOUT'
  | 'CREATE_CHARACTER'

export function useApiAction() {
  const player = usePlayerStore()

  async function call(type: ActionType, payload?: any): Promise<any> {
    try {
      const res = await $fetch('/api/action', {
        method: 'POST',
        body: { type, payload }
      }) as any

      if (res?.player) {
        player.loadFromData(res.player)
      }

      if (res?.message) {
        // Server already pushes logs; client adds only for non-player responses
        if (!res.player) player.addLog(res.message)
      }

      return res
    } catch (e: any) {
      const msg = e?.data?.message || e?.message || 'Có lỗi xảy ra'
      player.addLog(`Lỗi: ${msg}`)
      return { success: false, message: msg }
    }
  }

  return { call }
}
