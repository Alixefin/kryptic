"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        // Convex Auth doesn't have a built-in password reset flow via email.
        // For now, show a message that the feature is coming soon.
        // TODO: Implement password reset via Convex action + email provider
        setError("Password reset is not yet available. Please contact support at support@krypticlab.com.");
        setIsSubmitting(false);
    };

    return (
        <main className="min-h-screen">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-md mx-auto">
                    {!isSubmitted ? (
                        <>
                            <Link
                                href="/account/login"
                                className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>

                            <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
                            <p className="text-[var(--text-secondary)] mb-8">
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>

                            <div className="bg-[var(--bg-secondary)] p-8 rounded-lg">
                                {error && (
                                    <div className="bg-[var(--sale-red)]/10 border border-[var(--sale-red)] text-[var(--sale-red)] px-4 py-3 rounded-lg mb-6">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <>
                                                <Mail className="h-5 w-5" />
                                                Send Reset Link
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="bg-[var(--bg-secondary)] p-8 rounded-lg text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                            <p className="text-[var(--text-secondary)] mb-6">
                                We&apos;ve sent a password reset link to <strong>{email}</strong>.
                                Please check your inbox and follow the instructions.
                            </p>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">
                                Didn&apos;t receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-[var(--accent)] hover:underline"
                                >
                                    try again
                                </button>
                                .
                            </p>
                            <Link
                                href="/account/login"
                                className="btn-primary inline-block"
                            >
                                Return to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
