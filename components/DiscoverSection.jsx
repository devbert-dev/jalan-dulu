'use client';
import { useState } from 'react';
import { C, CATEGORIES, EVENTS } from '../lib/constants';
import EventCard from './EventCard';
import DetailPanel from './DetailPanel';

export default function DiscoverSection({ isHost }) {
  const [selected, setSelected] = useState(EVENTS[0]);
  const [search,   setSearch]   = useState('');
  const [cat,      setCat]      = useState('All');

  const filtered = EVENTS.filter(e =>
    (cat === 'All' || e.category === cat) &&
    (!search || e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', height: '100%', overflow: 'hidden' }}>

      {/* ── Left: list ── */}
      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: `1.5px solid ${C.border}` }}>

        {/* Search + filter */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, background: C.bgPage }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search events, locations, hosts..."
            style={{
              width: '100%', padding: '10px 16px', borderRadius: 10,
              border: `1.5px solid ${C.border}`, fontFamily: 'Outfit', fontSize: 14,
              color: C.text, background: C.bgCard, outline: 'none', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                style={{
                  padding: '5px 14px', borderRadius: 99,
                  fontFamily: 'Outfit', fontWeight: 600, fontSize: 12,
                  whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all .18s',
                  background: cat === c ? C.greenDark : C.bgCard,
                  color:      cat === c ? '#fff' : C.textMuted,
                  border:     `1.5px solid ${cat === c ? C.greenDark : C.border}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{ overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontFamily: 'Outfit', fontSize: 12, color: C.textMuted, marginBottom: 4 }}>
            {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
          </div>

          {filtered.length ? filtered.map(e => (
            <EventCard
              key={e.id}
              event={e}
              selected={selected}
              onClick={() => setSelected(e)}
            />
          )) : (
            <div style={{ padding: 40, textAlign: 'center', color: C.textMuted, fontFamily: 'Outfit' }}>
              No events match your search 🌿<br />Try a different filter.
            </div>
          )}
        </div>
      </div>

      {/* ── Right: detail ── */}
      <div style={{ overflowY: 'auto', background: C.bgCard }}>
        <DetailPanel event={selected} isHost={isHost} />
      </div>
    </div>
  );
}
