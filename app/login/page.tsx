"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(Boolean);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError('Invalid email or password');
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    required
                />

                <input type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    required
                />

                {
                    error &&
                    <p style={{ color: 'red' }}>{error}</p>
                }

                <button
                    type="submit"
                    disabled={loading}>
                    {loading ? "Loading in..." : "Login"}
                </button>
            </form>
        </div>
    )
}