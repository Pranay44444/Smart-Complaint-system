'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { BrandMark } from '../../components/ui';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState('');
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError('');
      const regRes = await api.post('/auth/register', data);
      if (regRes.data.success) {
        const loginRes = await api.post('/auth/login', { email: data.email, password: data.password });
        if (loginRes.data.success) {
          const { access_token, user } = loginRes.data.data;
          login(access_token, user);
        }
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const msg = err.response?.data?.message;
        setServerError(Array.isArray(msg) ? msg[0] : (msg || 'Registration failed'));
      } else {
        setServerError('Something went wrong');
      }
    }
  };

  const fieldStyle = (hasError: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px',
    borderRadius: 'var(--radius-md)', border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border-soft)'}`,
    background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none', width: '100%',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <BrandMark size={48}/>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 6px' }}>Create your account</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent-600)', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Full name</label>
                <input type="text" autoComplete="name" {...register('name')} style={fieldStyle(!!errors.name)}/>
                {errors.name && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.name.message}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Email address</label>
                <input type="email" autoComplete="email" {...register('email')} style={fieldStyle(!!errors.email)}/>
                {errors.email && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.email.message}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Password</label>
                <input type="password" autoComplete="new-password" {...register('password')} style={fieldStyle(!!errors.password)}/>
                {errors.password && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.password.message}</span>}
                <span style={{ fontSize: 12, color: 'var(--fg-quaternary)' }}>Password must be at least 6 characters.</span>
              </div>

              {serverError && (
                <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--status-suspended-dot)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 13, color: 'var(--danger)', textAlign: 'center' }}>
                  {serverError}
                </div>
              )}

              <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: isSubmitting ? 'var(--accent-400)' : 'var(--accent-500)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '-0.005em', transition: 'background 120ms' }}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
