import action from '../../models'

export async function GET(request, { params }) {
  return await action.read('khach_hang', 'ma_khach_hang', params.id)
}

export async function PATCH(request, { params }) {
  const res = await request.json()
  return await action.update('khach_hang', res, 'ma_khach_hang', params.id)
}

export async function DELETE(request, { params }) {
  return await action.delete('khach_hang', 'ma_khach_hang', params.id)
}
