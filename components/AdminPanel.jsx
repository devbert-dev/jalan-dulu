'use client';
import { useState, useEffect } from 'react';
import { C } from '../lib/constants';

const API_URL = 'https://jalan-dulu-api-production.up.railway.app';

const ROLE_COLOR = {
  admin: C.greenDark,
  host:  C.greenSage,
  user:  C.textMuted,
};

export default function AdminPanel({ token }) {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(null); // user id currently being saved

  useEffect(() => {
    fetch(`${API_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setUsers(data);
      })
      .catch(() => setError('Failed to load users. Check your connection.'))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleRoleChange(userId, newRole) {
    setSaving(userId);
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: data.role } : u));
      } else {
        setError(data.error || 'Failed to update role.');
      }
    } catch {
      setError('Network error while updating role.');
    } finally {
      setSaving(null);
    }
  }

  async function handleDelete(userId, userName) {
    if (!confirm(`Permanently delete "${userName || 'this user'}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete user.');
      }
    } catch {
      setError('Network error while deleting user.');
    }
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        fontFamily: 'Jura, sans-serif', fontWeight: 800,
        fontSize: 22, color: C.text, marginBottom: 4,
      }}>
        User Management
      </div>
      <div style={{ fontFamily: 'Jura', fontSize: 13, color: C.textMuted, marginBottom: 8 }}>
        Change roles or remove users.
      </div>
      <div style={{
        fontFamily: 'Jura', fontSize: 11, color: C.yellowDeep,
        background: C.yellowPale, border: `1px solid ${C.yellowMid}44`,
        borderRadius: 8, padding: '8px 12px', marginBottom: 24, display: 'inline-block',
      }}>
        ⚠ Role changes take effect on the affected user&apos;s next login.
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: C.female + '14', border: `1px solid ${C.female}44`,
          borderRadius: 8, padding: '12px 16px', marginBottom: 20,
          fontFamily: 'Jura', fontSize: 13, color: C.female,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {error}
          <button
            onClick={() => setError('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.female, fontFamily: 'Jura', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: 48, textAlign: 'center', color: C.textMuted, fontFamily: 'Jura' }}>
          Loading users…
        </div>
      )}

      {/* Empty */}
      {!loading && !error && users.length === 0 && (
        <div style={{ padding: 48, textAlign: 'center', color: C.textMuted, fontFamily: 'Jura' }}>
          No users found.
        </div>
      )}

      {/* Column headers */}
      {!loading && users.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '38px 1fr 110px 110px 90px',
          gap: 12, padding: '0 18px 8px',
          fontFamily: 'Jura', fontSize: 11, fontWeight: 700,
          color: C.textMuted, textTransform: 'uppercase', letterSpacing: .8,
        }}>
          <div />
          <div>User</div>
          <div>Joined</div>
          <div>Role</div>
          <div />
        </div>
      )}

      {/* User rows */}
      {!loading && users.map(u => {
        const initial = (u.full_name || u.email || '?')[0].toUpperCase();
        const joined  = new Date(u.created_at).toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric',
        });

        return (
          <div
            key={u.id}
            style={{
              background: C.bgCard, border: `1.5px solid ${C.border}`,
              borderRadius: 12, padding: '14px 18px', marginBottom: 10,
              display: 'grid',
              gridTemplateColumns: '38px 1fr 110px 110px 90px',
              gap: 12, alignItems: 'center',
            }}
          >
            {/* Avatar */}
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: C.yellowPale,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Jura', fontWeight: 800, fontSize: 16, color: C.greenDark,
            }}>
              {initial}
            </div>

            {/* Name + email */}
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'Jura', fontWeight: 700, fontSize: 14, color: C.text,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {u.full_name || '—'}
              </div>
              <div style={{
                fontFamily: 'Jura', fontSize: 12, color: C.textMuted,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {u.email}
              </div>
            </div>

            {/* Join date */}
            <div style={{ fontFamily: 'Jura', fontSize: 12, color: C.textMuted }}>
              {joined}
            </div>

            {/* Role dropdown */}
            <select
              value={u.role}
              disabled={saving === u.id}
              onChange={e => handleRoleChange(u.id, e.target.value)}
              style={{
                padding: '7px 10px', borderRadius: 8,
                border: `1.5px solid ${C.border}`,
                fontFamily: 'Jura', fontWeight: 600, fontSize: 12,
                color: ROLE_COLOR[u.role] || C.textMuted,
                background: C.bgPage, cursor: saving === u.id ? 'wait' : 'pointer',
                width: '100%',
              }}
            >
              <option value="user">User</option>
              <option value="host">Host</option>
              <option value="admin">Admin</option>
            </select>

            {/* Delete */}
            <button
              onClick={() => handleDelete(u.id, u.full_name || u.email)}
              style={{
                padding: '7px 12px', borderRadius: 8,
                fontFamily: 'Jura', fontWeight: 600, fontSize: 12,
                background: 'transparent', color: C.female,
                border: `1.5px solid ${C.female}55`, cursor: 'pointer',
                width: '100%',
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}
