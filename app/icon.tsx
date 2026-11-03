import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: 6,
          fontFamily: 'Georgia, serif',
          fontSize: 22,
          fontWeight: 600,
          paddingTop: 2,
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
