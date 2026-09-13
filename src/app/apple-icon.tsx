import { ImageResponse } from 'next/og';

/**
 * The home-screen icon iOS asks for. It repeats the design of `icon.tsx` at Apple's 180px size
 * with a fully opaque background, because iOS composites the icon onto the home screen without
 * honouring transparency.
 */

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const alt = 'Koshi Motegi portfolio';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b1120',
          backgroundImage: 'linear-gradient(135deg, #1e3a8a 0%, #0b1120 70%)',
          color: '#f8fafc',
          fontSize: 76,
        }}
      >
        KM
      </div>
    ),
    size,
  );
}
