import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#070d16',
          backgroundImage:
            'radial-gradient(860px 460px at 16% 16%, rgba(97, 184, 255, 0.35), rgba(97, 184, 255, 0) 62%), radial-gradient(860px 460px at 86% 18%, rgba(126, 241, 210, 0.22), rgba(126, 241, 210, 0) 58%), radial-gradient(860px 460px at 76% 86%, rgba(142, 167, 255, 0.20), rgba(142, 167, 255, 0) 62%)',
          padding: 64,
          color: '#eaf3ff',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
        }}
      >
        <div style={{ width: '100%', display: 'flex', gap: 44, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  backgroundImage: 'linear-gradient(135deg, #61b8ff, #7ef1d2, #8ea7ff)',
                  boxShadow: '0 0 0 8px rgba(97,184,255,0.10)',
                }}
              />
              <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>Care Axis</div>
            </div>

            <div style={{ fontSize: 54, fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.03em' }}>
              One platform.
              <br />
              Specialized packages for every practice model.
            </div>

            <div
              style={{
                marginTop: 6,
                fontSize: 18,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(220, 236, 255, 0.88)',
              }}
            >
              trycareaxis.com
            </div>
          </div>

          <div
            style={{
              width: 280,
              height: 280,
              borderRadius: 44,
              border: '1px solid rgba(255,255,255,0.14)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
            }}
          >
            <div
              style={{
                width: 196,
                height: 196,
                borderRadius: 999,
                border: '10px solid rgba(255,255,255,0.14)',
                backgroundImage: 'linear-gradient(135deg, rgba(97,184,255,0.25), rgba(126,241,210,0.20), rgba(142,167,255,0.20))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-0.02em' }}>CA</div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

