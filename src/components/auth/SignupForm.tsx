"use client"

import React, { useEffect, useState } from 'react';



const SignupForm = () => {
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState("");
  const [error, setError] = useState('');
  const [grecaptchaReady, setGrecaptchaReady] = useState(false);

  useEffect(() => {

    (window as any).onRecaptchaSuccess = async (token: string) => {
      const form = document.getElementById('credentials-signup-form') as HTMLFormElement;
      if (!form) {
        setError('Form not found.');
        return;
      }

      const formData = new FormData(form);
      formData.set('g-recaptcha-response', token);

      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          setEmail(result.email);
          setStep('verify');
        } else {
          setError(result.message || "Signup failed")
        }

      } catch (err: any) {
        setError(err.message || 'Signup failed for unknown reason');
      }
    };


    if (!document.querySelector('#recaptcha-script')) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js`;
      script.async = true;
      script.defer = true;
      script.id = 'recaptcha-script';
      script.onload = () => setGrecaptchaReady(true);
      document.body.appendChild(script);
    } else {
      setGrecaptchaReady(true);
    }
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      })

      const result = await response.json();

      if (result.success) {
        setStep("signup");
        alert("Email successfully verified. You may now log in.");
      } else {
        setError(result.message || "Verification failed")
      }

    } catch (err: any) {
      setError(err.message || "Verification failed for unknown reason");
    }
  }

  if (step === 'verify') {
    return (
      <div>
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-gray-300">Verification code sent to <strong>{email}</strong></p>

          <input
            type="text"
            name="code"
            placeholder="Enter verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Verify Email
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await fetch("/api/resend-code", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });

                const result = await response.json();
                if (!result.success) {
                  setError(result.message || "Failed to resend code");
                } else {
                  alert("A new verification code has been sent.");
                }
              } catch (err: any) {
                setError(err.message || "Error resending code");
              }
            }}
            className="mt-2 text-sm text-orange-400 hover:underline"
          >
            Re-send verification code
          </button>
        </form>
      </div>
    );
  }

  return (

    <form
      id='credentials-signup-form'
      className="space-y-4"
    >
      <div>
        <label className="block text-sm text-gray-300 mb-1">Username</label>
        <input
          name="name"
          type="text"
          placeholder="John Doe"
          required
          autoComplete='name'
          className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input
          name='email'
          type="email"
          placeholder="johndoe@example.com"
          required
          autoComplete='email'
          className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <input
          name='password'
          type="password"
          placeholder="••••••••"
          required
          autoComplete='current-password'
          className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type='submit'
        className="g-recaptcha mt-2 cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
        data-callback="onRecaptchaSuccess"
        data-action="submit"
        disabled={!grecaptchaReady}
      >
        {grecaptchaReady ? 'Sign Up' : 'Loading...'}
      </button>

    </form>

  );
};

export default SignupForm;
