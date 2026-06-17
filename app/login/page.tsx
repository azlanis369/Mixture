"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6 text-white">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold mb-3">
            M
          </div>
          <h1 className="text-2xl font-bold">Mixture</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Sistem Pengurusan Tadika
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            Log Masuk
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Masukkan akaun pekerja anda.
          </p>

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Emel
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nama@mixture.my"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Kata Laluan
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
                required
              />
            </div>

            {state?.error && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {state.error}
              </div>
            )}

            <Button type="submit" disabled={pending} className="w-full">
              {pending ? "Sedang log masuk..." : "Log Masuk"}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <p className="font-medium text-slate-600 mb-1">Akaun demo:</p>
            <p>Admin HQ — admin@mixture.my</p>
            <p>Ketua Cawangan — head.amp@mixture.my</p>
            <p>Pekerja — staff.amp.1@mixture.my</p>
            <p className="mt-1">Kata laluan semua: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
