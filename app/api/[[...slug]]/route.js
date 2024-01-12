import { NextResponse } from 'next/server'

const handler = () => {
  return new NextResponse('API Not Found')
}
export { handler as GET, handler as POST }