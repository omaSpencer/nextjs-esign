'use server'

import { cookies } from 'next/headers'

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
