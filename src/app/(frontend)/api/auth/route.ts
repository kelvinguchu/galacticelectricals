import { getMe } from '@/actions/auth'

export async function GET() {
  const user = await getMe()
  return Response.json({ user })
}
