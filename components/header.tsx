"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { WalletConnect } from "./walletConnect"

const NAV_LINKS = [
  { href: "/create", label: "Create" },
  { href: "/view", label: "View" },
]

const Header = () => {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 z-30 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto grid h-20 w-full max-w-6xl grid-cols-[auto,1fr,auto] items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-white transition-transform hover:scale-[1.01]">
          <span className="text-lg font-semibold tracking-tight sm:text-xl">IntelliX</span>
        </Link>

        <nav className="hidden items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-slate-200 shadow-sm backdrop-blur md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 transition-colors ${
                  isActive
                    ? "bg-primary/20 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <nav className="md:hidden">
            <div className="flex items-center gap-1 text-xs text-slate-300">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    pathname.startsWith(link.href)
                      ? "bg-primary/25 text-white"
                      : "hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}

export default Header
