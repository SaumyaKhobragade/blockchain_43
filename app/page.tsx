"use client";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-white-pattern">
      {/* Hero Section */}
      <Hero />

      {/* Footer */}
      <Footer />
    </div>
  );
}
