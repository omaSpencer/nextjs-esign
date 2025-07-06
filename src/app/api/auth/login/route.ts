import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from '@node-rs/argon2'

import { db } from '@/lib/db'
import { userSchema } from '@/lib/schema'
import { getErrorMessage } from '@/lib/utils'
import { lucia } from '@/lib/auth'

export const POST = async (request: Request) => {
  const { email, password } = await request.json()

  //? Validate the request body
  const validation = userSchema.safeParse({ email, password })

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 })
  }

  try {
    const cookieStore = await cookies()
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }

    const validPassword = await verify(existingUser.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })

    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }

    const session = await lucia.createSession(existingUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return NextResponse.json({ data: true }, { status: 200 })
  } catch (error) {
    console.error('Error during sign in:', error)
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
