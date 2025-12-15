import { readFileSync } from 'fs'
import { ImageResponse } from 'next/og'
import { join } from 'path'

// Force Node.js runtime to allow fs access
export const runtime = 'nodejs'

export const alt = 'QuiRamèneQuoi - Organisez vos soirées'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Read the logo file from the public directory
  const logoPath = join(process.cwd(), 'public', 'logo.svg')
  const logoData = readFileSync(logoPath)
  const logoBase64 = logoData.toString('base64')
  const logoSrc = `data:image/svg+xml;base64,${logoBase64}`

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Logo Image */}
          <img 
            src={logoSrc} 
            alt="QuiRamèneQuoi Logo" 
            width="256" 
            height="256" 
            style={{ marginBottom: 40 }}
          />
          <div style={{ fontSize: 80, fontWeight: 900, color: '#0f172a' }}>QuiRamèneQuoi</div>
          <div style={{ fontSize: 32, marginTop: 20, color: '#64748b' }}>Organisez vos soirées simplement</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
