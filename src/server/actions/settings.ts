'use server'

import { SettingSchema } from '@/types/settingsSchema'
import { eq } from 'drizzle-orm'
import { createSafeActionClient } from 'next-safe-action'
import { db } from '..'
import { auth } from '../auth'
import { users } from '../schema'
import bcrypt from 'bcrypt'
import { revalidatePath } from 'next/cache'

const action = createSafeActionClient()

export const settings = action
  .schema(SettingSchema)
  .action(async ({ parsedInput: values }) => {
    const user = await auth()
    if (!user) {
      return { error: 'User not found' }
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    })
    if (!dbUser) {
      return { error: 'User not found' }
    }

    if (user.user.isOAuth) {
      values.email = undefined
      values.password = undefined
      values.newPassword = undefined
      values.isTwoFactorEnabled = undefined
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      )
      if (!passwordMatch) {
        return { error: 'Password does not match' }
      }

      const samePassword = await bcrypt.compare(
        values.newPassword,
        dbUser.password
      )
      if (samePassword) {
        return { error: 'New password is same as the old password' }
      }

      const hashedPassword = await bcrypt.hash(values.newPassword, 10)
      values.password = hashedPassword
      values.newPassword = undefined
    }
    const updatedUser = await db
      .update(users)
      .set({
        name: values.name,
        email: values.email,
        password: values.password,
        image: values.image,
        twoFactorEnabled: values.isTwoFactorEnabled,
      })
      .where(eq(users.id, dbUser.id))

    revalidatePath('/dashboard/settings')
    return { success: 'Settings updated' }
  })
