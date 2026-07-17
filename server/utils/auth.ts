import type { H3Event } from 'h3'
import { getRequestHeader, createError } from 'h3'
import { redis } from './redis'

const TOKEN_PREFIX = 'admin:token:'
// 30 gün: oturumun makul süre açık kalması için.
export const ADMIN_TOKEN_TTL = 60 * 60 * 24 * 30

export const adminTokenKey = (token: string) => TOKEN_PREFIX + token

function extractToken(event: H3Event): string | null {
  const header = getRequestHeader(event, 'authorization') || ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() ?? null
}

// Yazma uçlarını korur: geçerli bir admin token'ı yoksa 401 atar.
export async function assertAdmin(event: H3Event): Promise<void> {
  const token = extractToken(event)
  if (!token || !(await redis.get(adminTokenKey(token)))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
