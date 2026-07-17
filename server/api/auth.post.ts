// server/api/auth.post.ts
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const realPassword = process.env.ADMIN_SECRET_PASSWORD || '123'
  
    if (body.password === realPassword) {
      // Şifre doğruysa sunucu sahte/kırılmaz bir jeton (token) üretip döner
      return { success: true, token: 'eyp_auth_' + Date.now() + '_secure_token' }
    } else {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
  })