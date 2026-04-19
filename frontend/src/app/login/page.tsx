'use client';
import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { BrandMark } from '../../components/ui';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const joinSlug = searchParams.get('join');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError('');
      const res = await api.post('/auth/login', data);
      if (res.data.success) {
        const { access_token, user } = res.data.data;
        login(access_token, user);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setServerError(err.response?.data?.message || 'Invalid credentials');
      } else {
        setServerError('Something went wrong');
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <BrandMark size={48}/>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 6px' }}>Sign in to Smart Complaint</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>
            Or{' '}
            {joinSlug ? (
              <Link href={`/join/${joinSlug}`} style={{ color: 'var(--accent-600)', fontWeight: 500 }}>back to registration</Link>
            ) : (
              <Link href="/register" style={{ color: 'var(--accent-600)', fontWeight: 500 }}>create a new account</Link>
            )}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Email address</label>
                <input
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${errors.email ? 'var(--danger)' : 'var(--border-soft)'}`, background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none', width: '100%' }}
                />
                {errors.email && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.email.message}</span>}
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register('password')}
                  style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px', borderRadius: 'var(--radius-md)', border: `1px solid ${errors.password ? 'var(--danger)' : 'var(--border-soft)'}`, background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none', width: '100%' }}
                />
                {errors.password && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.password.message}</span>}
              </div>

              {/* Server error */}
              {serverError && (
                <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--status-suspended-dot)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 13, color: 'var(--danger)', textAlign: 'center' }}>
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
                  background: isSubmitting ? 'var(--accent-400)' : 'var(--accent-500)',
                  color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)', letterSpacing: '-0.005em',
                  transition: 'background 120ms',
                }}
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm/>
    </Suspense>
  );
}
