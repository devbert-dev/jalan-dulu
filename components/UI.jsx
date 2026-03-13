'use client';
import { C } from '../lib/constants';

// ─── Tag chip ─────────────────────────────────────────────────────────────────
export function Tag({ label, color = C.greenSage }) {
  return (
    <span style={{
      background: color + '18', color,
      fontSize: 11, fontWeight: 600,
      padding: '2px 9px', borderRadius: 20,
      fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

// ─── Public slot bar (no gender info) ────────────────────────────────────────
export function PublicSlotBar({ filled, total }) {
  const pct   = Math.round((filled / total) * 100);
  const left  = total - filled;
  const almostFull = left <= 3;

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'Outfit', fontSize: 12, marginBottom: 4,
      }}>
        <span style={{ color: C.textMuted }}>
          {left <= 0 ? 'Fully booked' : `${left} spot${left !== 1 ? 's' : ''} left`}
        </span>
        <span style={{ color: almostFull ? C.yellowDeep : C.textMuted }}>
          {pct}% full
        </span>
      </div>
      <div style={{ height: 6, background: C.greenPale, borderRadius: 99 }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 99,
          background: almostFull ? C.yellowWarm : C.greenSage,
          transition: 'width .4s',
        }} />
      </div>
    </div>
  );
}

// ─── Host-only gender breakdown ───────────────────────────────────────────────
export function HostGenderBar({ female, male }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1.5px dashed ${C.border}`,
      borderRadius: 10, padding: '12px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{
          fontSize: 11, background: C.yellowPale, color: C.yellowDeep,
          fontFamily: 'Outfit', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
        }}>
          🔒 Host View Only
        </span>
        <span style={{ fontSize: 11, color: C.textMuted, fontFamily: 'Outfit' }}>
          Gender quota breakdown
        </span>
      </div>

      {[['♀ Female', female, C.female], ['♂ Male', male, C.male]].map(([label, q, color]) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontFamily: 'Outfit', fontSize: 12, marginBottom: 3,
          }}>
            <span style={{ color, fontWeight: 600 }}>{label}</span>
            <span style={{ color: C.textMuted }}>
              {q.filled} / {q.max} ({Math.round(q.filled / q.max * 100)}%)
            </span>
          </div>
          <div style={{ height: 7, background: color + '22', borderRadius: 99 }}>
            <div style={{
              width: `${Math.round(q.filled / q.max * 100)}%`,
              height: '100%', background: color, borderRadius: 99,
              transition: 'width .5s',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
