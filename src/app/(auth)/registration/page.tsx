'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@/lib/schema/users'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

async function registerUser(values: z.infer<typeof userSchema>) {
  const res = await fetch('/api/v1/auth/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Registration failed')
  }
  return data
}

export default function RegistrationPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: { email: '', password: '' },
  })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      form.reset()
      router.push('/')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  function onSubmit(values: z.infer<typeof userSchema>) {
    mutate(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-2xl font-bold">Register</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(error || isError) && (
              <div className="text-destructive text-center text-sm">{error.message}</div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
