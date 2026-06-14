"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrganizerSignup() {
    const [formData, setFormData] = useState({
        organizationName: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (
            !formData.organizationName ||
            !formData.fullName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (!agreedToTerms) {
            setError("Please agree to the Terms of Service and Privacy Policy.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    organization_name: formData.organizationName,
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const message =
                    data.errors?.[Object.keys(data.errors)[0]]?.[0] ||
                    data.message ||
                    "Registration failed.";
                throw new Error(message);
            }

            router.push("/organizer/auth-organizer");
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError("");
        setIsLoading(true);
        try {
            window.location.href = "http://localhost:8000/api/auth/google";
        } catch {
            setError("Google sign-up failed. Please try again.");
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
                        id="back-to-login-link"
                        href="/organizer/login"
                        className="group flex items-center gap-2 text-gold-shimmer hover:text-gold transition-colors duration-200 label-caps text-xs font-semibold"
                    >
                        <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                        <span>Back to Login</span>
                    </Link>
                </div>

                {/* Signup Card */}
                <div className="bg-purple-deep/40 border border-gold-shimmer/20 rounded-xl shadow-gold backdrop-blur-md border-b-2 border-b-gold p-8 md:p-10 animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="label-caps text-gold tracking-[0.25em] mb-3 block">
                            ORGANIZER APPLICATION
                        </span>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-cream-warm tracking-tight">
                            Create Account
                        </h1>
                        <div className="w-16 h-0.5 bg-gold mx-auto mt-4 mb-3" />
                        <p className="font-body text-sm text-cream-dim/70">
                            Register your organization to host and manage pageants
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-body text-center">
                            {error}
                        </div>
                    )}

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="organization-name"
                                className="label-caps text-gold-shimmer/70 text-[10px]"
                            >
                                Organization Name
                            </label>
                            <input
                                id="organization-name"
                                name="organizationName"
                                type="text"
                                placeholder="Carousel Productions"
                                value={formData.organizationName}
                                onChange={handleChange}
                                className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="full-name"
                                className="label-caps text-gold-shimmer/70 text-[10px]"
                            >
                                Full Name
                            </label>
                            <input
                                id="full-name"
                                name="fullName"
                                type="text"
                                placeholder="Juan Dela Cruz"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="signup-email"
                                className="label-caps text-gold-shimmer/70 text-[10px]"
                            >
                                Email Address
                            </label>
                            <input
                                id="signup-email"
                                name="email"
                                type="email"
                                placeholder="organizer@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="signup-password"
                                className="label-caps text-gold-shimmer/70 text-[10px]"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="signup-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 pr-12 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                                />
                                <button
                                    id="toggle-signup-password-visibility"
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-3.5 text-gold-shimmer/50 hover:text-gold text-sm transition-colors duration-200"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                            <span className="font-body text-[10px] text-cream-dim/40">
                                Must be at least 8 characters
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="confirm-password"
                                className="label-caps text-gold-shimmer/70 text-[10px]"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-purple-deep/60 border border-gold-shimmer/30 text-cream-warm px-4 py-3 pr-12 rounded-md focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all duration-300 text-sm placeholder-cream-dim/40"
                                />
                                <button
                                    id="toggle-confirm-password-visibility"
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-3.5 text-gold-shimmer/50 hover:text-gold text-sm transition-colors duration-200"
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <label
                            htmlFor="agree-terms"
                            className="flex items-start gap-3 cursor-pointer group"
                        >
                            <input
                                id="agree-terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded border-gold-shimmer/30 bg-purple-deep/60 text-gold accent-gold cursor-pointer"
                            />
                            <span className="font-body text-xs text-cream-dim/70 leading-relaxed">
                                I agree to the{" "}
                                <Link
                                    id="terms-link"
                                    href="/terms"
                                    className="text-gold hover:text-gold-light transition-colors duration-200"
                                >
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link
                                    id="privacy-link"
                                    href="/privacy"
                                    className="text-gold hover:text-gold-light transition-colors duration-200"
                                >
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        <button
                            id="signup-submit-btn"
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border rounded-md btn-shimmer transition-all duration-300 cursor-pointer bg-gold border-gold text-purple-deep hover:bg-gold-light hover:border-gold-light font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-7">
                        <div className="flex-1 h-px bg-gold-shimmer/15" />
                        <span className="label-caps text-cream-dim/40 text-[10px]">OR CONTINUE WITH</span>
                        <div className="flex-1 h-px bg-gold-shimmer/15" />
                    </div>

                    {/* Google Sign Up */}
                    <button
                        id="google-signup-btn"
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider border rounded-md transition-all duration-300 cursor-pointer bg-purple-deep/60 border-gold-shimmer/30 text-cream-warm hover:border-gold-shimmer/50 hover:bg-purple-deep/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M12 10.8v3.6h5.04c-.2 1.2-1.5 3.6-5.04 3.6-3.04 0-5.52-2.52-5.52-5.6s2.48-5.6 5.52-5.6c1.74 0 2.9.74 3.56 1.38l2.44-2.36C16.62 3.96 14.5 3 12 3 7.04 3 3 7.04 3 12s4.04 9 9 9c5.2 0 8.64-3.64 8.64-8.76 0-.58-.06-1.04-.14-1.44H12z"
                            />
                        </svg>
                        <span>Sign up with Google</span>
                    </button>

                    {/* Login Link */}
                    <p className="text-center font-body text-sm text-cream-dim/70 mt-8">
                        Already have an account?{" "}
                        <Link
                            id="login-link"
                            href="/organizer/auth-organizer"
                            className="text-gold hover:text-gold-light font-semibold transition-colors duration-200"
                        >
                            Sign In
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