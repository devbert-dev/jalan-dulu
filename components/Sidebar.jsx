'use client';
import { C, NAV } from '../lib/constants';

const ROLE_BADGE = {
  admin: '⚙ Admin',
  host:  '🎯 Host',
  user:  '👤 Participant',
};

export default function Sidebar({ page, setPage, role, user }) {
  const visibleNav = NAV.filter(n => n.roles.includes(role));
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const initial = (displayName[0] || '?').toUpperCase();

  return (
    <div style={{
      background: C.greenDark,
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden', width: 220, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 22px 20px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
        <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 24, color: '#fff', lineHeight: 1 }}>
          Jalan
        </div>
        <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 24, color: C.yellowMid, lineHeight: 1 }}>
          Dulu
        </div>
        <div style={{ fontFamily: 'Jura', fontSize: 10, color: C.greenLight, marginTop: 5, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Activity Platform
        </div>
      </div>

      {/* Nav links — filtered by role */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {visibleNav.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 10,
              fontFamily: 'Jura', fontWeight: page === n.id ? 700 : 500, fontSize: 14,
              background: page === n.id ? C.greenMid : 'transparent',
              color:      page === n.id ? '#fff' : C.greenLight,
              border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all .18s',
            }}
            onMouseEnter={e => {
              if (page !== n.id) {
                e.currentTarget.style.background = 'rgba(255,255,255,.06)';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={e => {
              if (page !== n.id) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = C.greenLight;
              }
            }}
          >
            <span style={{ fontSize: 16, opacity: .8 }}>{n.icon}</span>
            {n.label}
            {page === n.id && (
              <span style={{
                marginLeft: 'auto', width: 5, height: 5,
                borderRadius: '50%', background: C.yellowMid,
              }} />
            )}
          </button>
        ))}
      </nav>

      {/* User card with real name + role badge */}
      <div style={{
        padding: '14px 14px 20px',
        borderTop: '1px solid rgba(255,255,255,.08)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: C.yellowPale,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Jura', fontWeight: 800, fontSize: 15,
          color: C.greenDark, flexShrink: 0,
        }}>
          {initial}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'Jura', fontWeight: 600, fontSize: 13, color: '#fff',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {displayName}
          </div>
          <div style={{ fontFamily: 'Jura', fontSize: 10, color: C.greenLight }}>
            {ROLE_BADGE[role] || '👤 Participant'}
          </div>
        </div>
      </div>
    </div>
  );
}
