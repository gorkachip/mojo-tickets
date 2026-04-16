"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCF9F6]">
      <div className="w-full max-w-sm rounded-2xl border border-[#E5DAD0] bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-[family-name:var(--font-lacquer)] text-2xl text-[#27241E]">
            MOJO
          </h1>
          <p className="mt-1 text-sm text-[#6F634F]">Sign in to manage tickets</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#27241E]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#E5DAD0] px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#27241E]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[#E5DAD0] px-3 py-2 text-sm text-[#27241E] outline-none focus:border-[#49615B] focus:ring-1 focus:ring-[#49615B]"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#27241E] py-2.5 text-sm font-medium text-[#FCF9F6] transition-colors hover:bg-[#3E3723] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
