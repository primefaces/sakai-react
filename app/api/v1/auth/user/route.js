import supabase from 'utils/supabase/auth/admin'

export async function POST(request) {
  const res = await request.json()

  const { email, password, ...other } = res

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { ...other },
  })

  if (error) return Response.json(error, { status: error.status || 400 })

  return Response.json(data)
}
