'use client';
import { useState } from 'react';
import { C } from '../lib/constants';
import { Tag, PublicSlotBar, HostGenderBar } from './UI';

export default function DetailPanel({ event, isHost }) {
  const [booked, setBooked] = useState(false);
  const [gender, setGender] = useState(null);

  // Reset state when event changes
  // (in production you'd use useEffect([event?.id]))

  if (!event) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: C.textMuted, gap: 12,
      }}>
        <span style={{ fontSize: 48, opacity: .3 }}>✦</span>
        <span style={{ fontFamily: 'Jura', fontSize: 14 }}>
          Select an event to see details
        </span>
      </div>
    );
  }

  const spotsLeft = event.totalSlots - event.totalFilled;

  return (
    <div style={{
      padding: '28px', height: '100%', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{ fontSize: 40 }}>{event.category.split(' ')[0]}</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: 'Jura', fontSize: 12, color: C.yellowDeep, fontWeight: 600 }}>
              ★ {event.rating} ({event.reviews})
            </span>
            {event.hostVerified && (
              <span style={{
                fontSize: 11, background: C.greenMint, color: C.greenSage,
                padding: '2px 8px', borderRadius: 20,
                fontFamily: 'Jura', fontWeight: 700,
              }}>
                ✓ Verified Host
              </span>
            )}
          </div>
        </div>

        <div style={{
          fontFamily: 'Jura, sans-serif', fontWeight: 800,
          fontSize: 22, color: C.text, lineHeight: 1.25, marginBottom: 6,
        }}>
          {event.title}
        </div>

        <div style={{ fontFamily: 'Jura', fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>
          📅 {event.date} &nbsp;·&nbsp; 🕐 {event.time}<br />
          📍 {event.location}<br />
          👤 Hosted by <strong style={{ color: C.text }}>{event.host}</strong>
        </div>
      </div>

      {/* Description */}
      <div style={{
        fontFamily: 'Jura', fontSize: 14, color: C.textMid,
        lineHeight: 1.7, padding: '16px', background: C.greenMint, borderRadius: 12,
      }}>
        {event.desc}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {event.tags.map(t => <Tag key={t} label={t} color={C.greenSage} />)}
      </div>

      {/* Availability */}
      <div style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        <div style={{
          fontFamily: 'Jura', fontWeight: 700, fontSize: 12,
          color: C.textMuted, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 10,
        }}>
          Availability
        </div>
        <PublicSlotBar filled={event.totalFilled} total={event.totalSlots} />
        <div style={{ fontFamily: 'Jura', fontSize: 12, color: C.textMuted, marginTop: 8, fontStyle: 'italic' }}>
          Total capacity: {event.totalSlots} participants
        </div>
      </div>

      {/* Host view: gender breakdown */}
      {isHost && <HostGenderBar female={event.gender.female} male={event.gender.male} />}

      {/* Participant view: privacy notice */}
      {!isHost && (
        <div style={{
          background: C.yellowPale, border: `1px solid ${C.yellowMid}44`,
          borderRadius: 10, padding: '10px 14px',
          fontFamily: 'Jura', fontSize: 12, color: C.yellowDeep, lineHeight: 1.6,
        }}>
          ℹ️ The host has set gender quotas to ensure a balanced experience. You'll declare your gender when booking.
        </div>
      )}

      {/* Booking / Manage */}
      {!booked ? (
        <div style={{ background: C.bgCard, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
          <div style={{
            fontFamily: 'Jura', fontWeight: 700, fontSize: 12,
            color: C.textMuted, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 12,
          }}>
            {isHost ? 'Manage Event' : 'Book Your Spot'}
          </div>

          {!isHost && (
            <>
              <div style={{ fontFamily: 'Jura', fontSize: 13, color: C.textMid, marginBottom: 8 }}>
                Register as:
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[['♀ Female', 'female'], ['♂ Male', 'male'], ['Prefer not to say', 'other']].map(([label, val]) => (
                  <button
                    key={val}
                    onClick={() => setGender(val)}
                    style={{
                      flex: 1, padding: '9px 4px', borderRadius: 10,
                      fontFamily: 'Jura', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                      border:      `2px solid ${gender === val ? C.greenSage : C.border}`,
                      background:  gender === val ? C.greenMint : 'transparent',
                      color:       gender === val ? C.greenSage : C.textMuted,
                      transition: 'all .18s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14,
          }}>
            <span style={{ fontFamily: 'Jura', color: C.textMuted, fontSize: 13 }}>Ticket price</span>
            <span style={{ fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 22, color: C.yellowDeep }}>
              Rp {event.price.toLocaleString('id-ID')}
            </span>
          </div>

          {isHost ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                flex: 1, padding: '12px', borderRadius: 10,
                fontFamily: 'Jura', fontWeight: 700, fontSize: 13,
                background: C.greenDark, color: '#fff', border: 'none', cursor: 'pointer',
              }}>
                📊 View Full Dashboard
              </button>
              <button style={{
                flex: 1, padding: '12px', borderRadius: 10,
                fontFamily: 'Jura', fontWeight: 700, fontSize: 13,
                background: 'transparent', color: C.greenSage,
                border: `2px solid ${C.greenSage}`, cursor: 'pointer',
              }}>
                ✏️ Edit Event
              </button>
            </div>
          ) : (
            <button
              onClick={() => { if (gender) setBooked(true); }}
              style={{
                width: '100%', padding: '13px', borderRadius: 10,
                fontFamily: 'Jura', fontWeight: 700, fontSize: 14,
                background: gender ? C.greenDark : C.greenPale,
                color:      gender ? '#fff' : C.textMuted,
                border: 'none', cursor: gender ? 'pointer' : 'not-allowed',
                transition: 'all .2s',
              }}
            >
              {gender
                ? `Reserve Spot as ${gender === 'female' ? '♀ Female' : gender === 'male' ? '♂ Male' : '—'} →`
                : 'Select gender to continue'}
            </button>
          )}
        </div>
      ) : (
        <div style={{
          background: C.greenMint, border: `2px solid ${C.greenSage}`,
          borderRadius: 14, padding: 20, textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
          <div style={{
            fontFamily: 'Jura, sans-serif', fontWeight: 800,
            fontSize: 18, color: C.greenDark, marginBottom: 6,
          }}>
            You&apos;re In!
          </div>
          <div style={{ fontFamily: 'Jura', fontSize: 13, color: C.greenSage }}>
            E-ticket sent to your email. Check your event chat room to connect with fellow participants.
          </div>
          <button
            onClick={() => { setBooked(false); setGender(null); }}
            style={{
              marginTop: 12, padding: '8px 20px', borderRadius: 8,
              fontFamily: 'Jura', fontWeight: 600, fontSize: 12,
              background: C.greenSage, color: '#fff', border: 'none', cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
