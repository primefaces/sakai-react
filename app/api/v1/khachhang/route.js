import action from '../models'

export async function GET() {
  return await action.read('khach_hang')
}

export async function POST(request) {
  const res = await request.json()
  return await action.create('khach_hang', res)
}
