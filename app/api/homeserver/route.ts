import { auth } from '@/lib/auth'
import { getServerStatus } from '@/lib/ha-client'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const status = await getServerStatus()
    return NextResponse.json({ data: status })
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudo conectar al servidor' },
      { status: 503 }
    )
  }
}
