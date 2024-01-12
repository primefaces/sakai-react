import Action from '../../models'

export async function GET(request, { params }) {
  return await Action.read('nhan_vien', 'ma_nhan_vien', params.id)
}

export async function PATCH(request, { params }) {
  const res = await request.json()
  return await Action.update('nhan_vien', res, 'ma_nhan_vien', params.id)
}

export async function DELETE(request, { params }) {
  return await Action.delete('nhan_vien', 'ma_nhan_vien', params.id)
}
