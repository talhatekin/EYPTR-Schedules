import { assertAdmin } from '../utils/auth'

// Admin sayfası mount olduğunda localStorage'daki token'ın hâlâ geçerli
// olup olmadığını doğrular (süresi dolmuş/eski bir token'la "giriş yapılmış"
// görünüp tüm kayıtların sessizce 401 ile reddedilmesini önler).
export default defineEventHandler(async (event) => {
  await assertAdmin(event)
  return { valid: true }
})
