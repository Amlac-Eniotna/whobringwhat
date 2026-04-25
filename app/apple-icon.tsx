import { readFileSync } from 'fs'
import { ImageResponse } from 'next/og'
import { join } from 'path'
 
export const runtime = 'nodejs'
 
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'
 
export default function Icon() {
  const logoPath = join(process.cwd(), 'public', 'logo.svg')
  const logoData = readFileSync(logoPath)
  const logoBase64 = logoData.toString('base64')
  const logoSrc = `data:image/svg+xml;base64,${logoBase64}`

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Apple icons usually don't need rounded corners in the image itself as iOS does it, 
          // but a white background is good.
        }}
      >
         <img
            src={logoSrc}
            alt="Icon"
            width={128}
            height={128}
          />
      </div>
    ),
    {
      ...size,
    }
  )
}
