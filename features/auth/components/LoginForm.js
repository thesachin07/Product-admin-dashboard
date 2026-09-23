'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/components/Buttons';
import Input from '@/shared/components/Input';
import { useAuthContext } from '../state/AuthContext';

const INITIAL_FORM = { username: '', password: '' };

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuthContext();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setApiError('');
  }

  function validate() {
    const next = {};
    if (!form.username.trim()) next.username = 'Username is required';
    if (!form.password.trim()) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoggingIn) return;
    if (!validate()) return;

    setApiError('');

    try {
      await login({ username: form.username, password: form.password });
      router.replace('/products');
    } catch (err) {
      if (err.isCanceled) return;
      setApiError(err.message || 'Login failed. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      {apiError && (
        <div
          role="alert"
          className="p-3 mb-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm"
        >
          {apiError}
        </div>
      )}

      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={handleChange}
        error={errors.username}
        placeholder="emilys"
        disabled={isLoggingIn}
        required
        autoComplete="username"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        placeholder="emilyspass"
        disabled={isLoggingIn}
        required
        autoComplete="current-password"
      />

      <Button
        type="submit"
        loading={isLoggingIn}
        className="w-full mt-2"
      >
        Login
      </Button>
    </form>
  );
}