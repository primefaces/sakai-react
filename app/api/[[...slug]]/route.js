import { NextResponse } from 'next/server'

const handler = () => {
  return new NextResponse('Not Found')
}
export { handler as GET, handler as POST }
