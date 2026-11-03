import { ImageResponse } from 'next/og'

export const alt = 'Morrow — Considered secondhand fashion'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#e8e0d5',
          color: '#171715',
          padding: '64px 76px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: 44,
              letterSpacing: '-0.05em',
            }}
          >
            <span>Morrow</span>
            <span style={{ color: '#9a7656' }}>.</span>
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#796b5d',
              fontFamily: 'sans-serif',
            }}
          >
            Curated Second Life · Lagos &amp; Beyond
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 920,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontSize: 96,
              lineHeight: 0.95,
              letterSpacing: '-0.05em',
            }}
          >
            <span>Style that speaks</span>
            <span style={{ color: '#9a7656' }}>.</span>
          </div>
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
              fontStyle: 'italic',
              color: '#5a5046',
              marginTop: 8,
            }}
          >
            Prices that make sense.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(23, 23, 21, 0.16)',
            paddingTop: 28,
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#171715',
            }}
          >
            Considered secondhand fashion
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#171715',
              color: '#f8f7f3',
              padding: '14px 28px',
              fontSize: 15,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Shop the Edit
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
