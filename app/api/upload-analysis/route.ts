import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const apiKey = process.env.LIGHTHOUSE_API_KEY || process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Lighthouse API key not configured on server' }, { status: 500 })
    }

    const fileName = `analysis-${body.className || 'unknown'}-${Date.now()}.json`

    // Use server-side FormData + Blob (Node 18+ provides these)
    const formData = new FormData()
    const blob = new Blob([JSON.stringify(body, null, 2)], { type: 'application/json' })
    // append(name, value, filename) supported in Web FormData
    formData.append('file', blob, fileName)

    const url = 'https://upload.lighthouse.storage/api/v0/add?wrap-with-directory=false&cid-version=1'
    const resp = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + apiKey,
      },
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json({ error: `Upload failed: ${resp.status} ${text}` }, { status: resp.status })
    }

    const data = await resp.json()
    return NextResponse.json({ cid: data?.Hash })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || String(e) }, { status: 500 })
  }
}
