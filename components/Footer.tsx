import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Create report card", href: "/create" },
      { label: "View records", href: "/view" },
      { label: "Store on Filecoin", href: "/store" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Filecoin documentation", href: "https://docs.filecoin.io/" },
      { label: "Lighthouse SDK", href: "https://docs.lighthouse.storage/" },
      { label: "Builder quickstart", href: "https://www.builder.io/c/docs/projects" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "FIL Builders", href: "https://x.com/FILBuilders" },
      { label: "Filecoin", href: "https://filecoin.io/" },
      { label: "Discord", href: "https://discord.gg/filecoin" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3 text-white">
              <Image
                src="/assets/logos/logo.svg"
                width={48}
                height={48}
                alt="IntelliX logo"
                className="h-10 w-10"
              />
              <span className="text-lg font-semibold tracking-tight">IntelliX</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-300">
              Trusted infrastructure for schools, cohorts, and communities to publish tamper-proof achievements on Filecoin.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Live on Filecoin
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                {column.title}
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {column.links.map((item) => {
                  const isExternal = item.href.startsWith("http");
                  if (isExternal) {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors hover:text-white"
                        >
                          {item.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className="transition-colors hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {year} IntelliX. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/FILBuilders"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Follow updates ↗
            </a>
            <a
              href="mailto:hello@intelix.app"
              className="transition-colors hover:text-white"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
