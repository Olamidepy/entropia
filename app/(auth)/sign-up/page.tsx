import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function SignUpPage() {
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
          Register New Node
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Provision an Entropia survival cluster for your agents.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-200 shadow-sm rounded-2xl space-y-6">
          <form className="space-y-4" action="/dashboard">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Operator Name
              </label>
              <input
                type="text"
                placeholder="Systems Architect"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                placeholder="architect@domain.com"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40 focus:border-[#FF6B00] text-sm text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-[#FF6B00] hover:bg-[#E85F00] transition-colors orange-glow"
            >
              Initialize Node & Enter
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an operator key?{" "}
            <Link href="/sign-in" className="font-semibold text-[#FF6B00] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
