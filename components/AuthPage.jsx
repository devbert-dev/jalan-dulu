'use client';
import { useState } from 'react';
import { C } from '../lib/constants';

const API_URL = 'https://jalan-dulu-api-production.up.railway.app';

const RULES = [
  { id: 'len',     label: 'At least 8 characters',        test: p => p.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)',    test: p => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'One lowercase letter (a–z)',    test: p => /[a-z]/.test(p) },
  { id: 'number',  label: 'One number (0–9)',              test: p => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$…)', test: p => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_LABEL = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const STRENGTH_COLOR = ['', C.female, C.female, '#C8A800', C.greenSage, C.greenMid];

export default function AuthPage({ onAuth }) {
  const [mode,            setMode]            = useState('login');
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');

  const passedRules  = RULES.filter(r => r.test(password));
  const strength     = passedRules.length;
  const isPassStrong = strength === RULES.length;
  const passwordsMatch = password === confirmPassword;

  const canSubmit = mode === 'login'
    ? email && password
    : name.trim() && email && isPassStrong && confirmPassword && passwordsMatch;

  function switchMode(m) {
    setMode(m);
    setError('');
    setName('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const body = mode === 'login'
        ? { email, password }
        : { email, password, name: name.trim() };
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || 'Something went wrong. Please try again.');
      } else {
        // Unwrap { user, token } so page.js receives the user object directly
        onAuth({ ...data.user, token: data.token });
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr',
      height: '100vh', fontFamily: 'Jura, sans-serif',
      background: C.bgPage,
    }}>

      {/* ── Left: Branding panel ── */}
      <div style={{
        background: C.greenDark, display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,.04)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,.03)' }} />
        <div style={{ position: 'absolute', top: '40%', right: -40, width: 160, height: 160, borderRadius: '50%', background: C.yellowWarm + '18' }} />

        {/* Logo */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 32, color: '#fff', lineHeight: 1 }}>
            Jalan
          </div>
          <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 32, color: C.yellowMid, lineHeight: 1 }}>
            Dulu
          </div>
          <div style={{ fontFamily: 'Jura', fontSize: 11, color: C.greenLight, marginTop: 6, letterSpacing: 2, textTransform: 'uppercase' }}>
            Activity Platform
          </div>
        </div>

        {/* Hero text */}
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 36, color: '#fff', lineHeight: 1.2, marginBottom: 20 }}>
            Find your<br />
            <span style={{ color: C.yellowMid }}>tribe</span> &amp;<br />
            <span style={{ color: C.greenLight }}>move</span> together.
          </div>
          <div style={{ fontFamily: 'Jura', fontSize: 14, color: C.greenPale, lineHeight: 1.8 }}>
            Discover events with smart gender quotas.<br />
            Zero commission. Built for Jakarta.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 32, position: 'relative' }}>
          {[['500+', 'Events'], ['12K+', 'Members'], ['0%', 'Commission']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 22, color: C.yellowMid }}>{n}</div>
              <div style={{ fontFamily: 'Jura', fontSize: 11, color: C.greenLight, textTransform: 'uppercase', letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: Auth form ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Mode tabs */}
          <div style={{
            display: 'flex', background: C.bgPage,
            borderRadius: 12, padding: 4, marginBottom: 32,
            border: `1.5px solid ${C.border}`,
          }}>
            {[['login', 'Log In'], ['signup', 'Sign Up']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontFamily: 'Jura', fontWeight: 700, fontSize: 13, transition: 'all .18s',
                  background: mode === m ? C.greenDark : 'transparent',
                  color:      mode === m ? '#fff' : C.textMuted,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'Jura, sans-serif', fontWeight: 700, fontSize: 26, color: C.text, marginBottom: 6 }}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </div>
            <div style={{ fontFamily: 'Jura', fontSize: 13, color: C.textMuted }}>
              {mode === 'login'
                ? 'Log in to discover and join activities.'
                : 'Join the community. Find your tribe.'}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Name — signup only */}
            {mode === 'signup' && (
              <div>
                <label style={{ fontFamily: 'Jura', fontSize: 12, fontWeight: 700, color: C.textMid, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .8 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: `1.5px solid ${C.border}`, fontFamily: 'Jura', fontSize: 14,
                    color: C.text, background: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = C.greenSage}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label style={{ fontFamily: 'Jura', fontSize: 12, fontWeight: 700, color: C.textMid, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .8 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 10,
                  border: `1.5px solid ${C.border}`, fontFamily: 'Jura', fontSize: 14,
                  color: C.text, background: '#fff', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = C.greenSage}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontFamily: 'Jura', fontSize: 12, fontWeight: 700, color: C.textMid, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%', padding: '11px 44px 11px 14px', borderRadius: 10,
                    border: `1.5px solid ${C.border}`, fontFamily: 'Jura', fontSize: 14,
                    color: C.text, background: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = C.greenSage}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 16, color: C.textMuted, padding: 0, lineHeight: 1,
                  }}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>

              {/* Password strength — signup only */}
              {mode === 'signup' && password.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  {/* Strength bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 5, background: C.border, borderRadius: 99 }}>
                      <div style={{
                        width: `${(strength / RULES.length) * 100}%`, height: '100%',
                        borderRadius: 99, transition: 'width .3s, background .3s',
                        background: STRENGTH_COLOR[strength],
                      }} />
                    </div>
                    <span style={{ fontFamily: 'Jura', fontSize: 11, fontWeight: 700, color: STRENGTH_COLOR[strength], minWidth: 64 }}>
                      {STRENGTH_LABEL[strength]}
                    </span>
                  </div>

                  {/* Rule checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {RULES.map(r => {
                      const ok = r.test(password);
                      return (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 12, color: ok ? C.greenSage : C.textMuted, lineHeight: 1 }}>
                            {ok ? '✓' : '○'}
                          </span>
                          <span style={{ fontFamily: 'Jura', fontSize: 12, color: ok ? C.greenSage : C.textMuted }}>
                            {r.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm password — signup only */}
            {mode === 'signup' && (
              <div>
                <label style={{ fontFamily: 'Jura', fontSize: 12, fontWeight: 700, color: C.textMid, display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .8 }}>
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: `1.5px solid ${confirmPassword && !passwordsMatch ? C.female : C.border}`,
                    fontFamily: 'Jura', fontSize: 14, color: C.text,
                    background: '#fff', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = passwordsMatch ? C.greenSage : C.female}
                  onBlur={e => e.target.style.borderColor = confirmPassword && !passwordsMatch ? C.female : C.border}
                />
                {confirmPassword && !passwordsMatch && (
                  <div style={{ fontFamily: 'Jura', fontSize: 12, color: C.female, marginTop: 5 }}>
                    Passwords do not match.
                  </div>
                )}
                {confirmPassword && passwordsMatch && (
                  <div style={{ fontFamily: 'Jura', fontSize: 12, color: C.greenSage, marginTop: 5 }}>
                    ✓ Passwords match.
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                background: C.female + '14', border: `1px solid ${C.female}44`,
                borderRadius: 8, padding: '10px 14px',
                fontFamily: 'Jura', fontSize: 13, color: C.female, lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{
                width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                fontFamily: 'Jura', fontWeight: 700, fontSize: 14, cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                background: canSubmit ? C.greenDark : C.greenPale,
                color:      canSubmit ? '#fff' : C.textMuted,
                transition: 'all .2s', marginTop: 4,
              }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          {/* Switch mode link */}
          <div style={{ textAlign: 'center', marginTop: 20, fontFamily: 'Jura', fontSize: 13, color: C.textMuted }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Jura', fontWeight: 700, fontSize: 13, color: C.greenSage, padding: 0 }}
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
