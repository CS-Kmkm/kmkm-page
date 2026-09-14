import { ImageResponse } from 'next/og';

/**
 * The installable app icons.
 *
 * They are generated from code rather than committed as PNG binaries: the initials are Latin,
 * so the font bundled with `ImageResponse` covers them, and a single source keeps the 192 and
 * 512 variants (plus `apple-icon.tsx`) from drifting apart. `favicon.ico` stays in place and
 * keeps being emitted first by Next's own favicon handling.
 */

export const contentType = 'image/png';

const ICON_SIZES = [192, 512] as const;

export function generateImageMetadata() {
  return ICON_SIZES.map(size => ({
    id: String(size),
    size: { width: size, height: size },
    contentType,
  }));
}

// Next passes the id of the requested variant as a promise, the same way it passes route params.
export default async function Icon({ id }: { id: Promise<string> }) {
  const requestedId = await id;
  const size = ICON_SIZES.find(candidate => String(candidate) === requestedId) ?? ICON_SIZES[0];

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
          fontSize: size * 0.4,
          letterSpacing: size * 0.01,
        }}
      >
        KM
      </div>
    ),
    { width: size, height: size },
  );
}
