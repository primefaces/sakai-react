import Action from '../../models'

export async function GET(request, { params }) {
  return await Action.read('khach_hang', 'ma_khach_hang', params.id)
}

export async function PATCH(request, { params }) {
  const res = await request.json()
  return await Action.update('khach_hang', res, 'ma_khach_hang', params.id)
}

export async function DELETE(request, { params }) {
  return await Action.delete('khach_hang', 'ma_khach_hang', params.id)
}
