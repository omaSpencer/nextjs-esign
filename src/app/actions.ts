'use server'

import { cookies } from 'next/headers'

import { lucia } from '@/lib/auth'
import { getErrorMessage } from '@/lib/utils'

export const storeTokens = async (data: {
  access_token: string
  refresh_token: string
  expires_in: number
}) => {
  const cookieStore = await cookies()

  cookieStore.set('access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: data.expires_in, //? 28800s = 8h
    path: '/',
  })

  cookieStore.set('refresh_token', data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60, //? 30 nap
    path: '/',
  })
}

export const signOut = async () => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null
  if (!sessionId) {
    return {
      data: null,
      error: 'No session found',
    }
  }

  try {
    await lucia.invalidateSession(sessionId)
    const sessionCookie = lucia.createBlankSessionCookie()
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    console.error('Error during sign out:', error)
    return {
      data: null,
      error: getErrorMessage(error),
    }
  }
}
