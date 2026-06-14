"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrganizerLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Invalid email or password.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            router.push("/organizer/dashboard");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Invalid email or password. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        setIsLoading(true);
        try {
            // TODO: replace with actual Google OAuth call
            // await signIn("google", { callbackUrl: "/organizer/dashboard" });
            await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-purple-deep flex flex-col items-center justify-center overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
            {/* Spotlight Radial Glow */}
            <div
                className="absolute inset-0 z-0 opacity-80"
                style={{
                    background:
                        "radial-gradient(circle at 50% 30%, rgba(197, 160, 89, 0.1) 0%, transparent 70%)",
                }}
            />

            {/* Decorative Diamonds */}
            <div className="absolute top-[10%] left-[5%] w-4 h-4 border border-gold-shimmer/20 rotate-45 animate-float z-0" />
            <div
                className="absolute bottom-[15%] right-[5%] w-5 h-5 border border-gold-shimmer/20 rotate-45 animate-float-slow z-0"
                style={{ animationDelay: "1s" }}
            />

            <div className="relative z-10 w-full max-w-md flex flex-col">
                {/* Back Link */}
                <div className="mb-8 self-start">
                    <Link
                        id="back-to-home-link"
                        href="/"
                        className="group flex items-center gap-2 text-gold-shimmer hover:text-gold transition-colors duration-200 label-caps text-xs font-semibold"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-purple-deep/40 border border-gold-shimmer/20 rounded-xl shadow-gold backdrop-blur-md border-b-2 border-b-gold p-8 md:p-10 animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="label-caps text-gold tracking-[0.25em] mb-3 block">
                            ORGANIZER ACCESS
                        </span>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-cream-warm tracking-tight">
                            Welcome Back
                        </h1>
                        <div className="w-16 h-0.5 bg-gold mx-auto mt-4 mb-3" />
                        <p className="font-body text-sm text-cream-dim/70">
                            Sign in to manage your pageants and candidates
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-body text-center">
                            {error}
                        </div>
                    )}

                    {/* Email / Password Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="organizer-email"
                                className="label-caps text-gold-shimmer/70 text-[10px]"
                            >
                                Email Address
                            </label>
                            <input
                                id="organizer-email"
                                type="email"
                                placeholder="organizer@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="organizer-password"
                                    className="label-caps text-gold-shimmer/70 text-[10px]"
                                >
                                    Password
                                </label>
                                <Link
                                    id="forgot-password-link"
                                    href="/organizer/forgot-password"
                                    className="label-caps text-gold-shimmer/60 hover:text-gold text-[10px] transition-colors duration-200"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    id="organizer-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 pr-12 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                                />
                                <button
                                    id="toggle-password-visibility"
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-3.5 text-gold-shimmer/50 hover:text-gold text-sm transition-colors duration-200"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border rounded-md btn-shimmer transition-all duration-300 cursor-pointer bg-gold border-gold text-purple-deep hover:bg-gold-light hover:border-gold-light font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-7">
                        <div className="flex-1 h-px bg-gold-shimmer/15" />
                        <span className="label-caps text-cream-dim/40 text-[10px]">OR CONTINUE WITH</span>
                        <div className="flex-1 h-px bg-gold-shimmer/15" />
                    </div>

                    {/* Google Sign In */}
                    <button
                        id="google-signin-btn"
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider border rounded-md transition-all duration-300 cursor-pointer bg-purple-deep/60 border-gold-shimmer/30 text-cream-warm hover:border-gold-shimmer/50 hover:bg-purple-deep/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 10.8v3.6h5.04c-.2 1.2-1.5 3.6-5.04 3.6-3.04 0-5.52-2.52-5.52-5.6s2.48-5.6 5.52-5.6c1.74 0 2.9.74 3.56 1.38l2.44-2.36C16.62 3.96 14.5 3 12 3 7.04 3 3 7.04 3 12s4.04 9 9 9c5.2 0 8.64-3.64 8.64-8.76 0-.58-.06-1.04-.14-1.44H12z"
                            />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>

                    {/* Sign Up Link */}
                    <p className="text-center font-body text-sm text-cream-dim/70 mt-8">
                        Don&apos;t have an organizer account?{" "}
                        <Link
                            id="signup-link"
                            href="/organizer/signup-organizer"
                            className="text-gold hover:text-gold-light font-semibold transition-colors duration-200"
                        >
                            Apply Now
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer copyright note */}
            <p className="relative z-10 font-body text-[10px] text-gold-shimmer/30 uppercase tracking-widest mt-12">
                © 2026 Crown & Glory. All rights reserved.
            </p>
        </div>
    );
}