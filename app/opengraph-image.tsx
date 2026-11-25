import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Youssef Elalfy — Full-Stack Developer, Creative Front-End Engineer, AI-Powered Applications Builder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const portrait = await readFile(join(process.cwd(), 'public/images/profile/youssef-elalfy-og.jpg'));
  const src = `data:image/jpeg;base64,${portrait.toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#040605', color: '#eef3ec', padding: 56, position: 'relative' }}>
        <div style={{ position: 'absolute', right: 40, top: 40, width: 560, height: 560, borderRadius: 999, background: 'radial-gradient(circle, rgba(200,255,61,0.28), rgba(31,122,85,0.08) 45%, rgba(4,6,5,0) 70%)', display: 'flex' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, letterSpacing: 4 }}>ELALFY<span style={{ color: '#c8ff3d' }}>.</span></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 0.9 }}>Youssef</div>
            <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 0.9, display: 'flex' }}>Elalfy<span style={{ color: '#c8ff3d' }}>.</span></div>
            <div style={{ marginTop: 28, fontSize: 26, color: '#a2ada4', display: 'flex', flexDirection: 'column' }}>
              <span>Full-Stack Developer</span>
              <span>Creative Front-End Engineer</span>
              <span>AI-Powered Applications Builder</span>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: '#c8ff3d' }}>Interfaces, intelligent products, and the systems behind them.</div>
        </div>
        <div style={{ display: 'flex', width: 420, height: 518, borderRadius: 32, overflow: 'hidden', border: '2px solid rgba(200,255,61,0.55)', boxShadow: '0 0 80px rgba(200,255,61,0.25)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={420} height={462} alt="" style={{ width: 420, height: 518, objectFit: 'cover', objectPosition: '50% 0%' }} />
        </div>
      </div>
    ),
    size,
  );
}
