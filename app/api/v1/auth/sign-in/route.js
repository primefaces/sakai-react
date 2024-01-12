import createServer from 'utils/supabase/auth/route'

export async function POST(request) {
  const supabase = createServer()

  const res = await request.json()

  const { data, error } = await supabase.auth.signInWithPassword(res)

  if (error) return Response.json(error, { status: error.status || 400 })

  return Response.json(data)
}
