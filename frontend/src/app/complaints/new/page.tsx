'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../../lib/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const complaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function NewComplaintPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    try {
      setServerError('');
      const res = await api.post('/complaints', data);
      if (res.data.success) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a New Complaint</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Subject/Title</label>
              <input
                id="title"
                type="text"
                {...register('title')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Details</label>
              <textarea
                id="description"
                rows={6}
                {...register('description')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            {serverError && <p className="text-sm text-red-600">{serverError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
