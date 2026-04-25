import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface JwtPayload {
  sub: string
  userId: string
  email: string
  name: string
  role: string
}

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password: string) => {
  return password.length >= 6
}

export const signToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      sub: decoded.userId,
      ...decoded
    }
  } catch (error) {
    return null
  }
}

export const extractTokenFromHeader = (header?: string) => {
  if (!header || !header.startsWith('Bearer ')) {
    return null
  }
  return header.split(' ')[1]
}

export const extractTokenFromCookie = (cookieHeader?: string, cookieName: string = 'token') => {
  if (!cookieHeader) {
    return null
  }
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=')
    acc[name] = value
    return acc
  }, {} as Record<string, string>)
  return cookies[cookieName] || null
}
