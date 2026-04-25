import { H3Event } from 'h3'
import { verifyToken, extractTokenFromHeader, extractTokenFromCookie, JwtPayload } from '@invited/shared'

export async function getUserFromRequest(event: H3Event): Promise<JwtPayload | null> {
  const authHeader = getHeader(event, 'authorization')
  let token = extractTokenFromHeader(authHeader)

  if (!token) {
    const cookieHeader = getHeader(event, 'cookie')
    token = extractTokenFromCookie(cookieHeader, 'manager-token')
  }

  if (!token) {
    return null
  }

  return verifyToken(token)
}

export async function requireAuth(event: H3Event): Promise<JwtPayload> {
  const user = await getUserFromRequest(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Требуется авторизация'
    })
  }

  return user
}

export async function requireRole(event: H3Event, allowedRoles: string[]): Promise<JwtPayload> {
  const user = await requireAuth(event)

  if (!allowedRoles.includes(user.role)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Доступ запрещен. Недостаточно прав.'
    })
  }

  return user
}
