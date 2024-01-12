import createServer from 'utils/supabase/auth/route'

export async function POST() {
  const supabase = createServer()
  const { error } = await supabase.auth.signOut()

  if (error) return Response.json(error, { status: 400 })
}
