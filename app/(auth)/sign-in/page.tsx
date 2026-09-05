import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-6">
          <div className="relative h-10 w-44 mx-auto">
            <Image
              src="/images/entropia-logo.png"
              alt="Entropia"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Operator Access Vault
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to monitor autonomous survival telemetry and policies.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200 shadow-sm rounded-2xl space-y-6">
          <form className="space-y-4" action="/dashboard">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Operator Email
              </label>
              <input
                type="email"
                defaultValue="operator@entropia.network"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Security Key / Password
              </label>
              <input
                type="password"
                defaultValue="••••••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
            >
              Enter Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#FF6B00] font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Direct Sandbox Operator Access Enabled
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Need an account?{" "}
          <Link href="/sign-up" className="font-semibold text-[#FF6B00] hover:underline">
            Register new node
          </Link>
        </p>
      </div>
    </div>
  );
}
