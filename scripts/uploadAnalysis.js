const fs = require('fs')
const path = require('path')
// Prefer global fetch (Node 18+). Fall back to node-fetch if available.
let fetchImpl = globalThis.fetch
try {
  if (!fetchImpl) fetchImpl = require('node-fetch')
} catch (e) {
  // node-fetch not installed; rely on global fetch
}

// Usage: node scripts/uploadAnalysis.js ./path/to/analysis.json
(async () => {
  try {
    const arg = process.argv[2]
    if (!arg) throw new Error('Provide path to analysis JSON')
    const filePath = path.resolve(arg)
    if (!fs.existsSync(filePath)) throw new Error('File not found: ' + filePath)

    const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || process.env.LIGHTHOUSE_API_KEY
    if (!apiKey) throw new Error('Set NEXT_PUBLIC_LIGHTHOUSE_API_KEY or LIGHTHOUSE_API_KEY in env')

    const url = 'https://upload.lighthouse.storage/api/v0/add?wrap-with-directory=false&cid-version=1'
    // Use form-data package if available, otherwise try the built-in FormData
    let FormDataImpl
    try {
      FormDataImpl = require('form-data')
    } catch (e) {
      FormDataImpl = globalThis.FormData
    }
    if (!FormDataImpl) throw new Error('FormData implementation not found. Install the `form-data` package or run on Node 18+ which provides global FormData.')
    const formData = new FormDataImpl()
    // form-data (npm) expects a stream; Node's global FormData accepts Blob or streams via fetch file helpers.
    if (typeof formData.append === 'function') {
      formData.append('file', fs.createReadStream(filePath))
    } else {
      throw new Error('Unexpected FormData implementation')
    }

    console.log('Uploading', filePath)
  const resp = await fetchImpl(url, { method: 'POST', body: formData, headers: { Authorization: 'Bearer ' + apiKey } })
    if (!resp.ok) {
      const body = await resp.text()
      throw new Error('Upload failed: ' + resp.status + ' ' + body)
    }
    const data = await resp.json()
    console.log('Upload successful, CID:', data.Hash)
  } catch (e) {
    console.error('Error:', e.message || e)
    process.exit(1)
  }
})()
