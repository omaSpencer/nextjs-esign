import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { generateId } from 'lucia'
import { cookies } from 'next/headers'
import { hash } from '@node-rs/argon2'

import { db } from '@/lib/db'
import { users, userSchema } from '@/lib/schema'
import { getErrorMessage } from '@/lib/utils'
import { lucia } from '@/lib/auth'

export const POST = async (request: Request) => {
  const { email, password } = await request.json()

  //? Validate the request body
  const validation = userSchema.safeParse({ email, password })

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.message }, { status: 400 })
  }

  //? Check if user already exists
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (user) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  try {
    const cookieStore = await cookies()
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    })
    const userId = generateId(15)

    await db.insert(users).values({
      id: userId,
      email,
      password: passwordHash,
    })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return NextResponse.json({ data: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 })
  }
}
