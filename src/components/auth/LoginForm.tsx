"use client"

import React, { useEffect, useState } from 'react';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import GithubSignIn from '@/components/auth/GithubSignIn';
import FacebookSignIn from '@/components/auth/FacebookSignIn';
import { signIn } from 'next-auth/react';

const LoginForm = () => {
    const [step, setStep] = useState<'login' | 'email' | 'verify' | 'resetPassword'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [resetPassword, setResetPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const result = await response.json();

            if (result.success) {
                await signIn("credentials", {
                    email,
                    password,
                    redirect: true,
                    redirectTo: "/"
                })
            } else {
                switch (result.reason) {
                    case "unverified":
                        setStep("verify");
                        break;
                    case "invalid_password":
                        setError("Password is incorrect");
                        break;
                    case "not_found":
                        setError("No account found with specified email. Sign up to create a new account.");
                        break;
                    default:
                        setError("Something went wrong. Please try again")
                }
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        }
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/resend-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!result.success) {
                setError(result.message || "Failed to send verification code")
            } else {
                setStep("verify");
            }
        } catch (err: any) {
            setError(err.message || "Error sending code");
        }
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            })

            const result = await response.json();

            if (result.success) {
                if (!resetPassword) {
                    await signIn("credentials", {
                        email,
                        password,
                        redirect: true,
                        redirectTo: "/"
                    })
                } else {
                    setStep("resetPassword")
                }
            } else {
                setError(result.message || "Verification failed.");
            }
        } catch (err: any) {
            setError(err.message || "Verification failed for unknown reason.");
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: newPassword }),
            });

            const result = await response.json();

            if (result.success) {
                alert("Password reset successfully. You may now log in.");
                setStep("login");
                setResetPassword(false);
                setNewPassword("");
                setConfirmPassword("");
                setPassword("");
            } else {
                setError(result.message || "Failed to reset password.");
            }
        } catch (err: any) {
            setError(err.message || "Unknown error occurred.");
        }
    }

    if (step === "email") {
        return (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
                <p className="text-sm text-gray-300">
                    Enter your account email to receive a verification code.
                </p>

                <input
                    type="email"
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-2"
                >
                    Send Verification Code
                </button>
            </form>
        )
    }

    if (step === "verify") {
        return (
            <form onSubmit={handleVerify} className="space-y-4">
                <p className="text-sm text-gray-300">
                    Verification code sent to <strong>{email}</strong>
                </p>

                <input
                    type="text"
                    name="code"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-2"
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
                    className="cursor-pointer underline hover:text-orange-400"
                >
                    Re-send verification code
                </button>
            </form>
        )
    }

    if (step === "resetPassword") {
        return (
            <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm"
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-2">Reset Password</button>
            </form>
        )
    }

    return (
        <>
            {/* Social Auth Buttons */}
            <div className="flex justify-center gap-4">
                <GoogleSignIn />
                <GithubSignIn />
                <FacebookSignIn />
            </div>

            <div className="flex items-center gap-2">
                <div className="flex-grow border-t border-gray-600" />
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-grow border-t border-gray-600" />
            </div>

            {/* Form Inputs */}
            <form
                onSubmit={handleLogin}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm text-gray-300 mb-1">Email</label>
                    <input
                        name='email'
                        type="email"
                        placeholder="johndoe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete='current-password'
                        className="w-full bg-zinc-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-2"
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setResetPassword(true);
                        setStep("email");
                    }}
                    className="cursor-pointer underline hover:text-orange-400"
                >
                    Forgot your password?
                </button>
            </form>
            <a href="/signup" className='cursor-pointer underline hover:text-orange-400'>New to Keepsakes?</a>
        </>
    )
};

export default LoginForm
