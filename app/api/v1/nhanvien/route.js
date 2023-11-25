import action from '../models'

export async function GET() {
  return await action.read('nhan_vien')
}

export async function POST(request) {
  const res = await request.json()
  return await action.create('nhan_vien', res)
}
