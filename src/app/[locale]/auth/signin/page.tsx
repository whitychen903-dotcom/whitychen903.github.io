"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Mail } from "lucide-react";

export default function SignInPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await signIn("nodemailer", { email, redirect: false });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2 text-center">
          J-Pop Hub
        </h1>
        <p className="text-[14px] text-neutral-500 text-center mb-8">
          {t("auth.signIn")}
        </p>

        {sent ? (
          <div className="text-center p-6 rounded-xl bg-[#E5D89E]/20 border border-[#E5D89E]/30">
            <Mail className="w-8 h-8 text-[#6F8436] mx-auto mb-3" />
            <p className="text-[14px] text-neutral-700">{t("auth.checkEmail")}</p>
          </div>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#6F8436] focus:ring-1 focus:ring-[#6F8436] transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-full bg-[#6F8436] text-white font-medium text-[15px] hover:bg-[#5a6e2b] transition-colors disabled:opacity-50"
            >
              {loading ? "..." : t("auth.emailSignIn")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
