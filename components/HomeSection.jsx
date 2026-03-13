'use client';
import { useState, useEffect } from 'react';
import { C, CATEGORIES } from '../lib/constants';
import { PublicSlotBar } from './UI';

const API_URL = 'https://jalan-dulu-api-production.up.railway.app';

export default function HomeSection({ setPage }) {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then(r => r.json())
      .then(data => setEvents(data))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>

      {/* ── Hero + Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

        {/* Hero card */}
        <div style={{
          background: C.greenDark, borderRadius: 20, padding: '36px 32px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: C.yellowWarm + '22' }} />
          <div style={{ position: 'absolute', bottom: -60, left: 20, width: 120, height: 120, borderRadius: '50%', background: C.greenSage + '33' }} />

          <div style={{ fontFamily: 'Outfit', fontSize: 12, fontWeight: 700, color: C.greenLight, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
            Jakarta's New Way to
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 38, color: '#fff', lineHeight: 1.15, marginBottom: 14, position: 'relative' }}>
            Find your<br />
            <span style={{ color: C.yellowMid }}>tribe</span> &amp;<br />
            <span style={{ color: C.greenLight }}>move</span> together.
          </div>
          <div style={{ fontFamily: 'Outfit', fontSize: 14, color: C.greenLight, marginBottom: 24, lineHeight: 1.7, position: 'relative' }}>
            Events with smart gender quotas, zero commission, and a community that shows up.
          </div>
          <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
            <button
              onClick={() => setPage('discover')}
              style={{ padding: '11px 24px', borderRadius: 10, background: C.yellowPale, color: C.greenDark, fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
            >
              Explore Events
            </button>
            <button style={{ padding: '11px 24px', borderRadius: 10, background: 'transparent', color: '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, border: '2px solid rgba(255,255,255,.3)', cursor: 'pointer' }}>
              + Host an Event
            </button>
          </div>
        </div>

        {/* Right column: stats + explainer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[['500+', 'Events Live', C.yellowDeep], ['12K+', 'Members', C.greenSage], ['0%', 'Commission', C.greenSage]].map(([n, l, col]) => (
              <div key={l} style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 24, color: col }}>{n}</div>
                <div style={{ fontFamily: 'Outfit', fontSize: 11, color: C.textMuted, marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Gender quota explainer */}
          <div style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 20, flex: 1 }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 17, color: C.text, marginBottom: 6 }}>
              ⚧ Our Signature Feature
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.7 }}>
              Hosts set separate ♀/♂ slot limits. The public only sees total spots — the gender breakdown is{' '}
              <strong style={{ color: C.text }}>private to the host</strong>.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 8, alignItems: 'center' }}>
              {[['♀ 8 slots', C.female], null, ['♂ 12 slots', C.male], null, ['= 20 total', C.greenSage]].map((item, i) =>
                item === null
                  ? <span key={i} style={{ textAlign: 'center', fontFamily: 'Playfair Display', fontWeight: 800, color: C.textMuted, fontSize: 18 }}>+</span>
                  : <div key={i} style={{ padding: '10px 8px', background: item[1] + '14', borderRadius: 10, textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 15, color: item[1] }}>{item[0]}</div>
                    </div>
              )}
            </div>
            <div style={{ marginTop: 12, fontFamily: 'Outfit', fontSize: 11, color: C.textMuted, fontStyle: 'italic' }}>
              Public sees only: "8 spots left" — not the gender split.
            </div>
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 20, color: C.text, marginBottom: 16 }}>
        Browse by Category
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {CATEGORIES.slice(1).map(c => (
          <button
            key={c}
            onClick={() => setPage('discover')}
            style={{ padding: '8px 16px', borderRadius: 99, fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', background: C.bgCard, color: C.textMid, border: `1.5px solid ${C.border}`, transition: 'all .18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.greenMint; e.currentTarget.style.borderColor = C.greenSage; e.currentTarget.style.color = C.greenSage; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bgCard; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMid; }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Featured events ── */}
      <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 20, color: C.text, marginBottom: 16 }}>
        Featured This Weekend
      </div>
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontFamily: 'Outfit' }}>
          Loading events…
        </div>
      ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {events.slice(0, 3).map(e => (
          <div
            key={e.id}
            onClick={() => setPage('discover')}
            style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 18, cursor: 'pointer', transition: 'all .2s' }}
            onMouseEnter={x => { x.currentTarget.style.borderColor = C.greenSage; x.currentTarget.style.boxShadow = `0 4px 16px ${C.greenSage}22`; }}
            onMouseLeave={x => { x.currentTarget.style.borderColor = C.border; x.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{e.category.split(' ')[0]}</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 6, lineHeight: 1.3 }}>
              {e.title}
            </div>
            <div style={{ fontFamily: 'Outfit', fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
              📅 {e.date} · 📍 {e.location.split(',')[0]}
            </div>
            <PublicSlotBar filled={e.totalFilled} total={e.totalSlots} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 16, color: C.yellowDeep }}>
                Rp {e.price.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
