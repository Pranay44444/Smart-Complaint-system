'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';
import Link from 'next/link';
import { BrandMark } from '../../../components/ui';

const registerSchema = z.object({
  orgName: z.string().min(2, 'Company name is required'),
  adminName: z.string().min(2, 'Name is required'),
  adminEmail: z.email('Invalid email address'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterOrgPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError('');
      const res = await api.post('/auth/register/org', data);
      if (res.data.success || res.data.data) {
        const payload = res.data.data || res.data;
        login(payload.access_token, payload.user);
      } else {
        setError('Registration failed to complete properly.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const fieldStyle = (hasError: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px',
    borderRadius: 'var(--radius-md)', border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border-soft)'}`,
    background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none', width: '100%',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <BrandMark size={48}/>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 6px' }}>Register your organization</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: 0 }}>Create an organization and become the first admin.</p>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', padding: '32px 28px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Company name</label>
                <input type="text" {...register('orgName')} placeholder="e.g. Acme Corp" style={fieldStyle(!!errors.orgName)}/>
                {errors.orgName && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.orgName.message}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Your full name</label>
                <input type="text" {...register('adminName')} style={fieldStyle(!!errors.adminName)}/>
                {errors.adminName && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.adminName.message}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Work email</label>
                <input type="email" {...register('adminEmail')} style={fieldStyle(!!errors.adminEmail)}/>
                {errors.adminEmail && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.adminEmail.message}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Password</label>
                <input type="password" {...register('adminPassword')} style={fieldStyle(!!errors.adminPassword)}/>
                {errors.adminPassword && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.adminPassword.message}</span>}
                <span style={{ fontSize: 12, color: 'var(--fg-quaternary)' }}>Password must be at least 6 characters.</span>
              </div>

              {error && (
                <div style={{ background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 13, color: 'var(--danger)', textAlign: 'center' }}>{error}</div>
              )}

              <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: isSubmitting ? 'var(--accent-400)' : 'var(--accent-500)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)', transition: 'background 120ms' }}>
                {isSubmitting ? 'Registering…' : 'Register organization'}
              </button>
            </div>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Link href="/login" style={{ fontSize: 13, color: 'var(--accent-600)', fontWeight: 500 }}>Already have an account? Sign in</Link>
            <p style={{ fontSize: 13, color: 'var(--fg-quaternary)', margin: 0 }}>Are you a customer? Ask your organization for their join link.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
