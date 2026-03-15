'use client';
import { C } from '../lib/constants';
import { PublicSlotBar } from './UI';

export default function EventCard({ event, selected, onClick }) {
  const spotsLeft  = event.totalSlots - event.totalFilled;
  const isSelected = selected?.id === event.id;

  return (
    <div
      onClick={onClick}
      style={{
        background:    isSelected ? C.greenDark : C.bgCard,
        border:        `2px solid ${isSelected ? C.greenSage : C.border}`,
        borderRadius:  14,
        padding:       18,
        cursor:        'pointer',
        transition:    'all .2s',
        boxShadow:     isSelected
          ? `0 8px 28px ${C.greenDark}33`
          : '0 1px 4px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = C.greenPale;
          e.currentTarget.style.boxShadow   = '0 4px 16px rgba(0,0,0,0.10)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = C.border;
          e.currentTarget.style.boxShadow   = '0 1px 4px rgba(0,0,0,0.06)';
        }
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 26 }}>{event.category.split(' ')[0]}</span>
        <span style={{
          fontFamily: 'Jura', fontWeight: 700, fontSize: 12,
          background: spotsLeft <= 3 ? C.yellowPale : C.greenMint,
          color:      spotsLeft <= 3 ? C.yellowDeep : C.greenSage,
          padding: '3px 10px', borderRadius: 20,
        }}>
          {spotsLeft <= 0 ? 'FULL' : `${spotsLeft} left`}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'Jura, sans-serif', fontWeight: 700,
        fontSize: 15, lineHeight: 1.3, marginBottom: 5,
        color: isSelected ? '#fff' : C.text,
      }}>
        {event.title}
      </div>

      {/* Meta */}
      <div style={{
        fontFamily: 'Jura', fontSize: 12, marginBottom: 10, lineHeight: 1.6,
        color: isSelected ? C.greenPale : C.textMuted,
      }}>
        📅 {event.date}<br />📍 {event.location}
      </div>

      {/* Slot bar */}
      <PublicSlotBar filled={event.totalFilled} total={event.totalSlots} />

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {event.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              background: isSelected ? 'rgba(255,255,255,0.12)' : C.greenMint,
              color:      isSelected ? C.greenPale : C.greenSage,
              fontSize: 10, fontFamily: 'Jura', fontWeight: 600,
              padding: '2px 8px', borderRadius: 10,
            }}>
              {t}
            </span>
          ))}
        </div>
        <span style={{
          fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 16,
          color: isSelected ? C.yellowMid : C.yellowDeep,
        }}>
          Rp {event.price.toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  );
}
