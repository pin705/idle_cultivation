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
  | 'TECH_UNLOCK'
  | 'TECH_EQUIP'
  | 'SNAPSHOT_SAVE'
  | 'SNAPSHOT_LIST'
  | 'SNAPSHOT_ROLLBACK'
  | 'EQUIP_ITEM'
  | 'UNEQUIP_ITEM'
  | 'SHOP_LIST'
  | 'SHOP_BUY'
  | 'SHOP_SELL'
  | 'ITEM_REROLL'
  | 'TRIB_PREPARE'
  | 'TRIB_START'
  | 'TRIB_RESOLVE'
  | 'REALM_PATH_INFO'
  | 'SECT_CREATE'
  | 'SECT_JOIN'
  | 'SECT_LEAVE'
  | 'SECT_DONATE'
  | 'MISSION_LIST'
  | 'MISSION_ASSIGN'
  | 'MISSION_CLAIM'

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

      // Add logs from server response (do not persist on server)
      if (res?.log) player.addLog(res.log)
      if (Array.isArray(res?.logs)) (res.logs as string[]).forEach((l) => player.addLog(l))
      if (res?.message && !res?.log && !res?.logs) player.addLog(res.message)

      return res
    } catch (e: any) {
      const msg = e?.data?.message || e?.message || 'Có lỗi xảy ra'
      player.addLog(`Lỗi: ${msg}`)
      return { success: false, message: msg }
    }
  }

  return { call }
}
