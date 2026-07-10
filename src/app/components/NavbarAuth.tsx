'use client';

import { useState, useRef } from 'react';
import { X, Terminal, Smartphone, Shield, User, Mail, Lock, Eye, EyeOff, HelpCircle, ArrowRight, MailCheck, RefreshCw, ChevronLeft, Camera, Pencil, AtSign, Upload, CircleCheckBig, UserCircle2, Laptop, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { profileService } from '@/lib/supabase/services/profileService';
import { signUpAction, loginAction, verifyOtpAction } from '@/app/auth/actions';
import { encryptField } from '@/lib/crypto/clientEncrypt';

type ModalMode = 'login' | 'signup' | 'verify' | 'profile' | 'photo' | 'success';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 814 1000">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.4-155.5-127.4C46.7 790.7 0 663 0 541.8c0-194.3 127.4-297.5 252.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

const OTP_LENGTH = 8;

export default function NavbarAuth() {
  const [open, setOpen]             = useState(false);
  const [mode, setMode]             = useState<ModalMode>('login');
  const [showPassword, setShowPass] = useState(false);
  const [agreed, setAgreed]         = useState(false);
  // form fields
  const [loginEmail, setLoginEmail]   = useState('');
  const [loginPassword, setLoginPass] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [fullName, setFullName]       = useState('');
  const [username, setUsername]       = useState('');
  // async state
  const [loading, setLoading]         = useState(false);
  const [authError, setAuthError]     = useState('');
  const [otp, setOtp]               = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [resent, setResent]         = useState(false);
  const [bio, setBio]               = useState('');
  const [avatarUrl, setAvatarUrl]   = useState('');
  const [emailSessionRef, setEmailSessionRef] = useState('');
  const supabase = createClient();
  const otpRefs                     = useRef<(HTMLInputElement | null)[]>([]);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const openLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode('login');
    setAuthError('');
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setShowPass(false);
    setAgreed(false);
    setOtp(Array(OTP_LENGTH).fill(''));
    setResent(false);
    setAuthError('');
    setLoginEmail('');
    setLoginPass('');
    setEmail('');
    setPassword('');
    setFullName('');
    setUsername('');
    setBio('');
    setAvatarUrl('');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setAuthError('Please choose a username.');
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await profileService.updateProfile(supabase, user.id, {
          username,
          bio,
        });
      }
      setMode('photo');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setAuthError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAuthError('You must be logged in to upload a photo.');
        return;
      }
      
      const publicUrl = await profileService.uploadAvatar(supabase, user.id, file);
      setAvatarUrl(publicUrl);

      // Save to database profile row
      await profileService.updateProfile(supabase, user.id, {
        avatarUrl: publicUrl
      });
    } catch (err: any) {
      setAuthError(err.message || 'Failed to upload photo.');
    } finally {
      setLoading(false);
    }
  };
  const switchTo = (m: ModalMode) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMode(m);
    setShowPass(false);
    setAuthError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      // Step 1: Send encrypted credentials to prepare route — get back an opaque sessionRef
      const [encEmail, encPassword] = await Promise.all([
        encryptField(loginEmail),
        encryptField(loginPassword),
      ]);
      const prepRes = await fetch('/api/auth/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: encEmail, password: encPassword }),
      });
      const { sessionRef, error: prepErr } = await prepRes.json();
      if (prepErr || !sessionRef) {
        setAuthError(prepErr || 'Could not prepare session.');
        return;
      }
      // Step 2: Call server action with ONLY the sessionRef — no credentials in this payload
      const res = await loginAction({ sessionRef });
      if (!res.success) {
        setAuthError(res.error || 'Invalid credentials.');
      } else {
        closeModal();
        window.location.reload();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }
    if (!agreed) {
      setAuthError('You must agree to the Terms & Conditions.');
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      // Step 1: Send encrypted credentials to prepare route — get back an opaque sessionRef
      const [encEmail, encPassword, encFullName] = await Promise.all([
        encryptField(email),
        encryptField(password),
        encryptField(fullName),
      ]);
      const prepRes = await fetch('/api/auth/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: encEmail, password: encPassword, fullName: encFullName }),
      });
      const { sessionRef, error: prepErr } = await prepRes.json();
      if (prepErr || !sessionRef) {
        setAuthError(prepErr || 'Could not prepare session.');
        return;
      }
      // Store sessionRef to use later for OTP verification (email lookup)
      setEmailSessionRef(sessionRef);
      // Step 2: Call server action with ONLY the sessionRef — no credentials in this payload
      const res = await signUpAction({ sessionRef });
      if (!res.success) {
        setAuthError(res.error || 'Could not create account.');
      } else {
        setMode('verify');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = otp.join('');
    if (token.length !== OTP_LENGTH) {
      setAuthError('Please enter the full 8-digit code.');
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      // Prepare a new sessionRef referencing the email (we need email for OTP verification)
      const encEmail = await encryptField(email);
      const prepRes = await fetch('/api/auth/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: encEmail, password: encEmail }), // password field reused as placeholder
      });
      const { sessionRef: emailRef, error: prepErr } = await prepRes.json();
      if (prepErr || !emailRef) {
        setAuthError(prepErr || 'Could not prepare session.');
        return;
      }
      // Server action only receives an opaque ref + the OTP token (not secret)
      const res = await verifyOtpAction({ emailRef, token });
      if (!res.success) {
        setAuthError(res.error || 'Invalid verification code.');
      } else {
        setMode('profile');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during OTP verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Supabase OAuth Error:", error);
        setAuthError(error.message || (typeof error.toString === 'function' ? error.toString() : 'Social login failed.'));
      }
    } catch (err: any) {
      console.error("OAuth Exception:", err);
      setAuthError(err?.message || (err && typeof err.toString === 'function' ? err.toString() : 'An unexpected error occurred during social login.'));
    } finally {
      setLoading(false);
    }
  };

  /* OTP input handling */
  const handleOtpChange = (idx: number, val: string) => {
    const digit = val.replace(/\D/, '').slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && idx > 0) otpRefs.current[idx - 1]?.focus();
    if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = [...Array(OTP_LENGTH).fill('')];
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();
    setOtp(Array(OTP_LENGTH).fill(''));
    setResent(true);
    try {
      // Re-trigger sign up to resend confirmation email
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
    } catch (err) {
      // silent fail or set auth error
    }
    setTimeout(() => setResent(false), 3000);
  };

  const otpFilled = otp.every(d => d !== '');

  return (
    <>
      {/* Navbar buttons */}
      <a href="#" className="nav-login-btn" id="btn-login" onClick={openLogin}>Log In</a>
      <a href="#" className="nav-sell-btn"  id="btn-sell"  onClick={openLogin}>
        <span className="nav-sell-badge">+</span>
        <span className="nav-sell-label">Sell</span>
      </a>

      {/* Modal */}
      {open && (
        <div className="auth-overlay" onClick={closeModal} role="dialog" aria-modal="true">
          <div
            className={`auth-modal${mode === 'signup' ? ' auth-modal-signup' : ''}${mode === 'verify' ? ' auth-modal-verify' : ''}${mode === 'profile' ? ' auth-modal-signup auth-modal-profile' : ''}${mode === 'photo' ? ' auth-modal-signup auth-modal-profile' : ''}${mode === 'success' ? ' auth-modal-success' : ''}`}
            onClick={e => e.stopPropagation()}
          >

            {/* ══════════ LOGIN ══════════ */}
            {mode === 'login' && (<>
              <button className="auth-close" onClick={closeModal} aria-label="Close"><X size={18}/></button>

              <div className="auth-brand">
                <div className="auth-brand-icon"><Terminal size={26} color="#fff" strokeWidth={1.8}/></div>
                <h2 className="auth-brand-name">TechMarket</h2>
                <p className="auth-brand-sub">Premium pre-owned high-tech marketplace.</p>
              </div>

               <div className="auth-card">
                {authError && <div className="auth-error-msg">{authError}</div>}
                <form onSubmit={handleLogin}>
                  <div className="auth-field">
                    <label htmlFor="auth-email" className="auth-label">Email Address</label>
                    <input
                      id="auth-email"
                      type="email"
                      placeholder="name@company.com"
                      className="auth-input"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="auth-field">
                    <div className="auth-label-row">
                      <label htmlFor="auth-password" className="auth-label">Password</label>
                      <a href="#" className="auth-forgot">Forgot Password?</a>
                    </div>
                    <input
                      id="auth-password"
                      type="password"
                      placeholder="••••••••"
                      className="auth-input"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={e => setLoginPass(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <button type="submit" className="auth-submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {loading ? <Loader2 size={16} className="animate-spin" /> : 'Login'}
                  </button>
                </form>
                <div className="auth-divider">
                  <span className="auth-divider-line"/><span className="auth-divider-text">OR CONTINUE WITH</span><span className="auth-divider-line"/>
                </div>
                <div className="auth-social-row">
                  <button className="auth-social-btn" onClick={() => handleOAuthSignIn('google')} disabled={loading}><GoogleIcon/> Google</button>
                  <button className="auth-social-btn" onClick={() => handleOAuthSignIn('apple')} disabled={loading}><AppleIcon/> Apple</button>
                </div>
                <button className="auth-phone-btn" disabled={loading}><Smartphone size={16}/> Login with Phone Number</button>
              </div>

              <p className="auth-signup-text">
                Don&apos;t have an account?{' '}
                <a href="#" className="auth-signup-link" onClick={switchTo('signup')}>Sign up</a>
              </p>
              <div className="auth-security">
                <Shield size={14} color="#059669"/>
                <span className="auth-security-badge">VERIFIED SECONDARY MARKET</span>
                <p className="auth-security-sub">Your connection is encrypted. All transactions are protected by TechMarket Secure.</p>
              </div>
            </>)}

            {/* ══════════ SIGN UP ══════════ */}
            {mode === 'signup' && (<>
              <div className="su-topbar">
                <span className="su-topbar-brand">TechMarket</span>
                <button className="su-support-btn"><HelpCircle size={16}/> Support</button>
              </div>
              <button className="auth-close" onClick={closeModal} aria-label="Close"><X size={18}/></button>

              <div className="su-security-pill"><Shield size={13} color="#059669"/> Enterprise-grade security</div>
              <h2 className="su-title">Join TechMarket</h2>
              <p className="su-subtitle">The premium secondary marketplace for high-end electronics.</p>

              <form className="su-form" onSubmit={handleCreateAccount}>
                {authError && <div className="auth-error-msg">{authError}</div>}
                <div className="auth-field">
                  <label htmlFor="su-name" className="auth-label">Full Name</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon"/>
                    <input
                      id="su-name"
                      type="text"
                      placeholder="John Doe"
                      className="auth-input auth-input-icon-pad"
                      autoComplete="name"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="su-email" className="auth-label">Email Address</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon"/>
                    <input
                      id="su-email" type="email" placeholder="name@company.com"
                      className="auth-input auth-input-icon-pad"
                      autoComplete="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="su-password" className="auth-label">Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon"/>
                    <input
                      id="su-password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                      className="auth-input auth-input-icon-pad auth-input-icon-pad-right"
                      autoComplete="new-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      disabled={loading}
                    />
                    <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'} disabled={loading}>
                      {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                  <p className="su-hint">Minimum 8 characters with a number and a symbol.</p>
                </div>

                <label className="su-terms">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="su-checkbox" disabled={loading}/>
                  <span>I agree to the <a href="#" className="su-link">Terms &amp; Conditions</a> and <a href="#" className="su-link">Privacy Policy</a>.</span>
                </label>

                <button type="submit" className="auth-submit su-submit" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Create Account <ArrowRight size={17}/></>}
                </button>
              </form>

              <div className="auth-divider">
                <span className="auth-divider-line"/><span className="auth-divider-text">OR JOIN WITH</span><span className="auth-divider-line"/>
              </div>
              <div className="auth-social-row">
                <button className="auth-social-btn" onClick={() => handleOAuthSignIn('google')} disabled={loading}><GoogleIcon/> Google</button>
                <button className="auth-social-btn" onClick={() => handleOAuthSignIn('apple')} disabled={loading}><AppleIcon/> Apple</button>
              </div>

              <p className="auth-signup-text" style={{ marginTop: '16px', marginBottom: '20px' }}>
                Already have an account?{' '}
                <a href="#" className="auth-signup-link" onClick={switchTo('login')}>Log in</a>
              </p>

              <div className="su-footer-badges">
                <span className="su-footer-badge"><Shield size={12}/> SECURE SSL</span>
                <span className="su-footer-badge"><Lock size={12}/> PCI COMPLIANT</span>
              </div>
              <p className="su-footer-text">
                Your data is protected by industry-leading encryption standards. We never sell your personal information.
              </p>
            </>)}

            {/* ══════════ EMAIL VERIFY ══════════ */}
            {mode === 'verify' && (<>
              <button className="auth-close" onClick={closeModal} aria-label="Close"><X size={18}/></button>

              {/* Animated icon */}
              <div className="vf-icon-wrap">
                <div className="vf-icon-ring"/>
                <div className="vf-icon-circle">
                  <MailCheck size={28} color="#fff" strokeWidth={1.8}/>
                </div>
              </div>

              <h2 className="vf-title">Check your inbox</h2>
              <p className="vf-subtitle">
                We&apos;ve sent an 8-digit verification code to
                <br/>
                <strong className="vf-email">{email || 'your email address'}</strong>
              </p>

               {authError && <div className="auth-error-msg" style={{ margin: '0 28px 16px', width: 'auto' }}>{authError}</div>}

               {/* OTP boxes */}
               <div className="vf-otp-row" onPaste={handleOtpPaste}>
                 {otp.map((digit, i) => (
                   <input
                     key={i}
                     ref={el => { otpRefs.current[i] = el; }}
                     type="text"
                     inputMode="numeric"
                     maxLength={1}
                     value={digit}
                     onChange={e => handleOtpChange(i, e.target.value)}
                     onKeyDown={e => handleOtpKey(i, e)}
                     className={`vf-otp-input${digit ? ' vf-otp-filled' : ''}`}
                     aria-label={`Digit ${i + 1}`}
                     autoFocus={i === 0}
                     disabled={loading}
                   />
                 ))}
               </div>

               {/* Verify button */}
               <button
                 className={`auth-submit vf-verify-btn${otpFilled ? ' vf-verify-btn-ready' : ''}`}
                 onClick={handleVerifyOtp}
                 disabled={!otpFilled || loading}
                 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
               >
                 {loading ? <Loader2 size={16} className="animate-spin" /> : (otpFilled ? 'Verify & Continue' : 'Enter Code')}
               </button>

              {/* Resend */}
              <div className="vf-resend-row">
                {resent ? (
                  <span className="vf-resent-msg">✓ Code resent!</span>
                ) : (
                  <>
                    <span className="vf-resend-label">Didn&apos;t receive the code?</span>
                    <a href="#" className="vf-resend-link" onClick={handleResend}>
                      <RefreshCw size={13}/> Resend
                    </a>
                  </>
                )}
              </div>

              {/* Continue link */}
              <a href="#" className="vf-continue-link" onClick={(e) => { e.preventDefault(); setMode('profile'); }}>
                Continue without verifying →
              </a>

              {/* Back link */}
              <a href="#" className="vf-back" onClick={switchTo('signup')}>← Back to Sign Up</a>

              {/* Security note */}
              <div className="auth-security" style={{ marginTop: '8px' }}>
                <Shield size={13} color="#059669"/>
                <span className="auth-security-badge">VERIFIED SECONDARY MARKET</span>
                <p className="auth-security-sub">Code expires in 10 minutes. Keep this window open.</p>
              </div>
            </>)}

            {/* ══════════ PROFILE SETUP ══════════ */}
            {mode === 'profile' && (<>
              {/* Top navigation bar */}
              <div className="pr-topbar">
                <button className="pr-back-btn" onClick={switchTo('verify')} aria-label="Go back">
                  <ChevronLeft size={20} />
                </button>
                <span className="pr-topbar-brand">TechMarket</span>
                <button className="su-support-btn"><HelpCircle size={16} /> Support</button>
              </div>

              <button className="auth-close" onClick={closeModal} aria-label="Close"><X size={18} /></button>

              {/* Step progress */}
              <div className="pr-steps">
                <div className="pr-step pr-step-active" />
                <div className="pr-step" />
              </div>
              <span className="pr-step-label">STEP 1 OF 2</span>
              <h2 className="pr-title">Personalize your profile</h2>
              <p className="pr-subtitle">Setting up your identity in the TechMarket ecosystem takes just a moment.</p>

              {/* Avatar uploader — click goes to photo step */}
              <div className="pr-avatar-wrap" onClick={() => setMode('photo')} style={{ cursor: 'pointer' }}>
                <div className="pr-avatar-circle">
                  <Camera size={28} color="#94A3B8" strokeWidth={1.5} />
                </div>
                <div className="pr-avatar-edit">
                  <Pencil size={13} color="#ffffff" />
                </div>
              </div>
              <span className="pr-avatar-label">Edit Profile Picture</span>

              <form className="pr-form" onSubmit={handleProfileSubmit}>
                {authError && <div className="auth-error-msg">{authError}</div>}
                {/* Username */}
                <div className="auth-field">
                  <label htmlFor="pr-username" className="auth-label">Choose Username</label>
                  <div className="auth-input-wrapper">
                    <AtSign size={16} className="auth-input-icon" />
                    <input
                      id="pr-username"
                      type="text"
                      placeholder="username"
                      className="auth-input auth-input-icon-pad"
                      autoComplete="username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <p className="su-hint">Unique name for your transactions</p>
                </div>

                {/* Bio */}
                <div className="auth-field">
                  <div className="pr-bio-labelrow">
                    <label htmlFor="pr-bio" className="auth-label" style={{ marginBottom: 0 }}>
                      Bio <span className="pr-bio-optional">(Optional)</span>
                    </label>
                    <span className="pr-bio-count">{bio.length}/120</span>
                  </div>
                  <textarea
                    id="pr-bio"
                    placeholder="Tell the community about your tech interests…"
                    className="pr-bio-input"
                    maxLength={120}
                    rows={4}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="auth-submit su-submit" disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Continue <ArrowRight size={17} /></>}
                </button>
              </form>

              <p className="pr-settings-note">You can change these details later in Settings.</p>
            </>)}

            {/* ══════════ PHOTO UPLOAD (Step 2 of 2) ══════════ */}
            {mode === 'photo' && (<>
              {/* Top bar */}
              <div className="pr-topbar">
                <span className="pr-topbar-brand">TechMarket</span>
                <button className="su-support-btn"><HelpCircle size={16} /> Support</button>
              </div>
              <button className="auth-close" onClick={closeModal} aria-label="Close"><X size={18} /></button>

              {/* Step 2 progress */}
              <div className="ph-step-bar">
                <div className="ph-step-info">
                  <span className="ph-step-num">Step 2 of 2</span>
                  <span className="ph-step-name">Finalizing Profile</span>
                </div>
                <div className="ph-progress-track">
                  <div className="ph-progress-fill" />
                </div>
              </div>

              <h2 className="pr-title" style={{ marginTop: '24px' }}>Add your photo</h2>
              <p className="pr-subtitle">Putting a face to your profile builds trust within the tech marketplace.</p>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
                disabled={loading}
              />

              {/* Avatar preview area */}
              <div className="ph-avatar-area" style={{ overflow: 'hidden', position: 'relative' }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <UserCircle2 size={64} color="#94A3B8" strokeWidth={1.2} />
                    <span className="ph-no-photo">No photo yet</span>
                  </>
                )}
                <div className="ph-camera-badge">
                  <Camera size={18} color="#ffffff" strokeWidth={1.8} />
                </div>
              </div>

              {/* Upload / Take buttons */}
              <div className="ph-action-row">
                <button className="ph-action-btn" id="btn-upload-photo" onClick={() => fileInputRef.current?.click()} disabled={loading}>
                  <Upload size={22} color="var(--color-primary-navy)" strokeWidth={1.5} />
                  <span>Upload Photo</span>
                </button>
                <button className="ph-action-btn" id="btn-take-photo" disabled={loading}>
                  <Camera size={22} color="var(--color-primary-navy)" strokeWidth={1.5} />
                  <span>Take Photo</span>
                </button>
              </div>
              <p className="ph-formats">Accepted formats: JPG, PNG, HEIC. Max 5MB.</p>

              {authError && <div className="auth-error-msg" style={{ margin: '12px 28px 0', width: 'auto' }}>{authError}</div>}

              {/* Finish button */}
              <div className="ph-finish-wrap">
                <button className="auth-submit su-submit ph-finish-btn" onClick={(e) => { e.preventDefault(); if (!loading) setMode('success'); }} disabled={loading}>
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Finish <CircleCheckBig size={18} /></>}
                </button>
                <a href="#" className="ph-skip" onClick={(e) => { e.preventDefault(); if (!loading) closeModal(); }}>Skip for now</a>
              </div>
            </>)}

            {/* ══════════ SUCCESS ══════════ */}
            {mode === 'success' && (<>
              <button className="auth-close" onClick={closeModal} aria-label="Close"><X size={18} /></button>

              {/* Illustration */}
              <div className="sc-illustration">
                {/* Floating device cards */}
                <div className="sc-device sc-device-phone">
                  <Smartphone size={22} color="var(--color-primary-navy)" strokeWidth={1.5} />
                </div>
                <div className="sc-device sc-device-laptop">
                  <Laptop size={20} color="var(--color-primary-navy)" strokeWidth={1.5} />
                </div>
                {/* Main green check circle */}
                <div className="sc-check-circle">
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="26" r="26" fill="#DCFCE7" />
                    <path d="M14 27l9 9 15-18" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <h2 className="sc-title">
                You&apos;re all set{username ? `, ${username}` : ''}!
              </h2>
              <p className="sc-subtitle">
                Your account has been successfully created. Start browsing the best tech deals.
              </p>

              <div className="sc-actions">
                <button className="auth-submit sc-primary-btn" onClick={closeModal}>
                  Start Shopping
                </button>
                <button className="sc-secondary-btn" onClick={closeModal}>
                  Go to Dashboard
                </button>
              </div>
            </>)}

          </div>
        </div>
      )}
    </>
  );
}
