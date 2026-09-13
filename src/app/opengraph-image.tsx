import { ImageResponse } from 'next/og';
import { getLocalizedProfile } from '@/data/localized';
import { englishSiteConfig, siteConfig } from '@/lib/site';

/**
 * The social preview card, shared by both locale trees.
 *
 * `ImageResponse` only ships a Latin font (Geist), so any Japanese glyph would render as tofu.
 * Rather than committing a subsetted CJK binary to the repository, the card is composed from
 * Latin-only copy that is true for both locales: the owner publishes under the romanized name
 * "Koshi Motegi", and the English affiliation and research interests already exist in the data.
 * The locale-specific part of the card lives in `og:image:alt`, which is plain metadata text and
 * therefore free of the font constraint (see `generatePageMetadata`).
 */

export const alt = `${englishSiteConfig.personName} — ${englishSiteConfig.currentAffiliation}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const profile = getLocalizedProfile('en');
  const interests = (profile.researchInterests ?? '')
    .split(/\sand\s|,/)
    .map(interest => interest.trim())
    .filter(Boolean)
    // The source string is one sentence, so every part after the first starts lowercase.
    .map(interest => interest.charAt(0).toUpperCase() + interest.slice(1));
  const [affiliation, ...affiliationRest] = englishSiteConfig.currentAffiliation.split(', ');
  const host = siteConfig.siteUrl ? new URL(siteConfig.siteUrl).host : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#0b1120',
          backgroundImage: 'radial-gradient(circle at 85% 15%, #1e3a8a 0%, transparent 55%)',
          color: '#f8fafc',
          fontSize: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 12, height: 48, backgroundColor: '#60a5fa', borderRadius: 6 }} />
          <div style={{ fontSize: 28, letterSpacing: 6, color: '#93c5fd' }}>PORTFOLIO</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 92, lineHeight: 1.1, letterSpacing: -2 }}>
            {englishSiteConfig.personName}
          </div>
          <div style={{ marginTop: 24, fontSize: 34, color: '#cbd5f5' }}>
            {profile.currentPosition}
          </div>
          <div style={{ marginTop: 8, fontSize: 30, color: '#94a3b8' }}>{affiliation}</div>
          <div style={{ fontSize: 30, color: '#94a3b8' }}>{affiliationRest.join(', ')}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {interests.map(interest => (
              <div
                key={interest}
                style={{
                  display: 'flex',
                  padding: '10px 24px',
                  borderRadius: 999,
                  border: '2px solid #334155',
                  color: '#e2e8f0',
                  fontSize: 26,
                }}
              >
                {interest}
              </div>
            ))}
          </div>
          {host ? <div style={{ fontSize: 26, color: '#64748b' }}>{host}</div> : null}
        </div>
      </div>
    ),
    size,
  );
}
