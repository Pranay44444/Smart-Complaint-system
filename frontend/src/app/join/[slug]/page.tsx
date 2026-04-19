'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import api from '../../../lib/axios';
import { AxiosError } from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { BrandMark } from '../../../components/ui';

function decodeJwtPayload(token: string) {
  const base64url = token.split('.')[1];
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  return JSON.parse(atob(padded));
}

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function JoinOrgPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setServerError('');
      const res = await api.post(`/auth/register/join/${slug}`, data);
      if (res.data.success) {
        const token = res.data.data.token;
        const payload = decodeJwtPayload(token);
        login(token, { sub: payload.sub, email: payload.email, role: payload.role });
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        setServerError(err.response?.data?.message || 'Registration failed');
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
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 6px' }}>Join an organization</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>
            Registering under: <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-primary)', fontWeight: 500 }}>{slug}</span>
          </p>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Full name</label>
                <input type="text" {...register('name')} style={fieldStyle(!!errors.name)}/>
                {errors.name && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.name.message}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Email</label>
                <input type="email" {...register('email')} style={fieldStyle(!!errors.email)}/>
                {errors.email && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.email.message}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Password</label>
                <input type="password" {...register('password')} style={fieldStyle(!!errors.password)}/>
                {errors.password && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.password.message}</span>}
              </div>

              {serverError && (
                <div style={{ background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 13, color: 'var(--danger)', textAlign: 'center' }}>{serverError}</div>
              )}

              <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: isSubmitting ? 'var(--accent-400)' : 'var(--accent-500)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', transition: 'background 120ms' }}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Link href={`/login?join=${slug}`} style={{ fontSize: 13, color: 'var(--accent-600)', fontWeight: 500 }}>Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
