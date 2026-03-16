'use client';
import { useState } from 'react';
import { C, CATEGORIES } from '../lib/constants';

const API_URL = 'https://jalan-dulu-api-production.up.railway.app';

const FIELD = (override = {}) => ({
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: `1.5px solid ${C.border}`, fontFamily: 'Jura', fontSize: 14,
  color: C.text, background: '#fff', outline: 'none', boxSizing: 'border-box',
  ...override,
});

const LABEL = {
  fontFamily: 'Jura', fontSize: 11, fontWeight: 700,
  color: C.textMid, display: 'block', marginBottom: 5,
  textTransform: 'uppercase', letterSpacing: .8,
};

export default function CreateEventForm({ token, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: '', category: '🏸 Badminton', description: '',
    date: '', time: '', location: '', price: '',
    female_slots: '', male_slots: '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  const total = (Number(form.female_slots) || 0) + (Number(form.male_slots) || 0);

  const canSubmit =
    form.title.trim() &&
    form.date &&
    Number(form.female_slots) > 0 &&
    Number(form.male_slots) > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title:        form.title.trim(),
          category:     form.category,
          description:  form.description.trim(),
          date:         form.date,
          time:         form.time.trim(),
          location:     form.location.trim(),
          price:        form.price ? Number(form.price) : null,
          female_slots: Number(form.female_slots),
          male_slots:   Number(form.male_slots),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create event.');
      } else {
        onSuccess(data);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    /* Overlay */
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Modal */}
      <div style={{
        background: C.bgPage, borderRadius: 20, width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, background: C.bgPage, zIndex: 1,
          borderRadius: '20px 20px 0 0',
        }}>
          <div>
            <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 20, color: C.text }}>
              Create Event
            </div>
            <div style={{ fontFamily: 'Jura', fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              Fill in the details. Gender quotas are required.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, color: C.textMuted, lineHeight: 1, padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Title */}
          <div>
            <label style={LABEL}>Event Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Sunday Badminton Doubles"
              required
              style={FIELD()}
              onFocus={e => e.target.style.borderColor = C.greenSage}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* Category */}
          <div>
            <label style={LABEL}>Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              style={FIELD({ cursor: 'pointer' })}
            >
              {CATEGORIES.slice(1).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={LABEL}>Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="What can participants expect?"
              rows={3}
              style={FIELD({ resize: 'vertical', minHeight: 80 })}
              onFocus={e => e.target.style.borderColor = C.greenSage}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* Date + Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={LABEL}>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                required
                style={FIELD({ cursor: 'pointer' })}
                onFocus={e => e.target.style.borderColor = C.greenSage}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
            <div>
              <label style={LABEL}>Time</label>
              <input
                type="text"
                value={form.time}
                onChange={e => set('time', e.target.value)}
                placeholder="08:00–11:00 WIB"
                style={FIELD()}
                onFocus={e => e.target.style.borderColor = C.greenSage}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label style={LABEL}>Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => set('location', e.target.value)}
              placeholder="e.g. GOR Senayan, Jakarta Pusat"
              style={FIELD()}
              onFocus={e => e.target.style.borderColor = C.greenSage}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* Price */}
          <div>
            <label style={LABEL}>Ticket Price (Rp)</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder="0 for free"
              style={FIELD()}
              onFocus={e => e.target.style.borderColor = C.greenSage}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>

          {/* Gender slots */}
          <div style={{
            background: C.bgCard, border: `1.5px solid ${C.border}`,
            borderRadius: 14, padding: 16,
          }}>
            <div style={{
              fontFamily: 'Jura', fontWeight: 700, fontSize: 12,
              color: C.textMuted, textTransform: 'uppercase', letterSpacing: .8, marginBottom: 14,
            }}>
              Gender Quota *
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ ...LABEL, color: C.female }}>♀ Female Slots</label>
                <input
                  type="number"
                  min="1"
                  value={form.female_slots}
                  onChange={e => set('female_slots', e.target.value)}
                  placeholder="e.g. 8"
                  required
                  style={FIELD({ borderColor: form.female_slots ? C.female + '88' : C.border })}
                  onFocus={e => e.target.style.borderColor = C.female}
                  onBlur={e => e.target.style.borderColor = form.female_slots ? C.female + '88' : C.border}
                />
              </div>
              <div>
                <label style={{ ...LABEL, color: C.male }}>♂ Male Slots</label>
                <input
                  type="number"
                  min="1"
                  value={form.male_slots}
                  onChange={e => set('male_slots', e.target.value)}
                  placeholder="e.g. 8"
                  required
                  style={FIELD({ borderColor: form.male_slots ? C.male + '88' : C.border })}
                  onFocus={e => e.target.style.borderColor = C.male}
                  onBlur={e => e.target.style.borderColor = form.male_slots ? C.male + '88' : C.border}
                />
              </div>
            </div>

            {total > 0 && (
              <div style={{
                background: C.greenMint, borderRadius: 8, padding: '8px 12px',
                fontFamily: 'Jura', fontSize: 12, color: C.greenSage,
                display: 'flex', justifyContent: 'space-between',
              }}>
                <span>
                  <span style={{ color: C.female }}>♀ {form.female_slots || 0}</span>
                  {' + '}
                  <span style={{ color: C.male }}>♂ {form.male_slots || 0}</span>
                  {' = '}
                  <strong>{total} total slots</strong>
                </span>
                <span style={{ color: C.textMuted, fontStyle: 'italic' }}>hidden from public</span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: C.female + '14', border: `1px solid ${C.female}44`,
              borderRadius: 8, padding: '10px 14px',
              fontFamily: 'Jura', fontSize: 13, color: C.female,
            }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: 10, border: `1.5px solid ${C.border}`,
                fontFamily: 'Jura', fontWeight: 600, fontSize: 13,
                background: 'transparent', color: C.textMuted, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{
                flex: 2, padding: '12px', borderRadius: 10, border: 'none',
                fontFamily: 'Jura', fontWeight: 700, fontSize: 13,
                background: canSubmit ? C.greenDark : C.greenPale,
                color:      canSubmit ? '#fff' : C.textMuted,
                cursor:     canSubmit && !loading ? 'pointer' : 'not-allowed',
                transition: 'all .2s',
              }}
            >
              {loading ? 'Creating…' : '+ Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
