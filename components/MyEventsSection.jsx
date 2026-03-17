'use client';
import { useState, useEffect } from 'react';
import { C } from '../lib/constants';

const API_URL = 'https://jalan-dulu-api-production.up.railway.app';

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: color + '14', borderRadius: 8, padding: '8px 14px', minWidth: 60,
    }}>
      <span style={{ fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 18, color }}>{value}</span>
      <span style={{ fontFamily: 'Jura', fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: .6 }}>{label}</span>
    </div>
  );
}

export default function MyEventsSection({ token, onCreateEvent }) {
  const [events,   setEvents]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [deleting, setDeleting] = useState(null); // event id being deleted

  async function handleDelete(id) {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to delete event.');
      } else {
        setEvents(prev => prev.filter(e => e.id !== id));
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  function load() {
    setLoading(true);
    fetch(`${API_URL}/events/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setEvents(data);
      })
      .catch(() => setError('Failed to load your events.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [token]);

  return (
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28,
      }}>
        <div>
          <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 22, color: C.text }}>
            My Events
          </div>
          <div style={{ fontFamily: 'Jura', fontSize: 13, color: C.textMuted, marginTop: 3 }}>
            Events you host. Gender quotas are visible only to you.
          </div>
        </div>
        <button
          onClick={onCreateEvent}
          style={{
            padding: '10px 22px', borderRadius: 10,
            background: C.greenDark, color: '#fff',
            fontFamily: 'Jura', fontWeight: 700, fontSize: 13,
            border: 'none', cursor: 'pointer',
            boxShadow: `0 4px 14px ${C.greenDark}44`,
          }}
        >
          + Create Event
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: C.female + '14', border: `1px solid ${C.female}44`,
          borderRadius: 8, padding: '12px 16px', marginBottom: 20,
          fontFamily: 'Jura', fontSize: 13, color: C.female,
        }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: 48, textAlign: 'center', color: C.textMuted, fontFamily: 'Jura' }}>
          Loading your events…
        </div>
      )}

      {/* Empty */}
      {!loading && !error && events.length === 0 && (
        <div style={{
          background: C.bgCard, border: `1.5px dashed ${C.border}`,
          borderRadius: 16, padding: '48px 32px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 8 }}>
            No events yet
          </div>
          <div style={{ fontFamily: 'Jura', fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
            Create your first event to start welcoming participants.
          </div>
          <button
            onClick={onCreateEvent}
            style={{
              padding: '10px 24px', borderRadius: 10,
              background: C.greenDark, color: '#fff',
              fontFamily: 'Jura', fontWeight: 700, fontSize: 13,
              border: 'none', cursor: 'pointer',
            }}
          >
            + Create Event
          </button>
        </div>
      )}

      {/* Event cards */}
      {!loading && events.map(e => {
        const gs         = e.gender_slots;
        const femaleFill = gs?.female_filled ?? 0;
        const maleFill   = gs?.male_filled   ?? 0;
        const femaleMax  = gs?.female_slots  ?? 0;
        const maleMax    = gs?.male_slots    ?? 0;
        const totalFill  = femaleFill + maleFill;
        const totalMax   = gs?.total_slots   ?? 0;
        const spotsLeft  = totalMax - totalFill;
        const fillPct    = totalMax > 0 ? Math.round((totalFill / totalMax) * 100) : 0;

        return (
          <div
            key={e.id}
            style={{
              background: C.bgCard, border: `1.5px solid ${C.border}`,
              borderRadius: 16, padding: '20px 24px', marginBottom: 16,
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 22 }}>{e.category?.split(' ')[0] ?? '🎯'}</span>
                  <span style={{
                    fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 17, color: C.text,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {e.title}
                  </span>
                </div>
                <div style={{ fontFamily: 'Jura', fontSize: 12, color: C.textMuted, lineHeight: 1.7 }}>
                  {e.date && `📅 ${e.date}`}
                  {e.time && ` · 🕐 ${e.time}`}
                  {e.location && <><br />📍 {e.location}</>}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginLeft: 16, flexShrink: 0 }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 20,
                  fontFamily: 'Jura', fontWeight: 700, fontSize: 11,
                  background: spotsLeft <= 0 ? C.female + '14' : C.greenMint,
                  color:      spotsLeft <= 0 ? C.female : C.greenSage,
                }}>
                  {spotsLeft <= 0 ? 'FULL' : `${spotsLeft} left`}
                </span>
                {e.price != null && (
                  <span style={{
                    fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 14, color: C.yellowDeep,
                    alignSelf: 'center',
                  }}>
                    Rp {e.price.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <StatPill label="Total"   value={totalMax}   color={C.greenSage} />
              <StatPill label="Filled"  value={totalFill}  color={C.greenMid}  />
              <StatPill label="♀ Slots" value={femaleMax}  color={C.female}    />
              <StatPill label="♀ Filled" value={femaleFill} color={C.female}   />
              <StatPill label="♂ Slots" value={maleMax}    color={C.male}      />
              <StatPill label="♂ Filled" value={maleFill}  color={C.male}      />
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  {/* Female bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'Jura', fontSize: 11, color: C.female }}>♀</span>
                    <div style={{ width: 80, height: 6, background: C.border, borderRadius: 99 }}>
                      <div style={{
                        width: `${femaleMax > 0 ? (femaleFill / femaleMax) * 100 : 0}%`,
                        height: '100%', borderRadius: 99, background: C.female, transition: 'width .4s',
                      }} />
                    </div>
                    <span style={{ fontFamily: 'Jura', fontSize: 11, color: C.female }}>
                      {femaleFill}/{femaleMax}
                    </span>
                  </div>
                  {/* Male bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: 'Jura', fontSize: 11, color: C.male }}>♂</span>
                    <div style={{ width: 80, height: 6, background: C.border, borderRadius: 99 }}>
                      <div style={{
                        width: `${maleMax > 0 ? (maleFill / maleMax) * 100 : 0}%`,
                        height: '100%', borderRadius: 99, background: C.male, transition: 'width .4s',
                      }} />
                    </div>
                    <span style={{ fontFamily: 'Jura', fontSize: 11, color: C.male }}>
                      {maleFill}/{maleMax}
                    </span>
                  </div>
                </div>
                <span style={{ fontFamily: 'Jura', fontSize: 11, color: C.textMuted }}>
                  {fillPct}% full
                </span>
              </div>
            </div>

            {/* Description */}
            {e.description && (
              <div style={{
                fontFamily: 'Jura', fontSize: 12, color: C.textMuted,
                lineHeight: 1.6, marginBottom: 14,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {e.description}
              </div>
            )}

            {/* Footer buttons */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 4, borderTop: `1px solid ${C.border}` }}>
              <button style={{
                padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${C.border}`,
                fontFamily: 'Jura', fontWeight: 600, fontSize: 12,
                background: 'transparent', color: C.textMid, cursor: 'pointer',
              }}>
                ✏️ Edit Event
              </button>
              <button style={{
                padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${C.border}`,
                fontFamily: 'Jura', fontWeight: 600, fontSize: 12,
                background: 'transparent', color: C.greenSage, cursor: 'pointer',
              }}>
                📊 View Bookings
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                disabled={deleting === e.id}
                style={{
                  marginLeft: 'auto',
                  padding: '8px 16px', borderRadius: 8,
                  border: `1.5px solid ${C.female}55`,
                  fontFamily: 'Jura', fontWeight: 600, fontSize: 12,
                  background: 'transparent', color: C.female,
                  cursor: deleting === e.id ? 'not-allowed' : 'pointer',
                  opacity: deleting === e.id ? 0.5 : 1,
                }}
              >
                {deleting === e.id ? 'Deleting…' : '🗑 Delete'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
