'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BrandMark, Btn, Icons } from '../../../components/ui';

const complaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});
type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function NewComplaintPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    try {
      setServerError('');
      const res = await api.post('/complaints', data);
      if (res.data.success) router.push('/dashboard');
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  const fieldStyle = (hasError: boolean): React.CSSProperties => ({
    fontFamily: 'var(--font-sans)', fontSize: 13.5, padding: '9px 12px',
    borderRadius: 'var(--radius-md)', border: `1px solid ${hasError ? 'var(--danger)' : 'var(--border-soft)'}`,
    background: 'var(--bg-surface)', color: 'var(--fg-primary)', outline: 'none', width: '100%',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ height: 64, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 14 }}>
        <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--fg-tertiary)', textDecoration: 'none', fontWeight: 500 }}>
          <Icons.ChevLeft size={14}/> Back to dashboard
        </Link>
        <div style={{ flex: 1 }}/>
        <BrandMark size={28}/>
      </nav>

      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-primary)', margin: '0 0 6px' }}>Submit a new complaint</h1>
          <p style={{ fontSize: 14, color: 'var(--fg-tertiary)', margin: '0 0 24px', lineHeight: 1.6 }}>Give us a clear subject and a short description. You'll be able to track progress here.</p>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', padding: '28px 28px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Subject</label>
                  <input type="text" {...register('title')} placeholder="e.g. Refund not received" style={fieldStyle(!!errors.title)}/>
                  {errors.title && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.title.message}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--fg-secondary)' }}>Details</label>
                  <textarea rows={7} {...register('description')} placeholder="What happened? Include order IDs, dates, and anything else relevant." style={{ ...fieldStyle(!!errors.description), resize: 'vertical', lineHeight: 1.6 }}/>
                  {errors.description && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{errors.description.message}</span>}
                </div>

                {serverError && (
                  <div style={{ background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 13, color: 'var(--danger)' }}>{serverError}</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--fg-quaternary)' }}>You'll receive updates here and by email.</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Btn variant="secondary" onClick={() => router.push('/dashboard')}>Cancel</Btn>
                    <button type="submit" disabled={isSubmitting} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 'var(--radius-md)', background: isSubmitting ? 'var(--accent-400)' : 'var(--accent-500)', color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-sans)' }}>
                      {isSubmitting ? 'Submitting…' : 'Submit complaint'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
