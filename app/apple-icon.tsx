import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          background: '#171715',
          color: '#f8f7f3',
          borderRadius: 36,
          fontFamily: 'Georgia, serif',
          fontSize: 118,
          fontWeight: 600,
          paddingTop: 14,
        }}
      >
        <span>M</span>
        <span style={{ color: '#9a7656' }}>.</span>
      </div>
    ),
    {
      ...size,
    }
  )
}
