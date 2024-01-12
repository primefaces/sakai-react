import supabase from 'utils/supabase/auth/admin'

export async function DELETE(request, { params }) {
  const { data, error } = await supabase.auth.admin.deleteUser(params.userId)

  if (error) return Response.json(error, { status: error.status || 400 })

  return Response.json(data)
}
