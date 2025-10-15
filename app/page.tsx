"use client";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <main className="relative flex flex-col">
        <Hero />
        <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur">
            <div className="grid gap-8 rounded-[calc(theme(borderRadius.3xl)-4px)] bg-slate-900/70 p-8 md:grid-cols-3">
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">End-to-end ownership</span>
                <h3 className="text-xl font-semibold text-white">Sign once, keep forever</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Record grades, attendance, and achievements on Filecoin to guarantee every transcript remains verifiable and tamper-proof.
                </p>
              </div>
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Guided workflows</span>
                <h3 className="text-xl font-semibold text-white">Create without friction</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Smart validation, reusable templates, and previewable report cards streamline onboarding for schools, tutors, and accelerators.
                </p>
              </div>
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Secure sharing</span>
                <h3 className="text-xl font-semibold text-white">Share with confidence</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  Generate public or gated links, export polished PDFs, and let students prove milestones with a single CID.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
