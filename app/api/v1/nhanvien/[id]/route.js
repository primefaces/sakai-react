import action from '../../models'

export async function GET(request, { params }) {
  return await action.read('nhan_vien', 'ma_nhan_vien', params.id)
}

export async function PATCH(request, { params }) {
  const res = await request.json()
  return await action.update('nhan_vien', res, 'ma_nhan_vien', params.id)
}

export async function DELETE(request, { params }) {
  return await action.delete('nhan_vien', 'ma_nhan_vien', params.id)
}
