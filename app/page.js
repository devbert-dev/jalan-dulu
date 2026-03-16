'use client';
import { useState } from 'react';
import { C, NAV } from '../lib/constants';
import Sidebar from '../components/Sidebar';
import HomeSection from '../components/HomeSection';
import DiscoverSection from '../components/DiscoverSection';
import AdminPanel from '../components/AdminPanel';
import MyEventsSection from '../components/MyEventsSection';
import CreateEventForm from '../components/CreateEventForm';
import AuthPage from '../components/AuthPage';

export default function Page() {
  const [user,            setUser]            = useState(null);
  const [page,            setPage]            = useState('home');
  const [showCreateForm,  setShowCreateForm]  = useState(false);

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  const role  = user?.user_metadata?.role ?? 'user';
  const token = user?.token;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there';
  const META = {
    home:     { title: `Welcome back, ${displayName} 👋`, sub: '3 new events near you' },
    discover: { title: 'Discover',                         sub: 'Browse & join activities' },
    myevents: { title: 'My Events',                        sub: 'Events you host' },
    admin:    { title: 'Admin Panel',                      sub: 'Manage users and roles' },
  };
  const meta = META[page] || META.home;

  function handleCreateSuccess(newEvent) {
    setShowCreateForm(false);
    setPage('myevents');
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '220px 1fr',
      height: '100vh', fontFamily: 'Jura, sans-serif',
      background: C.bgPage, overflow: 'hidden',
    }}>

      {/* Sidebar */}
      <Sidebar page={page} setPage={setPage} role={role} user={user} />

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{
          padding: '14px 32px', background: C.bgCard,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
        }}>
          <div>
            <span style={{ fontFamily: 'Jura, sans-serif', fontWeight: 800, fontSize: 20, color: C.text }}>
              {meta.title}
            </span>
            <span style={{ fontFamily: 'Jura', fontSize: 13, color: C.textMuted, marginLeft: 14 }}>
              {meta.sub}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {(role === 'host' || role === 'admin') && (
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  padding: '8px 18px', borderRadius: 8,
                  background: C.greenDark, color: '#fff',
                  fontFamily: 'Jura', fontWeight: 600, fontSize: 13,
                  border: 'none', cursor: 'pointer',
                }}
              >
                + Host Event
              </button>
            )}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: C.yellowPale,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, cursor: 'pointer',
            }}>
              🔔
            </div>
            <button
              onClick={() => setUser(null)}
              style={{
                padding: '8px 14px', borderRadius: 8,
                background: 'transparent', color: C.textMuted,
                fontFamily: 'Jura', fontWeight: 600, fontSize: 12,
                border: `1.5px solid ${C.border}`, cursor: 'pointer',
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: page === 'discover' ? 'hidden' : 'auto' }}>
          {page === 'home'     && <HomeSection setPage={setPage} token={token} role={role} />}
          {page === 'discover' && <DiscoverSection role={role} token={token} />}
          {page === 'admin'    && <AdminPanel token={token} />}
          {page === 'myevents' && (
            <MyEventsSection
              token={token}
              onCreateEvent={() => setShowCreateForm(true)}
            />
          )}
        </div>
      </div>

      {/* Create Event modal — rendered at root so it overlays everything */}
      {showCreateForm && (
        <CreateEventForm
          token={token}
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
