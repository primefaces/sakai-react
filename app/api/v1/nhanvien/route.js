import action from '../models'

export async function GET(request) {
  const queryParams = request.nextUrl.searchParams

  const offset = parseInt(queryParams.get('offset'), 10)
  const limit = parseInt(queryParams.get('limit'), 10)

  return await action.read('nhan_vien', null, null, { offset, limit })
}

export async function POST(request) {
  const res = await request.json()
  return await action.create('nhan_vien', res)
}
