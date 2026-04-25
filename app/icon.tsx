import { readFileSync } from 'fs'
import { ImageResponse } from 'next/og'
import { join } from 'path'
 
// Force Node.js runtime to allow fs access
export const runtime = 'nodejs'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Generate the image
export default function Icon() {
  const logoPath = join(process.cwd(), 'public', 'logo.svg')
  const logoData = readFileSync(logoPath)
  const logoBase64 = logoData.toString('base64')
  const logoSrc = `data:image/svg+xml;base64,${logoBase64}`

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20%', // Rounded corners for icon
        }}
      >
         <img
            src={logoSrc}
            alt="Icon"
            width={32}
            height={32}
          />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
